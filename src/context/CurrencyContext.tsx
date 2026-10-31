"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Conversion rate relative to USD (1 USD = rate target)
  region: string;
}

export const INITIAL_CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0, region: 'United States' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rate: 3.67, region: 'United Arab Emirates' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', rate: 3.75, region: 'Saudi Arabia' },
  { code: 'QAR', symbol: 'QAR', name: 'Qatari Riyal', rate: 3.64, region: 'Qatar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5, region: 'India' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, region: 'European Union' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, region: 'United Kingdom' },
];

export const REGIONS_LIST = [
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'India',
  'United Kingdom',
  'United States',
];

export const REGION_SHORT_MAP: Record<string, string> = {
  'United Arab Emirates': 'UAE',
  'Saudi Arabia': 'Saudi',
  'Qatar': 'Qatar',
  'India': 'India',
  'United Kingdom': 'UK',
  'United States': 'USA',
};

export const getShortRegionName = (regionName: string): string => {
  return REGION_SHORT_MAP[regionName] || regionName;
};

interface DetectedRegionProfile {
  region: string;
  currency: string;
  countryCode: string;
}

export const REGION_PROFILES: Record<string, DetectedRegionProfile> = {
  'AE': { region: 'United Arab Emirates', currency: 'USD', countryCode: 'AE' },
  'SA': { region: 'Saudi Arabia', currency: 'USD', countryCode: 'SA' },
  'QA': { region: 'Qatar', currency: 'USD', countryCode: 'QA' },
  'IN': { region: 'India', currency: 'USD', countryCode: 'IN' },
  'GB': { region: 'United Kingdom', currency: 'USD', countryCode: 'GB' },
  'US': { region: 'United States', currency: 'USD', countryCode: 'US' },
  'KW': { region: 'Kuwait', currency: 'USD', countryCode: 'KW' },
  'OM': { region: 'Oman', currency: 'USD', countryCode: 'OM' },
  'BH': { region: 'Bahrain', currency: 'USD', countryCode: 'BH' },
  'DE': { region: 'Germany', currency: 'USD', countryCode: 'DE' },
  'FR': { region: 'France', currency: 'USD', countryCode: 'FR' },
};

export function detectRegionFromBrowserTimezone(): DetectedRegionProfile {
  if (typeof window === 'undefined') {
    return REGION_PROFILES['US'];
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Dubai') || tz.includes('Muscat')) {
      return REGION_PROFILES['AE'];
    }
    if (tz.includes('Riyadh')) {
      return REGION_PROFILES['SA'];
    }
    if (tz.includes('Qatar')) {
      return REGION_PROFILES['QA'];
    }
    if (tz.includes('Kolkata') || tz.includes('Calcutta')) {
      return REGION_PROFILES['IN'];
    }
    if (tz.includes('London') || tz.includes('Belfast')) {
      return REGION_PROFILES['GB'];
    }
    if (tz.startsWith('America/')) {
      return REGION_PROFILES['US'];
    }
    if (tz.startsWith('Europe/')) {
      return REGION_PROFILES['DE'];
    }
  } catch {}
  return REGION_PROFILES['US'];
}

export const DEFAULT_EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  AED: 3.6725,
  SAR: 3.75,
  QAR: 3.64,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  KWD: 0.307,
  OMR: 0.385,
  BHD: 0.376,
};

let globalExchangeRates: Record<string, number> = { ...DEFAULT_EXCHANGE_RATES };

// Initialize cached rates from localStorage in browser
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('surplus_live_exchange_rates');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        globalExchangeRates = { ...globalExchangeRates, ...parsed };
      }
    }
  } catch {}
}

export function updateGlobalExchangeRates(rates: Record<string, number>) {
  globalExchangeRates = { ...globalExchangeRates, ...rates };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('surplus_live_exchange_rates', JSON.stringify(globalExchangeRates));
    } catch {}
  }
}

export function getGlobalExchangeRates(): Record<string, number> {
  return globalExchangeRates;
}

/**
 * Accurately converts any currency amount to USD based on exchange rate.
 * Example: 92.40 QAR / 3.64 = $25.38 USD
 */
export function convertToUsd(
  amount: number | string | undefined | null,
  fromCurrency?: string,
  customRates?: Record<string, number>
): number {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount || 0));
  if (isNaN(num) || !isFinite(num) || num <= 0) return 0;

  const rawCode = String(fromCurrency || 'USD').toUpperCase().trim();
  if (rawCode === 'USD' || rawCode === '$' || rawCode === 'US DOLLAR' || rawCode === 'USD$') {
    return Number(num.toFixed(2));
  }

  const rates = customRates || globalExchangeRates;
  const rate = rates[rawCode] || DEFAULT_EXCHANGE_RATES[rawCode] || 1.0;

  // 1 USD = rate in source currency. Therefore, amount / rate = USD amount
  return Number((num / rate).toFixed(2));
}

interface CurrencyContextType {
  currency: string;
  selectedRegion: string;
  detectedCountryCode: string;
  isAutoDetected: boolean;
  currencyOptions: CurrencyOption[];
  isLiveRates: boolean;
  setCurrency: (code: string) => void;
  setSelectedRegion: (region: string) => void;
  setRegionAndCurrency: (region: string, code: string) => void;
  convertToUsd: (amount: number | string | undefined | null, fromCurrency?: string) => number;
  formatPrice: (amount: number | string | undefined | null, fromCurrency?: string) => string;
  activeOption: CurrencyOption;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency] = useState<string>('USD');
  const [selectedRegion, setSelectedRegionState] = useState<string>('United States');
  const [detectedCountryCode, setDetectedCountryCode] = useState<string>('US');
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(true);
  const [currencyOptions] = useState<CurrencyOption[]>([INITIAL_CURRENCY_OPTIONS[0]]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(DEFAULT_EXCHANGE_RATES);
  const [isLiveRates, setIsLiveRates] = useState<boolean>(false);

  // Enforce USD globally on mount & fetch live forex rates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('surplus_currency', 'USD');
    }

    const savedRegion = typeof window !== 'undefined' ? localStorage.getItem('surplus_region') : null;
    if (savedRegion) {
      setSelectedRegionState(savedRegion);
      setIsAutoDetected(false);
    } else {
      const fallback = detectRegionFromBrowserTimezone();
      setSelectedRegionState(fallback.region);
      setDetectedCountryCode(fallback.countryCode);
      setIsAutoDetected(true);
    }

    // Fetch live rates relative to USD from open forex API (cached for 6 hours, deferred after LCP)
    const RATE_TS_KEY = 'surplus_live_exchange_rates_ts';
    const lastFetched = typeof window !== 'undefined' ? Number(localStorage.getItem(RATE_TS_KEY) || 0) : 0;
    const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

    if (lastFetched > 0 && Date.now() - lastFetched < SIX_HOURS_MS) {
      setExchangeRates({ ...globalExchangeRates });
      setIsLiveRates(true);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (response.ok) {
          const data = await response.json();
          if (data && data.rates) {
            updateGlobalExchangeRates(data.rates);
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(RATE_TS_KEY, String(Date.now()));
              } catch {}
            }
            setExchangeRates(prev => ({
              ...prev,
              ...data.rates
            }));
            setIsLiveRates(true);
          }
        }
      } catch (err) {
        console.warn('Live forex exchange rates unavailable, using default rates.', err);
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const setCurrency = useCallback((_code: string) => {
    // Platform displays in USD only
    if (typeof window !== 'undefined') {
      localStorage.setItem('surplus_currency', 'USD');
    }
  }, []);

  const setSelectedRegion = useCallback((region: string) => {
    setSelectedRegionState(region);
    setIsAutoDetected(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('surplus_region', region);
      localStorage.setItem('surplus_currency', 'USD');
    }
  }, []);

  const setRegionAndCurrency = useCallback((region: string, _code: string) => {
    setSelectedRegionState(region);
    setIsAutoDetected(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('surplus_region', region);
      localStorage.setItem('surplus_currency', 'USD');
    }
  }, []);

  const activeOption = INITIAL_CURRENCY_OPTIONS[0]; // Always USD ($)

  const convertPriceToUsd = useCallback((amount: number | string | undefined | null, fromCurrency?: string): number => {
    return convertToUsd(amount, fromCurrency, exchangeRates);
  }, [exchangeRates]);

  const formatPrice = useCallback((amount: number | string | undefined | null, fromCurrency?: string): string => {
    const usdAmount = convertToUsd(amount, fromCurrency, exchangeRates);
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: usdAmount >= 1000 ? 0 : 2
    }).format(usdAmount);
  }, [exchangeRates]);

  const contextValue = useMemo(() => ({
    currency: 'USD',
    selectedRegion,
    detectedCountryCode,
    isAutoDetected,
    currencyOptions,
    isLiveRates,
    setCurrency,
    setSelectedRegion,
    setRegionAndCurrency,
    convertToUsd: convertPriceToUsd,
    formatPrice,
    activeOption
  }), [selectedRegion, detectedCountryCode, isAutoDetected, currencyOptions, isLiveRates, setCurrency, setSelectedRegion, setRegionAndCurrency, convertPriceToUsd, formatPrice, activeOption]);

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    return {
      currency: 'USD',
      selectedRegion: 'United States',
      detectedCountryCode: 'US',
      isAutoDetected: true,
      currencyOptions: [INITIAL_CURRENCY_OPTIONS[0]],
      isLiveRates: false,
      setCurrency: () => {},
      setSelectedRegion: () => {},
      setRegionAndCurrency: () => {},
      convertToUsd: (amount: number | string | undefined | null, fromCurrency?: string) => convertToUsd(amount, fromCurrency),
      formatPrice: (amount: number | string | undefined | null, fromCurrency?: string) => {
        const usdAmount = convertToUsd(amount, fromCurrency);
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: usdAmount >= 1000 ? 0 : 2
        }).format(usdAmount);
      },
      activeOption: INITIAL_CURRENCY_OPTIONS[0]
    };
  }
  return context;
};

// Backwards compatibility export
export const CURRENCY_OPTIONS = [INITIAL_CURRENCY_OPTIONS[0]];
