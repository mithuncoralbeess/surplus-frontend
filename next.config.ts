import type { NextConfig } from "next";

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
      "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 https://surplus-backend-uhg0.onrender.com https://open.er-api.com https://*.r2.cloudflarestorage.com https://*.cloudflarestorage.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
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

