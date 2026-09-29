import React from 'react';
import UaeMarketplaceWidget from '../../widgets/UaeMarketplace';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Buy & Sell Excess Inventory in UAE | Surplus Market",
  description: "Connect with verified buyers and sellers for excess inventory, liquidation deals, and export-grade surplus stock in UAE.",
  keywords: "Excess inventory UAE, Surplus market UAE, Liquidation UAE, Export surplus UAE, Buy surplus UAE, Sell excess stock UAE",
  alternates: {
    canonical: "https://surplusmarket.com/uae",
  },
  openGraph: {
    title: "Buy & Sell Excess Inventory in UAE | Surplus Market",
    description: "Connect with verified buyers and sellers for excess inventory, liquidation deals, and export-grade surplus stock in UAE.",
    url: "https://surplusmarket.com/uae",
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
    <main className="min-h-screen bg-gray-50/50">
      <UaeMarketplaceWidget />
    </main>
  );
}
