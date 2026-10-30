import React, { Suspense } from 'react';
import { Metadata } from 'next';
import BrowseSearchBanner from '../../widgets/BrowseSearchBanner';
import BrowseResults from '../../widgets/BrowseResults';
import BrowseSourcingDesk from '../../widgets/BrowseSourcingDesk';
import { BreadcrumbJsonLd } from '../../components/StructuredData';

export const metadata: Metadata = {
  title: "Browse Surplus Inventory & Wholesale Lots | Surplus Market",
  description: "Search and filter verified surplus inventory, wholesale lots, electronics, industrial tools, building materials, and overstock deals.",
  alternates: {
    canonical: "https://surplusmarket.com/browse",
  },
  openGraph: {
    title: "Browse Surplus Inventory & Wholesale Lots | Surplus Market",
    description: "Search and filter verified surplus inventory, wholesale lots, electronics, industrial tools, building materials, and overstock deals.",
    url: "https://surplusmarket.com/browse",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export default function BrowsePage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Browse Deals & Lots', url: '/browse' },
        ]}
      />
      <Suspense fallback={<div className="p-8 text-center w-full">Loading Search Banner...</div>}>
        <BrowseSearchBanner />
      </Suspense>

      <Suspense fallback={<div className="p-8 text-center w-full">Loading Results...</div>}>
        <BrowseResults />
      </Suspense>
    </div>
  );
}

export { BrowseSourcingDesk };

