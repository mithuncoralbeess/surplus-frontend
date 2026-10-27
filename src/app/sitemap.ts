import type { MetadataRoute } from 'next';
import { getBlogs } from '../services/blogService';
import { catalogService } from '../services/catalogService';
import { createLotUrl } from '../lib/slugs';

export const revalidate = 3600; // Revalidate every 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://surplusmarket.com').replace(/\/$/, '');

  // 1. Core static marketing & application pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/buy`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sell`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop-by-category`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/partnership`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/inventory-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/checklist-comparison`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/assistance`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sustainability`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Regional landing pages
    {
      url: `${baseUrl}/uae`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/saudi`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/saudi-arabia`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/qatar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/india`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // User guide & Sustainability data articles
    {
      url: `${baseUrl}/user-guide/track-surplus-trends`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sustainability-data/gcc-business-sourcing-surplus-locally`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sustainability-data/hidden-economy-surplus-strategic-asset`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sustainability-data/how-surplus-market-reduces-waste-carbon-footprint`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sustainability-data/textile-waste-fashion-industry-92-million-tons`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Policy & Legal documents
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/warranty`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // 2. Dynamic Blog Articles
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await getBlogs();
    if (Array.isArray(blogs) && blogs.length > 0) {
      blogRoutes = blogs
        .filter((b) => Boolean(b && b.slug))
        .map((b) => ({
          url: `${baseUrl}/blog/${b.slug}`,
          lastModified: b.publishedAt ? new Date(b.publishedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
    }
  } catch (error) {
    console.warn('[sitemap] Failed to fetch dynamic blogs for sitemap:', error);
  }

  // 3. Dynamic Wholesale Lots
  let lotRoutes: MetadataRoute.Sitemap = [];
  try {
    const lots = await catalogService.getLots({ limit: 100 });
    if (Array.isArray(lots) && lots.length > 0) {
      lotRoutes = lots
        .filter((l) => Boolean(l && l.id))
        .map((l) => ({
          url: `${baseUrl}${createLotUrl(l.title, String(l.id))}`,
          lastModified: l.created_at ? new Date(l.created_at) : new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        }));
    }
  } catch (error) {
    console.warn('[sitemap] Failed to fetch dynamic lots for sitemap:', error);
  }

  // 4. Popular Category Slugs
  const commonCategories = [
    'consumer-electronics',
    'electricals',
    'power-tools',
    'hand-tools',
    'ppe',
    'building-materials',
    'lifting-accessories',
    'ict',
    'industrial-machinery-pumps',
    'automation-controls',
  ];

  const categoryRoutes: MetadataRoute.Sitemap = commonCategories.map((slug) => ({
    url: `${baseUrl}/shop-by-category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Combine all routes, deduplicating URLs
  const allRoutes = [...staticRoutes, ...categoryRoutes, ...blogRoutes, ...lotRoutes];
  const seenUrls = new Set<string>();

  return allRoutes.filter((item) => {
    if (seenUrls.has(item.url)) {
      return false;
    }
    seenUrls.add(item.url);
    return true;
  });
}
