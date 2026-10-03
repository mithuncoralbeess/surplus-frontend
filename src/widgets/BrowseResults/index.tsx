"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Sparkles, Filter, SlidersHorizontal, Grid, List, 
  ArrowUpDown, Check, X, ShieldCheck, MapPin, RotateCcw, 
  PackageOpen, TrendingDown, Tag, ChevronDown, CheckCircle2, ArrowRight
} from 'lucide-react';
import { 
  performAiSearch, 
  fetchSemanticSearchResults,
  AiSearchResultItem, 
  AiSearchResponse 
} from '../../lib/aiSearchEngine';
import { useCurrency } from '../../context/CurrencyContext';

const CONDITIONS = [
  'All',
  'Brand New Surplus',
  'Refurbished',
  'Liquidation Lot',
  'Unused Overstock'
];

const BrowseResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();

  const query = searchParams.get('q') || '';
  const mode = (searchParams.get('mode') as 'ai' | 'sku') || 'ai';
  const highlightId = searchParams.get('highlight') || '';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [isCertifiedOnly, setIsCertifiedOnly] = useState<boolean>(false);
  const [priceMax, setPriceMax] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'discount_desc'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [rfqSubmittedMap, setRfqSubmittedMap] = useState<Record<string, boolean>>({});

  // Perform AI Hybrid Search with Live Neon DB pgvector vector similarity
  const [searchResult, setSearchResult] = useState<AiSearchResponse>(() => 
    performAiSearch(query, {
      mode,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      condition: selectedCondition !== 'All' ? selectedCondition : undefined,
      isCertifiedOnly,
      maxPrice: priceMax < 10000 ? priceMax : undefined,
      sortBy
    })
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const filterOptions = {
      mode,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      condition: selectedCondition !== 'All' ? selectedCondition : undefined,
      isCertifiedOnly,
      maxPrice: priceMax < 10000 ? priceMax : undefined,
      sortBy
    };

    fetchSemanticSearchResults(query, filterOptions)
      .then((res) => {
        if (!isCancelled) {
          setSearchResult(res);
          const hasDbItems = res.results.some(r => r.sku && r.sku.startsWith('PRO-'));
          setIsLiveBackend(hasDbItems);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Semantic search error:', err);
        if (!isCancelled) {
          setSearchResult(performAiSearch(query, filterOptions));
          setIsLiveBackend(false);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [query, mode, selectedCategory, selectedCondition, isCertifiedOnly, priceMax, sortBy]);

  // Sync category if parsed from intent on fresh query
  useEffect(() => {
    if (searchResult.intent.category && selectedCategory === 'All') {
      setSelectedCategory(searchResult.intent.category);
    }
    if (searchResult.intent.condition && selectedCondition === 'All') {
      setSelectedCondition(searchResult.intent.condition);
    }
  }, [searchResult.intent]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedCondition('All');
    setIsCertifiedOnly(false);
    setPriceMax(10000);
    setSortBy('relevance');
  };

  const handleRfqClick = (itemId: string) => {
    setRfqSubmittedMap(prev => ({ ...prev, [itemId]: true }));
    setTimeout(() => {
      setRfqSubmittedMap(prev => ({ ...prev, [itemId]: false }));
    }, 3000);
  };

  return (
    <section className="container max-w-7xl mx-auto px-4 py-8 flex-1">
      {/* Top AI Search Summary & Latency Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#14b875]" />
                Semantic pgvector Engine
              </span>
              <span className="text-[11px] font-mono text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                {isLoading ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Searching Neon DB pgvector...</span>
                  </>
                ) : (
                  <>
                    <span>⚡ {searchResult.executionMs}ms</span>
                    <span className="text-gray-300">•</span>
                    <span className={isLiveBackend ? "text-emerald-700 font-semibold" : "text-gray-500"}>
                      {isLiveBackend ? "Neon DB pgvector" : "Vector Cache"}
                    </span>
                  </>
                )}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              {query ? (
                <>
                  Results for <span className="text-[#0a5c48]">&quot;{query}&quot;</span>
                </>
              ) : (
                'All Verified Surplus Inventory Lots'
              )}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Found <strong className="text-gray-900 font-semibold">{searchResult.totalCount}</strong> matching items across verified industrial catalogs.
            </p>
          </div>

          {/* Sort & View Options */}
          <div className="flex items-center gap-3 self-end md:self-center shrink-0">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <span className="text-xs text-gray-500 mr-2 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f7a61]/30 cursor-pointer"
              >
                <option value="relevance">✨ AI Match Relevance</option>
                <option value="discount_desc">🔥 Highest Discount %</option>
                <option value="price_asc">💵 Price: Low to High</option>
                <option value="price_desc">💎 Price: High to Low</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200/60">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active AI Extracted Intent Badges */}
        {(searchResult.intent.brand || searchResult.intent.category || searchResult.intent.condition || searchResult.intent.maxPrice) && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">
              Active Criteria:
            </span>

            {searchResult.intent.brand && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#0a5c48] border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-medium">
                <span>Brand: <strong>{searchResult.intent.brand}</strong></span>
              </span>
            )}

            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-medium">
                <span>Category: <strong>{selectedCategory}</strong></span>
                <button type="button" onClick={() => setSelectedCategory('All')} className="hover:text-red-600 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            )}

            {selectedCondition !== 'All' && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-medium">
                <span>Condition: <strong>{selectedCondition}</strong></span>
                <button type="button" onClick={() => setSelectedCondition('All')} className="hover:text-red-600 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            )}

            {isCertifiedOnly && (
              <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-full text-xs font-medium">
                <ShieldCheck className="w-3 h-3 text-[#0f7a61]" />
                <span>SM Certified Only</span>
                <button type="button" onClick={() => setIsCertifiedOnly(false)} className="hover:text-red-600 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            )}

            {priceMax < 10000 && (
              <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-full text-xs font-medium">
                <span>Max Budget: <strong>${priceMax.toLocaleString()}</strong></span>
                <button type="button" onClick={() => setPriceMax(10000)} className="hover:text-red-600 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-gray-500 hover:text-red-600 underline font-medium ml-2 cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout: Sidebar Filters + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filter Column */}
        <aside className={`lg:block ${isMobileFilterOpen ? 'block fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'}`}>
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-[#0f7a61]" />
                <span>Refine Search</span>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-gray-400 hover:text-[#0f7a61] flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              {isMobileFilterOpen && (
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-900 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Categories
              </h4>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === 'All'
                      ? 'bg-emerald-50 text-[#0f7a61] font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {searchResult.availableCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory === cat.name
                        ? 'bg-emerald-50 text-[#0f7a61] font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-gray-400 text-[10px] font-mono">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Condition
              </h4>
              <div className="space-y-1.5">
                {CONDITIONS.map((cond, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedCondition(cond)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCondition === cond
                        ? 'bg-emerald-50 text-[#0f7a61] font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cond}</span>
                    {selectedCondition === cond && <Check className="w-3.5 h-3.5 text-[#0f7a61]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Budget Slider */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Max Budget
                </h4>
                <span className="text-xs font-bold text-gray-900">
                  {priceMax >= 10000 ? 'Any Budget' : `$${priceMax.toLocaleString()}`}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="10000"
                step="200"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#0f7a61] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>$200</span>
                <span>$5,000</span>
                <span>$10,000+</span>
              </div>
            </div>

            {/* Certified Seller Only Toggle */}
            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0f7a61]" />
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">
                    SM Certified Only
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isCertifiedOnly}
                  onChange={(e) => setIsCertifiedOnly(e.target.checked)}
                  className="rounded text-[#0f7a61] focus:ring-[#0f7a61] h-4 w-4 cursor-pointer accent-[#0f7a61]"
                />
              </label>
            </div>

            {isMobileFilterOpen && (
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#0f7a61] text-white rounded-xl font-bold text-sm"
              >
                Apply Filters
              </button>
            )}
          </div>
        </aside>

        {/* Results List / Grid Container */}
        <div className="lg:col-span-3">
          {searchResult.results.length > 0 ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {searchResult.results.map((item) => {
                const isHighlighted = item.id === highlightId;
                const isRfqSent = rfqSubmittedMap[item.id];

                if (viewMode === 'list') {
                  // LIST VIEW
                  return (
                    <div 
                      key={item.id}
                      className={`bg-white rounded-2xl border transition-all p-4 md:p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between ${
                        isHighlighted 
                          ? 'border-[#0f7a61] ring-2 ring-[#0f7a61]/20 shadow-md' 
                          : 'border-gray-200/80 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-200/70 shrink-0">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                          {item.discountPercent >= 50 && (
                            <span className="absolute top-2 left-2 bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                              -{item.discountPercent}%
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold text-[#0a5c48] bg-emerald-50 px-2 py-0.5 rounded uppercase">
                              {item.category}
                            </span>
                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {item.condition}
                            </span>
                            {/* AI Match Badge */}
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                              <Sparkles className="w-2.5 h-2.5 text-[#14b875]" />
                              {item.aiMatchScore}% Match
                            </span>
                          </div>

                          <h3 className="font-bold text-gray-900 text-base mb-1 hover:text-[#0f7a61] cursor-pointer">
                            {item.title}
                          </h3>

                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                            <span>SKU: <strong className="font-mono text-gray-700">{item.sku}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              {item.location}
                            </span>
                            <span>•</span>
                            <span>MOQ: {item.moq} unit(s)</span>
                          </div>

                          <div className="text-[11px] text-gray-500 line-clamp-1">
                            {item.description}
                          </div>

                          {/* Live AI Match Reasons */}
                          {Array.isArray(item.matchReasons) && item.matchReasons.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.matchReasons.slice(0, 3).map((reason: string, rIdx: number) => (
                                <span key={rIdx} className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded px-1.5 py-0.5">
                                  ✓ {reason}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                        <div className="text-left sm:text-right">
                          <div className="text-xl font-extrabold text-primary">
                            {formatPrice(item.price)}
                          </div>
                          <div className="text-xs text-gray-400 line-through">
                            MSRP {formatPrice(item.retailPrice)}
                          </div>
                          <div className="text-[11px] font-semibold text-emerald-700">
                            Save ${(item.retailPrice - item.price).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => handleRfqClick(item.id)}
                            className={`px-4 py-2 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                              isRfqSent 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-[#0f7a61] hover:bg-[#0c6651] text-white'
                            }`}
                          >
                            {isRfqSent ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>RFQ Added!</span>
                              </>
                            ) : (
                              <span>+ Add to RFQ</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                // GRID VIEW CARD
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border overflow-hidden flex flex-col group transition-all duration-300 ${
                      isHighlighted
                        ? 'border-[#0f7a61] ring-2 ring-[#0f7a61]/20 shadow-lg'
                        : 'border-gray-200/80 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {/* Image Container with Badges */}
                    <div className="relative aspect-[16/10] w-full bg-gray-50 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* AI Match Badge (Top Right) */}
                      <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-emerald-200/80 flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3 text-[#14b875]" />
                        <span className="text-[10px] font-extrabold text-[#0a5c48]">
                          {item.aiMatchScore}% Match
                        </span>
                      </div>

                      {/* Discount Badge (Top Left) */}
                      {item.discountPercent >= 50 && (
                        <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                          -{item.discountPercent}% OFF
                        </div>
                      )}

                      {/* Certified Seller Badge */}
                      {item.isCertified && (
                        <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full border border-gray-100 flex items-center gap-1 shadow-xs">
                          <ShieldCheck className="w-3 h-3 text-[#0f7a61]" />
                          <span className="text-[9px] font-bold text-gray-700 tracking-wide uppercase">SM Certified</span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      {/* Category & Condition tags */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0a5c48] truncate">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {item.condition}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-gray-900 text-sm sm:text-[15px] leading-snug mb-2 line-clamp-2 group-hover:text-[#0f7a61] transition-colors">
                        {item.title}
                      </h3>

                      {/* Specs snippet */}
                      <div className="text-[11px] text-gray-500 font-mono mb-2">
                        SKU: <span className="text-gray-800 font-medium">{item.sku}</span> • {item.location}
                      </div>

                      {/* Live AI Match Reasons */}
                      {Array.isArray(item.matchReasons) && item.matchReasons.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {item.matchReasons.slice(0, 2).map((reason: string, rIdx: number) => (
                            <span key={rIdx} className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded px-1.5 py-0.5 truncate max-w-full">
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Price Section */}
                      <div className="mt-auto pt-3 border-t border-gray-100">
                        <div className="flex items-baseline justify-between mb-1">
                          <div className="text-xl font-extrabold text-primary">
                            {formatPrice(item.price)}
                          </div>
                          <div className="text-xs text-gray-400 line-through">
                            MSRP {formatPrice(item.retailPrice)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-4">
                          <span>MOQ: {item.moq} unit</span>
                          <span>Est. Qty: {item.estQty.toLocaleString()}</span>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => router.push(`/contact?inquiry=${encodeURIComponent(item.sku)}`)}
                            className="w-full py-2 px-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Details
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRfqClick(item.id)}
                            className={`w-full py-2 px-1 text-center rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              isRfqSent 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-[#0f7a61] hover:bg-[#0c6651] text-white shadow-xs'
                            }`}
                          >
                            {isRfqSent ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Added</span>
                              </>
                            ) : (
                              <span>+ Add RFQ</span>
                            )}
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* EMPTY RESULTS STATE WITH AI ASSISTANCE */
            <div className="bg-white rounded-3xl border border-gray-200/90 p-8 md:p-12 text-center shadow-xs">
              <div className="w-16 h-16 bg-emerald-50 text-[#0f7a61] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PackageOpen className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No surplus lots found matching your exact filters
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                Our AI smart search couldn&apos;t find an item with all selected constraints. Try relaxing price or condition filters.
              </p>

              {searchResult.didYouMean && (
                <div className="mb-6 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl max-w-md mx-auto">
                  <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-wider block mb-1">
                    AI Suggested Search:
                  </span>
                  <button
                    type="button"
                    onClick={() => router.push(`/browse?q=${encodeURIComponent(searchResult.didYouMean!)}`)}
                    className="text-sm font-semibold text-[#0f7a61] hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <span>&quot;{searchResult.didYouMean}&quot;</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset Active Filters
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/contact')}
                  className="px-5 py-2.5 bg-[#0f7a61] hover:bg-[#0c6651] text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  Request Custom Inventory Sourcing
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default BrowseResults;
