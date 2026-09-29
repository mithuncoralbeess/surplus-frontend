import React from 'react';
import FAQPageWidget from '../../widgets/FAQPage';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Frequently Asked Questions (FAQ) | Surplus Market",
  description: "Find instant answers to common questions about buying surplus, selling overstock, escrow payments, LTL/FTL shipping, and vendor verification.",
  keywords: "Surplus market FAQ, B2B liquidation questions, Inventory auctions FAQ, Surplus escrow, Wholesale shipping FAQ",
  alternates: {
    canonical: "https://surplusmarket.com/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | Surplus Market",
    description: "Find instant answers to common questions about buying surplus, selling overstock, escrow payments, LTL/FTL shipping, and vendor verification.",
    url: "https://surplusmarket.com/faq",
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
      <FAQPageWidget />
    </main>
  );
}
