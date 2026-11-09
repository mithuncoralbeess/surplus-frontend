import React from 'react';
import { Metadata } from 'next';
import LotDetailWidget from '../../../../widgets/LotDetailWidget';
import { getPageMetadata } from '../../../../services/pageSeoService';
import { catalogService } from '../../../../services/catalogService';

interface PageProps {
  params: Promise<{
    lot: string;
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lot } = await props.params;
  const decodedLot = decodeURIComponent(lot || '').replace(/-/g, ' ');
  const readableTitle = decodedLot.replace(/\b\w/g, (c) => c.toUpperCase());

  const fallbackMetadata: Metadata = {
    title: `${readableTitle} | Verified Wholesale Lot on Surplus Market`,
    description: `Inspect manifested liquidation batch ${readableTitle}. Detailed line-item manifest, buyer protection hold, and LTL/FTL logistics dispatch.`,
    alternates: {
      canonical: `https://www.surplusmarket.com/buy/lot/${lot}`,
    },
  };

  try {
    const fetchedLot = await catalogService.getLotById(lot);
    if (fetchedLot) {
      const lotTitle = fetchedLot.title || readableTitle;
      const customFallback: Metadata = {
        title: `${lotTitle} | Verified Wholesale Lot on Surplus Market`,
        description: fetchedLot.description
          ? fetchedLot.description.slice(0, 160)
          : `Inspect manifested liquidation batch ${lotTitle}. Detailed line-item manifest, buyer protection hold, and LTL/FTL logistics dispatch.`,
        alternates: {
          canonical: `https://www.surplusmarket.com/buy/lot/${lot}`,
        },
        openGraph: {
          title: `${lotTitle} | Verified Wholesale Lot on Surplus Market`,
          description: fetchedLot.description
            ? fetchedLot.description.slice(0, 160)
            : `Inspect manifested liquidation batch ${lotTitle}.`,
          images: fetchedLot.image ? [fetchedLot.image] : [],
        },
      };
      return getPageMetadata(`lot-${lot}`, customFallback);
    }
  } catch (e) {
    // Silently fall back to standard metadata
  }

  return getPageMetadata(`lot-${lot}`, fallbackMetadata);
}

export default async function LotDetailPage(props: PageProps) {
  const { lot } = await props.params;
  const lotIdentifier = decodeURIComponent(lot || '');

  return (
    <main className="min-h-screen bg-[#fcfbf7] flex flex-col w-full">
      <LotDetailWidget lotId={lotIdentifier} />
    </main>
  );
}

