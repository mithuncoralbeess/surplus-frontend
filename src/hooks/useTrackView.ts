"use client";

import { useEffect, useRef } from 'react';
import { analyticsService, TrackViewPayload } from '../services/analyticsService';

/**
 * Custom hook for dedicated entity tracking (e.g. BlogPost, Product, Lot)
 * Enriches the backend with exact entity IDs, slugs, and dwell time.
 */
export function useTrackView(params: TrackViewPayload) {
  const logIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();

    analyticsService.trackView({
      ...params,
      entity_type: params.entity_type || 'blog',
    }).then((res) => {
      if (res && res.success && res.data) {
        logIdRef.current = res.data.log_id || res.data.id;
      }
    });

    const sendDuration = () => {
      if (logIdRef.current) {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        analyticsService.updateDwellTime(logIdRef.current, duration, duration >= 180);
      }
    };

    window.addEventListener('beforeunload', sendDuration);
    return () => {
      sendDuration();
      window.removeEventListener('beforeunload', sendDuration);
    };
  }, [params.entity_type, params.entity_id, params.entity_slug, params.path]);
}
