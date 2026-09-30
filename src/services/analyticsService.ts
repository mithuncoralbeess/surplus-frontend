import { apiClient, ApiResponse } from './apiClient';

export interface TrackViewPayload {
  entity_type: 'lot' | 'product' | 'blog' | 'page';
  entity_id?: string | number;
  entity_slug?: string;
  path: string;
  title?: string;
  referrer?: string;
}

export const analyticsService = {
  /**
   * Send pageview or entity view ping to backend API.
   * Uses non-blocking call so UI performance is unaffected.
   */
  async trackView(payload: TrackViewPayload): Promise<ApiResponse> {
    try {
      return await apiClient('/api/analytics/track-view/', {
        method: 'POST',
        body: JSON.stringify({
          ...payload,
          referrer: payload.referrer || (typeof document !== 'undefined' ? document.referrer : ''),
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }),
      });
    } catch (err) {
      // Non-blocking catch to prevent analytics errors from interrupting user experience
      return { success: false, message: 'Analytics tracking failed quietly' };
    }
  },
};
