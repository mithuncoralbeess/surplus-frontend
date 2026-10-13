"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Sparkles, Grid, List, ShieldCheck, MapPin, 
  PackageOpen, CheckCircle2, Search, Layers
} from 'lucide-react';
import { 
  fetchSemanticSearchResults,
  AiSearchResultItem, 
  AiSearchResponse 
} from '../../lib/aiSearchEngine';
import { useCurrency } from '../../context/CurrencyContext';
import { slugify } from '../../lib/slugs';

const BrowseResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();

  const query = searchParams.get('q') || '';
  const mode = (searchParams.get('mode') as 'ai' | 'sku') || 'ai';
  const highlightId = searchParams.get('highlight') || '';

  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'discount_desc'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [rfqSubmittedMap, setRfqSubmittedMap] = useState<Record<string, boolean>>({});

  const [searchResult, setSearchResult] = useState<AiSearchResponse>({
    query: '',
    intent: { rawQuery: '', cleanedQuery: '', confidence: 1 },
    results: [],
    totalCount: 0,
    executionMs: 0,
    mode: 'ai',
    availableCategories: [],
    priceRange: { min: 0, max: 0 }
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(query.trim()));

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResult({
        query: '',
        intent: { rawQuery: '', cleanedQuery: '', confidence: 1 },
        results: [],
        totalCount: 0,
        executionMs: 0,
        mode: 'ai',
        availableCategories: [],
        priceRange: { min: 0, max: 0 }
      });
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);

    fetchSemanticSearchResults(trimmed, { mode, sortBy })
      .then((res) => {
        if (!isCancelled) {
          setSearchResult(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Search error:', err);
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [query, mode, sortBy]);

  const handleRfqClick = (itemId: string) => {
    setRfqSubmittedMap(prev => ({ ...prev, [itemId]: true }));
    setTimeout(() => {
      setRfqSubmittedMap(prev => ({ ...prev, [itemId]: false }));
    }, 3000);
  };

  const handleCardClick = (item: AiSearchResultItem) => {
    if (item.isLot) {
      router.push(`/buy/lot/${slugify(item.title || item.sku)}`);
    } else {
      router.push(`/contact?enquiry=${encodeURIComponent(item.sku)}`);
    }
  };

  const trimmedQuery = query.trim();

  // IF NO SEARCH QUERY: DO NOT SHOW PRODUCTS OR LOTS
  if (!trimmedQuery) {
    return (
      <section className="container max-w-5xl mx-auto px-4 py-12 flex-1">
        <div className="bg-white rounded-3xl border border-gray-200/80 p-8 md:p-14 text-center shadow-xs">
          <div className="w-16 h-16 bg-emerald-50 text-[#0f7a61] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2">
            Search Surplus Inventory & Wholesale Lots
          </h3>
          <p className="text-gray-500 text-sm max-w-lg mx-auto mb-6">
            Enter a keyword, product name, brand, SKU, or wholesale lot description in the search bar above to view matching inventory.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
            <span className="text-xs font-semibold text-gray-400 mr-1">Popular searches:</span>
            {['Cisco Switches', 'Dell Servers', 'Compressor', 'Electronics Wholesale Lot', 'Power Tools', 'Cat6 Cable'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => router.push(`/browse?q=${encodeURIComponent(tag)}`)}
                className="text-xs bg-gray-100 hover:bg-emerald-50 hover:text-[#0f7a61] hover:border-emerald-200 border border-gray-200/80 px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer text-gray-700"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // IF SEARCH QUERY EXISTS: SHOW FULL-WIDTH RESULTS (NO FILTER SIDEBAR)
  return (
    <section className="container max-w-7xl mx-auto px-4 py-8 flex-1">
      {/* Top Search Summary Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 md:p-6 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#14b875]" />
                Semantic Search
              </span>
              <span className="text-[11px] font-mono text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                {isLoading ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Searching catalog...</span>
                  </>
                ) : (
                  <>
                    <span>⚡ {searchResult.executionMs}ms</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-emerald-700 font-semibold">
                      Verified Catalog & Lots
                    </span>
                  </>
                )}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              Results for <span className="text-[#0a5c48]">&quot;{trimmedQuery}&quot;</span>
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {isLoading ? (
                <span className="inline-flex items-center gap-1.5 text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                  Searching verified industrial catalogs and wholesale lots...
                </span>
              ) : (
                <>
                  Found <strong className="text-gray-900 font-semibold">{searchResult.totalCount}</strong> matching items across verified industrial catalogs and wholesale lots.
                </>
              )}
            </p>
          </div>

          {/* Sort & View Options */}
          <div className="flex items-center gap-3 self-end md:self-center shrink-0">
            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <span className="text-xs text-gray-500 mr-2 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f7a61]/30 cursor-pointer"
              >
                <option value="relevance">Featured & Relevant</option>
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
      </div>

      {/* Results Container - Full Width (No Filter Sidebar) */}
      <div className="w-full">
        {isLoading ? (
          /* SKELETON LOADING STATE WHILE FETCHING API */
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs animate-pulse">
                <div className="aspect-[16/10] bg-gray-200/70 w-full" />
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 rounded w-20" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-24" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="h-8 bg-gray-200 rounded-full" />
                    <div className="h-8 bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchResult.results.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
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
                        <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 96px, 112px" className="object-cover" />
                        {item.discountPercent >= 10 && (
                          <span className="absolute top-2 left-2 bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                            -{item.discountPercent}%
                          </span>
                        )}
                        {item.isLot && (
                          <span className="absolute bottom-2 left-2 bg-blue-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-xs uppercase">
                            Lot
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
                          {item.isLot && (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              Wholesale Lot
                            </span>
                          )}
                        </div>

                        <h3 
                          onClick={() => handleCardClick(item)}
                          className="font-bold text-gray-900 text-base mb-1 hover:text-[#0f7a61] cursor-pointer"
                        >
                          {item.title}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          {item.isLot && (
                            <>
                              <span>Lot #: <strong className="font-mono text-gray-700">{item.sku}</strong></span>
                              <span>•</span>
                            </>
                          )}
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {item.location}
                          </span>
                          <span>•</span>
                          <span>{item.isLot ? `Total Units: ${item.estQty.toLocaleString()}` : `MOQ: ${item.moq} unit(s)`}</span>
                        </div>

                        <div className="text-[11px] text-gray-500 line-clamp-1">
                          {item.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                      <div className="text-left sm:text-right">
                        <div className="text-xl font-extrabold text-primary">
                          {formatPrice(item.price)}
                        </div>
                        {item.retailPrice > item.price && (
                          <div className="text-xs text-gray-400 line-through">
                            MSRP {formatPrice(item.retailPrice)}
                          </div>
                        )}
                        {item.retailPrice > item.price && (
                          <div className="text-[11px] font-semibold text-emerald-700">
                            Save {formatPrice(item.retailPrice - item.price)}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => handleCardClick(item)}
                          className="px-4 py-2 rounded-full font-semibold text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all cursor-pointer"
                        >
                          Details
                        </button>
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
                  <div 
                    onClick={() => handleCardClick(item)}
                    className="relative aspect-[16/10] w-full bg-gray-50 overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Discount Badge */}
                    {item.discountPercent >= 10 && (
                      <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                        -{item.discountPercent}% OFF
                      </div>
                    )}

                    {/* Lot Tag (Top Left) */}
                    {item.isLot && (
                      <div className="absolute top-2.5 left-2.5 bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>Wholesale Lot</span>
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
                    <h3 
                      onClick={() => handleCardClick(item)}
                      className="font-bold text-gray-900 text-sm sm:text-[15px] leading-snug mb-2 line-clamp-2 group-hover:text-[#0f7a61] transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h3>

                    {/* Specs snippet */}
                    <div className="text-[11px] text-gray-500 mb-3">
                      {item.isLot ? (
                        <div className="font-mono">
                          Lot #: <span className="text-gray-800 font-medium">{item.sku}</span> • {item.location}
                        </div>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500 font-sans">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{item.location}</span>
                        </span>
                      )}
                    </div>

                    {/* Price Section */}
                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <div className="flex items-baseline justify-between mb-1">
                        <div className="text-xl font-extrabold text-primary">
                          {formatPrice(item.price)}
                        </div>
                        {item.retailPrice > item.price && (
                          <div className="text-xs text-gray-400 line-through">
                            MSRP {formatPrice(item.retailPrice)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 mb-4">
                        <span>{item.isLot ? 'Min Order: 1 Lot' : `MOQ: ${item.moq} unit`}</span>
                        <span>{item.isLot ? `Total Units: ${item.estQty.toLocaleString()}` : `Est. Qty: ${item.estQty.toLocaleString()}`}</span>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleCardClick(item)}
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
          /* EMPTY SEARCH RESULTS STATE */
          <div className="bg-white rounded-3xl border border-gray-200/90 p-8 md:p-12 text-center shadow-xs max-w-xl mx-auto my-6">
            <div className="w-16 h-16 bg-emerald-50 text-[#0f7a61] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No products or lots found for &quot;{trimmedQuery}&quot;
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              We couldn&apos;t find any verified inventory matching your search. Try using broader keywords or checking spelling.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/contact')}
                className="px-5 py-2.5 bg-[#0f7a61] hover:bg-[#0c6651] text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                Request Custom Sourcing
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseResults;
