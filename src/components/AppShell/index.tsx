"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../widgets/Header';
import Footer from '../Footer';
import MaintenanceWidget from '../../widgets/Maintenance';
import WhatsAppFloatingButton from '../WhatsAppFloatingButton';
import CartDrawer from '../CartDrawer';
import { apiClient } from '../../services/apiClient';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(() => {
    // If NEXT_PUBLIC_IS_MAINTENANCE is explicitly false, start in normal mode; otherwise default to maintenance
    return process.env.NEXT_PUBLIC_IS_MAINTENANCE !== 'false';
  });

  const checkMaintenanceStatus = useCallback(async () => {
    if (process.env.NEXT_PUBLIC_IS_MAINTENANCE === 'true') {
      setIsMaintenanceMode(true);
      return;
    }

    try {
      const res = await apiClient('/api/maintenance-status/', {
        silent: true,
        timeout: 6000,
      });

      if (res.status === 503) {
        setIsMaintenanceMode(true);
        return;
      }

      if (res.success && res.data) {
        const data = res.data;

        // Check for explicit "Live" status from backend dashboard
        const isLive =
          data.website_status === 'Live' ||
          data.status === 'Live' ||
          data.status === 'live' ||
          data.is_live === true ||
          data.is_maintenance_mode === false ||
          data.is_maintenance === false;

        if (isLive) {
          setIsMaintenanceMode(false);
          return;
        }

        // Check for explicit Maintenance status from backend dashboard
        const isMaintenance = Boolean(
          data.is_maintenance_mode === true ||
          data.is_maintenance === true ||
          data.maintenance_mode === true ||
          data.website_status === 'Maintenance' ||
          data.status === 'maintenance' ||
          data.status === 'under_maintenance'
        );

        setIsMaintenanceMode(isMaintenance);
      } else {
        // If server is unreachable or backend is down, remain in maintenance mode
        setIsMaintenanceMode(true);
      }
    } catch {
      // Backend connection failed or down, keep maintenance mode active
      setIsMaintenanceMode(true);
    }
  }, []);

  useEffect(() => {
    checkMaintenanceStatus();

    // Check on window focus and poll at 45s interval to detect when backend comes back up
    const interval = setInterval(checkMaintenanceStatus, 45000);
    const handleFocus = () => checkMaintenanceStatus();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkMaintenanceStatus]);

  // Exclusively render Under Maintenance page on all routes when maintenance mode is active
  if (isMaintenanceMode) {
    return (
      <main className="flex-1 min-h-screen">
        <MaintenanceWidget />
      </main>
    );
  }

  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <WhatsAppFloatingButton />
      <CartDrawer />
    </>
  );
}
