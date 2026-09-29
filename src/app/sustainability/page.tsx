import React from 'react';
import CommonBanner from '../../widgets/CommonBanner';
import SustainabilityMission from '../../widgets/SustainabilityMission';
import SustainabilityImpact from '../../widgets/SustainabilityImpact';
import SustainabilityGoals from '../../widgets/SustainabilityGoals';
import SustainabilityModel from '../../widgets/SustainabilityModel';
import SustainabilityCTA from '../../widgets/SustainabilityCTA';
import { Metadata } from 'next';
import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata: Metadata = {
  title: "Sustainability & Circular Economy | Surplus Market",
  description: "Transform excess inventory into measurable carbon offsets, circular savings, and recovered capital.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('sustainability', fallbackMetadata);
}

export default function SustainabilityPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      <CommonBanner 
        title="Reducing Waste, Boosting Impact: Building a Sustainable Future Together"
        subtitle="Transform excess inventory into measurable carbon offsets, circular savings, and recovered capital."
        align="center"
        image="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Sustainability' }
        ]}
      >
        <a 
          href="/inventory-calculator" 
          className="w-full sm:w-auto bg-[#0a5c48] hover:bg-[#084838] text-white px-8 py-4 rounded-full font-bold text-[15px] transition-all flex items-center justify-center"
        >
          Inventory Aging Calculator
        </a>
        <a 
          href="/browse" 
          className="w-full sm:w-auto bg-transparent border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold text-[15px] transition-all flex items-center justify-center"
        >
          Explore Surplus Deals
        </a>
      </CommonBanner>
      <SustainabilityMission />
      <SustainabilityImpact />
      <SustainabilityGoals />
      <SustainabilityModel />
      <SustainabilityCTA />
    </main>
  );
}
