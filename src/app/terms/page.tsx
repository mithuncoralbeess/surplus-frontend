import React from 'react';
import TermsConditionsWidget from '../../widgets/TermsConditions';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Terms & Conditions | Surplus Market",
  description: "Read the terms and conditions governing prospective buyers and sellers, listing obligations, tax requirements, and user conduct on Surplus Market.",
  alternates: {
    canonical: "https://surplusmarket.com/terms",
  },
};

export async function generateMetadata() {
  return getPageMetadata('terms', fallbackMetadata);
}

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <TermsConditionsWidget />
    </main>
  );
}
