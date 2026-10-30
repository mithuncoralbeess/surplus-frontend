import React from 'react';
import InventoryCalculatorWidget from '../../widgets/InventoryCalculator';
import { BreadcrumbJsonLd } from '../../components/StructuredData';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Inventory Ageing Calculator | Surplus Market",
  description: "Estimate how much value your surplus stock is losing to depreciation and storage over time - so you know when to liquidate.",
  alternates: {
    canonical: "https://surplusmarket.com/inventory-calculator",
  },
};

export async function generateMetadata() {
  return getPageMetadata('inventory-calculator', fallbackMetadata);
}

export default function InventoryCalculatorPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Inventory Calculator', url: '/inventory-calculator' },
        ]}
      />
      <InventoryCalculatorWidget />
    </main>
  );
}
