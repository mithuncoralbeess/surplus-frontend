import React from 'react';
import ChecklistComparisonWidget from '../../widgets/ChecklistComparison';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Checklist & Comparison Guides | Surplus Market",
  description: "Detailed checklists and easy-to-understand comparison guides to evaluate branded vs non-branded surplus, auction vs fixed price, and LTL/FTL shipping.",
  keywords: "Branded vs non branded surplus, Inventory comparison guide, Surplus buying checklist, Overstock liquidation comparison",
  alternates: {
    canonical: "https://surplusmarket.com/compare",
  },
  openGraph: {
    title: "Checklist & Comparison Guides | Surplus Market",
    description: "Detailed checklists and easy-to-understand comparison guides to evaluate branded vs non-branded surplus, auction vs fixed price, and LTL/FTL shipping.",
    url: "https://surplusmarket.com/compare",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export async function generateMetadata() {
  return getPageMetadata('compare', fallbackMetadata);
}

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <ChecklistComparisonWidget />
    </main>
  );
}
