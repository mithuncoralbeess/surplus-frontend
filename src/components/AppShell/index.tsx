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
      if (!res.success) {
        res = await apiClient('/api/website-status/');
      }

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
        setIsMaintenanceMode(false);
      }
    } catch (err) {
      console.error('Failed to check maintenance status:', err);
      setIsMaintenanceMode(false);
    }
  }, []);

  useEffect(() => {
    checkMaintenanceStatus();

    // Poll status every 5 seconds to react quickly when admin toggles maintenance mode
    const interval = setInterval(checkMaintenanceStatus, 5000);
    return () => clearInterval(interval);
  }, [checkMaintenanceStatus]);

  // Conditionally render Under Maintenance design on homepage / all routes when maintenance mode is active
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
