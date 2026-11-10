import type { MetadataRoute } from 'next';
import { getBaseUrl, getStaticRoutes, getBlogRoutes, getProductRoutes } from '../lib/sitemapData';

// Ensure sitemaps are dynamically generated on-demand so newly published,
// updated, or deleted pages/products/blogs are instantly reflected.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Master XML Sitemap (/sitemap.xml)
 * Returns all active marketing, regional, category, blog, product, and lot URLs.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const [pages, blogs, products] = await Promise.all([
    getStaticRoutes(baseUrl),
    getBlogRoutes(baseUrl),
    getProductRoutes(baseUrl),
  ]);

  const all = [...pages, ...blogs, ...products];
  const seen = new Set<string>();
  return all.filter((item) => {
    if (!item?.url || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  }) as MetadataRoute.Sitemap;
}
