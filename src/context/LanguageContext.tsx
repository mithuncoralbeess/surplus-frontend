"use client";

import React, { createContext, useContext, useCallback } from 'react';

export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  locale: Locale;
  dir: Direction;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
  tCategory: (name: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  dir: 'ltr',
  setLocale: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  tCategory: (name: string) => name,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setLocale = useCallback((_newLocale: Locale) => {}, []);
  const t = useCallback((key: string, fallback?: string): string => fallback || key, []);
  const tCategory = useCallback((name: string): string => name || '', []);

  return (
    <LanguageContext.Provider value={{ locale: 'en', dir: 'ltr', setLocale, t, tCategory }}>
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
      tCategory: (name: string) => name,
    };
  }
  return context;
};
