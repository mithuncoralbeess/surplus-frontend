"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface CurrencyContextType {
  currency: string;
  selectedRegion: string;
  currencyOptions: CurrencyOption[];
  isLiveRates: boolean;
  setCurrency: (code: string) => void;
  setSelectedRegion: (region: string) => void;
  setRegionAndCurrency: (region: string, code: string) => void;
  formatPrice: (amountInUsd: number, overrideCurrency?: string) => string;
  activeOption: CurrencyOption;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>('USD');
  const [selectedRegion, setSelectedRegionState] = useState<string>('India');
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>(INITIAL_CURRENCY_OPTIONS);
  const [isLiveRates, setIsLiveRates] = useState<boolean>(false);

  // Restore saved choices & fetch live exchange rates on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('surplus_currency');
    const savedRegion = localStorage.getItem('surplus_region');
    if (savedCurrency) {
      setCurrencyState(savedCurrency);
    }
    if (savedRegion) {
      setSelectedRegionState(savedRegion);
    }

    // Fetch live rates relative to USD from open forex API
    async function fetchLiveExchangeRates() {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (response.ok) {
          const data = await response.json();
          if (data && data.rates) {
            setCurrencyOptions(prev => 
              prev.map(opt => ({
                ...opt,
                rate: data.rates[opt.code] ? data.rates[opt.code] : opt.rate
              }))
            );
            setIsLiveRates(true);
          }
        }
      } catch (err) {
        console.warn('Live forex exchange rates unavailable, using default rates.', err);
      }
    }

    fetchLiveExchangeRates();
  }, []);

  const setCurrency = (code: string) => {
    setCurrencyState(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('surplus_currency', code);
    }
  };

  const setSelectedRegion = (region: string) => {
    setSelectedRegionState(region);
    if (typeof window !== 'undefined') {
      localStorage.setItem('surplus_region', region);
    }
  };

  const setRegionAndCurrency = (region: string, code: string) => {
    setSelectedRegionState(region);
    setCurrencyState(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('surplus_region', region);
      localStorage.setItem('surplus_currency', code);
    }
  };

  const activeOption = currencyOptions.find(c => c.code === currency) || currencyOptions[0];

  const formatPrice = (amountInUsd: number, overrideCurrency?: string): string => {
    const targetCode = overrideCurrency || currency;
    const option = currencyOptions.find(c => c.code === targetCode) || activeOption;
    const converted = amountInUsd * option.rate;

    if (option.code === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: amountInUsd >= 1000 ? 0 : 2
      }).format(converted);
    } else if (option.code === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: converted >= 1000 ? 0 : 2
      }).format(converted);
    } else if (option.code === 'EUR') {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: converted >= 1000 ? 0 : 2
      }).format(converted);
    } else if (option.code === 'GBP') {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        maximumFractionDigits: converted >= 1000 ? 0 : 2
      }).format(converted);
    } else {
      // For AED, SAR, QAR
      const formattedNum = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: converted >= 1000 ? 0 : 2
      }).format(converted);
      return `${option.symbol} ${formattedNum}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      selectedRegion,
      currencyOptions,
      isLiveRates,
      setCurrency,
      setSelectedRegion,
      setRegionAndCurrency,
      formatPrice,
      activeOption
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    return {
      currency: 'USD',
      selectedRegion: 'India',
      currencyOptions: INITIAL_CURRENCY_OPTIONS,
      isLiveRates: false,
      setCurrency: () => {},
      setSelectedRegion: () => {},
      setRegionAndCurrency: () => {},
      formatPrice: (amountInUsd: number) => `$${amountInUsd}`,
      activeOption: INITIAL_CURRENCY_OPTIONS[0]
    };
  }
  return context;
};

// Backwards compatibility export
export const CURRENCY_OPTIONS = INITIAL_CURRENCY_OPTIONS;
