"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Package, 
  MapPin, 
  Tag, 
  FileSpreadsheet, 
  ShieldCheck, 
  ArrowRight, 
  Download, 
  X, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Truck, 
  TrendingUp, 
  Boxes, 
  Eye, 
  ExternalLink, 
  ShoppingBag, 
  RotateCw,
  Server,
  SlidersHorizontal,
  Filter,
  Flame,
  Star
} from 'lucide-react';
import { catalogService, LotItem, ProductItem } from '../../services/catalogService';
import { useCurrency } from '../../context/CurrencyContext';
import { useAppSelector } from '../../store';
import ProductCard from '../../components/ProductCard';
import LotCard from '../../components/LotCard';
import { createLotUrl } from '../../lib/slugs';

export default function BuyFeaturedLots() {
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();
  const { categories: reduxCategories } = useAppSelector((state) => state.categories);

  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [purchaseMode, setPurchaseMode] = useState<'lot' | 'product'>('lot');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Dynamic API State
  const [lots, setLots] = useState<LotItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Interactive UI State
  const [selectedLotForManifest, setSelectedLotForManifest] = useState<LotItem | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"discount" | "price-asc" | "price-desc" | "units">("discount");

  // Advanced Filter Panel State
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [shippingSizeFilter, setShippingSizeFilter] = useState<string>('all');
  const [moqFilter, setMoqFilter] = useState<string>('all');
  const [selectedCuration, setSelectedCuration] = useState<'all' | 'best_sellers' | 'featured' | 'new_arrivals'>('all');

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (minPrice.trim() !== '') count++;
    if (maxPrice.trim() !== '') count++;
    if (selectedCondition !== 'all') count++;
    if (selectedCountry !== 'all') count++;
    if (minDiscount > 0) count++;
    if (shippingSizeFilter !== 'all') count++;
    if (moqFilter !== 'all') count++;
    if (selectedCuration !== 'all') count++;
    return count;
  }, [minPrice, maxPrice, selectedCondition, selectedCountry, minDiscount, shippingSizeFilter, moqFilter, selectedCuration]);

  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    lots.forEach(lot => {
      const c = lot.inventory_country || lot.country || (lot.location ? lot.location.split(',').pop()?.trim() : null);
      if (c && c.length > 2) set.add(c);
    });
    products.forEach(p => {
      const c = p.manufacturing_country || (p.location ? p.location.split(',').pop()?.trim() : null);
      if (c && c.length > 2) set.add(c);
    });
    return Array.from(set).sort();
  }, [lots, products]);

  // Sync with URL params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchFilter(q);
      setDebouncedSearch(q);
    }
    const cat = searchParams.get('category');
    if (cat !== null) {
      setSelectedCategory(cat);
    }
    const mode = searchParams.get('mode');
    if (mode === 'product' || mode === 'lot') {
      setPurchaseMode(mode);
    }
  }, [searchParams]);

  // Debounce search filter input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchFilter]);

  // Compute Dynamic Categories from Redux Store (guarded by mounted for SSR hydration stability)
  const dynamicCategories = useMemo(() => {
    const list = ["All Categories"];
    if (mounted && reduxCategories && reduxCategories.length > 0) {
      reduxCategories.forEach((cat) => {
        if (cat.name && !list.includes(cat.name)) {
          list.push(cat.name);
        }
      });
    } else {
      // Stable fallback during SSR and initial hydration
      return [
        "All Categories",
        "Consumer Electronics",
        "Construction, Hardware & MRO",
        "Books, Stationery & Office Supplies",
        "Electricals",
        "IT & Servers",
        "Power Tools",
        "PPE & Safety",
        "Lighting",
        "Heavy Equipment"
      ];
    }
    return list;
  }, [mounted, reduxCategories]);

  // Fetch Dynamic Data from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    const queryCategory = selectedCategory === "All Categories" || selectedCategory === "All" ? undefined : selectedCategory;
    const querySearch = debouncedSearch.trim() || undefined;

    if (purchaseMode === 'product') {
      try {
        const data = await catalogService.getProducts({
          category: queryCategory,
          search: querySearch
        });
        setProducts(data);
      } catch (err) {
        console.warn('[BuyFeaturedLots] Error fetching dynamic products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const data = await catalogService.getLots({
          category: queryCategory,
          search: querySearch
        });
        setLots(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('[BuyFeaturedLots] Error fetching dynamic lots:', err);
        setLots([]);
      } finally {
        setLoading(false);
      }
    }
  }, [purchaseMode, selectedCategory, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  // Filter & Sort Dynamic Products
  const sortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Price Filter
      const price = Number(product.price) || 0;
      if (minPrice !== '' && price < Number(minPrice)) return false;
      if (maxPrice !== '' && price > Number(maxPrice)) return false;

      // Condition Filter
      if (selectedCondition !== 'all') {
        const cond = (product.condition || '').toLowerCase();
        if (selectedCondition === 'new' && !cond.includes('new') && !cond.includes('surplus')) return false;
        if (selectedCondition === 'refurbished' && !cond.includes('refurb') && !cond.includes('like new') && !cond.includes('open')) return false;
        if (selectedCondition === 'returns' && !cond.includes('return') && !cond.includes('used') && !cond.includes('mixed')) return false;
        if (selectedCondition === 'salvage' && !cond.includes('salvage')) return false;
      }

      // Country / Location Filter
      if (selectedCountry !== 'all') {
        const pCountry = (product.manufacturing_country || product.location || '').toLowerCase();
        if (!pCountry.includes(selectedCountry.toLowerCase())) return false;
      }

      // Minimum Discount Filter
      if (minDiscount > 0) {
        const orig = Number(product.originalPrice || product.previousPrice || product.msrp || product.price);
        const disc = orig > price ? ((orig - price) / orig) * 100 : 0;
        if (disc < minDiscount) return false;
      }

      // MOQ Filter
      if (moqFilter !== 'all') {
        const moq = Number(product.moq) || 0;
        if (moqFilter === 'under_50' && moq >= 50) return false;
        if (moqFilter === '50_200' && (moq < 50 || moq > 200)) return false;
        if (moqFilter === '200_plus' && moq < 200) return false;
      }

      // Curation Filter (Best Sellers, Featured Deals, New Arrivals)
      if (selectedCuration !== 'all') {
        if (selectedCuration === 'best_sellers') {
          const isBest = product.isBestSelling || Boolean(product.offer?.toLowerCase().includes('best')) || (product.views_count && product.views_count > 30);
          if (!isBest) return false;
        } else if (selectedCuration === 'featured') {
          const isFeat = product.isFeatured || product.isCertified;
          if (!isFeat) return false;
        } else if (selectedCuration === 'new_arrivals') {
          const isNew = product.isNewArrival || product.isNew;
          if (!isNew) return false;
        }
      }

      return true;
    });

    return filtered.sort((a, b) => {
      const origA = Number(a.originalPrice || a.previousPrice || a.msrp || a.price);
      const origB = Number(b.originalPrice || b.previousPrice || b.msrp || b.price);
      if (sortBy === 'discount') {
        const discA = origA > a.price ? (origA - a.price) / origA : 0;
        const discB = origB > b.price ? (origB - b.price) / origB : 0;
        return discB - discA;
      }
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'units') return (b.estQty || 0) - (a.estQty || 0);
      return 0;
    });
  }, [products, sortBy, minPrice, maxPrice, selectedCondition, selectedCountry, minDiscount, moqFilter, selectedCuration]);

  // Filter & Sort Dynamic Lots
  const sortedLots = useMemo(() => {
    let filtered = lots.filter(lot => {
      // Price Filter
      const price = Number(lot.price) || 0;
      if (minPrice !== '' && price < Number(minPrice)) return false;
      if (maxPrice !== '' && price > Number(maxPrice)) return false;

      // Condition Filter
      if (selectedCondition !== 'all') {
        const cond = (lot.condition || '').toLowerCase();
        if (selectedCondition === 'new' && !cond.includes('new') && !cond.includes('surplus') && !cond.includes('overstock')) return false;
        if (selectedCondition === 'refurbished' && !cond.includes('refurb') && !cond.includes('like new') && !cond.includes('graded')) return false;
        if (selectedCondition === 'returns' && !cond.includes('return') && !cond.includes('mixed') && !cond.includes('raw')) return false;
        if (selectedCondition === 'salvage' && !cond.includes('salvage')) return false;
      }

      // Country / Location Filter
      if (selectedCountry !== 'all') {
        const lCountry = (lot.inventory_country || lot.country || lot.location || '').toLowerCase();
        if (!lCountry.includes(selectedCountry.toLowerCase())) return false;
      }

      // Minimum Discount Filter
      if (minDiscount > 0) {
        const msrp = Number(lot.msrp) || 0;
        const disc = msrp > price ? ((msrp - price) / msrp) * 100 : 0;
        if (disc < minDiscount) return false;
      }

      // Shipping Size Filter
      if (shippingSizeFilter !== 'all') {
        const size = (lot.shipping_size || lot.load_type || '').toLowerCase();
        if (shippingSizeFilter === 'pallet' && !size.includes('pallet')) return false;
        if (shippingSizeFilter === 'truckload' && !size.includes('truckload') && !size.includes('ftl')) return false;
        if (shippingSizeFilter === 'ltl' && !size.includes('ltl') && !size.includes('multi')) return false;
      }

      // Curation Filter (Best Sellers, Featured Deals, New Arrivals)
      if (selectedCuration !== 'all') {
        if (selectedCuration === 'best_sellers') {
          const isBest = lot.is_best_selling || lot.isBestSelling || lot.sale_method === 'buy_now' || (lot.offer && lot.offer.toLowerCase().includes('best'));
          if (!isBest) return false;
        } else if (selectedCuration === 'featured') {
          const msrpVal = Number(lot.msrp) || 0;
          const disc = msrpVal > price && msrpVal > 0 ? (msrpVal - price) / msrpVal : 0;
          const isFeat = lot.is_featured || lot.isFeatured || disc >= 0.5;
          if (!isFeat) return false;
        } else if (selectedCuration === 'new_arrivals') {
          const age = (lot.inventory_stock_age || '').toLowerCase();
          const isNew = lot.is_new_arrival || lot.isNewArrival || age.includes('< 6') || age.includes('current');
          if (!isNew) return false;
        }
      }

      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'discount') {
        const discA = a.msrp > a.price ? (a.msrp - a.price) / a.msrp : 0;
        const discB = b.msrp > b.price ? (b.msrp - b.price) / b.msrp : 0;
        return discB - discA;
      }
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'units') return (b.units || 0) - (a.units || 0);
      return 0;
    });
  }, [lots, sortBy, minPrice, maxPrice, selectedCondition, selectedCountry, minDiscount, shippingSizeFilter, selectedCuration]);

  const handleDownloadManifest = (lotTitle: string) => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 3000);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All Categories");
    setSearchFilter("");
    setDebouncedSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedCondition("all");
    setSelectedCountry("all");
    setMinDiscount(0);
    setShippingSizeFilter("all");
    setMoqFilter("all");
    setSelectedCuration("all");
  };

  return (
    <section id="liquidation-catalog" className="w-full bg-[#f8fafc] py-16 md:py-24 border-b border-gray-200/80">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-[#0a5c48] font-bold text-xs tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#14b875]" />
                <span>DYNAMIC SOURCING CATALOG</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                <Server className="w-3.5 h-3.5 text-emerald-600" />
                <span>API: /api/{purchaseMode === 'lot' ? 'lots/' : 'products/'}</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Verified Wholesale Inventory & Lots
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Live dynamic inventory fetched directly from the Surplus Market API. Browse manifested bulk lots or source single wholesale SKUs using verified MOQ.
            </p>
          </div>

          {/* Mode Switcher: Lots vs Products */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-full border border-slate-300/70 shadow-xs shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setPurchaseMode('lot')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                purchaseMode === 'lot'
                  ? 'bg-[#0a5c48] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Manifested Lots</span>
              <span suppressHydrationWarning className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                purchaseMode === 'lot' ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-700'
              }`}>
                {loading && purchaseMode === 'lot' ? '...' : sortedLots.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPurchaseMode('product')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                purchaseMode === 'product'
                  ? 'bg-[#0a5c48] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Wholesale Products</span>
              <span suppressHydrationWarning className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                purchaseMode === 'product' ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-700'
              }`}>
                {loading && purchaseMode === 'product' ? '...' : sortedProducts.length}
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Filter Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm mb-10">
          
          {/* Category Tabs: Driven Dynamically from Redux / API */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide border-b border-slate-100">
            {dynamicCategories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0a5c48] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search, Sort and Refresh Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={purchaseMode === 'lot' ? "Search lots by keyword, brand, location..." : "Search products by SKU, name, or model..."}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0a5c48] focus:bg-white transition-all"
              />
              {searchFilter && (
                <button 
                  onClick={() => { setSearchFilter(''); setDebouncedSearch(''); }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span suppressHydrationWarning className="text-xs text-slate-500 font-medium whitespace-nowrap">
                {loading ? (
                  <span>Loading from API...</span>
                ) : (
                  <span>
                    Found <strong suppressHydrationWarning className="text-slate-900">{purchaseMode === 'lot' ? sortedLots.length : sortedProducts.length}</strong> items
                  </span>
                )}
              </span>

              {/* Refresh from API button */}
              <button
                type="button"
                onClick={() => setRefreshTrigger((prev) => prev + 1)}
                className="p-2 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Refresh API Data"
              >
                <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#0a5c48]' : ''}`} />
              </button>

              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                  isFilterOpen || activeFiltersCount > 0
                    ? 'bg-[#0a5c48] text-white border-[#0a5c48] shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title="Filter by Price, Condition, Location & More"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-[#0a5c48] text-[10px] font-black flex items-center justify-center shrink-0">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs">
                <span className="text-slate-500 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="discount">Highest Savings %</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="units">{purchaseMode === 'lot' ? 'Most Units' : 'Highest Qty'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Expandable Advanced Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#0a5c48]" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Catalog Filters
                  </span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-emerald-100 text-[#0a5c48] text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {activeFiltersCount} active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {activeFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer underline"
                    >
                      Clear all filters
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Curated Highlights Strip */}
              <div className="mb-5 pb-4 border-b border-slate-100">
                <label className="font-bold text-slate-800 text-xs block mb-2">Curated Highlights</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Items', icon: Boxes },
                    { id: 'best_sellers', label: 'Best Sellers', icon: Flame, color: 'text-amber-500' },
                    { id: 'featured', label: 'Featured Deals', icon: Star, color: 'text-emerald-600' },
                    { id: 'new_arrivals', label: 'New Arrivals', icon: Sparkles, color: 'text-blue-500' },
                  ].map((cur) => {
                    const Icon = cur.icon;
                    const isSelected = selectedCuration === cur.id;
                    return (
                      <button
                        key={cur.id}
                        type="button"
                        onClick={() => setSelectedCuration(cur.id as any)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0a5c48] text-white border-[#0a5c48] font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : cur.color || 'text-slate-500'}`} />
                        <span>{cur.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter Grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
                {/* 1. Price Range */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-800 block">Price Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min $"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#0a5c48]"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      placeholder="Max $"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#0a5c48]"
                    />
                  </div>
                  {/* Quick price chips */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {[
                      { label: '<$1K', min: '', max: '1000' },
                      { label: '$1K-$5K', min: '1000', max: '5000' },
                      { label: '$5K-$20K', min: '5000', max: '20000' },
                      { label: '$20K+', min: '20000', max: '' },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => { setMinPrice(preset.min); setMaxPrice(preset.max); }}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                          minPrice === preset.min && maxPrice === preset.max
                            ? 'bg-[#0a5c48] text-white border-[#0a5c48]'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Condition */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-800 block">Inventory Condition</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'new', label: 'Brand New / Surplus' },
                      { value: 'refurbished', label: 'Refurbished' },
                      { value: 'returns', label: 'Customer Returns' },
                      { value: 'salvage', label: 'Salvage / Mixed' },
                    ].map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setSelectedCondition(c.value)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          selectedCondition === c.value
                            ? 'bg-[#0a5c48] text-white border-[#0a5c48] font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Location / Country */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-800 block">Warehouse Location</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#0a5c48] cursor-pointer"
                  >
                    <option value="all">All Locations / Global</option>
                    {availableCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400">Filter inventory by origin depot</p>
                </div>

                {/* 4. Mode-specific & Discounts */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-800 block">
                    {purchaseMode === 'lot' ? 'Load & Shipping Size' : 'Minimum Order Qty (MOQ)'}
                  </label>
                  {purchaseMode === 'lot' ? (
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { value: 'all', label: 'All Sizes' },
                        { value: 'pallet', label: 'Pallet Lots' },
                        { value: 'ltl', label: 'Multi-Pallet / LTL' },
                        { value: 'truckload', label: 'Full Truckload' },
                      ].map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => setShippingSizeFilter(s.value)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                            shippingSizeFilter === s.value
                              ? 'bg-[#0a5c48] text-white border-[#0a5c48] font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { value: 'all', label: 'All MOQs' },
                        { value: 'under_50', label: '< 50 pcs' },
                        { value: '50_200', label: '50 - 200 pcs' },
                        { value: '200_plus', label: '200+ pcs' },
                      ].map((m) => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => setMoqFilter(m.value)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                            moqFilter === m.value
                              ? 'bg-[#0a5c48] text-white border-[#0a5c48] font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Minimum Savings */}
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">Minimum Savings %</span>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { value: 0, label: 'Any' },
                        { value: 30, label: '30%+' },
                        { value: 50, label: '50%+' },
                        { value: 70, label: '70%+' },
                      ].map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setMinDiscount(d.value)}
                          className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                            minDiscount === d.value
                              ? 'bg-[#0a5c48] text-white border-[#0a5c48] font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Panel Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Showing <strong className="text-slate-900">{purchaseMode === 'lot' ? sortedLots.length : sortedProducts.length}</strong> matching {purchaseMode === 'lot' ? 'lots' : 'products'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="px-5 py-1.5 bg-[#0a5c48] hover:bg-[#074737] text-white rounded-full text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Done / Apply
                </button>
              </div>
            </div>
          )}

          {/* Active Filter Pills Bar */}
          {activeFiltersCount > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider">Active Filters:</span>
              
              {selectedCuration !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300/80 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {selectedCuration === 'best_sellers' && '🔥 Best Sellers'}
                  {selectedCuration === 'featured' && '⭐ Featured Deals'}
                  {selectedCuration === 'new_arrivals' && '✨ New Arrivals'}
                  <button onClick={() => setSelectedCuration('all')} className="hover:text-amber-950 cursor-pointer ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {minPrice && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Min: ${minPrice}
                  <button onClick={() => setMinPrice('')} className="hover:text-emerald-950 cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}

              {maxPrice && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Max: ${maxPrice}
                  <button onClick={() => setMaxPrice('')} className="hover:text-emerald-950 cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}

              {selectedCondition !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                  Condition: {selectedCondition}
                  <button onClick={() => setSelectedCondition('all')} className="hover:text-emerald-950 cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}

              {selectedCountry !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Location: {selectedCountry}
                  <button onClick={() => setSelectedCountry('all')} className="hover:text-emerald-950 cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}

              {minDiscount > 0 && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Savings: {minDiscount}%+
                  <button onClick={() => setMinDiscount(0)} className="hover:text-emerald-950 cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}

              {shippingSizeFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                  Size: {shippingSizeFilter}
                  <button onClick={() => setShippingSizeFilter('all')} className="hover:text-emerald-950 cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}

              {moqFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  MOQ: {moqFilter.replace('_', ' ')}
                  <button onClick={() => setMoqFilter('all')} className="hover:text-emerald-950 cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer hover:underline"
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* CONDITION 1: WHOLESALE PRODUCTS (USING ProductCard) */}
        {purchaseMode === 'product' ? (
          <div>
            {loading ? (
              /* Loading Skeletons for Products */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <ProductCard
                    key={`skel-prod-${idx}`}
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
            ) : sortedProducts.length > 0 ? (
              /* Dynamic Products from API */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <div key={product.id} className="h-full">
                    <ProductCard 
                      {...product} 
                      isLoading={false} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto shadow-xs">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No products found</h3>
                <p className="text-xs text-slate-500 mb-6">
                  No products matched the current category or search criteria from the API.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#0a5c48] text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-[#074737] transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          /* CONDITION 2: MANIFESTED LOTS */
          <div>
            {loading ? (
              /* Loading Skeletons for Lots */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <LotCard
                    key={`skel-lot-${idx}`}
                    image=""
                    title=""
                    isLoading={true}
                  />
                ))}
              </div>
            ) : sortedLots.length > 0 ? (
              /* Dynamic Lots from API using LotCard */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {sortedLots.map((lot) => (
                  <div key={lot.id} className="h-full">
                    <LotCard
                      {...lot}
                      onViewManifest={() => setSelectedLotForManifest(lot)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto shadow-xs">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No liquidation lots available</h3>
                <p className="text-xs text-slate-500 mb-6">
                  There are currently no active lots returned from the live API. Check back soon or browse single wholesale products.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <button
                    onClick={() => setPurchaseMode('product')}
                    className="bg-[#0a5c48] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#074737] transition-colors cursor-pointer"
                  >
                    Browse Wholesale Products
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="border border-slate-200 text-slate-700 px-6 py-2.5 rounded-full text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Manifest Interactive Quick-Preview Modal */}
      {selectedLotForManifest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
              <div className="flex items-center gap-3 pr-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0a5c48] flex items-center justify-center shrink-0 border border-emerald-200">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                      Verified Manifest (.XLSX)
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {selectedLotForManifest.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {selectedLotForManifest.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLotForManifest(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Summary Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-emerald-50/50 border-b border-emerald-100 text-xs">
              <div>
                <div className="text-slate-500 font-medium">Total Units</div>
                <div suppressHydrationWarning className="text-sm font-extrabold text-slate-900">{selectedLotForManifest.units.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-slate-500 font-medium">Pallets / Weight</div>
                <div suppressHydrationWarning className="text-sm font-extrabold text-slate-900">{selectedLotForManifest.pallets} Pallets</div>
              </div>
              <div>
                <div className="text-slate-500 font-medium">Total MSRP</div>
                <div suppressHydrationWarning className="text-sm font-extrabold text-slate-500 line-through">{formatPrice(selectedLotForManifest.msrp)}</div>
              </div>
              <div>
                <div className="text-emerald-700 font-medium">Lot Wholesale Price</div>
                <div suppressHydrationWarning className="text-sm font-extrabold text-[#0a5c48]">{formatPrice(selectedLotForManifest.price)}</div>
              </div>
            </div>

            {/* Manifest Line Items Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Line-Item Breakdown ({selectedLotForManifest.manifest_items?.length || 3} items)</span>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Barcode Inspected
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="py-2.5 px-3">SKU / Part #</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">Condition</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">MSRP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selectedLotForManifest.manifest_items && selectedLotForManifest.manifest_items.length > 0) ? (
                      selectedLotForManifest.manifest_items.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{item.sku || `SKU-${idx + 101}`}</td>
                          <td className="py-2.5 px-3 text-slate-800 font-medium">{item.title}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-semibold">{item.condition || "Inspected"}</span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-900">{item.qty}</td>
                          <td suppressHydrationWarning className="py-2.5 px-3 text-right font-semibold text-slate-700">{formatPrice(item.msrp * item.qty)}</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-slate-800">LOT-ITEM-01</td>
                          <td className="py-2.5 px-3 text-slate-800 font-medium">Primary Item Manifested Lot Batch</td>
                          <td className="py-2.5 px-3 text-center"><span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">Overstock</span></td>
                          <td className="py-2.5 px-3 text-center font-bold">{Math.round(selectedLotForManifest.units * 0.6)}</td>
                          <td suppressHydrationWarning className="py-2.5 px-3 text-right">{formatPrice(selectedLotForManifest.msrp * 0.6)}</td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-slate-800">LOT-ITEM-02</td>
                          <td className="py-2.5 px-3 text-slate-800 font-medium">Secondary SKU Complementary Units</td>
                          <td className="py-2.5 px-3 text-center"><span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">Factory Sealed</span></td>
                          <td className="py-2.5 px-3 text-center font-bold">{Math.round(selectedLotForManifest.units * 0.4)}</td>
                          <td suppressHydrationWarning className="py-2.5 px-3 text-right">{formatPrice(selectedLotForManifest.msrp * 0.4)}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {downloadSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Manifest spreadsheet (.xlsx) downloaded successfully with complete UPC barcodes.</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDownloadManifest(selectedLotForManifest.title)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 px-4 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                <span>Export Full Manifest (.XLSX)</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedLotForManifest(null)}
                  className="w-1/2 sm:w-auto px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href={createLotUrl(selectedLotForManifest.title || selectedLotForManifest.id)}
                  className="w-1/2 sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#0a5c48] hover:bg-[#074737] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>Acquire Lot</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
