import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CommonBanner from "../../../widgets/CommonBanner";
import CategoryDetailWidget from "../../../widgets/CategoryDetailWidget";
import { BreadcrumbJsonLd } from '../../../components/StructuredData';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { category } = await props.params;
  const categorySlug = decodeURIComponent(category || '');

  if (categorySlug === 'product' || categorySlug === 'lot') {
    return {};
  }

  const readableTitle = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const canonicalUrl = `https://www.surplusmarket.com/buy/${categorySlug}`;
  
  return {
    title: `${readableTitle} Surplus Inventory & Overstock | Surplus Market`,
    description: `Browse certified surplus, overstock liquidation, and wholesale inventory in ${readableTitle}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${readableTitle} Surplus Inventory & Overstock`,
      description: `Browse certified surplus, overstock liquidation, and wholesale inventory in ${readableTitle}.`,
      url: canonicalUrl,
      siteName: 'Surplus Market',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${readableTitle} Surplus Inventory & Overstock`,
      description: `Browse certified surplus, overstock liquidation, and wholesale inventory in ${readableTitle}.`,
    },
  };
}

export default async function BuyCategoryPage(props: PageProps) {
  const { category } = await props.params;
  const categorySlug = decodeURIComponent(category || '');

  if (categorySlug === 'product' || categorySlug === 'lot') {
    notFound();
  }

  const readableTitle = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <main className="flex min-h-screen flex-col items-center w-full">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Buy', url: '/buy' },
          { name: readableTitle, url: `/buy/${categorySlug}` },
        ]}
      />
      <CommonBanner 
        title={readableTitle}
        subtitle={`Source verified surplus and liquidation inventory in ${readableTitle}.`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Buy', href: '/buy' },
          { label: readableTitle }
        ]}
      />
      <CategoryDetailWidget categorySlug={categorySlug} />
    </main>
  );
}

