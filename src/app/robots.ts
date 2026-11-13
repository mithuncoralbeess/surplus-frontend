import type { MetadataRoute } from 'next';
import { getBaseUrl } from '../lib/sitemapData';

const standardAllow = [
  '/',
  '/api/products/',
  '/api/products/*',
  '/api/lots/',
  '/api/lots/*',
  '/api/categories/',
  '/api/categories/*',
  '/api/auth/session',
];

const standardDisallow = [
  '/api/',
  '/profile/',
  '/cart/',
  '/auth/',
  '/admin/',
  '/maintenance/',
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: standardAllow,
        disallow: standardDisallow,
      },
      // Allowed AI crawlers, search bots, and SEO audit tools
      {
        userAgent: [
          'Bytespider',
          'CCBot',
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-Web',
          'anthropic-ai',
          'Amazonbot',
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'PetalBot',
          'DataForSeoBot',
          'Scrapy',
        ],
        allow: standardAllow,
        disallow: standardDisallow,
      },
      {
        userAgent: 'Googlebot',
        allow: standardAllow,
        disallow: standardDisallow,
      },
      {
        userAgent: 'Bingbot',
        allow: standardAllow,
        disallow: standardDisallow,
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-pages.xml`,
      `${baseUrl}/sitemap-blogs.xml`,
      `${baseUrl}/sitemap-products.xml`,
    ],
  };
}
