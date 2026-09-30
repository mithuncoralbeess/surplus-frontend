"use client";

import { useEffect, useRef } from 'react';
import { analyticsService, TrackViewPayload } from '../services/analyticsService';

/**
 * Custom hook to track views for pages, lots, products, and blogs.
 * Deduplicates view events per session to avoid counting duplicate re-renders or page refreshes.
 */
export function useTrackView(params: TrackViewPayload) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;

    const sessionKey = `view_tracked_${params.entity_type}_${params.entity_id || params.entity_slug || params.path}`;
    
    // Avoid double logging within the same session
    if (typeof window !== 'undefined' && sessionStorage.getItem(sessionKey)) {
      hasTracked.current = true;
      return;
    }

    hasTracked.current = true;

    analyticsService.trackView(params).then((res) => {
      if (res.success && typeof window !== 'undefined') {
        sessionStorage.setItem(sessionKey, '1');
      }
    });
  }, [params.entity_type, params.entity_id, params.entity_slug, params.path]);
}
