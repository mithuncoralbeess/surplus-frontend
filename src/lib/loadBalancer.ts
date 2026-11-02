/**
 * Surplus Market — Multi-Node Load Balancer, Circuit Breaker & Failover Engine
 *
 * Features:
 * 1. Multi-node upstream pool resolution (BACKEND_API_URLS, BACKEND_API_URL, FALLBACK_BACKEND_API_URL)
 * 2. Latency-aware (EWMA) + Least-Connections + Round-Robin node selection
 * 3. Per-node Circuit Breaker (CLOSED -> OPEN -> HALF_OPEN)
 * 4. Automatic multi-node failover & retry with exponential backoff + jitter
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface UpstreamNodeHealth {
  url: string;
  state: CircuitState;
  consecutiveFailures: number;
  totalRequests: number;
  totalFailures: number;
  activeRequests: number;
  ewmaLatencyMs: number;
  lastFailureAt: number | null;
  lastSuccessAt: number | null;
  lastError?: string;
}

interface UpstreamNodeInternal extends UpstreamNodeHealth {}

const FAILURE_THRESHOLD = 3; // Consecutive failures before tripping circuit to OPEN
const OPEN_COOLDOWN_MS = 25_000; // 25s cooldown before trying HALF_OPEN probe
const EWMA_ALPHA = 0.3; // Weight for new latency samples
const DEFAULT_INITIAL_LATENCY_MS = 120;

const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);

class LoadBalancerEngine {
  private nodes: UpstreamNodeInternal[] = [];
  private rrIndex = 0;
  private initialized = false;

  constructor() {
    this.initNodes();
  }

  /**
   * Parses environment variables to build the ordered pool of upstream backend URLs.
   */
  public initNodes(): void {
    const rawUrls: string[] = [];

    // 1. Comma-separated pool (e.g. BACKEND_API_URLS="https://api1.surplusmarket.com,https://api2.surplusmarket.com")
    const poolEnv =
      process.env.BACKEND_API_URLS ||
      process.env.NEXT_PUBLIC_BACKEND_API_URLS ||
      '';
    if (poolEnv) {
      poolEnv
        .split(',')
        .map((u) => u.trim().replace(/\/$/, ''))
        .filter(Boolean)
        .forEach((u) => rawUrls.push(u));
    }

    // 2. Primary & Fallback individual env vars
    const candidates = [
      process.env.BACKEND_API_URL,
      process.env.INTERNAL_BACKEND_URL,
      process.env.API_BASE_URL,
      process.env.FALLBACK_BACKEND_API_URL,
      process.env.SECONDARY_BACKEND_API_URL,
      process.env.NEXT_PUBLIC_API_URL,
      process.env.NEXT_PUBLIC_BACKEND_URL,
      process.env.NEXT_PUBLIC_FALLBACK_API_URL,
    ];

    for (const candidate of candidates) {
      if (candidate) {
        const cleaned = candidate.trim().replace(/\/$/, '');
        if (cleaned && !rawUrls.includes(cleaned)) {
          rawUrls.push(cleaned);
        }
      }
    }

    // Ensure at least the default production/dev target exists on server
    if (rawUrls.length === 0) {
      rawUrls.push('https://dev.surplusmarket.com');
    }

    const existingMap = new Map(this.nodes.map((n) => [n.url, n]));
    this.nodes = rawUrls.map((url) => {
      const prev = existingMap.get(url);
      if (prev) return prev;
      return {
        url,
        state: 'CLOSED',
        consecutiveFailures: 0,
        totalRequests: 0,
        totalFailures: 0,
        activeRequests: 0,
        ewmaLatencyMs: DEFAULT_INITIAL_LATENCY_MS,
        lastFailureAt: null,
        lastSuccessAt: null,
      };
    });

    this.initialized = true;
  }

  /**
   * Returns all configured upstream nodes and refreshes OPEN circuits whose cooldown has elapsed.
   */
  public getNodes(): UpstreamNodeHealth[] {
    if (!this.initialized || this.nodes.length === 0) {
      this.initNodes();
    }
    const now = Date.now();
    for (const node of this.nodes) {
      if (
        node.state === 'OPEN' &&
        node.lastFailureAt &&
        now - node.lastFailureAt >= OPEN_COOLDOWN_MS
      ) {
        node.state = 'HALF_OPEN';
      }
    }
    return this.nodes.map((n) => ({ ...n }));
  }

  /**
   * Selects an ordered list of candidate nodes for a request:
   * - Filters out OPEN nodes (unless all nodes are OPEN, in which case all are tried as fallback)
   * - Ranks CLOSED nodes by composite score: EWMA latency + active connection penalty + round-robin rotation
   * - Places HALF_OPEN nodes after healthy CLOSED nodes
   */
  public getCandidateNodes(): UpstreamNodeInternal[] {
    if (!this.initialized || this.nodes.length === 0) {
      this.initNodes();
    }

    const now = Date.now();
    for (const node of this.nodes) {
      if (
        node.state === 'OPEN' &&
        node.lastFailureAt &&
        now - node.lastFailureAt >= OPEN_COOLDOWN_MS
      ) {
        node.state = 'HALF_OPEN';
      }
    }

    if (this.nodes.length === 1) {
      return [this.nodes[0]];
    }

    const closed: UpstreamNodeInternal[] = [];
    const halfOpen: UpstreamNodeInternal[] = [];
    const open: UpstreamNodeInternal[] = [];

    const total = this.nodes.length;
    const startIdx = this.rrIndex % total;
    this.rrIndex = (this.rrIndex + 1) % total;

    for (let i = 0; i < total; i++) {
      const node = this.nodes[(startIdx + i) % total];
      if (node.state === 'CLOSED') {
        closed.push(node);
      } else if (node.state === 'HALF_OPEN') {
        halfOpen.push(node);
      } else {
        open.push(node);
      }
    }

    // Sort CLOSED nodes by effective score (EWMA latency + active requests * 50ms)
    closed.sort((a, b) => {
      const scoreA = a.ewmaLatencyMs + a.activeRequests * 50;
      const scoreB = b.ewmaLatencyMs + b.activeRequests * 50;
      return scoreA - scoreB;
    });

    const available = [...closed, ...halfOpen];
    return available.length > 0 ? available : open;
  }

  /**
   * Returns the single best primary upstream URL right now.
   */
  public getPrimaryNodeUrl(): string {
    const candidates = this.getCandidateNodes();
    return candidates[0]?.url || '';
  }

  public recordRequestStart(url: string): void {
    const node = this.nodes.find((n) => n.url === url);
    if (node) {
      node.activeRequests = Math.max(0, node.activeRequests + 1);
      node.totalRequests += 1;
    }
  }

  public recordSuccess(url: string, durationMs: number): void {
    const node = this.nodes.find((n) => n.url === url);
    if (!node) return;
    node.activeRequests = Math.max(0, node.activeRequests - 1);
    node.consecutiveFailures = 0;
    node.state = 'CLOSED';
    node.lastSuccessAt = Date.now();
    node.lastError = undefined;
    const clampedDuration = Math.max(5, Math.min(durationMs, 30_000));
    node.ewmaLatencyMs = Math.round(
      EWMA_ALPHA * clampedDuration + (1 - EWMA_ALPHA) * node.ewmaLatencyMs
    );
  }

  public recordFailure(url: string, errorMsg?: string): void {
    const node = this.nodes.find((n) => n.url === url);
    if (!node) return;
    node.activeRequests = Math.max(0, node.activeRequests - 1);
    node.consecutiveFailures += 1;
    node.totalFailures += 1;
    node.lastFailureAt = Date.now();
    if (errorMsg) {
      node.lastError = errorMsg;
    }

    if (node.state === 'HALF_OPEN' || node.consecutiveFailures >= FAILURE_THRESHOLD) {
      node.state = 'OPEN';
    }
  }

  public resetAll(): void {
    for (const node of this.nodes) {
      node.state = 'CLOSED';
      node.consecutiveFailures = 0;
      node.activeRequests = 0;
      node.lastError = undefined;
    }
  }
}

export const loadBalancer = new LoadBalancerEngine();

export interface FailoverFetchOptions extends RequestInit {
  timeoutMs?: number;
  maxRetries?: number;
  retryOnStatus?: Set<number>;
}

/**
 * Executes an HTTP fetch with automatic multi-node load balancing, circuit breaking,
 * and exponential-backoff retry failover.
 */
export async function fetchWithFailover(
  endpointOrUrl: string,
  options: FailoverFetchOptions = {}
): Promise<{ response: Response; nodeUrl: string; attempts: number }> {
  const {
    timeoutMs = 10_000,
    maxRetries = 2,
    retryOnStatus = RETRYABLE_STATUS_CODES,
    ...fetchInit
  } = options;

  const method = (fetchInit.method || 'GET').toUpperCase();
  const isIdempotent = method === 'GET' || method === 'HEAD' || method === 'OPTIONS';

  // Browser relative requests go through Next.js rewrite proxy; still apply retry on transient 502/503/504/network errors
  const isAbsoluteUrl =
    endpointOrUrl.startsWith('http://') || endpointOrUrl.startsWith('https://');
  const isBrowserRelative = typeof window !== 'undefined' && !isAbsoluteUrl;

  const candidates = isBrowserRelative
    ? [{ url: '' }]
    : isAbsoluteUrl
    ? [{ url: '' }]
    : loadBalancer.getCandidateNodes();

  const totalAttemptsAllowed = isIdempotent
    ? Math.max(candidates.length, 1 + maxRetries)
    : Math.min(candidates.length, 2);

  let lastError: any = null;
  let lastResponse: Response | null = null;
  let lastNodeUrl = '';

  for (let attempt = 0; attempt < totalAttemptsAllowed; attempt++) {
    const candidate = candidates[attempt % candidates.length];
    const baseUrl = candidate?.url || '';
    const cleanEndpoint = endpointOrUrl.startsWith('/')
      ? endpointOrUrl
      : `/${endpointOrUrl}`;
    const targetUrl = isAbsoluteUrl
      ? endpointOrUrl
      : isBrowserRelative
      ? cleanEndpoint
      : `${baseUrl}${cleanEndpoint}`;

    lastNodeUrl = baseUrl || 'browser-proxy';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const startTime = Date.now();

    if (baseUrl) {
      loadBalancer.recordRequestStart(baseUrl);
    }

    try {
      const response = await fetch(targetUrl, {
        ...fetchInit,
        signal: fetchInit.signal || controller.signal,
      });
      clearTimeout(timeoutId);

      const elapsed = Date.now() - startTime;

      if (retryOnStatus.has(response.status)) {
        if (baseUrl) {
          loadBalancer.recordFailure(baseUrl, `HTTP ${response.status}`);
        }
        lastResponse = response;

        if (attempt + 1 < totalAttemptsAllowed) {
          const backoffMs = Math.min(150 * Math.pow(2, attempt) + Math.random() * 80, 1200);
          await new Promise((r) => setTimeout(r, backoffMs));
          continue;
        }
        return { response, nodeUrl: lastNodeUrl, attempts: attempt + 1 };
      }

      if (baseUrl) {
        loadBalancer.recordSuccess(baseUrl, elapsed);
      }

      return { response, nodeUrl: lastNodeUrl, attempts: attempt + 1 };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (baseUrl) {
        loadBalancer.recordFailure(baseUrl, err?.message || 'Network/Timeout Error');
      }
      lastError = err;

      // If caller explicitly aborted, do not retry
      if (fetchInit.signal?.aborted) {
        throw err;
      }

      if (attempt + 1 < totalAttemptsAllowed) {
        const backoffMs = Math.min(150 * Math.pow(2, attempt) + Math.random() * 80, 1200);
        await new Promise((r) => setTimeout(r, backoffMs));
        continue;
      }
    }
  }

  if (lastResponse) {
    return { response: lastResponse, nodeUrl: lastNodeUrl, attempts: totalAttemptsAllowed };
  }

  throw lastError || new Error('All upstream backend nodes failed');
}

