import React from 'react';
import { Metadata } from 'next';
import SellHeroBanner from '../../widgets/SellHeroBanner';
import SellTrustBar from '../../widgets/SellTrustBar';
import SellRegionalMarkets from '../../widgets/SellRegionalMarkets';
import InventoryListingOptions from '../../widgets/InventoryListingOptions';
import SellValueProps from '../../widgets/SellValueProps';
import SellerStories from '../../widgets/SellerStories';
import ManufacturerSurplus from '../../widgets/ManufacturerSurplus';
import SellComparisonTable from '../../widgets/SellComparisonTable';
import SellFAQ from '../../widgets/SellFAQ';
import { SELL_FAQS } from '../../widgets/SellFAQ/faqData';
import SellCTA from '../../widgets/SellCTA';
import { BreadcrumbJsonLd, FaqJsonLd } from '../../components/StructuredData';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata: Metadata = {
  title: "Sell Excess Inventory & Liquidate Stock",
  description: "Sell your excess inventory, overstock lots, and equipment to verified global B2B buyers without hassle or public price erosion.",
  alternates: {
    canonical: "https://www.surplusmarket.com/sell",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('sell', fallbackMetadata);
}

export default function SellPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center overflow-x-clip">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Sell Surplus', url: '/sell' },
        ]}
      />
      <FaqJsonLd
        faqs={SELL_FAQS.map((faq) => ({
          question: faq.question,
          answer: typeof faq.answer === 'string' ? faq.answer : '',
        }))}
      />
      <SellHeroBanner />
      <SellTrustBar />
      <SellRegionalMarkets />
      <InventoryListingOptions />
      <SellValueProps />
      <SellerStories />
      <ManufacturerSurplus />
      <SellComparisonTable />
      <SellFAQ />
      <SellCTA />
    </main>
  );
}
