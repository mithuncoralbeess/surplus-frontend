import React from 'react';
import UaeMarketplaceWidget from '../../widgets/UaeMarketplace';
import { UAE_FAQS } from '../../widgets/UaeMarketplace/uaeData';
import { BreadcrumbJsonLd, FaqJsonLd } from '../../components/StructuredData';
import { getPageMetadata } from '../../services/pageSeoService';

export const revalidate = 3600;

const fallbackMetadata = {
  title: "Buy & Sell Excess Inventory in UAE with Surplus Market",
  description: "Surplus Market connects buyers and sellers through a dynamic, transparent platform built for excess inventory sale in UAE. Explore export-grade merchandise, surplus goods, and liquidation deals.",
  keywords: "Excess inventory UAE, Surplus market UAE, Liquidation UAE, Export surplus UAE, Buy surplus UAE, Sell excess stock UAE, surplus warehouses UAE, discount surplus warehouse UAE",
  alternates: {
    canonical: "https://www.surplusmarket.com/uae",
  },
  openGraph: {
    title: "Buy & Sell Excess Inventory in UAE with Surplus Market",
    description: "Surplus Market connects buyers and sellers through a dynamic, transparent platform built for excess inventory sale in UAE. Explore export-grade merchandise, surplus goods, and liquidation deals.",
    url: "https://www.surplusmarket.com/uae",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export async function generateMetadata() {
  return getPageMetadata('uae', fallbackMetadata);
}

export default function UaeRegionalPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'UAE Marketplace', url: '/uae' },
        ]}
      />
      <FaqJsonLd
        faqs={UAE_FAQS.map((faq) => ({
          question: faq.q,
          answer: faq.a,
        }))}
      />
      <UaeMarketplaceWidget />
    </main>
  );
}
