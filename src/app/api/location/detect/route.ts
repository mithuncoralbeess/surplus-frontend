import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 1. Detect from cloud / CDN / reverse proxy headers
    const countryHeader =
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('x-country-code') ||
      request.headers.get('x-geo-country');

    if (countryHeader && countryHeader !== 'XX' && countryHeader.length === 2) {
      return NextResponse.json({
        success: true,
        countryCode: countryHeader.toUpperCase(),
        source: 'edge_header'
      });
    }

    // 2. Return fallback response so client uses timezone & locale detection
    return NextResponse.json({
      success: true,
      countryCode: null,
      source: 'client_fallback'
    });
  } catch {
    return NextResponse.json({
      success: false,
      countryCode: null,
      source: 'error'
    });
  }
}
