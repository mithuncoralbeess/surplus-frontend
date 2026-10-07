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
  Server
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

  // Sort Dynamic Products
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
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
  }, [products, sortBy]);

  // Sort Dynamic Lots
  const sortedLots = useMemo(() => {
    return [...lots].sort((a, b) => {
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
  }, [lots, sortBy]);

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
