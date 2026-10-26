import React from 'react';
import { Metadata } from 'next';
import { getPageMetadata } from '../../../services/pageSeoService';
import SurplusWasteCarbonFootprint from '../../../widgets/SurplusWasteCarbonFootprint';

const fallbackMetadata: Metadata = {
  title: 'How Surplus Market Reduces Waste and Carbon Footprint | Surplus Market',
  description: 'Discover how Surplus Market facilitates excess inventory exchange to prevent brand-new items from being discarded, reduce manufacturing demand, and decrease carbon emissions.',
  keywords: [
    'surplus market waste reduction',
    'carbon footprint reduction surplus',
    'sustainable procurement',
    'circular economy surplus',
    'excess inventory carbon emissions',
    'industrial equipment re-use',
    'eco-friendly business solutions'
  ],
  alternates: {
    canonical: 'https://surplusmarket.com/sustainability-data/how-surplus-market-reduces-waste-carbon-footprint',
  },
  openGraph: {
    title: 'How Surplus Market Reduces Waste and Carbon Footprint',
    description: 'Learn how recirculating surplus goods reduces manufacturing strain, avoids landfill accumulation, and lowers supply chain emissions.',
    url: 'https://surplusmarket.com/sustainability-data/how-surplus-market-reduces-waste-carbon-footprint',
    siteName: 'Surplus Market',
    type: 'article',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('sustainability-data/how-surplus-market-reduces-waste-carbon-footprint', fallbackMetadata);
}

export default function HowSurplusMarketReducesWasteCarbonFootprintPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <SurplusWasteCarbonFootprint />
    </main>
  );
}
