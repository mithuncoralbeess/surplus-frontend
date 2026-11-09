import type { MetadataRoute } from 'next';
import { getBaseUrl } from '../lib/sitemapData';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/profile/',
          '/cart/',
          '/auth/',
          '/admin/',
          '/maintenance/',
        ],
      },
      // Block known aggressive AI scrapers and heavy bot crawlers
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
        disallow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/profile/',
          '/cart/',
          '/auth/',
          '/admin/',
          '/maintenance/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/profile/',
          '/cart/',
          '/auth/',
          '/admin/',
          '/maintenance/',
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-blogs.xml`,
      `${baseUrl}/sitemap-products.xml`,
    ],
  };
}
