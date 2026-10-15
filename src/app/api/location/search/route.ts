import { NextRequest, NextResponse } from 'next/server';
import { Country, City, State } from 'country-state-city';

const COUNTRY_NAME_ALIASES: Record<string, string> = {
  'USA': 'US',
  'UNITED STATES': 'US',
  'UNITED STATES OF AMERICA': 'US',
  'UK': 'GB',
  'UNITED KINGDOM': 'GB',
  'UAE': 'AE',
  'UNITED ARAB EMIRATES': 'AE',
  'KSA': 'SA',
  'SAUDI ARABIA': 'SA',
  'QATAR': 'QA',
  'KUWAIT': 'KW',
  'OMAN': 'OM',
  'BAHRAIN': 'BH',
  'INDIA': 'IN',
};

function getCountryCode(countryNameOrCode: string): string | null {
  if (!countryNameOrCode) return null;
  const cleaned = countryNameOrCode.replace(/\s*\([^)]*\)/g, '').trim().toUpperCase();

  if (COUNTRY_NAME_ALIASES[cleaned]) {
    return COUNTRY_NAME_ALIASES[cleaned];
  }

  if (cleaned.length === 2) {
    const directCountry = Country.getCountryByCode(cleaned);
    if (directCountry) return directCountry.isoCode;
  }

  const all = Country.getAllCountries();
  const match = all.find(c => 
    c.name.toUpperCase() === cleaned || 
    c.name.toUpperCase().startsWith(cleaned) ||
    cleaned.startsWith(c.name.toUpperCase())
  );

  return match ? match.isoCode : null;
}

export interface LocationSearchResult {
  displayName: string;
  shortName: string;
  cityOrTown: string;
  stateOrRegion: string;
  country: string;
  countryCode: string;
  lat?: string;
  lon?: string;
}

// In-memory cache for server-side responses
const serverCache = new Map<string, LocationSearchResult[]>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';
  const countryParam = searchParams.get('country')?.trim() || '';

  if (!q || q.length < 2) {
    return NextResponse.json({ success: true, data: [] });
  }

  const isoCode = countryParam ? getCountryCode(countryParam) : null;
  const cacheKey = `${q.toLowerCase()}_${isoCode || 'global'}`;

  if (serverCache.has(cacheKey)) {
    return NextResponse.json({ success: true, data: serverCache.get(cacheKey) });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=6&accept-language=en`;
    if (isoCode) {
      url += `&countrycodes=${encodeURIComponent(isoCode.toLowerCase())}`;
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SurplusLiquidationMarket/1.0 (contact@coralbees.com)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data: any[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const seen = new Set<string>();
        const results: LocationSearchResult[] = [];

        data.forEach(item => {
          const addr = item.address || {};
          const shortName = item.name || addr.village || addr.suburb || addr.town || addr.city || q;
          const cityOrTown = addr.city || addr.town || addr.county || addr.state_district || addr.village || shortName;

          const parts = [
            shortName,
            addr.suburb && addr.suburb !== shortName ? addr.suburb : null,
            addr.county && addr.county !== shortName ? addr.county : null,
            addr.state,
            addr.country
          ].filter(Boolean);

          const displayName = Array.from(new Set(parts)).join(', ');

          if (!seen.has(displayName.toLowerCase())) {
            seen.add(displayName.toLowerCase());
            results.push({
              displayName,
              shortName,
              cityOrTown,
              stateOrRegion: addr.state || '',
              country: addr.country || '',
              countryCode: addr.country_code || '',
              lat: item.lat,
              lon: item.lon
            });
          }
        });

        if (results.length > 0) {
          serverCache.set(cacheKey, results);
          return NextResponse.json({ success: true, data: results });
        }
      }
    }
  } catch (err) {
    console.warn(`[/api/location/search] Nominatim search failed for "${q}":`, err);
  }

  // Fallback: search local country-state-city database if Nominatim is unreachable
  try {
    const fallbackResults: LocationSearchResult[] = [];
    const queryLower = q.toLowerCase();

    if (isoCode) {
      const cities = City.getCitiesOfCountry(isoCode) || [];
      const states = State.getStatesOfCountry(isoCode) || [];

      // Check states/emirates
      states.forEach(s => {
        if (s.name.toLowerCase().includes(queryLower) && fallbackResults.length < 5) {
          fallbackResults.push({
            displayName: `${s.name}, ${countryParam}`,
            shortName: s.name,
            cityOrTown: s.name,
            stateOrRegion: s.name,
            country: countryParam,
            countryCode: isoCode
          });
        }
      });

      // Check cities
      cities.forEach(c => {
        if (c.name.toLowerCase().includes(queryLower) && fallbackResults.length < 6) {
          fallbackResults.push({
            displayName: `${c.name}, ${countryParam}`,
            shortName: c.name,
            cityOrTown: c.name,
            stateOrRegion: c.stateCode || '',
            country: countryParam,
            countryCode: isoCode
          });
        }
      });
    }

    return NextResponse.json({ success: true, data: fallbackResults });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}
