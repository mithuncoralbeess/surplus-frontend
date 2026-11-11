import React from 'react';
import FAQPageWidget from '../../widgets/FAQPage';
import { BreadcrumbJsonLd } from '../../components/StructuredData';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Frequently Asked Questions (FAQ)",
  description: "Find instant answers to common questions about buying surplus, selling overstock, secure payments, LTL/FTL shipping, and vendor verification.",
  keywords: "Surplus market FAQ, B2B liquidation questions, Inventory auctions FAQ, Surplus payment protection, Wholesale shipping FAQ",
  alternates: {
    canonical: "https://www.surplusmarket.com/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ)",
    description: "Find instant answers to common questions about buying surplus, selling overstock, secure payments, LTL/FTL shipping, and vendor verification.",
    url: "https://www.surplusmarket.com/faq",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export async function generateMetadata() {
  return getPageMetadata('faq', fallbackMetadata);
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Frequently Asked Questions', url: '/faq' },
        ]}
      />
      <FAQPageWidget />
    </main>
  );
}
