import React from 'react';
import { Metadata } from 'next';
import { getPageMetadata } from '../../services/pageSeoService';
import SustainabilityHero from '../../widgets/SustainabilityHero';
import SustainabilityCycle from '../../widgets/SustainabilityCycle';
import SustainabilityCalculator from '../../widgets/SustainabilityCalculator';
import SustainabilityPillars from '../../widgets/SustainabilityPillars';
import SustainabilitySDG from '../../widgets/SustainabilitySDG';
import SustainabilityCTA from '../../widgets/SustainabilityCTA';

const fallbackMetadata: Metadata = {
  title: "Sustainability & Scope 3 Circular Economy | Surplus",
  description: "Divert enterprise surplus from landfills and generate verified Scope 3 carbon reduction certificates across the GCC.",
  keywords: "Circular economy, industrial surplus, Scope 3 carbon avoidance, landfill diversion, ESG compliance, GCC sustainability",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('sustainability', fallbackMetadata);
}

export default function SustainabilityPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      {/* 1. Minimal Hero with Metric Strip */}
      <SustainabilityHero />

      {/* 2. Three-Step Circular Mechanism */}
      <SustainabilityCycle />

      {/* 3. Compact Impact Estimator */}
      <SustainabilityCalculator />

      {/* 4. Three Commitments */}
      <SustainabilityPillars />

      {/* 5. Climate Frameworks Trust Row */}
      <SustainabilitySDG />

      {/* 6. Minimal Closing CTA */}
      <SustainabilityCTA />
    </main>
  );
}
