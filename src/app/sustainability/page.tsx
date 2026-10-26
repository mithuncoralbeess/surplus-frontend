import React from 'react';
import { Metadata } from 'next';
import { getPageMetadata } from '../../services/pageSeoService';
import SustainabilityHero from '../../widgets/SustainabilityHero';
import SustainabilityMissionProblem from '../../widgets/SustainabilityMissionProblem';
import SustainabilityImpact from '../../widgets/SustainabilityImpact';
import SustainabilityBigNumbers from '../../widgets/SustainabilityBigNumbers';
import SustainabilityGoals from '../../widgets/SustainabilityGoals';
import SustainabilityWhyMatters from '../../widgets/SustainabilityWhyMatters';
import SustainabilityModel from '../../widgets/SustainabilityModel';
import SustainabilityCTA from '../../widgets/SustainabilityCTA';

const fallbackMetadata: Metadata = {
  title: "Sustainability at Surplus Market | Reducing Waste, Boosting Impact",
  description: "Transform excess inventory into measurable carbon offsets, circular savings, and recovered capital. Building a sustainable future together.",
  keywords: [
    "Sustainability at Surplus Market",
    "circular economy",
    "waste reduction",
    "UN SDGs",
    "Qatar National Vision 2030",
    "surplus deals",
    "inventory aging calculator",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('sustainability', fallbackMetadata);
}

export default function SustainabilityPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <SustainabilityHero />
      <SustainabilityMissionProblem />
      <SustainabilityImpact />
      <SustainabilityBigNumbers />
      <SustainabilityGoals />
      <SustainabilityWhyMatters />
      <SustainabilityModel />
      <SustainabilityCTA />
    </main>
  );
}
