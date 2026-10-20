"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  ShieldCheck,
  Play,
  ArrowRight,
  BarChart2,
  Sparkles,
  Zap,
  Clock,
  TrendingUp,
  Mic,
  MicOff,
  X,
  Boxes,
  Layers,
  Award
} from 'lucide-react';
import { getInstantSuggestions } from '../../lib/aiSearchEngine';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { useLanguage } from '../../context/LanguageContext';

// Natural language conversational search prompts
const AI_PROMPTS = [
  { text: "Show me 2U rackmount servers under $500 available in Maharashtra", tag: "ICT & Servers" },
  { text: "Industrial pumps with warranty under $1000", tag: "Heavy Equipment" },
  { text: "Refurbished Dell PowerEdge servers with warranty", tag: "Enterprise IT" },
  { text: "Overstock Power Tools & Industrial Machinery lots", tag: "Power Tools" },
  { text: "Wholesale Consumer Electronics & TWS Earbuds liquidation", tag: "Electronics" },
  { text: "Siemens S7-1200 PLC automation bundles factory sealed", tag: "Industrial Automation" }
];

const DEFAULT_RECENT = [
  "Dell PowerEdge R740",
  "Siemens S7-1200",
  "Neox PVC Electrical Tape",
  "Bulk Cat6 Copper Cable"
];

const TRENDING_SURPLUS = [
  "Dell Rack Servers",
  "Cat6 Drums",
  "Siemens S7 PLCs",
  "Electrical Surplus",
  "MRO Liquidation Lots",
  "PPE Bulk Pallets",
  "Industrial Pumps"
];

const POPULAR_CATEGORIES = [
  { name: "ICT Hardware & Servers", count: "1,240+ lots", path: "/browse?category=ICT" },
  { name: "Electricals & Cabling", count: "860+ lots", path: "/browse?category=Electricals" },
  { name: "Industrial Automation", count: "420+ lots", path: "/browse?category=Electricals" },
  { name: "Power Tools & Machinery", count: "510+ lots", path: "/browse?category=Power%20tools" },
  { name: "Auto Spare Parts", count: "3,180+ lots", path: "/browse?category=Auto%20Spare%20Parts%20%26%20Accessories" },
  { name: "Safety & PPE Pallets", count: "290+ lots", path: "/browse?category=PPE" }
];

// Track if hero banner landing animation has played in this browser JS context
let hasHeroLandedInPageLoad = false;

const HomeBanner = () => {
  const router = useRouter();
  const { t, tCategory, locale } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(DEFAULT_RECENT);
  const [isHeroLanding] = useState(() => !hasHeroLandedInPageLoad);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  // Autosuggest matches based on typing
  const [instantMatches, setInstantMatches] = useState<{
    products: any[];
    categories: string[];
    suggestions: string[];
  }>({ products: [], categories: [], suggestions: [] });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Voice Search Hook
  const { isListening, isSupported, toggleListening } = useVoiceSearch({
    onTranscript: (transcript) => {
      setSearchQuery(transcript);
      router.push(`/browse?q=${encodeURIComponent(transcript.trim())}`);
    }
  });

  useEffect(() => {
    hasHeroLandedInPageLoad = true;
  }, []);

  // Update instant search suggestions as query changes
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = getInstantSuggestions(searchQuery.trim(), 4);
      setInstantMatches(results);
    } else {
      setInstantMatches({ products: [], categories: [], suggestions: [] });
    }
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTourModalOpen) {
        setIsTourModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourModalOpen]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      if (!recentSearches.includes(query)) {
        setRecentSearches((prev) => [query, ...prev.slice(0, 5)]);
      }
      setIsDropdownOpen(false);
      router.push(`/browse?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/browse');
    }
  };

  const handleAiSmartSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/browse?q=${encodeURIComponent(query)}&openDropdown=true`);
    } else {
      router.push('/browse?openDropdown=true');
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    setSearchQuery(promptText);
    if (!recentSearches.includes(promptText)) {
      setRecentSearches((prev) => [promptText, ...prev.slice(0, 5)]);
    }
    setIsDropdownOpen(false);
    router.push(`/browse?q=${encodeURIComponent(promptText.trim())}`);
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
  };

  return (
    <section className="w-full relative overflow-hidden py-12 lg:py-16 min-[1350px]:py-20 min-[1350px]:min-h-[calc(100vh-81px)] flex items-center bg-gradient-to-b from-emerald-50/40 via-white to-gray-50/50">
      {/* Ambient background glow elements */}
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      {/* Subtle modern dot-grid background overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#0a5c48 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px'
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-6 items-center justify-between">

          {/* ========================================================================= */}
          {/* LEFT COLUMN: Hero Content & Intelligent Interactive Search                */}
          {/* ========================================================================= */}
          <div
            className={`w-full lg:w-[56%] flex flex-col items-start space-y-6 ${
              isHeroLanding ? 'animate-hero-landing' : ''
            }`}
          >

            {/* Elevated Pill Trust Badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/90 border border-emerald-600/20 shadow-xs px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all hover:border-emerald-600/40 hover:shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="text-xs font-semibold text-gray-800 tracking-wide uppercase">
                {t('hero.badge', 'B2B Liquidation Marketplace')}
              </span>
              <span className="hidden sm:inline-block w-px h-3.5 bg-gray-200" />
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {t('hero.escrow', '100% Escrow Protected')}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.9rem] xl:text-[3.4rem] font-extrabold text-gray-900 tracking-tight leading-[1.12]">
              {t('hero.titlePrefix', 'Buy, Liquidate & Source')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a5c48] via-[#0f7a61] to-[#14b875]">
                {t('hero.titleHighlight', 'Surplus Inventory')}
              </span>{' '}
              {t('hero.titleSuffix', 'At Scale.')}
            </h1>

            {/* High-conversion Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl font-normal">
              {t('hero.subtitle', 'Direct access to verified global overstock, factory excess, enterprise IT, and MRO equipment. Unlock up to 75% savings with certified lot inspection, guaranteed escrow settlement, and 48-hour dispatch.')}
            </p>

            {/* ========================================================================= */}
            {/* Interactive Search Bar & Attached Intelligent Search Dropdown             */}
            {/* ========================================================================= */}
            <div className="relative w-full max-w-2xl pt-2" ref={dropdownRef}>
              <form
                onSubmit={handleSearchSubmit}
                className={`w-full bg-white border ${
                  isDropdownOpen
                    ? 'border-primary shadow-xl ring-4 ring-primary/10'
                    : 'border-gray-200 shadow-md shadow-gray-200/50 hover:border-gray-300'
                } p-2 rounded-2xl sm:rounded-full flex items-center gap-2 transition-all duration-200`}
              >
                {/* Search Icon with subtle mint background */}
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-primary flex items-center justify-center shrink-0 ml-1 rtl:ml-0 rtl:mr-1">
                  <Search className="w-4 h-4 text-primary" />
                </div>

                {/* Input with natural language hint */}
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!isDropdownOpen) setIsDropdownOpen(true);
                  }}
                  placeholder={t('hero.searchPlaceholder', "Ask anything (e.g. '2U servers under $500', 'Siemens S7 PLCs', 'Cat6 cable drums')...")}
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-sm sm:text-base font-normal cursor-text min-w-0"
                  aria-label="Search surplus lots and excess inventory"
                />

                {/* Clear button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setInstantMatches({ products: [], categories: [], suggestions: [] });
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    title="Clear search text"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Voice search button */}
                {isSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-2 rounded-full transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-300'
                        : 'text-gray-400 hover:text-primary hover:bg-emerald-50'
                    }`}
                    title={isListening ? "Listening... click to stop" : "Search with Voice"}
                    aria-label="Voice Search"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}

                {/* AI Smart Search Action Pill */}
                <button
                  type="button"
                  onClick={handleAiSmartSearch}
                  className="hidden md:flex items-center gap-1.5 text-primary font-bold text-xs bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 transition-colors px-3 py-2 rounded-full cursor-pointer shrink-0"
                  title="Open Natural Language Smart Search"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>AI SEARCH</span>
                </button>

                {/* Submit Search Button */}
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden sm:inline-block" />
                </button>
              </form>

              {/* ----------------------------------------------------------------------- */}
              {/* Intelligent Search Dropdown Layer                                       */}
              {/* ----------------------------------------------------------------------- */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[460px] overflow-y-auto">
                  
                  {/* Case 1: User is actively typing and matches exist */}
                  {searchQuery.trim().length > 1 ? (
                    <div className="p-4 space-y-4">
                      {/* Products preview */}
                      {instantMatches.products.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                              <Boxes className="w-3.5 h-3.5 text-primary" />
                              Matching Inventory Lots ({instantMatches.products.length})
                            </span>
                            <span className="text-[11px] text-gray-400">Instant SKU &amp; Title Match</span>
                          </div>
                          <div className="space-y-1.5">
                            {instantMatches.products.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelectPrompt(item.title)}
                                className="w-full text-left p-2.5 hover:bg-emerald-50/70 rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-gray-500 group-hover:bg-white group-hover:text-primary transition-colors">
                                    <Boxes className="w-4 h-4" />
                                  </div>
                                  <div className="truncate">
                                    <p className="text-sm font-medium text-gray-900 group-hover:text-primary truncate">
                                      {item.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      SKU: <span className="font-mono text-gray-700">{item.sku}</span> • {item.category}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right shrink-0 pl-3">
                                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                                    ${item.price.toLocaleString()}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matching Categories */}
                      {instantMatches.categories.length > 0 && (
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-primary" />
                            Related Verticals
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {instantMatches.categories.map((cat, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setIsDropdownOpen(false);
                                  router.push(`/browse?category=${encodeURIComponent(cat)}`);
                                }}
                                className="text-xs font-medium text-gray-700 bg-gray-100 hover:bg-emerald-100 hover:text-primary px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Search trigger footer */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit()}
                          className="w-full text-center py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>View all results for &quot;{searchQuery}&quot;</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Case 2: Dropdown is opened with empty search query (Prompts, Trending & Recents) */
                    <div className="p-4 sm:p-5 space-y-5">
                      {/* AI Natural Language Prompts Section */}
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            AI Natural Language Queries
                          </span>
                          <span className="text-[11px] text-gray-600">Click to instant-run</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {AI_PROMPTS.map((prompt, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSelectPrompt(prompt.text)}
                              className="text-left p-2.5 bg-gray-50/80 hover:bg-emerald-50/80 border border-gray-100 hover:border-emerald-200/80 rounded-xl transition-all group flex flex-col justify-between cursor-pointer"
                            >
                              <span className="text-xs font-medium text-gray-800 group-hover:text-primary leading-snug">
                                &quot;{prompt.text}&quot;
                              </span>
                              <span className="inline-block mt-1.5 text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                                {prompt.tag}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Trending Surplus Searches */}
                      <div>
                        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          Trending Searches This Week
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {TRENDING_SURPLUS.map((term, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSelectPrompt(term)}
                              className="text-xs font-medium text-gray-700 hover:text-primary bg-gray-100 hover:bg-emerald-50 px-3 py-1.5 rounded-full border border-transparent hover:border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>{term}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              Recent Inquiries
                            </span>
                            <button
                              type="button"
                              onClick={clearRecentSearches}
                              className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                              Clear
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {recentSearches.map((term, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleSelectPrompt(term)}
                                className="text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-full border border-gray-200/70 transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <span>{term}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Popular Liquidation Categories */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-primary" />
                          High-Volume Verticals
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {POPULAR_CATEGORIES.map((cat, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setIsDropdownOpen(false);
                                router.push(cat.path);
                              }}
                              className="text-left p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex flex-col"
                            >
                              <span className="text-xs font-semibold text-gray-800 truncate hover:text-primary">
                                {cat.name}
                              </span>
                              <span className="text-[10px] text-gray-600">{cat.count}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => router.push('/browse')}
                className="btn btn-primary"
              >
                {t('hero.ctaBuy', 'Browse Inventory')}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>

              <button
                onClick={() => router.push('/sell')}
                className="btn btn-secondary"
              >
                {t('hero.ctaSell', 'Sell Inventory')}
              </button>
            </div>

            {/* Micro Trust & Assurance Strip */}
            <div className="pt-3 border-t border-gray-200/80 w-full grid grid-cols-2 sm:grid-cols-4 gap-3 text-gray-600 text-xs">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Escrow Protection</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>48-Hour Dispatch SLA</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>40%–75% Off MSRP</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Inspection</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Dark Dashboard Card (Original Design Maintained)            */}
          {/* ========================================================================= */}
          <div
            className={`relative w-full lg:w-[41%] aspect-square max-w-[600px] min-[1350px]:max-w-[520px] min-[1600px]:max-w-[600px] mx-auto lg:ml-auto lg:mr-0 ${
              isHeroLanding ? 'animate-hero-landing' : ''
            }`}
          >

            {/* Dark Card Container */}
            <div className="absolute inset-0 bg-dashboard-bg rounded-[2rem] shadow-2xl p-6 md:p-8 min-[1350px]:p-5 min-[1600px]:p-8 flex flex-col justify-between overflow-hidden">

              {/* Background grid overlay pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}
              />

              <div className="relative z-10 flex flex-col h-full space-y-6 min-[1350px]:space-y-3 min-[1600px]:space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-dashboard-card flex items-center justify-center">
                      <BarChart2 className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-[16px] text-white font-medium leading-tight mb-1">
                        Live Market Intelligence
                      </h3>
                      <p className="text-dashboard-text text-[12px] xxl:text-xs font-bold tracking-wider uppercase">
                        Operating Dashboard
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-dashboard-card px-3 py-1.5 rounded-full border border-dashboard-border">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-accent text-[10px] xxl:text-xs font-bold tracking-wider">
                      LIVE
                    </span>
                  </div>
                </div>

                {/* Tour Button */}
                <button
                  type="button"
                  onClick={() => setIsTourModalOpen(true)}
                  className="w-full bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent py-3 rounded-full font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" /> PLATFORM TOUR
                </button>

                {/* How it works section */}
                <div className="flex-1 flex flex-col pt-2">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[14px] xxl:text-base text-white font-medium tracking-widest uppercase">
                      How Surplus Market Works
                    </h4>
                    <span className="text-accent text-[12px] xxl:text-xs font-medium tracking-wider uppercase">
                      2 Min Tour
                    </span>
                  </div>

                  {/* Video Thumbnail */}
                  <div
                    onClick={() => setIsTourModalOpen(true)}
                    className="flex-1 rounded-3xl overflow-hidden relative group cursor-pointer bg-gray-900 border border-dashboard-border"
                  >
                    <Image
                      src="/hero-warehouse.jpg"
                      alt="Warehouse Surplus Tour"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px"
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                    {/* Play Button Center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(20,184,117,0.3)] group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 text-primary ml-1 fill-current" />
                      </div>
                    </div>

                    {/* Watch label */}
                    <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full text-xs font-bold text-gray-900 shadow-lg">
                      Watch - 2 min
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* Platform Tour & Liquidation Workflow Interactive Modal                     */}
      {/* ========================================================================= */}
      {isTourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="bg-[#141e1a] border border-[#2a3f35] rounded-3xl max-w-2xl w-full text-white p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-modal-title"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsTourModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 id="tour-modal-title" className="text-xl font-bold text-white">
                  How Surplus Market Works
                </h3>
                <p className="text-xs text-gray-400">
                  Enterprise-grade surplus sourcing and inventory liquidation in 4 simple steps.
                </p>
              </div>
            </div>

            {/* 4-Step Liquidation Workflow */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-[#1b2b24] border border-[#2a3e34]">
                <div className="w-8 h-8 rounded-xl bg-accent text-gray-950 font-extrabold text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Manifest Ingestion &amp; AI Matching</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                    Enterprises upload excess inventories via Excel or API. Our AI engine parses SKUs, specifications, and values in sub-seconds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-[#1b2b24] border border-[#2a3e34]">
                <div className="w-8 h-8 rounded-xl bg-accent text-gray-950 font-extrabold text-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Physical Warehouse Inspection</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                    Certified technicians inspect condition, serial numbers, and packaging to verify 100% manifest accuracy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-[#1b2b24] border border-[#2a3e34]">
                <div className="w-8 h-8 rounded-xl bg-accent text-gray-950 font-extrabold text-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Escrow-Secured Transactions</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                    Buyer funds are held securely in third-party escrow until shipment arrival and inspection approval.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-[#1b2b24] border border-[#2a3e34]">
                <div className="w-8 h-8 rounded-xl bg-accent text-gray-950 font-extrabold text-sm flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Insured 48-Hour Logistics &amp; Settlement</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                    Automated freight dispatch with real-time tracking, customs clearance, and instant seller settlement upon delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#2a3e35]">
              <button
                type="button"
                onClick={() => {
                  setIsTourModalOpen(false);
                  router.push('/browse');
                }}
                className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-gray-950 font-bold text-xs px-5 py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Browse Available Lots</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsTourModalOpen(false);
                  router.push('/sell');
                }}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-colors cursor-pointer"
              >
                Become a Verified Seller
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeBanner;
