import React, { Suspense } from 'react';
import { Metadata } from 'next';
import CommonBanner from '../../../widgets/CommonBanner';
import BuyFeaturedLots from '../../../widgets/BuyFeaturedLots';
import { BreadcrumbJsonLd } from '../../../components/StructuredData';

export const metadata: Metadata = {
  title: 'Wholesale Lots & Liquidation Pallets',
  description: 'Source manifested bulk pallets, truckload inventory, and wholesale liquidation lots directly from tier-1 liquidators and distributors at liquidation prices.',
  alternates: {
    canonical: 'https://www.surplusmarket.com/buy/lot',
  },
  openGraph: {
    title: 'Wholesale Lots & Liquidation Pallets',
    description: 'Source manifested bulk pallets, truckload inventory, and wholesale liquidation lots directly from tier-1 liquidators and distributors at liquidation prices.',
    url: 'https://www.surplusmarket.com/buy/lot',
    siteName: 'Surplus Market',
    locale: 'en_US',
    type: 'website',
  },
};

export default function BuyLotPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col w-full">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Buy', url: '/browse' },
          { name: 'Wholesale Lots', url: '/buy/lot' },
        ]}
      />

      <CommonBanner
        title="Wholesale Lots & Liquidation Pallets"
        subtitle="Source manifested bulk pallets, multi-pallet batches, and container load manifests pre-inspected and ready for fast freight dispatch."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Buy', href: '/browse' },
          { label: 'Wholesale Lots' },
        ]}
      />

      <Suspense fallback={<div className="p-12 text-center text-slate-500 font-medium">Loading wholesale lots catalog...</div>}>
        <BuyFeaturedLots defaultMode="lot" />
      </Suspense>
    </main>
  );
}

