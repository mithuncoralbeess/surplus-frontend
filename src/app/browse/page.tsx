import React, { Suspense } from 'react';
import { Metadata } from 'next';
import BrowseSearchBanner from '../../widgets/BrowseSearchBanner';
import BrowseResults from '../../widgets/BrowseResults';

export const metadata: Metadata = {
  title: "Browse Surplus Inventory & Wholesale Lots | Surplus Market",
  description: "Search and filter verified surplus inventory, wholesale lots, electronics, industrial tools, building materials, and overstock deals.",
};

export default function BrowsePage() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-slate-50">
      <Suspense fallback={<div className="p-8 text-center w-full">Loading Search Banner...</div>}>
        <BrowseSearchBanner />
      </Suspense>

      <Suspense fallback={<div className="p-8 text-center w-full">Loading Results...</div>}>
        <BrowseResults />
      </Suspense>
    </div>
  );
}
