import React from 'react';
import { Metadata } from 'next';
import { getPageMetadata } from '../../../services/pageSeoService';
import TrackSurplusTrends from '../../../widgets/TrackSurplusTrends';

const fallbackMetadata: Metadata = {
  title: 'How to Track Surplus Trends & Surplus Deals on SurplusMarket | Surplus Market',
  description: 'Learn how procurement teams track surplus deals, analyze demand trends across high-movement categories, and leverage liquidation market intelligence.',
  keywords: [
    'track surplus trends',
    'surplus deals B2B',
    'liquidation market intelligence',
    'high movement surplus categories',
    'procurement trends GCC',
    'surplus inventory demand'
  ],
  alternates: {
    canonical: 'https://surplusmarket.com/user-guide/track-surplus-trends',
  },
  openGraph: {
    title: 'How to Track Surplus Trends & Surplus Deals on SurplusMarket',
    description: 'Learn how procurement managers evaluate upcoming surplus opportunities, track market movements, and analyze high-demand categories.',
    url: 'https://surplusmarket.com/user-guide/track-surplus-trends',
    siteName: 'Surplus Market',
    type: 'article',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('user-guide/track-surplus-trends', fallbackMetadata);
}

export default function TrackSurplusTrendsPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <TrackSurplusTrends />
    </main>
  );
}
