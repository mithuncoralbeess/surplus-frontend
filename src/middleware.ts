import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Blocklist of automated scraper frameworks, abusive bots, and headless libraries
const BLOCKED_BOT_SIGNATURES = [
  'bytespider',
  'python-requests',
  'aiohttp',
  'httpx',
  'scrapy',
  'go-http-client',
  'libwww-perl',
  'urllib',
  'zgrab',
  'colly',
  'wget',
  'petalbot',
  'mj12bot',
  'dotbot',
  'ahrefsbot',
  'semrushbot',
  'dataforseobot',
  'ccbot',
  'gptbot',
  'claude-web',
  'anthropic-ai',
];

export function middleware(request: NextRequest) {
  // Allow health checks unconditionally
  if (request.nextUrl.pathname === '/api/health') {
    return NextResponse.next();
  }

  const userAgent = (request.headers.get('user-agent') || '').toLowerCase().trim();

  // 1. Block empty or non-existent User-Agent headers (real browsers always provide a User-Agent)
  if (!userAgent) {
    return new NextResponse('Access Denied', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // 2. Block known malicious bot frameworks and aggressive scrapers
  const isBlocked = BLOCKED_BOT_SIGNATURES.some((signature) => userAgent.includes(signature));
  if (isBlocked) {
    return new NextResponse('Access Denied - Automated Scraping Prohibited', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static chunks)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - static image and asset files (.svg, .png, .jpg, .webp, .css, .js, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

