import React from 'react';
import IndiaMarketplaceWidget from '../../widgets/IndiaMarketplace';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Buy & Sell Excess Inventory in India | Surplus Market",
  description: "B2B surplus marketplace in India. Connect with verified buyers and sellers for discounted overstock, branded surplus, and bulk inventory.",
  keywords: "Excess inventory India, Surplus market India, Overstock liquidation India, Wholesale surplus India, Buy surplus online India, Sell excess stock India",
  alternates: {
    canonical: "https://surplusmarket.com/india",
  },
  openGraph: {
    title: "Buy & Sell Excess Inventory in India | Surplus Market",
    description: "B2B surplus marketplace in India. Connect with verified buyers and sellers for discounted overstock, branded surplus, and bulk inventory.",
    url: "https://surplusmarket.com/india",
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
    <main className="min-h-screen bg-gray-50/50">
      <IndiaMarketplaceWidget />
    </main>
  );
}
