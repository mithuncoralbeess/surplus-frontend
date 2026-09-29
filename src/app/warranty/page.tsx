import React from 'react';
import WarrantyPolicyWidget from '../../widgets/WarrantyPolicy';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Service & Warranty Policy | Surplus Market",
  description: "Learn about Surplus Market's 12-month standard warranty, extended warranty coverage, repair & replacement terms, and warranty claim channels.",
  alternates: {
    canonical: "https://surplusmarket.com/warranty",
  },
  openGraph: {
    title: "Service & Warranty Policy | Surplus Market",
    description: "Learn about Surplus Market's 12-month standard warranty, extended warranty coverage, repair & replacement terms, and warranty claim channels.",
    url: "https://surplusmarket.com/warranty",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export async function generateMetadata() {
  return getPageMetadata('warranty', fallbackMetadata);
}

export default function WarrantyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <WarrantyPolicyWidget />
    </main>
  );
}
