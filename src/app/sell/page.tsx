import React from 'react';
import { Metadata } from 'next';
import CommonBanner from '../../widgets/CommonBanner';
import InventoryListingOptions from '../../widgets/InventoryListingOptions';
import SellValueProps from '../../widgets/SellValueProps';
import SellCTA from '../../widgets/SellCTA';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata: Metadata = {
  title: "Sell Excess Inventory & Liquidate Stock | Surplus Market",
  description: "Sell your excess inventory, overstock lots, and equipment to verified global B2B buyers without hassle or public price erosion.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('sell', fallbackMetadata);
}

export default function SellPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <CommonBanner 
        title="Turn excess inventory into recovered value."
        subtitle="You never see or speak to buyers. Surplus Market negotiates, verifies, collects payment and coordinates delivery - you focus on your business."
        align="center"
        image="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Sell' }
        ]}
      />
      <InventoryListingOptions />
      <SellValueProps />
      <SellCTA />
    </main>
  );
}
