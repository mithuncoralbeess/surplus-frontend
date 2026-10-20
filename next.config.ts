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
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
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
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Needed for Next.js hydration & dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: http:",
      `connect-src 'self' ${envBackendTarget} https://*.surplusmarket.com https://open.er-api.com https://*.r2.cloudflarestorage.com https://*.cloudflarestorage.com`.trim(),
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  images: {
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

