import React from 'react';
import QatarMarketplaceWidget from '../../widgets/QatarMarketplace';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Buy & Sell Excess Inventory in Qatar | Surplus Market",
  description: "Connect with verified buyers and sellers for excess inventory, overstock clearance, and bulk liquidation deals in Qatar.",
  keywords: "Excess inventory Qatar, Surplus market Qatar, Overstock liquidation Qatar, Wholesale surplus Qatar, Buy surplus Qatar, Sell stock Qatar",
  alternates: {
    canonical: "https://surplusmarket.com/qatar",
  },
  openGraph: {
    title: "Buy & Sell Excess Inventory in Qatar | Surplus Market",
    description: "Connect with verified buyers and sellers for excess inventory, overstock clearance, and bulk liquidation deals in Qatar.",
    url: "https://surplusmarket.com/qatar",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export async function generateMetadata() {
  return getPageMetadata('qatar', fallbackMetadata);
}

export default function QatarRegionalPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <QatarMarketplaceWidget />
    </main>
  );
}
