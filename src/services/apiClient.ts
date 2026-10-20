/**
 * Surplus Market API Client
 * Centralized, secure HTTP client with multi-tier caching, in-flight request deduplication,
 * offline persistence, URL resolution, and request sanitization.
 */

/**
 * Resolves request URL.
 * In browser: strictly uses relative path ('/api/...') so all requests proxy through Next.js
 * reverse proxy without exposing the backend domain.
 * On server: resolves to internal backend target.
 */
function resolveRequestUrl(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  if (typeof window !== 'undefined') {
    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  }
  const serverTarget = (
    process.env.BACKEND_API_URL ||
    process.env.BACKEND_APT_URL ||
    process.env.INTERNAL_BACKEND_URL ||
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ''
  ).replace(/\/$/, '');

  return `${serverTarget}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
  fromCache?: boolean;
}

export interface RequestOptions extends RequestInit {
  silent?: boolean;
  timeout?: number;
  /**
   * Cache duration in milliseconds.
   * - `false`: bypass cache and fetch fresh from network
   * - `true`: use default TTL (3 minutes for GET requests)
   * - `number`: custom TTL in ms (e.g. 60000 = 1 minute)
   * Default: true for GET requests, false for mutations (POST, PUT, DELETE, PATCH).
   */
  cacheTtl?: boolean | number;
  /**
   * Stale-while-revalidate: if true, immediately return cached response (even if stale)
   * while asynchronously refetching from network to refresh the cache in the background.
   * Default: true for GET requests when cached data exists.
   */
  staleWhileRevalidate?: boolean;
  /**
   * Force revalidation: bypass read cache, fetch fresh from network, and store update in cache.
   */
  revalidate?: boolean;
  /**
   * Persist cache across page reloads using browser localStorage for instant 0ms hydration.
   * Default: true for primary catalog & metadata GET requests.
   */
  persistCache?: boolean;
}

interface CacheEntry<T = any> {
  response: ApiResponse<T>;
  timestamp: number;
  expiresAt: number;
}

// 1. In-Memory Cache Store
const memoryCache = new Map<string, CacheEntry>();

// 2. In-Flight Request Deduplication Store (prevents duplicate simultaneous network requests)
const inFlightRequests = new Map<string, Promise<ApiResponse<any>>>();

// Default Cache TTL: 3 minutes
const DEFAULT_CACHE_TTL_MS = 3 * 60 * 1000;

// LocalStorage Persistent Cache Key Prefix
const STORAGE_PREFIX = 'surplus_api_cache_v2:';

// Endpoints that qualify for client-side localStorage persistence
const PERSISTENT_ENDPOINTS = [
  '/api/products/',
  '/api/lots/',
  '/api/categories/',
  '/categories/',
  '/api/maintenance-status/',
  '/api/seo/',
  '/api/blogs/'
];

/**
 * Checks if an endpoint should be persisted in browser localStorage
 */
function shouldPersistEndpoint(endpoint: string): boolean {
  return PERSISTENT_ENDPOINTS.some((prefix) => endpoint.includes(prefix));
}

/**
 * Safely reads cached response from localStorage
 */
function readStorageCache<T = any>(cacheKey: string): CacheEntry<T> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${cacheKey}`);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (!entry || !entry.response || typeof entry.expiresAt !== 'number') {
      localStorage.removeItem(`${STORAGE_PREFIX}${cacheKey}`);
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

/**
 * Safely writes response to localStorage
 */
function writeStorageCache<T = any>(cacheKey: string, entry: CacheEntry<T>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${cacheKey}`, JSON.stringify(entry));
  } catch (err: any) {
    // Quota exceeded: clean oldest cache items
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.slice(0, 5).forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore storage errors
    }
  }
}

/**
 * Invalidate cached entries matching a pattern (string or RegExp)
 */
function invalidateCacheByPattern(pattern?: string | RegExp): void {
  if (!pattern) {
    memoryCache.clear();
    if (typeof window !== 'undefined') {
      try {
        const toRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(STORAGE_PREFIX)) toRemove.push(key);
        }
        toRemove.forEach((k) => localStorage.removeItem(k));
      } catch {
        // Ignore
      }
    }
    return;
  }

  // Invalidate in memory
  for (const key of memoryCache.keys()) {
    const matches = typeof pattern === 'string' ? key.includes(pattern) : pattern.test(key);
    if (matches) {
      memoryCache.delete(key);
    }
  }

  // Invalidate in localStorage
  if (typeof window !== 'undefined') {
    try {
      const toRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const subKey = key.slice(STORAGE_PREFIX.length);
          const matches = typeof pattern === 'string' ? subKey.includes(pattern) : pattern.test(subKey);
          if (matches) toRemove.push(key);
        }
      }
      toRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore
    }
  }
}

/**
 * Automatically invalidates relevant caches upon successful mutations
 */
function autoInvalidateOnMutation(endpoint: string): void {
  const lower = endpoint.toLowerCase();
  if (lower.includes('product')) {
    invalidateCacheByPattern(/products/i);
  }
  if (lower.includes('lot')) {
    invalidateCacheByPattern(/lots/i);
  }
  if (lower.includes('categor')) {
    invalidateCacheByPattern(/categories/i);
  }
  if (lower.includes('notification')) {
    invalidateCacheByPattern(/notifications/i);
  }
  if (lower.includes('blog')) {
    invalidateCacheByPattern(/blogs/i);
  }
}

/**
 * Core HTTP Request Execution
 */
async function executeNetworkFetch<T = any>(
  url: string,
  config: RequestInit,
  timeout: number,
  silent: boolean,
  endpoint: string
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const fetchConfig: RequestInit = {
    ...config,
    signal: config.signal || controller.signal,
  };

  try {
    const response = await fetch(url, fetchConfig);
    clearTimeout(timeoutId);

    const text = await response.text();
    let json: any = {};

    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = { message: text };
    }

    if (!response.ok) {
      const errorMsg =
        json.message ||
        json.detail ||
        (typeof json === 'object' && Object.keys(json).length > 0
          ? JSON.stringify(json)
          : `Request failed with status ${response.status}`);

      return {
        success: false,
        status: response.status,
        message: errorMsg,
      };
    }

    return {
      success: true,
      status: response.status,
      data: json.data !== undefined ? json.data : json,
      message: json.message,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (!silent) {
      console.warn(`[API Client Notice] ${endpoint}:`, error?.message || error);
    }
    return {
      success: false,
      status: error?.name === 'AbortError' ? 408 : 500,
      message:
        error?.name === 'AbortError'
          ? 'Request timed out. Server may be starting up.'
          : error?.message || 'Network error or server unavailable.',
    };
  }
}

/**
 * Centralized API Client with multi-tiered caching & request deduplication
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    silent = false,
    timeout = 12000,
    cacheTtl = true,
    staleWhileRevalidate = true,
    revalidate = false,
    persistCache,
    ...fetchOptions
  } = options;

  const method = (fetchOptions.method || 'GET').toUpperCase();
  const isGetRequest = method === 'GET';

  const url = resolveRequestUrl(endpoint);

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      ...defaultHeaders,
      ...fetchOptions.headers,
    },
  };

  // Determine whether to cache this request
  const shouldCache = isGetRequest && cacheTtl !== false;
  const ttlMs = typeof cacheTtl === 'number' ? cacheTtl : DEFAULT_CACHE_TTL_MS;
  const cacheKey = `${method}:${url}`;
  const allowPersistence = persistCache ?? shouldPersistEndpoint(endpoint);

  // 1. Check Memory and Persistent Storage Cache if applicable
  if (shouldCache && !revalidate) {
    // Check in-memory cache
    let entry = memoryCache.get(cacheKey);

    // If not in memory, check localStorage
    if (!entry && allowPersistence) {
      entry = readStorageCache<T>(cacheKey) || undefined;
      if (entry) {
        // Hydrate memory cache
        memoryCache.set(cacheKey, entry);
      }
    }

    if (entry) {
      const now = Date.now();
      const isFresh = now < entry.expiresAt;

      // If fresh, return immediately from cache
      if (isFresh) {
        return {
          ...entry.response,
          fromCache: true,
        };
      }

      // If stale-while-revalidate is allowed, return stale response immediately
      // and refresh in the background
      if (staleWhileRevalidate) {
        // Kick off background refresh without blocking caller
        if (!inFlightRequests.has(cacheKey)) {
          const bgPromise = executeNetworkFetch<T>(url, config, timeout, silent, endpoint)
            .then((freshRes) => {
              if (freshRes.success && freshRes.data !== undefined) {
                const newEntry: CacheEntry<T> = {
                  response: freshRes,
                  timestamp: Date.now(),
                  expiresAt: Date.now() + ttlMs,
                };
                memoryCache.set(cacheKey, newEntry);
                if (allowPersistence) {
                  writeStorageCache(cacheKey, newEntry);
                }
              }
              return freshRes;
            })
            .finally(() => {
              inFlightRequests.delete(cacheKey);
            });

          inFlightRequests.set(cacheKey, bgPromise);
        }

        return {
          ...entry.response,
          fromCache: true,
        };
      }
    }
  }

  // 2. In-Flight Request Deduplication
  // If an identical request is already pending over the network, wait for it instead of duplicating
  if (shouldCache && inFlightRequests.has(cacheKey)) {
    try {
      const sharedRes = await inFlightRequests.get(cacheKey)!;
      return {
        ...sharedRes,
        fromCache: true,
      };
    } catch {
      // Fall through to normal fetch if shared promise failed
    }
  }

  // 3. Dispatch Network Fetch
  const fetchPromise = executeNetworkFetch<T>(url, config, timeout, silent, endpoint);

  if (shouldCache) {
    inFlightRequests.set(cacheKey, fetchPromise);
  }

  try {
    const response = await fetchPromise;

    // Cache successful GET responses
    if (shouldCache && response.success && response.data !== undefined) {
      const newEntry: CacheEntry<T> = {
        response,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttlMs,
      };
      memoryCache.set(cacheKey, newEntry);
      if (allowPersistence) {
        writeStorageCache(cacheKey, newEntry);
      }
    }

    // Auto-invalidate caches on successful mutations
    if (!isGetRequest && response.success) {
      autoInvalidateOnMutation(endpoint);
    }

    return response;
  } finally {
    if (shouldCache) {
      inFlightRequests.delete(cacheKey);
    }
  }
}

// Attach helper utilities to apiClient
apiClient.clearCache = (): void => {
  invalidateCacheByPattern();
};

apiClient.invalidate = (pattern?: string | RegExp): void => {
  invalidateCacheByPattern(pattern);
};

apiClient.getCacheSize = (): { memory: number } => {
  return { memory: memoryCache.size };
};

export default apiClient;
