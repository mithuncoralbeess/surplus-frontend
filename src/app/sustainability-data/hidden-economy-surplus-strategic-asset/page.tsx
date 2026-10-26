import React from 'react';
import { Metadata } from 'next';
import { getPageMetadata } from '../../../services/pageSeoService';
import HiddenEconomySurplus from '../../../widgets/HiddenEconomySurplus';

const fallbackMetadata: Metadata = {
  title: 'The $257 Billion "Hidden Economy": Why Surplus is the New Strategic Asset | Surplus Market',
  description: 'Explore the $257B re-commerce surge, industrial B2B surplus marketplaces, trust-as-a-service certification, and how enterprises transform excess inventory into cash flow.',
  keywords: [
    'hidden economy surplus',
    'surplus strategic asset',
    'industrial re-commerce B2B',
    'certified re-commerce',
    'excess inventory liquidity',
    'surplus marketplace GCC',
    'trust-as-a-service',
    'sustainable surplus management'
  ],
  alternates: {
    canonical: 'https://surplusmarket.com/sustainability-data/hidden-economy-surplus-strategic-asset',
  },
  openGraph: {
    title: 'The $257 Billion "Hidden Economy": Why Surplus is the New Strategic Asset',
    description: 'Why re-commerce is redefining enterprise value, liquidity, and supply chain resilience in 2026.',
    url: 'https://surplusmarket.com/sustainability-data/hidden-economy-surplus-strategic-asset',
    siteName: 'Surplus Market',
    type: 'article',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('sustainability-data/hidden-economy-surplus-strategic-asset', fallbackMetadata);
}

export default function HiddenEconomySurplusPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <HiddenEconomySurplus />
    </main>
  );
}
