import React from 'react';
import IndiaMarketplaceWidget from '../../widgets/IndiaMarketplace';
import { INDIA_FAQS } from '../../widgets/IndiaMarketplace/indiaData';
import { BreadcrumbJsonLd, FaqJsonLd } from '../../components/StructuredData';
import { getPageMetadata } from '../../services/pageSeoService';

export const revalidate = 3600;

const fallbackMetadata = {
  title: "Buy & Sell Surplus Inventory in India with Surplus Market",
  description: "Surplus India is a growing opportunity for businesses to unlock value from unused stock and slow-moving goods. Buy and sell surplus goods online in a secure B2B environment.",
  keywords: "Surplus inventory India, Surplus Market India, Buy surplus India, Sell excess stock India, Overstock liquidation India, B2B surplus wholesale India",
  alternates: {
    canonical: "https://www.surplusmarket.com/india",
  },
  openGraph: {
    title: "Buy & Sell Surplus Inventory in India with Surplus Market",
    description: "Surplus India is a growing opportunity for businesses to unlock value from unused stock and slow-moving goods. Buy and sell surplus goods online in a secure B2B environment.",
    url: "https://www.surplusmarket.com/india",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export async function generateMetadata() {
  return getPageMetadata('india', fallbackMetadata);
}

export default function IndiaRegionalPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'India Marketplace', url: '/india' },
        ]}
      />
      <FaqJsonLd
        faqs={INDIA_FAQS.map((faq) => ({
          question: faq.q,
          answer: faq.a,
        }))}
      />
      <IndiaMarketplaceWidget />
    </main>
  );
}
