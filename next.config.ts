import type { NextConfig } from "next";

const envBackendTarget = (
  process.env.BACKEND_API_URL ||
  process.env.BACKEND_APT_URL ||
  process.env.INTERNAL_BACKEND_URL ||
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  ''
).replace(/\/$/, '');

const securityHeaders = [
  // 1. Prevent Clickjacking (OWASP A05)
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // 2. Prevent MIME-type Sniffing (OWASP A04/A05)
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // 3. Referrer Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // 4. Permissions Policy - Disable unused dangerous hardware capabilities
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(self), geolocation=(), payment=()',
  },
  // 5. Strict Transport Security (HSTS)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  // 6. Cross-Site Scripting (XSS) Protection Filter
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  // 7. Content Security Policy (CSP)
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://tagmanager.google.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://connect.facebook.net https://*.facebook.net https://*.facebook.com https://www.clarity.ms https://*.clarity.ms",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: http: https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://www.facebook.com https://*.facebook.com https://*.clarity.ms https://c.bing.com",
      `connect-src 'self' ${envBackendTarget} https://*.surplusmarket.com https://open.er-api.com https://*.r2.cloudflarestorage.com https://*.cloudflarestorage.com https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://analytics.google.com https://stats.g.doubleclick.net https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.facebook.com https://*.facebook.com https://connect.facebook.net https://*.facebook.net https://*.clarity.ms https://c.clarity.ms https://*.bing.com https://*.run.app https://*.on.aws https://*.amazonaws.com`.trim(),
      "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://www.googletagmanager.com https://www.facebook.com https://*.facebook.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://facebook.com https://*.facebook.com https://facebook.net https://*.facebook.net",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async redirects() {
    return [
      {
        source: '/buy/clothing',
        destination: '/shop-by-category/apparel-footwear-accessories',
        permanent: true,
      },
      {
        source: '/buy/clothing/:path*',
        destination: '/shop-by-category/apparel-footwear-accessories',
        permanent: true,
      },
      {
        source: '/buy/fasteners',
        destination: '/shop-by-category/construction-hardware-mro',
        permanent: true,
      },
      {
        source: '/buy/fasteners/:path*',
        destination: '/shop-by-category/construction-hardware-mro',
        permanent: true,
      },
      {
        source: '/buy/auto-spare-parts-accessories',
        destination: '/shop-by-category/automotive',
        permanent: true,
      },
      {
        source: '/buy/auto-spare-parts-accessories/:path*',
        destination: '/shop-by-category/automotive',
        permanent: true,
      },
      {
        source: '/buy/ict',
        destination: '/shop-by-category/electronics-ict',
        permanent: true,
      },
      {
        source: '/buy/ict/:path*',
        destination: '/shop-by-category/electronics-ict',
        permanent: true,
      },
      {
        source: '/buy/building-materials',
        destination: '/shop-by-category/construction-hardware-mro',
        permanent: true,
      },
      {
        source: '/buy/building-materials/:path*',
        destination: '/shop-by-category/construction-hardware-mro',
        permanent: true,
      },
      {
        source: '/buy/electricals',
        destination: '/shop-by-category/electrical-parts',
        permanent: true,
      },
      {
        source: '/buy/electricals/:path*',
        destination: '/shop-by-category/electrical-parts',
        permanent: true,
      },
      {
        source: '/buy/furniture',
        destination: '/shop-by-category/books-stationery-office-supplies',
        permanent: true,
      },
      {
        source: '/buy/furniture/:path*',
        destination: '/shop-by-category/books-stationery-office-supplies',
        permanent: true,
      },
      {
        source: '/buy/mobile-phone-and-accessories',
        destination: '/shop-by-category/electronics-ict',
        permanent: true,
      },
      {
        source: '/buy/mobile-phone-and-accessories/:path*',
        destination: '/shop-by-category/electronics-ict',
        permanent: true,
      },
      {
        source: '/buy/plumbing-materials',
        destination: '/shop-by-category/construction-hardware-mro',
        permanent: true,
      },
      {
        source: '/buy/plumbing-materials/:path*',
        destination: '/shop-by-category/construction-hardware-mro',
        permanent: true,
      },
      {
        source: '/buy/ppe',
        destination: '/shop-by-category/oil-gas-equipment-mro',
        permanent: true,
      },
      {
        source: '/buy/ppe/:path*',
        destination: '/shop-by-category/oil-gas-equipment-mro',
        permanent: true,
      },
      {
        source: '/gcc-business-sourcing-surplus-locally',
        destination: '/sustainability-data/gcc-business-sourcing-surplus-locally',
        permanent: true,
      },
      {
        source: '/hidden-economy-surplus-strategic-asset',
        destination: '/sustainability-data/hidden-economy-surplus-strategic-asset',
        permanent: true,
      },
      {
        source: '/how-surplus-market-reduces-waste-carbon-footprint',
        destination: '/sustainability-data/how-surplus-market-reduces-waste-carbon-footprint',
        permanent: true,
      },
      {
        source: '/textile-waste-fashion-industry-92-million-tons',
        destination: '/sustainability-data/textile-waste-fashion-industry-92-million-tons',
        permanent: true,
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const backendTarget = envBackendTarget;

    if (!backendTarget) {
      return [];
    }

    return {
      beforeFiles: [
        {
          source: '/api/auth/login/:path*/',
          destination: `${backendTarget}/api/auth/login/:path*/`,
        },
        {
          source: '/api/auth/login/:path*',
          destination: `${backendTarget}/api/auth/login/:path*`,
        },
        {
          source: '/api/auth/register/:path*/',
          destination: `${backendTarget}/api/auth/register/:path*/`,
        },
        {
          source: '/api/auth/register/:path*',
          destination: `${backendTarget}/api/auth/register/:path*`,
        },
      ],
      fallback: [
        {
          source: '/api/:path*/',
          destination: `${backendTarget}/api/:path*/`,
        },
        {
          source: '/api/:path*',
          destination: `${backendTarget}/api/:path*`,
        },
        {
          source: '/categories/:path*/',
          destination: `${backendTarget}/categories/:path*/`,
        },
        {
          source: '/categories/:path*',
          destination: `${backendTarget}/categories/:path*`,
        },
        {
          source: '/media/:path*',
          destination: `${backendTarget}/media/:path*`,
        },
        {
          source: '/submit-product-request/:path*/',
          destination: `${backendTarget}/submit-product-request/:path*/`,
        },
        {
          source: '/submit-product-request/:path*',
          destination: `${backendTarget}/submit-product-request/:path*`,
        },
        {
          source: '/submit-lot-request/:path*/',
          destination: `${backendTarget}/submit-lot-request/:path*/`,
        },
        {
          source: '/submit-lot-request/:path*',
          destination: `${backendTarget}/submit-lot-request/:path*`,
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

