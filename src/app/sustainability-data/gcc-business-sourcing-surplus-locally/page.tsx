import React from 'react';
import { Metadata } from 'next';
import { getPageMetadata } from '../../../services/pageSeoService';
import GccLocalSourcing from '../../../widgets/GccLocalSourcing';

const fallbackMetadata: Metadata = {
  title: 'How GCC Businesses Source Surplus & Overstock Locally to Reduce Emissions | Surplus Market',
  description: 'Learn how GCC businesses are rethinking global surplus imports and sourcing regionally across the UAE, Saudi Arabia, and Qatar to cut carbon emissions, eliminate overseas freight delays, and optimize cash flow.',
  keywords: [
    'GCC local surplus sourcing',
    'reduce supply chain emissions GCC',
    'overstock inventory UAE',
    'industrial surplus Saudi Arabia',
    'Qatar infrastructure surplus',
    'circular economy GCC',
    'regional B2B liquidation'
  ],
  alternates: {
    canonical: 'https://surplusmarket.com/sustainability-data/gcc-business-sourcing-surplus-locally',
  },
  openGraph: {
    title: 'How GCC Businesses Source Surplus & Overstock Locally to Reduce Emissions',
    description: 'Discover why Gulf businesses are shifting from long-haul imports to local surplus sourcing to minimize shipping emissions and customs delays.',
    url: 'https://surplusmarket.com/sustainability-data/gcc-business-sourcing-surplus-locally',
    siteName: 'Surplus Market',
    type: 'article',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('sustainability-data/gcc-business-sourcing-surplus-locally', fallbackMetadata);
}

export default function GccBusinessSourcingSurplusLocallyPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <GccLocalSourcing />
    </main>
  );
}
