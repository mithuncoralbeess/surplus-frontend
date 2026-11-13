import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Blocklist of automated scraper frameworks, abusive bots, and headless libraries
const BLOCKED_BOT_SIGNATURES = [
  'python-requests',
  'aiohttp',
  'httpx',
  'go-http-client',
  'libwww-perl',
  'urllib',
  'zgrab',
  'colly',
  'wget',
];

export function middleware(request: NextRequest) {
  const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').toLowerCase();
  const isDevHost = host.includes('dev.surplusmarket.com') || host.startsWith('dev.');

  // 1. Staging/Dev environment protection: ensure dev.surplusmarket.com is NEVER indexed
  if (isDevHost && request.nextUrl.pathname === '/robots.txt') {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // Allow health checks unconditionally
  if (request.nextUrl.pathname === '/api/health') {
    return NextResponse.next();
  }

  const userAgent = (request.headers.get('user-agent') || '').toLowerCase().trim();

  // 2. Block empty or non-existent User-Agent headers (real browsers always provide a User-Agent)
  if (!userAgent) {
    return new NextResponse('Access Denied', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // 3. Block known malicious script scrapers
  const isBlocked = BLOCKED_BOT_SIGNATURES.some((signature) => userAgent.includes(signature));
  if (isBlocked) {
    return new NextResponse('Access Denied - Automated Scraping Prohibited', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const response = NextResponse.next();

  // 4. Inject X-Robots-Tag header on all pages for dev.surplusmarket.com
  if (isDevHost) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static chunks)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml
     * - static image and asset files (.svg, .png, .jpg, .webp, .css, .js, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.*\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|xml)$).*)',
  ],
};

