import { apiClient, ApiResponse } from './apiClient';

export interface TrackViewPayload {
  entity_type?: 'lot' | 'product' | 'blog' | 'page';
  entity_id?: string | number;
  entity_slug?: string;
  path: string;
  title?: string;
  referrer?: string;
  duration_seconds?: number;
  session_id?: string;
  visitor_id?: string;
  is_stuck?: boolean;
  log_id?: number | string;
}

const VISITOR_ID_KEY = 'surplus_analytics_vid';
const SESSION_ID_KEY = 'surplus_analytics_sid';

/**
 * Get or initialize persistent Anonymous Visitor ID (localStorage)
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    return vid;
  } catch {
    return 'v_anon';
  }
}

/**
 * Get or initialize Session ID (sessionStorage)
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let sid = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sid) {
      sid = 's_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      sessionStorage.setItem(SESSION_ID_KEY, sid);
    }
    return sid;
  } catch {
    return 's_anon';
  }
}

export const analyticsService = {
  /**
   * Track initial pageview or entity view ping to backend.
   * Returns created log_id so frontend can track dwell time / duration continuously.
   */
  async trackView(payload: TrackViewPayload): Promise<ApiResponse<{ id: number; log_id: number }>> {
    try {
      const visitor_id = getOrCreateVisitorId();
      const session_id = getOrCreateSessionId();

      return await apiClient('/api/analytics/track-view/', {
        method: 'POST',
        silent: true,
        body: JSON.stringify({
          entity_type: payload.entity_type || 'page',
          entity_id: payload.entity_id,
          entity_slug: payload.entity_slug || '',
          path: payload.path,
          referrer: payload.referrer || (typeof document !== 'undefined' ? document.referrer : ''),
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          duration_seconds: payload.duration_seconds || 0,
          session_id,
          visitor_id,
          is_stuck: payload.is_stuck || false,
        }),
      });
    } catch {
      return { success: false, message: 'Analytics tracking failed quietly' };
    }
  },

  /**
   * Update duration (dwell time) and stuck status for an active pageview log.
   * Uses navigator.sendBeacon when navigating away or unmounting to ensure delivery.
   */
  updateDwellTime(logId: number | string, durationSeconds: number, isStuck = false): void {
    if (typeof window === 'undefined' || !logId) return;

    const endpoint = (process.env.NEXT_PUBLIC_API_BASE_URL || '') + '/api/analytics/track-view/';
    const data = JSON.stringify({
      log_id: logId,
      duration_seconds: Math.round(durationSeconds),
      is_stuck: isStuck,
    });

    // 1. Try Beacon API for exit events (guaranteed transmission without delaying navigation)
    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: 'application/json' });
      const sent = navigator.sendBeacon(endpoint, blob);
      if (sent) return;
    }

    // 2. Fallback to fetch with keepalive: true
    try {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true,
      }).catch(() => {
        // ignore
      });
    } catch {
      // ignore
    }
  },
};
