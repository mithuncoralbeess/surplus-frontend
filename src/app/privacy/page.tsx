import React from 'react';
import PrivacyPolicyWidget from '../../widgets/PrivacyPolicy';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Privacy Policy | Surplus Market",
  description: "Learn how Surplus Market collects, uses, protects, and handles your personal information when using our website and services.",
  alternates: {
    canonical: "https://surplusmarket.com/privacy",
  },
};

export async function generateMetadata() {
  return getPageMetadata('privacy', fallbackMetadata);
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <PrivacyPolicyWidget />
    </main>
  );
}
