"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '../i18n/dictionaries/en.json';
import ar from '../i18n/dictionaries/ar.json';

export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

const dictionaries: Record<Locale, Record<string, any>> = {
  en,
  ar,
};

interface LanguageContextType {
  locale: Locale;
  dir: Direction;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('surplus_language') as Locale | null;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'ar')) {
      setLocaleState(savedLocale);
    }
  }, []);

  const dir: Direction = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
    }
  }, [locale, dir]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('surplus_language', newLocale);
      document.cookie = `surplus_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  const t = useCallback((key: string, fallback?: string): string => {
    const keys = key.split('.');
    let current: any = dictionaries[locale] || dictionaries.en;
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Fallback to English dictionary if key is missing in active locale
        let enCurrent: any = dictionaries.en;
        for (const enK of keys) {
          if (enCurrent && typeof enCurrent === 'object' && enK in enCurrent) {
            enCurrent = enCurrent[enK];
          } else {
            return fallback || key;
          }
        }
        return typeof enCurrent === 'string' ? enCurrent : fallback || key;
      }
    }

    return typeof current === 'string' ? current : fallback || key;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, dir, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      locale: 'en' as Locale,
      dir: 'ltr' as Direction,
      setLocale: () => {},
      t: (key: string, fallback?: string) => fallback || key,
    };
  }
  return context;
};
