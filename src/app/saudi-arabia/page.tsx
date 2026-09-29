import React from 'react';
import SaudiArabiaMarketplaceWidget from '../../widgets/SaudiArabiaMarketplace';

export const metadata = {
  title: "Buy & Sell Excess Inventory in Saudi Arabia | Surplus Market",
  description: "Connect with genuine buyers and sellers for excess inventory, overstock clearance, and bulk liquidation deals in Saudi Arabia.",
  keywords: "Excess inventory Saudi Arabia, Surplus market KSA, Overstock liquidation Riyadh, Wholesale surplus Jeddah, Buy surplus Saudi Arabia, Sell stock KSA",
  alternates: {
    canonical: "https://surplusmarket.com/saudi-arabia",
  },
  openGraph: {
    title: "Buy & Sell Excess Inventory in Saudi Arabia | Surplus Market",
    description: "Connect with genuine buyers and sellers for excess inventory, overstock clearance, and bulk liquidation deals in Saudi Arabia.",
    url: "https://surplusmarket.com/saudi-arabia",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export default function SaudiArabiaRegionalPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <SaudiArabiaMarketplaceWidget />
    </main>
  );
}
