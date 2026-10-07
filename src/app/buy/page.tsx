import React from 'react';
import { Metadata } from 'next';
import BuyHeroBanner from '../../widgets/BuyHeroBanner';
import BuyFeaturedLots from '../../widgets/BuyFeaturedLots';
import BuySourcingFormats from '../../widgets/BuySourcingFormats';
import BuyTrustGuarantee from '../../widgets/BuyTrustGuarantee';
import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata: Metadata = {
  title: "Buy Verified Surplus Lots, Liquidation Pallets & Overstock | Surplus Market",
  description: "Acquire verified B2B liquidation lots, wholesale pallets, and enterprise overstock at 60%-85% below retail MSRP. Line-item manifests, escrow checkout, and direct warehouse freight.",
  keywords: [
    "buy liquidation lots",
    "wholesale pallets",
    "overstock liquidation",
    "B2B surplus marketplace",
    "truckload liquidation",
    "verified inventory manifests",
    "salvage and customer returns",
    "bulk excess inventory"
  ],
  openGraph: {
    title: "Buy Verified Surplus Lots & Liquidation Pallets | Surplus Market",
    description: "Source manifested pallets and truckloads directly from enterprise liquidators and tier-1 distributors at up to 85% below MSRP.",
    url: "https://surplusmarket.com/buy",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('buy', fallbackMetadata);
}

export default function BuyPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col w-full">
      {/* 1. Hero Banner with Liquidation Live Stats & Sourcing Search */}
      <BuyHeroBanner />

      {/* 2. Interactive Manifested Pallet Lots & Liquidation Batches */}
      <BuyFeaturedLots />

      {/* 3. Procurement Channels & Interactive ROI / Margin Calculator */}
      <BuySourcingFormats />

      {/* 4. Institutional Buyer Protection Charter & Liquidation FAQ */}
      <BuyTrustGuarantee />
    </main>
  );
}
