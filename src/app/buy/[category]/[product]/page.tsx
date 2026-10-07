import React from 'react';
import { Metadata } from 'next';
import ProductDetailWidget from '../../../../widgets/ProductDetailWidget';
import { getPageMetadata } from '../../../../services/pageSeoService';

interface PageProps {
  params: Promise<{
    category: string;
    product: string;
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { category, product } = await props.params;
  const decodedProduct = decodeURIComponent(product || '').replace(/-/g, ' ');
  const readableTitle = decodedProduct.replace(/\b\w/g, (c) => c.toUpperCase());
  const decodedCategory = decodeURIComponent(category || '').replace(/-/g, ' ');
  const readableCategory = decodedCategory.replace(/\b\w/g, (c) => c.toUpperCase());

  const fallbackMetadata: Metadata = {
    title: `${readableTitle} | ${readableCategory} Wholesale on Surplus Market`,
    description: `Source ${readableTitle} in ${readableCategory} at liquidation wholesale prices. Escrow protection, itemized manifest inspection, and direct dispatch.`,
  };

  return getPageMetadata(`product-${product}`, fallbackMetadata);
}

export default async function ProductCategoryDetailPage(props: PageProps) {
  const { product } = await props.params;
  const productIdentifier = decodeURIComponent(product || '');

  return (
    <main className="min-h-screen bg-[#fdfcf9] flex flex-col w-full">
      <ProductDetailWidget productId={productIdentifier} />
    </main>
  );
}
