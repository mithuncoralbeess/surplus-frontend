import { NextResponse } from 'next/server';
import { loadBalancer, fetchWithFailover } from '../../../lib/loadBalancer';

export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 * Frontend Load Balancer & Upstream Failover Health Probe
 */
export async function GET() {
  const startTime = Date.now();
  const nodes = loadBalancer.getNodes();

  let backendHealth: any = { status: 'unreachable' };
  let activeNode = loadBalancer.getPrimaryNodeUrl();

  try {
    const { response, nodeUrl, attempts } = await fetchWithFailover('/api/health/', {
      method: 'GET',
      timeoutMs: 4000,
      maxRetries: 1,
      cache: 'no-store',
    });
    activeNode = nodeUrl;
    if (response.ok) {
      backendHealth = await response.json();
      backendHealth.failoverAttempts = attempts;
    } else {
      backendHealth = {
        status: 'degraded',
        httpStatus: response.status,
        failoverAttempts: attempts,
      };
    }
  } catch (err: any) {
    backendHealth = {
      status: 'down',
      error: err?.message || 'Upstream unreachable',
    };
  }

  const refreshedNodes = loadBalancer.getNodes();
  const anyHealthy = refreshedNodes.some((n) => n.state !== 'OPEN');

  return NextResponse.json(
    {
      status: backendHealth.status === 'healthy' || anyHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
      loadBalancer: {
        strategy: 'latency-ewma-least-conn-round-robin',
        activePrimaryNode: activeNode,
        totalNodes: refreshedNodes.length,
        healthyNodes: refreshedNodes.filter((n) => n.state === 'CLOSED').length,
        nodes: refreshedNodes,
      },
      upstreamBackend: backendHealth,
    },
    { status: 200 }
  );
}

