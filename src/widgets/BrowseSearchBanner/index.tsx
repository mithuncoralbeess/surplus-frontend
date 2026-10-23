"use client";

import React, { useState, useEffect, useRef, useTransition, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Sparkles, Search, Zap, Clock, TrendingUp, Mic, MicOff,
  X, Check, ChevronRight, Cpu, Wrench, ShieldCheck, Tag, ArrowRight,
  Loader2, Package, Truck, PenTool, Hammer, Laptop, HardHat, Drill, Lamp, Box, Layers
} from 'lucide-react';
import {
  parseNaturalLanguageQuery,
  getInstantSuggestions,
  fetchInstantSuggestions,
  ParsedAiIntent
} from '../../lib/aiSearchEngine';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { useCurrency } from '../../context/CurrencyContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCategories, Category, SubCategory } from '../../store/slices/categorySlice';

const ICON_MAP: Record<string, any> = {
  'apparel': Tag,
  'clothing': Tag,
  'automotive': Truck,
  'books': PenTool,
  'stationery': PenTool,
  'construction': Hammer,
  'building': Hammer,
  'consumer electronics': Laptop,
  'electronics': Cpu,
  'ict': Cpu,
  'electrical': Zap,
  'lighting': Lamp,
  'hardware': Wrench,
  'tools': Drill,
  'safety': HardHat,
  'ppe': HardHat,
  'industrial': Box,
};

const getCategoryIcon = (name: string) => {
  const normalized = (name || '').toLowerCase().trim();
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (normalized.includes(key)) return icon;
  }
  return Package;
};

const BrowseSearchBanner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { formatPrice } = useCurrency();
  const initialQuery = searchParams.get('q') || '';

  // Get categories strictly from Redux store (hydrated from API & cached in localStorage)
  const { categories: reduxCategories, loading: categoriesLoading } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (!reduxCategories || reduxCategories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, reduxCategories]);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchMode, setSearchMode] = useState<'ai' | 'sku'>('ai');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activePromptCategory, setActivePromptCategory] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [parsedIntent, setParsedIntent] = useState<ParsedAiIntent | null>(null);
  const [instantMatches, setInstantMatches] = useState<{ products: any[]; categories: string[]; suggestions: string[] }>({
    products: [],
    categories: [],
    suggestions: []
  });

  const [, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamically derive AI search prompts strictly from Redux API categories & subcategories
  const promptCategories = useMemo(() => {
    if (!reduxCategories || reduxCategories.length === 0) return [];
    return reduxCategories.map((cat) => {
      const subs = (cat.subcategories || cat.sub_categories || []).filter((s: SubCategory) => Boolean(s?.name));
      let prompts: { text: string; tag: string }[] = [];

      if (subs.length >= 3) {
        prompts = [
          { text: `Wholesale ${subs[0].name} surplus lots`, tag: subs[0].name.slice(0, 16) },
          { text: `Bulk pallets of ${subs[1].name} liquidation inventory`, tag: 'Wholesale Lot' },
          { text: `Verified ${subs[2].name} overstock deals`, tag: 'Overstock' },
          ...(subs[3] ? [{ text: `Brand new surplus ${subs[3].name} manifests`, tag: 'Verified Deal' }] : [])
        ];
      } else if (subs.length > 0) {
        prompts = [
          { text: `Wholesale ${subs[0].name} surplus lots`, tag: subs[0].name.slice(0, 16) },
          { text: `Surplus ${cat.name} liquidation inventory`, tag: 'Liquidation' },
          { text: `Bulk pallets of ${cat.name} ready to ship`, tag: 'Bulk Lot' }
        ];
      } else {
        prompts = [
          { text: `Wholesale ${cat.name} surplus lots`, tag: 'Wholesale' },
          { text: `Bulk ${cat.name} liquidation pallets`, tag: 'Liquidation' },
          { text: `Verified ${cat.name} overstock inventory`, tag: 'Overstock' }
        ];
      }

      return {
        category: cat.name,
        id: cat.id,
        icon: getCategoryIcon(cat.name),
        prompts,
        subCount: subs.length
      };
    });
  }, [reduxCategories]);

  const safeActiveIndex = promptCategories.length > 0
    ? Math.min(activePromptCategory, promptCategories.length - 1)
    : 0;
  const currentPromptCategory = promptCategories[safeActiveIndex];

  // Dynamically generate trending tags from Redux categories & subcategories
  const trendingTags = useMemo(() => {
    if (!reduxCategories || reduxCategories.length === 0) return [];
    const tags: string[] = [];
    for (const cat of reduxCategories) {
      const subs = cat.subcategories || cat.sub_categories || [];
      for (const sub of subs) {
        if (sub?.name && !tags.includes(sub.name)) {
          tags.push(sub.name);
          if (tags.length >= 8) break;
        }
      }
      if (tags.length >= 8) break;
    }
    if (tags.length < 5) {
      for (const cat of reduxCategories) {
        if (cat?.name && !tags.includes(cat.name)) {
          tags.push(cat.name);
          if (tags.length >= 8) break;
        }
      }
    }
    return tags;
  }, [reduxCategories]);

  // Real-time matched categories from Redux store when user is typing
  const matchedReduxCategories = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (trimmed.length < 2 || !reduxCategories) return [];
    return reduxCategories.filter(cat => {
      if (cat.name.toLowerCase().includes(trimmed)) return true;
      const subs = cat.subcategories || cat.sub_categories || [];
      return subs.some((s: SubCategory) => s?.name?.toLowerCase().includes(trimmed));
    }).slice(0, 4);
  }, [reduxCategories, searchQuery]);

  // Load recent searches from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('surplus_recent_searches');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentSearches(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter(t => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem('surplus_recent_searches', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const removeRecentSearch = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(t => t !== termToRemove);
    setRecentSearches(updated);
    try {
      localStorage.setItem('surplus_recent_searches', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const clearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('surplus_recent_searches');
    } catch (e) {
      // ignore
    }
  };

  // Sync with URL params
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchQuery(q);
    if (q) {
      setParsedIntent(parseNaturalLanguageQuery(q));
    }
    if (searchParams.get('openDropdown') === 'true' || searchParams.get('ai') === 'true') {
      setIsDropdownOpen(true);
    }
    if (searchParams.get('mode') === 'sku') {
      setSearchMode('sku');
    }
  }, [searchParams]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
      }
    };

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // Auto-close dropdown only when user scrolls far away, ignoring scrolls inside the dropdown
  useEffect(() => {
    if (!isDropdownOpen) return;
    const initialY = typeof window !== 'undefined' ? window.scrollY : 0;
    const handlePageScroll = (e: Event) => {
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
        return;
      }
      if (Math.abs(window.scrollY - initialY) > 160) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handlePageScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handlePageScroll);
    };
  }, [isDropdownOpen]);

  // Real-time AI Intent Parsing & Instant Typeahead suggestions with debouncing
  useEffect(() => {
    let isCancelled = false;
    const trimmed = searchQuery.trim();
    if (trimmed) {
      setIsLoadingSuggestions(true);
      const timer = setTimeout(() => {
        const intent = parseNaturalLanguageQuery(trimmed);
        setParsedIntent(intent);
        fetchInstantSuggestions(trimmed, 5)
          .then(instant => {
            if (!isCancelled) {
              setInstantMatches(instant);
              setIsLoadingSuggestions(false);
            }
          })
          .catch(() => {
            if (!isCancelled) {
              setInstantMatches(getInstantSuggestions(trimmed, 5));
              setIsLoadingSuggestions(false);
            }
          });
      }, 120);

      return () => {
        isCancelled = true;
        clearTimeout(timer);
      };
    } else {
      setParsedIntent(null);
      setInstantMatches({ products: [], categories: [], suggestions: [] });
      setIsLoadingSuggestions(false);
    }
  }, [searchQuery]);

  // Voice Search Handler
  const { isListening, isSupported, toggleListening } = useVoiceSearch({
    onTranscript: (transcript) => {
      setSearchQuery(transcript);
      setIsDropdownOpen(true);
      inputRef.current?.focus();
    },
    onError: (err) => {
      console.warn('Voice search note:', err);
    }
  });

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      saveRecentSearch(query);
      setIsDropdownOpen(false);
      setSelectedIndex(-1);
      startTransition(() => {
        router.push(`/browse?q=${encodeURIComponent(query)}`);
      });
    } else {
      router.push('/browse');
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    setSearchQuery(promptText);
    saveRecentSearch(promptText);
    setIsDropdownOpen(false);
    setSelectedIndex(-1);
    startTransition(() => {
      router.push(`/browse?q=${encodeURIComponent(promptText.trim())}`);
    });
  };

  const handleProductQuickSelect = (productId: string, productTitle: string) => {
    saveRecentSearch(productTitle);
    setSearchQuery(productTitle);
    setIsDropdownOpen(false);
    setSelectedIndex(-1);
    startTransition(() => {
      router.push(`/browse?q=${encodeURIComponent(productTitle)}&highlight=${productId}`);
    });
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSelectedIndex(-1);
      return;
    }
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsDropdownOpen(true);
        return;
      }
    }
    const items = instantMatches.products;
    if (items.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < items.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : items.length - 1));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          const sel = items[selectedIndex];
          handleProductQuickSelect(sel.id, sel.title);
        }
      }
    }
  };

  const handleRemoveIntentTag = (tagType: keyof ParsedAiIntent) => {
    if (!parsedIntent) return;
    const currentQuery = searchQuery;
    let newQuery = currentQuery;

    if (tagType === 'brand' && parsedIntent.brand) {
      newQuery = newQuery.replace(new RegExp(`\\b${parsedIntent.brand}\\b`, 'gi'), '');
    } else if (tagType === 'condition' && parsedIntent.condition) {
      newQuery = newQuery.replace(new RegExp(`\\b${parsedIntent.condition}\\b`, 'gi'), '');
    } else if (tagType === 'maxPrice' && parsedIntent.maxPrice) {
      newQuery = newQuery.replace(/(?:under|below|less than|<|up to|max)\s*\$?[0-9,]+/gi, '');
    } else if (tagType === 'category' && parsedIntent.category) {
      newQuery = newQuery.replace(new RegExp(`\\b${parsedIntent.category}\\b`, 'gi'), '');
    }

    newQuery = newQuery.replace(/\s+/g, ' ').trim();
    setSearchQuery(newQuery);
    if (newQuery) {
      setParsedIntent(parseNaturalLanguageQuery(newQuery));
      router.push(`/browse?q=${encodeURIComponent(newQuery)}`);
    } else {
      router.push('/browse');
    }
  };

  return (
    <section className="w-full bg-gradient-to-b py-10 md:py-14 border-b border-emerald-950/5 relative overflow-visible">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-48 bg-emerald-200/20 blur-3xl pointer-events-none rounded-full" />

      <div className="container max-w-5xl mx-auto px-4 relative z-10">

        {/* Header Badges & Latency Pill */}
        <div className="flex items-center gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-300/60 text-[#0a5c48] font-bold text-xs tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#14b875] animate-pulse" />
            <span>AI SMART SEARCH ENGINE 2.0</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800/80 bg-white/80 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            ⚡ &lt; 10ms Hybrid Latency
          </span>
        </div>

        {/* Main Title & Natural Subtitle */}
        <h1 className="text-3xl md:text-[44px] font-extrabold text-gray-900 mb-2 tracking-tight leading-tight">
          Verified Surplus Inventory, <span className="text-[#0a5c48]">Intelligently Found.</span>
        </h1>
        <p className="text-gray-600 text-sm md:text-[17px] mb-6 max-w-3xl leading-relaxed">
          Search naturally in plain English: specify brand, model, maximum budget, condition, location, or bulk quantity.
        </p>

        {/* High-Performance Search Bar Container */}
        <div className="relative w-full" ref={dropdownRef}>
          <form
            onSubmit={handleSearchSubmit}
            onClick={() => {
              setIsDropdownOpen(true);
              inputRef.current?.focus();
            }}
            className={`relative flex items-center w-full bg-white border cursor-text ${isDropdownOpen
                ? 'border-[#0f7a61] ring-3 ring-[#0f7a61]/15 shadow-2xl'
                : 'border-gray-300/80 shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:border-gray-400'
              } rounded-full transition-all p-1.5 sm:p-2 bg-white`}
          >
            <div className="flex items-center pl-3 sm:pl-4 text-gray-400 shrink-0">
              <Search className="w-5 h-5 text-gray-400" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(true);
              }}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
                setSelectedIndex(-1);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder={
                searchMode === 'ai'
                  ? "Ask conversationally (e.g. 'Show me 2U rackmount servers under $500 in Maharashtra')..."
                  : "e.g. Enter Part # or Model: R740-XD, C9300, DCD996..."
              }
              className="w-full pl-3 pr-2 py-3 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-[15px] sm:text-[16px] font-medium"
            />

            {/* Live Search Loading Indicator */}
            {isLoadingSuggestions && (
              <Loader2 className="w-4 h-4 text-[#0f7a61] animate-spin shrink-0 mr-1.5" />
            )}

            {/* Clear Query Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery('');
                  setParsedIntent(null);
                  setSelectedIndex(-1);
                  inputRef.current?.focus();
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer mr-1"
                title="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Voice Search Button */}
            {isSupported && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleListening();
                }}
                className={`relative p-2 rounded-full transition-all cursor-pointer mr-1 ${isListening
                    ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200'
                    : 'text-gray-500 hover:text-[#0f7a61] hover:bg-emerald-50'
                  }`}
                title={isListening ? "Listening... speak now" : "Search by voice"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isListening && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                )}
              </button>
            )}

            {/* AI Smart Search Toggle Trigger */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 pr-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                  if (!isDropdownOpen) {
                    inputRef.current?.focus();
                  }
                }}
                className="hidden md:flex items-center gap-1.5 bg-emerald-50 text-[#0f7a61] hover:bg-emerald-100 px-3.5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-colors cursor-pointer border border-emerald-200/50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#14b875]" />
                <span>AI PROMPTS</span>
              </button>

              <button
                type="submit"
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0f7a61] hover:bg-[#0c6651] active:scale-[0.98] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-[14px] sm:text-[15px] transition-all whitespace-nowrap cursor-pointer shadow-md hover:shadow-lg flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4 hidden sm:inline" />
              </button>
            </div>
          </form>

          {/* Real-time Extracted AI Intent Filter Chips */}
          {parsedIntent && (parsedIntent.brand || parsedIntent.category || parsedIntent.condition || parsedIntent.maxPrice || parsedIntent.sku || parsedIntent.isBulkLot) && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5 px-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#14b875]" /> AI Extracted:
              </span>

              {parsedIntent.brand && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-[#0a5c48] border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Brand: <strong className="font-semibold">{parsedIntent.brand}</strong>
                  <button type="button" onClick={() => handleRemoveIntentTag('brand')} className="hover:text-red-700 ml-0.5 cursor-pointer">×</button>
                </span>
              )}

              {parsedIntent.category && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Category: <strong className="font-semibold">{parsedIntent.category}</strong>
                  <button type="button" onClick={() => handleRemoveIntentTag('category')} className="hover:text-red-700 ml-0.5 cursor-pointer">×</button>
                </span>
              )}

              {parsedIntent.condition && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Condition: <strong className="font-semibold">{parsedIntent.condition}</strong>
                  <button type="button" onClick={() => handleRemoveIntentTag('condition')} className="hover:text-red-700 ml-0.5 cursor-pointer">×</button>
                </span>
              )}

              {parsedIntent.maxPrice && (
                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Budget: <strong className="font-semibold">&lt; ${parsedIntent.maxPrice.toLocaleString()}</strong>
                  <button type="button" onClick={() => handleRemoveIntentTag('maxPrice')} className="hover:text-red-700 ml-0.5 cursor-pointer">×</button>
                </span>
              )}

              {parsedIntent.sku && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  SKU: <strong className="font-semibold">{parsedIntent.sku}</strong>
                </span>
              )}

              {parsedIntent.isBulkLot && (
                <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  📦 Wholesale / Bulk Lot
                </span>
              )}
            </div>
          )}

          {/* High-Performance Attached Search Dropdown */}
          {isDropdownOpen && (
            <div
              className="absolute left-0 right-0 top-full mt-3 bg-white rounded-3xl border border-gray-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-50 p-5 md:p-6 max-h-[min(82vh,580px)] overflow-y-auto overscroll-contain animate-in fade-in zoom-in-95 duration-150"
            >
              {/* STATE 1: Live Typeahead Results (When user has typed) */}
              {searchQuery.trim().length > 0 ? (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                    <div className="flex items-center gap-2 text-[#0f7a61] font-bold text-xs tracking-wider uppercase">
                      {isLoadingSuggestions ? (
                        <Loader2 className="w-4 h-4 text-[#14b875] animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-[#14b875]" />
                      )}
                      <span>Instant AI Matches ({instantMatches.products.length} found)</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-[10px] font-mono text-gray-600">Enter ↵</kbd> for full results
                    </span>
                  </div>

                  {isLoadingSuggestions && instantMatches.products.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-[#0f7a61] animate-spin" />
                      <span className="text-xs font-semibold text-gray-600">Searching inventory & catalog...</span>
                    </div>
                  ) : instantMatches.products.length > 0 ? (
                    <div className="space-y-1.5 mb-4">
                      {instantMatches.products.map((item, idx) => {
                        const isSelected = selectedIndex === idx;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleProductQuickSelect(item.id, item.title)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer group border ${
                              isSelected
                                ? 'bg-emerald-50/90 border-emerald-300 shadow-xs'
                                : 'hover:bg-emerald-50/70 border-transparent hover:border-emerald-200/60'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/70 flex items-center justify-center">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="48px"
                                    className="object-cover group-hover:scale-105 transition-transform"
                                  />
                                ) : (
                                  <Package className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0a5c48] bg-emerald-100/70 px-2 py-0.5 rounded">
                                    {item.category || 'Surplus'}
                                  </span>
                                  {item.isLot && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                      Wholesale Lot
                                    </span>
                                  )}
                                  <span className="text-[11px] text-gray-500 font-mono truncate max-w-[150px]">
                                    SKU: {item.sku}
                                  </span>
                                </div>
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#0f7a61] truncate">
                                  {item.title}
                                </h4>
                              </div>
                            </div>

                            <div className="text-right shrink-0 pl-3">
                              <div className="text-sm font-extrabold text-[#0a5c48]">
                                {formatPrice(item.price)}
                              </div>
                              {item.retailPrice > item.price && (
                                <div className="text-[11px] text-gray-400 line-through">
                                  MSRP {formatPrice(item.retailPrice)}
                                </div>
                              )}
                              {item.discountPercent > 0 && (
                                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded inline-block mt-0.5">
                                  -{item.discountPercent}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      <p className="text-sm font-medium">No instant matches found for &quot;{searchQuery}&quot;</p>
                      <p className="text-xs text-gray-400 mt-1">Press search to run a full hybrid semantic search with fuzzy tolerance.</p>
                    </div>
                  )}

                  {/* Matched Categories & Suggestions */}
                  {(matchedReduxCategories.length > 0 || instantMatches.suggestions.length > 0) && (
                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      {matchedReduxCategories.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-gray-500 font-medium">Matching categories:</span>
                          {matchedReduxCategories.map((cat) => {
                            const subCount = cat.subcategories?.length || cat.sub_categories?.length || 0;
                            return (
                              <button
                                key={cat.id || cat.name}
                                type="button"
                                onClick={() => handleSelectPrompt(cat.name)}
                                className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-[#0f7a61] border border-emerald-200/80 px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer"
                              >
                                <Package className="w-3.5 h-3.5 text-[#0f7a61]" />
                                <span>{cat.name}</span>
                                <span className="text-[10px] text-emerald-700/70 font-normal">
                                  ({subCount} {subCount === 1 ? 'subcategory' : 'subcategories'})
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {instantMatches.suggestions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-gray-500 font-medium">Try searching:</span>
                          {instantMatches.suggestions.map((sug, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectPrompt(sug)}
                              className="text-xs bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-[#0f7a61] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* STATE 2: Prompts, Categories & Recent Searches (When input is empty) */
                <div>
                  {/* Category Tabs for AI Prompts */}
                  <div className="pb-3 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-[#0f7a61] font-bold text-xs tracking-wider uppercase">
                        <Sparkles className="w-4 h-4 text-[#14b875]" />
                        <span>AI Natural Language Prompts</span>
                      </div>
                      <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">Click any query to run instant AI search</span>
                    </div>

                    {/* Category Selector Tabs from Redux */}
                    {promptCategories.length > 0 ? (
                      <>
                        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
                          {promptCategories.map((cat, idx) => {
                            const Icon = cat.icon;
                            const isActive = safeActiveIndex === idx;
                            return (
                              <button
                                key={cat.id || idx}
                                type="button"
                                onClick={() => setActivePromptCategory(idx)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                  isActive
                                    ? 'bg-[#0f7a61] text-white shadow-xs'
                                    : 'bg-gray-100 hover:bg-gray-200/80 text-gray-600'
                                }`}
                              >
                                <Icon className="w-3 h-3" />
                                <span>{cat.category}</span>
                                {cat.subCount > 0 && (
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                                  }`}>
                                    {cat.subCount}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Prompts list for selected category */}
                        {currentPromptCategory && currentPromptCategory.prompts.length > 0 && (
                          <div className="space-y-1.5 mt-2.5">
                            {currentPromptCategory.prompts.map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectPrompt(item.text)}
                                className="w-full text-left p-2.5 rounded-2xl hover:bg-emerald-50/80 transition-colors flex items-center justify-between group border border-transparent hover:border-emerald-200/60 cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                  <Zap className="w-4 h-4 text-[#0f7a61] shrink-0 opacity-70 group-hover:opacity-100" />
                                  <span className="text-xs sm:text-sm text-gray-800 font-medium group-hover:text-[#0f7a61] transition-colors truncate">
                                    {item.text}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold bg-emerald-100/70 text-[#0f7a61] px-2.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                                  {item.tag}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="py-4 text-center text-xs text-gray-400">
                        {categoriesLoading ? 'Loading verified categories from catalog...' : 'Categories available soon'}
                      </div>
                    )}
                  </div>

                  {/* Section 2: Recent & Trending */}
                  <div className="py-4 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Recent Searches */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>Recent Searches</span>
                        </div>
                        {recentSearches.length > 0 && (
                          <button
                            type="button"
                            onClick={clearAllRecent}
                            className="text-[11px] text-gray-400 hover:text-red-600 font-medium cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      {recentSearches.length > 0 ? (
                        <div className="space-y-1">
                          {recentSearches.slice(0, 4).map((term, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleSelectPrompt(term)}
                              className="w-full px-2.5 py-1.5 rounded-lg hover:bg-gray-50 flex items-center justify-between text-xs text-gray-700 hover:text-[#0f7a61] transition-colors cursor-pointer group"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span className="truncate font-medium">{term}</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => removeRecentSearch(term, e)}
                                className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 p-0.5 rounded"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic py-1">Your recent searches will appear here</p>
                      )}
                    </div>

                    {/* Trending Surplus Categories */}
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                        <span>Trending Surplus Categories</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {trendingTags.map((tag, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectPrompt(tag)}
                            className="bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#0f7a61] border border-gray-200/60 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Popular Categories (Strictly from Redux Store) */}
                  <div className="pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-[#0f7a61]" />
                        <span>Browse by Verified Category</span>
                      </div>
                      {reduxCategories.length > 0 && (
                        <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">
                          {reduxCategories.length} categories from catalog
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {reduxCategories.map((cat) => {
                        const subCount = cat.subcategories?.length || cat.sub_categories?.length || 0;
                        return (
                          <button
                            key={cat.id || cat.name}
                            type="button"
                            onClick={() => handleSelectPrompt(cat.name)}
                            className="flex items-center gap-2 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-[#0f7a61] border border-gray-200/70 hover:border-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer group shadow-2xs"
                          >
                            <Package className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#0f7a61] transition-colors" />
                            <span className="font-semibold">{cat.name}</span>
                            <span className="text-gray-400 text-[10px] group-hover:text-[#0f7a61]/70">
                              ({subCount} {subCount === 1 ? 'subcategory' : 'subcategories'})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default BrowseSearchBanner;
