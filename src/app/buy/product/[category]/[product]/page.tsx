import React from 'react';
import { Metadata } from 'next';
import ProductDetailWidget from '../../../../../widgets/ProductDetailWidget';
import { getPageMetadata } from '../../../../../services/pageSeoService';
import { catalogService } from '../../../../../services/catalogService';

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    category: string;
    product: string;
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { category, product } = await props.params;
  const productIdentifier = decodeURIComponent(product || '');
  const categoryIdentifier = decodeURIComponent(category || '');

  const decodedProduct = productIdentifier.replace(/-/g, ' ');
  const readableTitle = decodedProduct.replace(/\b\w/g, (c) => c.toUpperCase());
  const decodedCategory = categoryIdentifier.replace(/-/g, ' ');
  const readableCategory = decodedCategory.replace(/\b\w/g, (c) => c.toUpperCase());

  const fallbackMetadata: Metadata = {
    title: `${readableTitle} | ${readableCategory} Wholesale on Surplus Market`,
    description: `Source ${readableTitle} in ${readableCategory} at liquidation wholesale prices. Buyer protection, itemized manifest inspection, and direct dispatch.`,
    alternates: {
      canonical: `https://www.surplusmarket.com/buy/product/${category}/${product}`,
    },
    openGraph: {
      title: `${readableTitle} | ${readableCategory} Wholesale on Surplus Market`,
      description: `Source ${readableTitle} in ${readableCategory} at liquidation wholesale prices.`,
      url: `https://www.surplusmarket.com/buy/product/${category}/${product}`,
      siteName: 'Surplus Market',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${readableTitle} | ${readableCategory} Wholesale on Surplus Market`,
      description: `Source ${readableTitle} in ${readableCategory} at liquidation wholesale prices.`,
    },
  };

  try {
    const fetchedProduct = await catalogService.getProductById(productIdentifier, categoryIdentifier);
    if (fetchedProduct) {
      const prodTitle = fetchedProduct.title || readableTitle;
      const prodCat = fetchedProduct.category || readableCategory;
      return {
        title: `${prodTitle} | ${prodCat} Wholesale on Surplus Market`,
        description: fetchedProduct.description 
          ? fetchedProduct.description.slice(0, 160) 
          : `Source ${prodTitle} in ${prodCat} at liquidation wholesale prices. Buyer protection, itemized manifest inspection, and direct dispatch.`,
        alternates: {
          canonical: `https://www.surplusmarket.com/buy/product/${category}/${product}`,
        },
        openGraph: {
          title: `${prodTitle} | ${prodCat} Wholesale on Surplus Market`,
          description: fetchedProduct.description 
            ? fetchedProduct.description.slice(0, 160) 
            : `Source ${prodTitle} in ${prodCat} at liquidation wholesale prices.`,
          url: `https://www.surplusmarket.com/buy/product/${category}/${product}`,
          siteName: 'Surplus Market',
          type: 'website',
          images: fetchedProduct.image ? [{ url: fetchedProduct.image }] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${prodTitle} | ${prodCat} Wholesale on Surplus Market`,
          description: fetchedProduct.description ? fetchedProduct.description.slice(0, 160) : undefined,
          images: fetchedProduct.image ? [fetchedProduct.image] : [],
        },
      };
    }
  } catch (e) {
    // Silently fall back to standard metadata
  }

  return fallbackMetadata;
}

export default async function ProductDetailPage(props: PageProps) {
  const { category, product } = await props.params;
  const productIdentifier = decodeURIComponent(product || '');
  const categoryIdentifier = decodeURIComponent(category || '');

  return (
    <main className="min-h-screen bg-[#fdfcf9] flex flex-col w-full">
      <ProductDetailWidget productId={productIdentifier} category={categoryIdentifier} />
    </main>
  );
}

