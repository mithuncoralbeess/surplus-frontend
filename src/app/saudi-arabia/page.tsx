import React from 'react';
import SaudiArabiaMarketplaceWidget from '../../widgets/SaudiArabiaMarketplace';
import { SAUDI_FAQS } from '../../widgets/SaudiArabiaMarketplace/saudiData';
import { BreadcrumbJsonLd, FaqJsonLd } from '../../components/StructuredData';
import { getPageMetadata } from '../../services/pageSeoService';

export const revalidate = 3600;

const fallbackMetadata = {
  title: "Buy & Sell Excess Inventory in Saudi Arabia with Surplus Market",
  description: "Managing unsold goods and unused stock can be challenging for businesses in Saudi Arabia. Surplus Market connects sellers with genuine buyers who are looking for discounted, ready-to-purchase items.",
  keywords: "Excess inventory Saudi Arabia, Surplus market KSA, Overstock liquidation Riyadh, Wholesale surplus Jeddah, Buy surplus Saudi Arabia, Sell stock KSA, inventory liquidators Saudi Arabia",
  alternates: {
    canonical: "https://www.surplusmarket.com/saudi-arabia",
  },
  openGraph: {
    title: "Buy & Sell Excess Inventory in Saudi Arabia with Surplus Market",
    description: "Managing unsold goods and unused stock can be challenging for businesses in Saudi Arabia. Surplus Market connects sellers with genuine buyers who are looking for discounted, ready-to-purchase items.",
    url: "https://www.surplusmarket.com/saudi-arabia",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export async function generateMetadata() {
  return getPageMetadata('saudi-arabia', fallbackMetadata);
}

export default function SaudiArabiaRegionalPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Saudi Arabia Marketplace', url: '/saudi-arabia' },
        ]}
      />
      <FaqJsonLd
        faqs={SAUDI_FAQS.map((faq) => ({
          question: faq.q,
          answer: faq.a,
        }))}
      />
      <SaudiArabiaMarketplaceWidget />
    </main>
  );
}
