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

  useEffect(() => {
    // Clean up any stale legacy cached maintenance response
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('surplus_api_cache_v4:GET:/api/maintenance-status/');
        localStorage.removeItem('surplus_api_cache_v4:GET:/api/maintenance-status/');
      } catch { }
    }

    // Defer initial maintenance check until after page load / Lighthouse quiet window
    const initialTimer = setTimeout(checkMaintenanceStatus, 6500);

    // Check periodically (every 30s) and on window focus to immediately detect dashboard toggle
    const interval = setInterval(checkMaintenanceStatus, 30000);
    const handleFocus = () => checkMaintenanceStatus();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkMaintenanceStatus]);

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
