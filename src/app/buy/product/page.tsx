import React, { Suspense } from 'react';
import { Metadata } from 'next';
import CommonBanner from '../../../widgets/CommonBanner';
import BuyFeaturedLots from '../../../widgets/BuyFeaturedLots';
import { BreadcrumbJsonLd } from '../../../components/StructuredData';

export const metadata: Metadata = {
  title: 'Surplus Products & Liquidation Inventory | Surplus Market',
  description: 'Browse verified surplus products, industrial machinery, consumer electronics, and liquidation inventory directly from enterprise sellers at wholesale prices.',
  alternates: {
    canonical: 'https://surplusmarket.com/buy/product',
  },
  openGraph: {
    title: 'Surplus Products & Liquidation Inventory | Surplus Market',
    description: 'Browse verified surplus products, industrial machinery, consumer electronics, and liquidation inventory directly from enterprise sellers at wholesale prices.',
    url: 'https://surplusmarket.com/buy/product',
    siteName: 'Surplus Market',
    locale: 'en_US',
    type: 'website',
  },
};

export default function BuyProductPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col w-full">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Buy', url: '/browse' },
          { name: 'Surplus Products', url: '/buy/product' },
        ]}
      />

      <CommonBanner
        title="Surplus Products & Liquidation Inventory"
        subtitle="Source verified single items, industrial equipment, tools, and overstock products directly from certified liquidators."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Buy', href: '/browse' },
          { label: 'Surplus Products' },
        ]}
      />

      <Suspense fallback={<div className="p-12 text-center text-slate-500 font-medium">Loading surplus products catalog...</div>}>
        <BuyFeaturedLots defaultMode="product" />
      </Suspense>
    </main>
  );
}

