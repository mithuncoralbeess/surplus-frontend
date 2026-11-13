import { permanentRedirect, notFound } from 'next/navigation';
import { Metadata } from 'next';
import { catalogService } from '../../../../services/catalogService';

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

  const initialProduct = await catalogService.getProductById(productIdentifier, categoryIdentifier);
  const canonicalUrl = initialProduct?.seo?.url 
    ? (initialProduct.seo.url.startsWith('http') ? initialProduct.seo.url : `https://www.surplusmarket.com${initialProduct.seo.url.startsWith('/') ? initialProduct.seo.url : `/${initialProduct.seo.url}`}`)
    : `https://www.surplusmarket.com/buy/product/${categoryIdentifier}/${productIdentifier}`;

  return {
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

/**
 * Alternate short route (/buy/[category]/[product])
 * Permanently 308 redirects to canonical URL structure (/buy/product/[category]/[product]).
 */
export default async function RedirectToCanonicalProduct(props: PageProps) {
  const { category, product } = await props.params;
  const productIdentifier = decodeURIComponent(product || '');
  const categoryIdentifier = decodeURIComponent(category || '');

  // Prevent matching sub-routes that belong to special handlers
  if (categoryIdentifier === 'lot' || categoryIdentifier === 'product') {
    notFound();
  }

  const initialProduct = await catalogService.getProductById(productIdentifier, categoryIdentifier);
  if (!initialProduct) {
    notFound();
  }

  const canonicalUrl = initialProduct.seo?.url 
    ? (initialProduct.seo.url.startsWith('/') ? initialProduct.seo.url : `/${initialProduct.seo.url}`)
    : `/buy/product/${categoryIdentifier}/${productIdentifier}`;

  permanentRedirect(canonicalUrl);
}
