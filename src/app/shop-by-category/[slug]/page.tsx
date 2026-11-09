import React from 'react';
import { Metadata } from 'next';
import CommonBanner from "../../../widgets/CommonBanner";
import CategoryDetailWidget from "../../../widgets/CategoryDetailWidget";
import { getPageMetadata } from '../../../services/pageSeoService';
import { BreadcrumbJsonLd } from '../../../components/StructuredData';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const readableTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  
  return {
    title: `${readableTitle} Surplus Inventory & Overstock | Surplus Market`,
    description: `Browse certified surplus, overstock liquidation, and wholesale inventory in ${readableTitle}.`,
    alternates: {
      canonical: `https://www.surplusmarket.com/shop-by-category/${slug}`,
    },
    openGraph: {
      title: `${readableTitle} Surplus Inventory & Overstock | Surplus Market`,
      description: `Browse certified surplus, overstock liquidation, and wholesale inventory in ${readableTitle}.`,
      url: `https://www.surplusmarket.com/shop-by-category/${slug}`,
      siteName: 'Surplus Market',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${readableTitle} Surplus Inventory & Overstock | Surplus Market`,
      description: `Browse certified surplus, overstock liquidation, and wholesale inventory in ${readableTitle}.`,
    },
  };
}

export default async function CategoryPage(props: PageProps) {
  const { slug } = await props.params;
  const readableTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <main className="flex min-h-screen flex-col items-center w-full">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Buy', url: '/buy' },
          { name: readableTitle, url: `/shop-by-category/${slug}` },
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
      <CategoryDetailWidget categorySlug={slug} />
    </main>
  );
}
