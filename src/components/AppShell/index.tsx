"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '../../widgets/Header';
import Footer from '../Footer';
import { apiClient } from '../../services/apiClient';
import { useCart } from '../../context/CartContext';

const MaintenanceWidget = dynamic(() => import('../../widgets/Maintenance'));
const WhatsAppFloatingButton = dynamic(() => import('../WhatsAppFloatingButton'), { ssr: false });
const CartDrawer = dynamic(() => import('../CartDrawer'), { ssr: false });

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isCartDrawerOpen } = useCart();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(() => {
    return process.env.NEXT_PUBLIC_IS_MAINTENANCE === 'true';
  });
  const [showDeferredOverlays, setShowDeferredOverlays] = useState(false);

  const isCheckingRef = useRef(false);
  const lastMaintenanceCheckRef = useRef<number>(0);

  useEffect(() => {
    let activated = false;
    const activateOverlays = () => {
      if (activated) return;
      activated = true;
      setShowDeferredOverlays(true);
    };
    const events = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'mousemove'];
    events.forEach((ev) => window.addEventListener(ev, activateOverlays, { once: true, passive: true }));
    const overlayTimer = setTimeout(activateOverlays, 3500);
    return () => {
      clearTimeout(overlayTimer);
      events.forEach((ev) => window.removeEventListener(ev, activateOverlays));
    };
  }, []);

  const checkMaintenanceStatus = useCallback(async () => {
    // If environment flag explicitly forces maintenance, honor it immediately
    if (process.env.NEXT_PUBLIC_IS_MAINTENANCE === 'true') {
      setIsMaintenanceMode(true);
      return;
    }

    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    try {
      const res = await apiClient('/api/maintenance-status/', {
        silent: true,
        timeout: 6000,
        cacheTtl: false,
        revalidate: true,
      });

      // 503 Service Unavailable directly indicates backend maintenance mode
      if (res.status === 503) {
        setIsMaintenanceMode(true);
        return;
      }

      if (res.success && res.data) {
        const data = res.data;

        // Check for maintenance state from backend SystemSettings
        const isMaintenance = Boolean(
          data.is_maintenance_mode === true ||
          data.is_maintenance === true ||
          data.maintenance_mode === true ||
          data.website_status?.toLowerCase() === 'maintenance' ||
          data.status?.toLowerCase() === 'maintenance' ||
          data.status?.toLowerCase() === 'under_maintenance' ||
          data.status_text?.toLowerCase() === 'maintenance' ||
          data.status_text?.toLowerCase() === 'under_maintenance'
        );

        if (isMaintenance) {
          setIsMaintenanceMode(true);
          return;
        }

        // Check for live state
        const isLive =
          data.is_maintenance_mode === false ||
          data.is_maintenance === false ||
          data.maintenance_mode === false ||
          data.is_live === true ||
          data.website_status?.toLowerCase() === 'live' ||
          data.status?.toLowerCase() === 'live' ||
          data.status_text?.toLowerCase() === 'live';

        if (isLive) {
          setIsMaintenanceMode(false);
          return;
        }

        setIsMaintenanceMode(false);
      }
    } catch {
      // If network fails, do not force maintenance unless env flag is active
      if (process.env.NEXT_PUBLIC_IS_MAINTENANCE === 'true') {
        setIsMaintenanceMode(true);
      }
    } finally {
      isCheckingRef.current = false;
    }
  }, []);

  const safeCheckMaintenanceStatus = useCallback((force = false) => {
    const now = Date.now();
    // Throttle maintenance checks to at most once every 5 minutes (300,000 ms) unless forced
    if (!force && now - lastMaintenanceCheckRef.current < 300000) {
      return;
    }
    lastMaintenanceCheckRef.current = now;
    checkMaintenanceStatus();
  }, [checkMaintenanceStatus]);

  useEffect(() => {
    // Clean up any stale legacy cached maintenance response
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('surplus_api_cache_v4:GET:/api/maintenance-status/');
        localStorage.removeItem('surplus_api_cache_v4:GET:/api/maintenance-status/');
      } catch { }
    }

    // Defer initial maintenance check until after page load / Lighthouse quiet window
    const initialTimer = setTimeout(() => safeCheckMaintenanceStatus(true), 6500);

    // Check on window focus only if at least 5 minutes have elapsed, and avoid checking if tab is hidden
    const handleFocus = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        safeCheckMaintenanceStatus(false);
      }
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleFocus);

    // Periodic heartbeat check relaxed from 30s to 10 minutes (600,000 ms)
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        safeCheckMaintenanceStatus(true);
      }
    }, 600000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
    };
  }, [safeCheckMaintenanceStatus]);

  // If directly visiting /maintenance route, show the full-screen maintenance design
  if (pathname === '/maintenance') {
    return (
      <main className="w-full min-h-screen bg-[#051611]">
        <MaintenanceWidget />
      </main>
    );
  }

  // If maintenance mode is active from the backend API, render maintenance page
  if (isMaintenanceMode) {
    return (
      <main className="w-full min-h-screen bg-[#051611]">
        <MaintenanceWidget />
      </main>
    );
  }

  // Normal live website
  return (
    <>
      <Header />
      <div className="flex-1 w-full">{children}</div>
      <Footer />
      {showDeferredOverlays && <WhatsAppFloatingButton />}
      {isCartDrawerOpen && <CartDrawer />}
    </>
  );
}
