import React from 'react';
import ChecklistComparisonWidget from '../../widgets/ChecklistComparison';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Checklist & Comparison Guides | Surplus Market",
  description: "Detailed checklists and easy-to-understand comparison guides to help you evaluate and simplify your buying and selling process.",
  alternates: {
    canonical: "https://surplusmarket.com/checklist-comparison",
  },
};

export async function generateMetadata() {
  return getPageMetadata('checklist-comparison', fallbackMetadata);
}

export default function ChecklistComparisonPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <ChecklistComparisonWidget />
    </main>
  );
}
