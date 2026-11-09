import type { MetadataRoute } from 'next';
import { getBaseUrl, getStaticRoutes, getBlogRoutes, getProductRoutes } from '../lib/sitemapData';

// Ensure sitemaps are dynamically generated on-demand so newly published,
// updated, or deleted pages/products/blogs are instantly reflected.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Splits the site into separate specialized XML sitemaps:
 * - /sitemap/pages.xml (Static marketing, category & legal pages)
 * - /sitemap/blogs.xml (All published blog articles)
 * - /sitemap/products.xml (All wholesale lots & individual products)
 *
 * Next.js automatically creates /sitemap.xml as the master sitemapindex.
 */
export async function generateSitemaps() {
  return [
    { id: 'pages' },
    { id: 'blogs' },
    { id: 'products' },
  ];
}

export default async function sitemap(props?: {
  id?: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const id = props?.id ? await props.id : undefined;

  if (id === 'blogs') {
    return (await getBlogRoutes(baseUrl)) as MetadataRoute.Sitemap;
  }

  if (id === 'products') {
    return (await getProductRoutes(baseUrl)) as MetadataRoute.Sitemap;
  }

  if (id === 'pages') {
    return (await getStaticRoutes(baseUrl)) as MetadataRoute.Sitemap;
  }

  // Fallback: If invoked without id, return all combined
  const [pages, blogs, products] = await Promise.all([
    getStaticRoutes(baseUrl),
    getBlogRoutes(baseUrl),
    getProductRoutes(baseUrl),
  ]);

  const all = [...pages, ...blogs, ...products];
  const seen = new Set<string>();
  return all.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  }) as MetadataRoute.Sitemap;
}
