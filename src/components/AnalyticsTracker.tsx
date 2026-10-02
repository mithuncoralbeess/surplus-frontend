"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analyticsService } from '../services/analyticsService';

/**
 * Global Real-time Page View & Dwell-Time Analytics Tracker
 * Automatically tracks:
 * 1. Every route navigation and page hit across the entire surplus application.
 * 2. Exact user dwell time (seconds spent actively on each page).
 * 3. Identifies stuck users (unusually high dwell time or friction points without progress).
 * 4. Sends reliable exit beacons on tab close, page leave, and route change.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Active tracking state refs
  const currentLogIdRef = useRef<number | null>(null);
  const pageStartTimeRef = useRef<number>(Date.now());
  const activeSecondsRef = useRef<number>(0);
  const lastActiveTimestampRef = useRef<number>(Date.now());
  const isStuckRef = useRef<boolean>(false);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Full URL path with query parameters
    const queryString = searchParams?.toString();
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

    // Determine entity type
    let entityType: 'page' | 'blog' | 'product' | 'lot' = 'page';
    let entitySlug = '';

    if (pathname.startsWith('/blog/')) {
      entityType = 'blog';
      entitySlug = pathname.replace('/blog/', '').replace(/\/$/, '');
    } else if (pathname.startsWith('/browse')) {
      entityType = 'page';
      entitySlug = 'browse-inventory';
    } else if (pathname === '/') {
      entityType = 'page';
      entitySlug = 'homepage';
    } else {
      entitySlug = pathname.replace(/^\//, '').replace(/\/$/, '') || 'home';
    }

    // Reset tracking metrics for the new page visit
    pageStartTimeRef.current = Date.now();
    activeSecondsRef.current = 0;
    lastActiveTimestampRef.current = Date.now();
    isStuckRef.current = false;
    currentLogIdRef.current = null;

    // 1. Send Initial Page View to Backend API
    analyticsService.trackView({
      path: fullPath,
      entity_type: entityType,
      entity_slug: entitySlug,
      title: typeof document !== 'undefined' ? document.title : '',
    }).then((res) => {
      if (res && res.success && res.data) {
        currentLogIdRef.current = res.data.log_id || res.data.id;
      }
    });

    // 2. Track User Activity (mouse, key, scroll, touch) to measure true active dwell time
    const handleUserActivity = () => {
      const now = Date.now();
      const elapsedSinceLast = (now - lastActiveTimestampRef.current) / 1000;
      
      // If user was active within last 45 seconds, count the duration
      if (elapsedSinceLast <= 45) {
        activeSecondsRef.current += elapsedSinceLast;
      } else {
        // User was idle, only add a small buffer
        activeSecondsRef.current += 5;
      }
      lastActiveTimestampRef.current = now;

      // Stuck detection: user has been on page for over 3 minutes
      const totalWallTimeSeconds = (now - pageStartTimeRef.current) / 1000;
      if (totalWallTimeSeconds >= 180) {
        isStuckRef.current = true;
      }
    };

    window.addEventListener('mousemove', handleUserActivity, { passive: true });
    window.addEventListener('scroll', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, { passive: true });

    // 3. Periodic 25-second Heartbeat
    // Keeps dwell time updated even if user closes tab abruptly
    heartbeatTimerRef.current = setInterval(() => {
      if (currentLogIdRef.current) {
        const now = Date.now();
        const totalDuration = Math.round(activeSecondsRef.current + ((now - lastActiveTimestampRef.current) < 30 ? (now - lastActiveTimestampRef.current) / 1000 : 0));
        
        if (totalDuration >= 180) {
          isStuckRef.current = true;
        }

        analyticsService.updateDwellTime(
          currentLogIdRef.current,
          totalDuration,
          isStuckRef.current
        );
      }
    }, 25000);

    // 4. Exit Beacon & Cleanup when Navigating Away or Closing Tab
    const sendExitBeacon = () => {
      if (currentLogIdRef.current) {
        const now = Date.now();
        const totalDuration = Math.round(activeSecondsRef.current + Math.min(30, (now - lastActiveTimestampRef.current) / 1000));
        
        analyticsService.updateDwellTime(
          currentLogIdRef.current,
          Math.max(1, totalDuration),
          isStuckRef.current || totalDuration >= 180
        );
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendExitBeacon();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', sendExitBeacon);
    window.addEventListener('beforeunload', sendExitBeacon);

    return () => {
      // Send final dwell time update for previous page
      sendExitBeacon();

      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', sendExitBeacon);
      window.removeEventListener('beforeunload', sendExitBeacon);
    };
  }, [pathname, searchParams]);

  return null;
}
