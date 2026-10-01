import React from 'react';
import { Metadata } from 'next';
import CommonBanner from "../../../widgets/CommonBanner";
import CategoryDetailWidget from "../../../widgets/CategoryDetailWidget";
import { getPageMetadata } from '../../../services/pageSeoService';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const readableTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  
  const fallbackMetadata: Metadata = {
    title: `${readableTitle} Surplus Inventory & Overstock | Surplus Market`,
    description: `Browse certified surplus, overstock liquidation, and wholesale inventory in ${readableTitle}.`,
  };

  return getPageMetadata(`category-${slug}`, fallbackMetadata);
}

export default async function CategoryPage(props: PageProps) {
  const { slug } = await props.params;
  const readableTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <main className="flex min-h-screen flex-col items-center w-full">
      <CommonBanner 
        title={readableTitle}
        subtitle={`Source verified surplus and liquidation inventory in ${readableTitle}.`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Shop by Category', href: '/shop-by-category' },
          { label: readableTitle }
        ]}
      />
      <CategoryDetailWidget categorySlug={slug} />
    </main>
  );
}
