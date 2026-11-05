import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://surplusmarket.com').replace(/\/$/, '');

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
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
