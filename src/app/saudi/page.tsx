import React from 'react';
import SaudiArabiaMarketplaceWidget from '../../widgets/SaudiArabiaMarketplace';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Buy & Sell Excess Inventory in Saudi Arabia | Surplus Market",
  description: "Connect with genuine buyers and sellers for excess inventory, overstock clearance, and bulk liquidation deals in Saudi Arabia.",
  alternates: {
    canonical: "https://surplusmarket.com/saudi",
  },
};

export async function generateMetadata() {
  return getPageMetadata('saudi', fallbackMetadata);
}

export default function SaudiPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <SaudiArabiaMarketplaceWidget />
    </main>
  );
}
