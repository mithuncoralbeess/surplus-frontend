import React from 'react';
import { Metadata } from 'next';
import MaintenanceWidget from '../../widgets/Maintenance';

export const metadata: Metadata = {
  title: 'Under Maintenance | Surplus Market',
  description: 'Surplus Market is currently undergoing scheduled maintenance and system upgrades. We will be back online shortly.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenancePage() {
  return <MaintenanceWidget />;
}
