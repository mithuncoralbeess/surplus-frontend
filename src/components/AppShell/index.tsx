"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../widgets/Header';
import Footer from '../Footer';
import MaintenanceWidget from '../../widgets/Maintenance';
import { apiClient } from '../../services/apiClient';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(() => {
    return process.env.NEXT_PUBLIC_IS_MAINTENANCE === 'true';
  });

  const checkMaintenanceStatus = useCallback(async () => {
    if (process.env.NEXT_PUBLIC_IS_MAINTENANCE === 'true') {
      setIsMaintenanceMode(true);
      return;
    }

    try {
      let res = await apiClient('/api/maintenance-status/');
      if (!res.success) {
        res = await apiClient('/api/maintenance/');
      }

      if (res.success && res.data) {
        const data = res.data;
        const statusActive = Boolean(
          data.is_maintenance_mode ??
          data.is_maintenance ??
          data.maintenance_mode ??
          data.enabled ??
          (data.status === 'maintenance' || data.status === 'under_maintenance')
        );
        setIsMaintenanceMode(statusActive);
      }
    } catch (err) {
      console.error('Failed to check maintenance status:', err);
    }
  }, []);

  useEffect(() => {
    checkMaintenanceStatus();

    // Poll status every 5 seconds to react quickly when admin toggles maintenance mode
    const interval = setInterval(checkMaintenanceStatus, 5000);
    return () => clearInterval(interval);
  }, [checkMaintenanceStatus]);

  // Conditionally render Under Maintenance widget directly in layout
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
    </>
  );
}
