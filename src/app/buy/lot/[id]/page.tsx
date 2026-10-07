import React from 'react';
import { Metadata } from 'next';
import LotDetailWidget from '../../../../widgets/LotDetailWidget';
import { getPageMetadata } from '../../../../services/pageSeoService';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = await props.params;
  const decodedId = decodeURIComponent(id || '').replace(/-/g, ' ');
  const readableTitle = decodedId.replace(/\b\w/g, (c) => c.toUpperCase());

  const fallbackMetadata: Metadata = {
    title: `${readableTitle} | Verified Wholesale Lot on Surplus Market`,
    description: `Inspect manifested liquidation batch ${readableTitle}. Detailed line-item manifest, escrow protection hold, and LTL/FTL logistics dispatch.`,
  };

  return getPageMetadata(`lot-${id}`, fallbackMetadata);
}

export default async function LotDetailPage(props: PageProps) {
  const { id } = await props.params;
  const lotIdentifier = decodeURIComponent(id || '');

  return (
    <main className="min-h-screen bg-[#fcfbf7] flex flex-col w-full">
      <LotDetailWidget lotId={lotIdentifier} />
    </main>
  );
}
