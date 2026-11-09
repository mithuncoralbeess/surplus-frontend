import { getBlogs } from '../services/blogService';
import { catalogService } from '../services/catalogService';
import { createLotUrl, createProductUrl } from './slugs';

export interface SitemapEntry {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Returns the normalized canonical base URL with 'www.' guaranteed for surplusmarket.com
 */
export function getBaseUrl(): string {
  let url = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.surplusmarket.com').trim().replace(/\/$/, '');
  if (url === 'https://surplusmarket.com' || url === 'http://surplusmarket.com') {
    url = 'https://www.surplusmarket.com';
  } else if (url.includes('surplusmarket.com') && !url.includes('www.')) {
    url = url.replace('surplusmarket.com', 'www.surplusmarket.com');
  }
  return url;
}

/**
 * Returns all static marketing, legal, calculator, category, and regional landing pages.
 */
export async function getStaticRoutes(baseUrl: string = getBaseUrl()): Promise<SitemapEntry[]> {
  const routes: SitemapEntry[] = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/browse`,
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
      url: `${baseUrl}/buy`,
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
    // Sustainability data articles
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

  // Popular category pages
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

  for (const slug of commonCategories) {
    routes.push({
      url: `${baseUrl}/shop-by-category/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  return routes;
}

/**
 * Returns dynamic blog sitemap entries, always fresh from the backend API.
 */
export async function getBlogRoutes(baseUrl: string = getBaseUrl()): Promise<SitemapEntry[]> {
  const routes: SitemapEntry[] = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    const blogs = await getBlogs();
    if (Array.isArray(blogs) && blogs.length > 0) {
      for (const b of blogs) {
        if (!b?.slug) continue;
        const lastMod = b.publishedAt ? new Date(b.publishedAt) : new Date();
        routes.push({
          url: `${baseUrl}/blog/${b.slug}`,
          lastModified: isNaN(lastMod.getTime()) ? new Date() : lastMod,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  } catch (error) {
    console.warn('[sitemapData] Failed to fetch dynamic blogs for sitemap:', error);
  }

  return routes;
}

/**
 * Returns dynamic product and lot sitemap entries, always fresh from the backend API.
 */
export async function getProductRoutes(baseUrl: string = getBaseUrl()): Promise<SitemapEntry[]> {
  const routes: SitemapEntry[] = [
    {
      url: `${baseUrl}/buy/product`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/buy/lot`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamic Wholesale Lots
  try {
    const lots = await catalogService.getLots({ limit: 1000 });
    if (Array.isArray(lots) && lots.length > 0) {
      for (const l of lots) {
        if (!l?.id) continue;
        const lastMod = l.created_at ? new Date(l.created_at) : new Date();
        routes.push({
          url: `${baseUrl}${createLotUrl(l.title, String(l.id))}`,
          lastModified: isNaN(lastMod.getTime()) ? new Date() : lastMod,
          changeFrequency: 'daily',
          priority: 0.8,
        });
      }
    }
  } catch (error) {
    console.warn('[sitemapData] Failed to fetch dynamic lots for sitemap:', error);
  }

  // Dynamic Products
  try {
    const products = await catalogService.getProducts({ limit: 2000 });
    if (Array.isArray(products) && products.length > 0) {
      for (const p of products) {
        if (!p?.id) continue;
        const lastMod = p.createdAt ? new Date(p.createdAt) : new Date();
        routes.push({
          url: `${baseUrl}${createProductUrl(p.category, p.title || p.sku || p.id, p.id)}`,
          lastModified: isNaN(lastMod.getTime()) ? new Date() : lastMod,
          changeFrequency: 'daily',
          priority: 0.8,
        });
      }
    }
  } catch (error) {
    console.warn('[sitemapData] Failed to fetch dynamic products for sitemap:', error);
  }

  return routes;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

/**
 * Serializes an array of sitemap entries into standard XML urlset format.
 */
export function formatXmlUrlSet(routes: SitemapEntry[]): string {
  const seen = new Set<string>();
  const uniqueRoutes = routes.filter((r) => {
    if (!r.url || seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });

  const urlsXml = uniqueRoutes
    .map((r) => {
      const lastModDate =
        r.lastModified instanceof Date
          ? r.lastModified
          : r.lastModified
          ? new Date(r.lastModified)
          : new Date();
      const lastmodIso = isNaN(lastModDate.getTime()) ? new Date().toISOString() : lastModDate.toISOString();
      const changefreq = r.changeFrequency || 'weekly';
      const priority = typeof r.priority === 'number' ? r.priority.toFixed(1) : '0.8';

      return `  <url>
    <loc>${escapeXml(r.url)}</loc>
    <lastmod>${lastmodIso}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}

/**
 * Serializes a list of sitemap URLs into standard XML sitemapindex format.
 */
export function formatXmlSitemapIndex(
  sitemaps: Array<{ loc: string; lastmod?: Date | string }>
): string {
  const sitemapsXml = sitemaps
    .map((s) => {
      const lastModDate =
        s.lastmod instanceof Date ? s.lastmod : s.lastmod ? new Date(s.lastmod) : new Date();
      const lastmodIso = isNaN(lastModDate.getTime()) ? new Date().toISOString() : lastModDate.toISOString();

      return `  <sitemap>
    <loc>${escapeXml(s.loc)}</loc>
    <lastmod>${lastmodIso}</lastmod>
  </sitemap>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}
</sitemapindex>`;
}

