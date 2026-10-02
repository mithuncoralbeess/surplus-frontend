"use client";

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Sparkles, Search, Zap, Clock, TrendingUp, Mic, MicOff, 
  X, Check, ChevronRight, Cpu, Wrench, ShieldCheck, Tag, ArrowRight
} from 'lucide-react';
import { 
  parseNaturalLanguageQuery, 
  getInstantSuggestions, 
  ParsedAiIntent 
} from '../../lib/aiSearchEngine';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';

interface AiPromptCategory {
  category: string;
  icon: any;
  prompts: { text: string; tag: string }[];
}

const AI_CATEGORIZED_PROMPTS: AiPromptCategory[] = [
  {
    category: "ICT & Data Center",
    icon: Cpu,
    prompts: [
      { text: "Dell PowerEdge R740 rack server refurbished with warranty", tag: "Enterprise Servers" },
      { text: "Cisco Catalyst 9300 48-port PoE+ network switch surplus", tag: "Networking" },
      { text: "HPE ProLiant DL380 Gen10 servers under $1500", tag: "ICT Hardware" }
    ]
  },
  {
    category: "Power Tools & Machinery",
    icon: Wrench,
    prompts: [
      { text: "Bosch Professional 18V brushless cordless combo kit", tag: "Cordless Tools" },
      { text: "DeWalt 20V MAX hammer drill liquidation lot wholesale", tag: "Wholesale Lots" },
      { text: "Caterpillar excavator hydraulic main pump unused", tag: "Heavy Equipment" }
    ]
  },
  {
    category: "Electricals & Industrial",
    icon: Zap,
    prompts: [
      { text: "Bulk Cat6 solid copper 23AWG network cable 500m drums", tag: "Cabling & Wire" },
      { text: "Siemens S7-1200 PLC automation bundle factory sealed", tag: "Automation" },
      { text: "Fluke 87V industrial true-RMS digital multimeter pack", tag: "Test & Measure" }
    ]
  },
  {
    category: "Liquidation Lots & PPE",
    icon: Tag,
    prompts: [
      { text: "Wholesale TWS wireless earbuds consumer electronics liquidation", tag: "Electronics Lot" },
      { text: "Full pallet 3M Aura N95 particulate respirators", tag: "Safety / PPE" },
      { text: "Neox 12W LED round recessed slim panels bulk pallet", tag: "Commercial Lighting" }
    ]
  }
];

const DEFAULT_RECENT = [
  "Dell PowerEdge R740",
  "Bulk Cat6 Cable",
  "Bosch 18V Brushless Combo",
  "Siemens S7-1200"
];

const TRENDING_SURPLUS = [
  "Dell Rack Servers",
  "Cat6 Drums",
  "Cisco 9300",
  "Fluke 87V",
  "3M N95 Pallets",
  "Bosch 18V",
  "Hydraulic Pumps"
];

const POPULAR_CATEGORIES = [
  { name: "ICT & Servers", count: 86 },
  { name: "Power tools", count: 142 },
  { name: "Electricals", count: 362 },
  { name: "Building Materials", count: 610 },
  { name: "PPE & Safety", count: 94 },
  { name: "Lifting accessories", count: 45 }
];

const BrowseSearchBanner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchMode, setSearchMode] = useState<'ai' | 'sku'>('ai');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activePromptCategory, setActivePromptCategory] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(DEFAULT_RECENT);
  const [parsedIntent, setParsedIntent] = useState<ParsedAiIntent | null>(null);
  const [instantMatches, setInstantMatches] = useState<{ products: any[]; categories: string[]; suggestions: string[] }>({
    products: [],
    categories: [],
    suggestions: []
  });

  const [, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Auto-close dropdown when user scrolls the page so it never gets stuck over content
  useEffect(() => {
    if (!isDropdownOpen) return;
    const initialY = typeof window !== 'undefined' ? window.scrollY : 0;
    const handlePageScroll = () => {
      if (Math.abs(window.scrollY - initialY) > 25) {
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
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        const intent = parseNaturalLanguageQuery(searchQuery);
        setParsedIntent(intent);
        const instant = getInstantSuggestions(searchQuery, 4);
        setInstantMatches(instant);
      } else {
        setParsedIntent(null);
        setInstantMatches({ products: [], categories: [], suggestions: [] });
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Voice Search Handler
  const { isListening, isSupported, toggleListening } = useVoiceSearch({
    onTranscript: (transcript) => {
      setSearchQuery(transcript);
      setIsDropdownOpen(true);
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
      startTransition(() => {
        router.push(`/browse?q=${encodeURIComponent(query)}&mode=${searchMode}`);
      });
    } else {
      router.push('/browse');
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    setSearchQuery(promptText);
    saveRecentSearch(promptText);
    setIsDropdownOpen(false);
    startTransition(() => {
      router.push(`/browse?q=${encodeURIComponent(promptText.trim())}&mode=${searchMode}`);
    });
  };

  const handleProductQuickSelect = (productId: string, productTitle: string) => {
    saveRecentSearch(productTitle);
    setIsDropdownOpen(false);
    startTransition(() => {
      router.push(`/browse?q=${encodeURIComponent(productTitle)}&highlight=${productId}`);
    });
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
    <section className="w-full bg-gradient-to-b from-[#f9faf7] via-[#f7f9f6] to-[#f4f7f4] py-10 md:py-14 border-b border-emerald-950/5 relative overflow-visible">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-48 bg-emerald-200/20 blur-3xl pointer-events-none rounded-full" />

      <div className="container max-w-5xl mx-auto px-4 relative z-10">
        
        {/* Header Badges & Latency Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-300/60 text-[#0a5c48] font-bold text-xs tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#14b875] animate-pulse" />
              <span>AI SMART SEARCH ENGINE 2.0</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800/80 bg-white/80 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              ⚡ &lt; 10ms Hybrid Latency
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex p-1 bg-white/90 border border-gray-200/80 rounded-full shadow-xs text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSearchMode('ai')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                searchMode === 'ai' 
                  ? 'bg-[#0f7a61] text-white shadow-xs' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>AI Semantic</span>
            </button>
            <button
              type="button"
              onClick={() => setSearchMode('sku')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                searchMode === 'sku' 
                  ? 'bg-[#0f7a61] text-white shadow-xs' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>Exact SKU / Part #</span>
            </button>
          </div>
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
            className={`relative flex items-center w-full bg-white border ${
              isDropdownOpen 
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchMode === 'ai'
                  ? "e.g. Refurbished Dell rack servers under $2,000 in Texas..."
                  : "e.g. Enter Part # or Model: R740-XD, C9300, DCD996..."
              }
              className="w-full pl-3 pr-2 py-3 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-[15px] sm:text-[16px] font-medium"
            />

            {/* Clear Query Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setParsedIntent(null);
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
                onClick={toggleListening}
                className={`relative p-2 rounded-full transition-all cursor-pointer mr-1 ${
                  isListening 
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
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="hidden md:flex items-center gap-1.5 bg-emerald-50 text-[#0f7a61] hover:bg-emerald-100 px-3.5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-colors cursor-pointer border border-emerald-200/50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#14b875]" />
                <span>AI PROMPTS</span>
              </button>

              <button
                type="submit"
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
                      <Sparkles className="w-4 h-4 text-[#14b875]" />
                      <span>Instant AI Matches ({instantMatches.products.length} found)</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-[10px] font-mono text-gray-600">Enter ↵</kbd> for full results
                    </span>
                  </div>

                  {instantMatches.products.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {instantMatches.products.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleProductQuickSelect(item.id, item.title)}
                          className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200/60 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/70">
                              <Image 
                                src={item.image} 
                                alt={item.title} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform" 
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-emerald-50 px-2 py-0.2 rounded">
                                  {item.category}
                                </span>
                                <span className="text-[11px] text-gray-500 font-mono">
                                  SKU: {item.sku}
                                </span>
                              </div>
                              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#0f7a61] truncate">
                                {item.title}
                              </h4>
                            </div>
                          </div>

                          <div className="text-right shrink-0 pl-3">
                            <div className="text-sm font-extrabold text-emerald-800">
                              ${item.price.toLocaleString()}
                            </div>
                            <div className="text-[11px] text-gray-400 line-through">
                              ${item.retailPrice.toLocaleString()} (-{item.discountPercent}%)
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      <p className="text-sm font-medium">No instant matches found for &quot;{searchQuery}&quot;</p>
                      <p className="text-xs text-gray-400 mt-1">Press search to run a full hybrid semantic search with fuzzy tolerance.</p>
                    </div>
                  )}

                  {/* Matched Categories & Suggestions */}
                  {instantMatches.suggestions.length > 0 && (
                    <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
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

                    {/* Category Selector Tabs */}
                    <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
                      {AI_CATEGORIZED_PROMPTS.map((cat, idx) => {
                        const Icon = cat.icon;
                        const isActive = activePromptCategory === idx;
                        return (
                          <button
                            key={idx}
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
                          </button>
                        );
                      })}
                    </div>

                    {/* Prompts list for selected category */}
                    <div className="space-y-1.5 mt-2.5">
                      {AI_CATEGORIZED_PROMPTS[activePromptCategory].prompts.map((item, idx) => (
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
                    </div>

                    {/* Trending Surplus */}
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                        <span>Trending Surplus Lots</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {TRENDING_SURPLUS.map((tag, idx) => (
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

                  {/* Section 3: Popular Categories */}
                  <div className="pt-3">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Browse by Verified Category
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_CATEGORIES.map((cat, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPrompt(cat.name)}
                          className="flex items-center gap-1.5 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-[#0f7a61] border border-gray-200/70 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer"
                        >
                          <span>{cat.name}</span>
                          <span className="text-gray-400 text-[10px]">({cat.count})</span>
                        </button>
                      ))}
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
