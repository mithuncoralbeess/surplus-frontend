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
import { slugify } from '../../lib/slugs';
import WhatsAppAlertBanner from '../../components/WhatsAppAlertBanner';
import ProductCard from '../../components/ProductCard';
import LotCard from '../../components/LotCard';
import BrowseSourcingDesk from '../BrowseSourcingDesk';
import { useAppSelector } from '../../store';

const BrowseResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories: reduxCategories } = useAppSelector((state) => state.categories);

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
  const isSearching = isLoading || (Boolean(trimmedQuery) && searchResult.query !== trimmedQuery);

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
            <span className="text-xs font-semibold text-gray-400 mr-1">Popular categories:</span>
            {(reduxCategories && reduxCategories.length > 0 ? reduxCategories.slice(0, 8).map(c => c.name) : []).map((tag) => (
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

        {/* WhatsApp Real-Time Drops Banner (Bottom CTA) */}
        <div className="mt-10">
          <WhatsAppAlertBanner />
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
                {isSearching ? (
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
              {isSearching ? (
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
        {isSearching ? (
          /* SKELETON LOADING STATE WHILE FETCHING API */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <ProductCard
                key={`skel-${idx}`}
                image=""
                category=""
                title=""
                moq={0}
                estQty={0}
                price={0}
                isLoading={true}
              />
            ))}
          </div>
        ) : searchResult.results.length > 0 ? (
          <div className={viewMode === 'list' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}>
            {searchResult.results.map((item) => {
              const isLot = Boolean(item.isLot || item.condition === 'Liquidation Lot' || item.subCategory === 'Wholesale Lots');

              if (isLot) {
                return (
                  <div key={item.id} className="h-full">
                    <LotCard
                      id={item.id}
                      image={item.image}
                      title={item.title}
                      condition={item.condition}
                      units={item.totalUnits || item.estQty || 1}
                      pallets={Math.max(1, Math.round((item.totalUnits || item.estQty || 1) / 50))}
                      price={item.price}
                      msrp={item.retailPrice}
                      originalPrice={item.retailPrice}
                      offer={item.discountPercent >= 10 ? `${item.discountPercent}% OFF` : undefined}
                      location={item.location}
                      category={item.category}
                      currency="USD"
                      isLoading={false}
                    />
                  </div>
                );
              }

              return (
                <div key={item.id} className="h-full">
                  <ProductCard
                    id={item.id}
                    sku={item.sku}
                    image={item.image}
                    category={item.category}
                    title={item.title}
                    moq={item.moq || 1}
                    estQty={item.estQty || item.totalUnits || 1}
                    price={item.price}
                    originalPrice={item.retailPrice}
                    offer={item.discountPercent >= 10 ? `${item.discountPercent}% OFF` : undefined}
                    location={item.location}
                    currency="USD"
                    isCertified={item.isCertified}
                    isNew={Boolean(item.condition?.toLowerCase().includes('new'))}
                    isLoading={false}
                    onAddRfq={() => handleRfqClick(item.id)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* EMPTY SEARCH RESULTS STATE: B2B FAST SOURCING DESK WIDGET */
          <div className="my-6">
            <BrowseSourcingDesk
              searchQuery={trimmedQuery}
              onCategorySelect={(category) => router.push(`/browse?q=${encodeURIComponent(category)}`)}
            />
          </div>
        )}

        {/* WhatsApp Liquidation Alert Banner (Bottom of the results) */}
        <div className="mt-12 sm:mt-16">
          <WhatsAppAlertBanner />
        </div>
      </div>
    </section>
  );
};

export default BrowseResults;
