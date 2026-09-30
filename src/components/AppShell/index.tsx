"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../../widgets/Header';
import Footer from '../Footer';
import { apiClient } from '../../services/apiClient';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isMaintenancePage = pathname === '/maintenance';
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean | null>(null);

  const checkMaintenanceStatus = useCallback(async () => {
    try {
      const res = await apiClient('/api/maintenance-status/');
      if (res.success && res.data) {
        const inMaintenance = Boolean(res.data.is_maintenance_mode);
        setIsMaintenanceMode(inMaintenance);

        if (inMaintenance && pathname !== '/maintenance') {
          router.replace('/maintenance');
        } else if (!inMaintenance && pathname === '/maintenance') {
          router.replace('/');
        }
      }
    } catch (err) {
      console.error('Failed to check maintenance status:', err);
    }
  }, [pathname, router]);

  useEffect(() => {
    checkMaintenanceStatus();

    // Poll status every 5 seconds to react quickly when admin toggles maintenance mode in dashboard sidebar
    const interval = setInterval(checkMaintenanceStatus, 5000);
    return () => clearInterval(interval);
  }, [checkMaintenanceStatus]);

  if (isMaintenanceMode === true || isMaintenancePage) {
    return <div className="flex-1 min-h-screen">{children}</div>;
  }

  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
