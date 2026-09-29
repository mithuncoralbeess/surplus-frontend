import React from 'react';
import InventoryCalculatorWidget from '../../widgets/InventoryCalculator';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Inventory Ageing Calculator | Surplus Market",
  description: "Estimate how much value your surplus stock is losing to depreciation and storage over time - so you know when to liquidate.",
  keywords: "Inventory ageing calculator, Inventory depreciation tool, Holding cost calculator, Warehouse storage cost, Liquidate surplus stock",
  alternates: {
    canonical: "https://surplusmarket.com/calculator",
  },
  openGraph: {
    title: "Inventory Ageing Calculator | Surplus Market",
    description: "Estimate how much value your surplus stock is losing to depreciation and storage over time - so you know when to liquidate.",
    url: "https://surplusmarket.com/calculator",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export async function generateMetadata() {
  return getPageMetadata('calculator', fallbackMetadata);
}

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <InventoryCalculatorWidget />
    </main>
  );
}
