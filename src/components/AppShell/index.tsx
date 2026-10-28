"use client";

import React from 'react';
import MaintenanceWidget from '../../widgets/Maintenance';

/**
 * AppShell:
 * Backend is currently down. Header, Footer, and all other website components
 * are completely disabled. ONLY the full-screen Under Maintenance page is displayed.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full min-h-screen bg-[#051611]">
      <MaintenanceWidget />
    </main>
  );
}
