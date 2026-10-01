"use client";

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from './index';
import { fetchCategories, setCategories } from './slices/categorySlice';

const CACHE_KEY = 'surplus_categories_cache';

const CategoryFetcher: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    // 1. Immediately hydrate from localStorage cache on client mount
    if (typeof window !== 'undefined' && categories.length === 0) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dispatch(setCategories(parsed));
          }
        }
      } catch {
        // Ignore JSON error
      }
    }

    // 2. Fetch fresh categories in background from API
    dispatch(fetchCategories());
  }, [dispatch]);

  return <>{children}</>;
};

export const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <CategoryFetcher>{children}</CategoryFetcher>
    </Provider>
  );
};

export default ReduxProvider;
