import React from 'react';
import { Metadata } from 'next';
import { getPageMetadata } from '../../services/pageSeoService';
import SustainabilityHero from '../../widgets/SustainabilityHero';
import SustainabilityCalculator from '../../widgets/SustainabilityCalculator';
import SustainabilityPillars from '../../widgets/SustainabilityPillars';
import SustainabilityCycle from '../../widgets/SustainabilityCycle';
import SustainabilitySDG from '../../widgets/SustainabilitySDG';
import SustainabilityFAQ from '../../widgets/SustainabilityFAQ';
import SustainabilityCTA from '../../widgets/SustainabilityCTA';

const fallbackMetadata: Metadata = {
  title: "Industrial Sustainability & Scope 3 Circular Economy | Surplus Market",
  description: "Accelerate enterprise zero-waste goals. Liquidate or procure industrial surplus with verified Scope 3 carbon avoidance, landfill diversion metrics, and escrow protection.",
  keywords: "Circular economy, enterprise surplus liquidation, Scope 3 carbon avoidance, industrial waste diversion, ESG compliance, GCC sustainability, surplus market",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('sustainability', fallbackMetadata);
}

export default function SustainabilityPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      {/* 1. Executive Hero with Verified Impact Metrics Bar */}
      <SustainabilityHero />

      {/* 2. Interactive ESG Scope 3 & Landfill Avoidance Calculator */}
      <SustainabilityCalculator />

      {/* 3. Dual-Sided Circular Economics Framework (Sellers vs Buyers vs P2P Logistics) */}
      <SustainabilityPillars />

      {/* 4. The 4-Stage Closed-Loop Supply Chain Architecture */}
      <SustainabilityCycle />

      {/* 5. Global UN SDGs & GCC National Environmental Visions Alignment */}
      <SustainabilitySDG />

      {/* 6. Corporate ESG Compliance FAQ Accordion */}
      <SustainabilityFAQ />

      {/* 7. Executive Enterprise CTA Hub */}
      <SustainabilityCTA />
    </main>
  );
}
