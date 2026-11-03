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

// Initialize cached rates from localStorage in browser (if in browser)
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

