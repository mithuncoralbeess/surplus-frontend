import { NextResponse } from 'next/server';
import { getBaseUrl, getStaticRoutes, formatXmlUrlSet } from '../../lib/sitemapData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const baseUrl = getBaseUrl();
  const routes = await getStaticRoutes(baseUrl);
  const xml = formatXmlUrlSet(routes);

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}

