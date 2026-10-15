/**
 * Global Location Service
 * Provides:
 * 1. Global Countries List (via `country-state-city` with GCC hubs prioritized).
 * 2. Real-world Location Search (powered by OpenStreetMap Nominatim Geocoding API).
 *    Searches any village, town, panchayat (e.g. Kakkodi), city (e.g. Kozhikode, Dubai),
 *    suburb, or industrial area globally in real time.
 */

import { Country } from 'country-state-city';

export interface LocationOption {
  value: string;
  label: string;
}

export interface RealLocationSuggestion {
  displayName: string;       // e.g. "Kakkodi, Kozhikode, Kerala, India"
  shortName: string;         // e.g. "Kakkodi"
  cityOrTown: string;        // e.g. "Kozhikode" or "Kakkodi"
  stateOrRegion: string;     // e.g. "Kerala"
  country: string;           // e.g. "India"
  countryCode: string;       // e.g. "in"
  lat?: string;
  lon?: string;
}

// Preferred GCC and major trade countries to display at the top of the country dropdown
const PRIORITY_COUNTRY_CODES = ['AE', 'SA', 'QA', 'KW', 'OM', 'BH', 'US', 'GB', 'DE', 'CN', 'IN'];

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

let cachedCountries: LocationOption[] | null = null;
const searchCache = new Map<string, RealLocationSuggestion[]>();

/**
 * Normalizes a country string or label to an ISO country code.
 */
export function getCountryCode(countryNameOrCode: string): string | null {
  if (!countryNameOrCode) return null;
  const cleaned = countryNameOrCode.replace(/\s*\([^)]*\)/g, '').trim().toUpperCase();

  if (COUNTRY_NAME_ALIASES[cleaned]) {
    return COUNTRY_NAME_ALIASES[cleaned];
  }

  // Check if it's already a 2-letter ISO code
  if (cleaned.length === 2) {
    const directCountry = Country.getCountryByCode(cleaned);
    if (directCountry) return directCountry.isoCode;
  }

  // Search by country name
  const all = Country.getAllCountries();
  const match = all.find(c => 
    c.name.toUpperCase() === cleaned || 
    c.name.toUpperCase().startsWith(cleaned) ||
    cleaned.startsWith(c.name.toUpperCase())
  );

  return match ? match.isoCode : null;
}

/**
 * Returns all 250 countries in the world.
 * Prioritizes GCC and key logistics hubs at the top, followed by an alphabetical list of all nations.
 */
export function getGlobalCountries(): LocationOption[] {
  if (cachedCountries && cachedCountries.length > 0) {
    return cachedCountries;
  }

  const all = Country.getAllCountries();
  const priorityList: LocationOption[] = [];
  const otherList: LocationOption[] = [];

  const prioritySet = new Set(PRIORITY_COUNTRY_CODES);

  // Friendly custom labels for primary GCC hubs
  const friendlyLabels: Record<string, string> = {
    'AE': 'United Arab Emirates (UAE)',
    'SA': 'Saudi Arabia (KSA)',
    'QA': 'Qatar',
    'KW': 'Kuwait',
    'OM': 'Oman',
    'BH': 'Bahrain',
    'US': 'United States (USA)',
    'GB': 'United Kingdom (UK)',
    'DE': 'Germany',
    'CN': 'China',
    'IN': 'India'
  };

  // 1. Add priority countries
  PRIORITY_COUNTRY_CODES.forEach(code => {
    const country = all.find(c => c.isoCode === code);
    if (country) {
      priorityList.push({
        value: country.name,
        label: friendlyLabels[code] || country.name,
      });
    }
  });

  // 2. Add all remaining global countries sorted alphabetically
  all.forEach(c => {
    if (!prioritySet.has(c.isoCode)) {
      otherList.push({
        value: c.name,
        label: c.name,
      });
    }
  });

  otherList.sort((a, b) => a.label.localeCompare(b.label));

  cachedCountries = [...priorityList, ...otherList];
  return cachedCountries;
}

/**
 * Real-time Location Search powered by internal API (/api/location/search).
 * Fetches real places, villages, towns, suburbs (e.g. Kakkodi, Kozhikode, Jebel Ali) globally.
 * If a country is selected, prioritizes/filters search within that country.
 */
export async function searchRealLocation(query: string, countryNameOrCode?: string): Promise<RealLocationSuggestion[]> {
  if (!query || query.trim().length < 2) return [];

  const trimmedQuery = query.trim();
  const cacheKey = `${trimmedQuery.toLowerCase()}_${countryNameOrCode || 'global'}`;

  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const params = new URLSearchParams();
    params.set('q', trimmedQuery);
    if (countryNameOrCode) {
      params.set('country', countryNameOrCode);
    }

    const response = await fetch(`/api/location/search?${params.toString()}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        searchCache.set(cacheKey, json.data);
        return json.data;
      }
    }
  } catch (err) {
    console.warn(`[locationService] Real location search for "${trimmedQuery}" error:`, err);
  }

  return [];
}
