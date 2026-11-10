import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LotDetailWidget from '../../../../widgets/LotDetailWidget';
import { getPageMetadata } from '../../../../services/pageSeoService';
import { catalogService } from '../../../../services/catalogService';

export const revalidate = 60;

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
    openGraph: {
      title: `${readableTitle} | Verified Wholesale Lot on Surplus Market`,
      description: `Inspect manifested liquidation batch ${readableTitle}.`,
      url: `https://www.surplusmarket.com/buy/lot/${lot}`,
      siteName: 'Surplus Market',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${readableTitle} | Verified Wholesale Lot on Surplus Market`,
      description: `Inspect manifested liquidation batch ${readableTitle}.`,
    },
  };

  try {
    const fetchedLot = await catalogService.getLotById(lot);
    if (fetchedLot) {
      const lotTitle = fetchedLot.title || readableTitle;
      return {
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
          url: `https://www.surplusmarket.com/buy/lot/${lot}`,
          siteName: 'Surplus Market',
          type: 'website',
          images: fetchedLot.image ? [{ url: fetchedLot.image }] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${lotTitle} | Verified Wholesale Lot on Surplus Market`,
          description: fetchedLot.description ? fetchedLot.description.slice(0, 160) : undefined,
          images: fetchedLot.image ? [fetchedLot.image] : [],
        },
      };
    }
  } catch (e) {
    // Silently fall back to standard metadata
  }

  return fallbackMetadata;
}

export default async function LotDetailPage(props: PageProps) {
  const { lot } = await props.params;
  const lotIdentifier = decodeURIComponent(lot || '');

  // Server-side fetch: ensures complete HTML in initial render for Googlebot
  const initialLot = await catalogService.getLotById(lotIdentifier);

  // Permanently unavailable or invalid lots return HTTP 404 (prevents Soft 404s)
  if (!initialLot) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fcfbf7] flex flex-col w-full">
      <LotDetailWidget lotId={lotIdentifier} initialLot={initialLot} />
    </main>
  );
}

