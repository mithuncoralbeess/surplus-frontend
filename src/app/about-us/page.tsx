import React from 'react';
import AboutHero from '../../widgets/AboutHero';
import AboutHowWeOperate from '../../widgets/AboutHowWeOperate';
import AboutOurStory from '../../widgets/AboutOurStory';
import AboutMissionVision from '../../widgets/AboutMissionVision';
import AboutWhatWeDo from '../../widgets/AboutWhatWeDo';
import AboutCTA from '../../widgets/AboutCTA';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "About Us | Surplus Market - B2B Inventory Liquidation Partner",
  description: "Rooted in Qatar, built for the world. Learn how Surplus Market transforms idle inventory into circular value for enterprises, SMEs, and the planet.",
  keywords: "About Surplus Market, B2B inventory liquidation Qatar, Circular commerce, Surplus stock marketplace, B2B trade Qatar",
  alternates: {
    canonical: "https://surplusmarket.com/about-us",
  },
  openGraph: {
    title: "About Us | Surplus Market",
    description: "Rooted in Qatar, built for the world. Learn how Surplus Market transforms idle inventory into circular value for enterprises, SMEs, and the planet.",
    url: "https://surplusmarket.com/about-us",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export async function generateMetadata() {
  return getPageMetadata('about-us', fallbackMetadata);
}

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <AboutHero />
      <AboutHowWeOperate />
      <AboutOurStory />
      <AboutMissionVision />
      <AboutWhatWeDo />
      <AboutCTA />
    </main>
  );
}


