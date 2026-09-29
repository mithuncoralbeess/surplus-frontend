import React from 'react';
import ReturnPolicyWidget from '../../widgets/ReturnPolicy';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Return & Refund Policy | Surplus Market",
  description: "Learn about Surplus Market's return eligibility criteria, 30-day return window, RMA process, shipping guidelines, and refund processing.",
  alternates: {
    canonical: "https://surplusmarket.com/returns",
  },
};

export async function generateMetadata() {
  return getPageMetadata('returns', fallbackMetadata);
}

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <ReturnPolicyWidget />
    </main>
  );
}
