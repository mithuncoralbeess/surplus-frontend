import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets, next internal bundles, and media to pass freely
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|css|js|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  // If already at root or /maintenance, let it render directly
  if (pathname === '/' || pathname === '/maintenance') {
    return NextResponse.next();
  }

  // Rewrite any other route to / so the maintenance page is shown across the entire site
  const url = request.nextUrl.clone();
  url.pathname = '/';
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
