"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  SearchX, 
  Filter, 
  X, 
  SlidersHorizontal, 
  Tag, 
  DollarSign, 
  ShoppingBag,
  Package
} from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import LotCard from '../../components/LotCard';
import { catalogService, ProductItem, LotItem } from '../../services/catalogService';

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 - $500', min: 100, max: 500 },
  { label: '$500 - $1,000', min: 500, max: 1000 },
  { label: 'Over $1,000', min: 1000, max: Infinity },
];

const CONDITIONS = [
  'All Conditions',
  'Brand New / Overstock',
  'Customer Returns',
  'Refurbished',
  'Salvage / Parts'
];

const BuyCatalog = () => {
  const [purchaseMode, setPurchaseMode] = useState<'product' | 'lot'>('product');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPriceRangeIndex, setSelectedPriceRangeIndex] = useState<number>(0);
  const [selectedCondition, setSelectedCondition] = useState<string>('All Conditions');

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [lots, setLots] = useState<LotItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const fetchCatalogData = () => {
    setLoading(true);
    Promise.allSettled([
      catalogService.getProducts({ search: searchQuery }),
      catalogService.getLots({ search: searchQuery }),
    ])
      .then(([productsRes, lotsRes]) => {
        if (productsRes.status === 'fulfilled') {
          setProducts(productsRes.value.filter((item) => item.type !== 'lot'));
        }
        if (lotsRes.status === 'fulfilled') {
          setLots(lotsRes.value);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCatalogData();
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const p = product.currentPrice || product.price || 0;
      const priceRange = PRICE_RANGES[selectedPriceRangeIndex];
      if (p < priceRange.min || p > priceRange.max) return false;

      if (selectedCondition !== 'All Conditions') {
        const cond = product.condition?.toLowerCase() || '';
        if (selectedCondition.includes('New') && !cond.includes('new') && !product.isNew) return false;
        if (selectedCondition.includes('Return') && !cond.includes('return')) return false;
        if (selectedCondition.includes('Refurbished') && !cond.includes('refurbish')) return false;
      }
      return true;
    });
  }, [products, selectedPriceRangeIndex, selectedCondition]);

  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      const p = lot.price || 0;
      const priceRange = PRICE_RANGES[selectedPriceRangeIndex];
      if (p < priceRange.min || p > priceRange.max) return false;

      if (selectedCondition !== 'All Conditions') {
        const cond = lot.condition?.toLowerCase() || '';
        if (selectedCondition.includes('New') && !cond.includes('new') && !cond.includes('overstock')) return false;
        if (selectedCondition.includes('Return') && !cond.includes('return')) return false;
        if (selectedCondition.includes('Refurbished') && !cond.includes('refurbish')) return false;
      }
      return true;
    });
  }, [lots, selectedPriceRangeIndex, selectedCondition]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedPriceRangeIndex > 0) count++;
    if (selectedCondition !== 'All Conditions') count++;
    return count;
  }, [searchQuery, selectedPriceRangeIndex, selectedCondition]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPriceRangeIndex(0);
    setSelectedCondition('All Conditions');
  };

  return (
    <main className="w-full min-h-screen bg-[#fafafa] pb-32 font-sans selection:bg-slate-200">
      {/* Sleek Mode Switcher */}
      <div className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 border-b border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-light text-slate-900 tracking-tight">The <span className="font-semibold">Catalog</span></h2>
          
          <div className="inline-flex p-1.5 bg-slate-100/50 backdrop-blur-md rounded-2xl border border-slate-200/50">
            <button
              onClick={() => setPurchaseMode('product')}
              className={`flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                purchaseMode === 'product'
                  ? 'bg-white text-slate-900 shadow-sm shadow-slate-200/50 scale-100'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/40 scale-95 hover:scale-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Products</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                purchaseMode === 'product' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {filteredProducts.length}
              </span>
            </button>

            <button
              onClick={() => setPurchaseMode('lot')}
              className={`flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                purchaseMode === 'lot'
                  ? 'bg-white text-slate-900 shadow-sm shadow-slate-200/50 scale-100'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/40 scale-95 hover:scale-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Wholesale Lots</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                purchaseMode === 'lot' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {filteredLots.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl pt-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Mobile Filter Toggle */}
          <div className="w-full lg:hidden flex items-center justify-between bg-white/80 backdrop-blur-lg p-5 rounded-2xl border border-slate-200/60 shadow-sm">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-slate-800"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-slate-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <span className="text-xs font-medium text-slate-500">
              {purchaseMode === 'product' ? filteredProducts.length : filteredLots.length} items
            </span>
          </div>

          {/* Elegant Sidebar Filters */}
          <aside className={`
            fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm transition-opacity lg:static lg:bg-transparent lg:z-auto lg:w-72 shrink-0
            ${isMobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto'}
          `}>
            <div className={`
              fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-white p-8 shadow-2xl overflow-y-auto transition-transform duration-500 ease-out z-50
              lg:static lg:w-full lg:p-0 lg:bg-transparent lg:shadow-none lg:overflow-visible
              ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
              
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8 lg:hidden">
                <h2 className="font-light text-2xl text-slate-900">Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="hidden lg:flex items-center justify-between mb-8">
                <h2 className="font-medium text-sm tracking-widest uppercase text-slate-400">Refine Search</h2>
                {activeFiltersCount > 0 && (
                  <button onClick={handleResetFilters} className="text-xs font-medium text-slate-900 hover:underline">
                    Clear All
                  </button>
                )}
              </div>

              {/* Keyword Search */}
              <div className="mb-10">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-colors group-focus-within:text-slate-900">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all shadow-sm shadow-slate-100/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-10">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  Price Range
                </h3>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((range, idx) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRangeIndex(idx)}
                      className={`
                        w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                        ${selectedPriceRangeIndex === idx
                          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                      `}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div className="mb-10">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  Item Condition
                </h3>
                <div className="space-y-1.5">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond}
                      onClick={() => setSelectedCondition(cond)}
                      className={`
                        w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                        ${selectedCondition === cond
                          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                      `}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-4 lg:hidden mt-auto">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl text-sm font-semibold transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-sm font-semibold transition-colors shadow-lg shadow-slate-900/20"
                >
                  Apply
                </button>
              </div>

            </div>
          </aside>

          {/* Catalog Grid Area */}
          <div className="flex-1 w-full">
            {purchaseMode === 'product' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <div key={`skel-prod-${idx}`} className="animate-pulse flex flex-col gap-4">
                      <div className="bg-slate-200 aspect-[4/5] rounded-3xl w-full" />
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                    </div>
                  ))
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="group cursor-pointer">
                      <ProductCard {...product} isLoading={false} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-200/50 p-12">
                    <SearchX className="w-16 h-16 text-slate-300 mb-6" />
                    <h3 className="text-2xl font-light text-slate-900 mb-3">No matches found</h3>
                    <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
                      We couldn't find any products matching your current filters. Try adjusting them or clear your search.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-8 py-3.5 bg-slate-900 text-white rounded-full text-sm font-semibold transition-all hover:bg-black hover:shadow-lg hover:shadow-slate-900/20"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <div key={`skel-lot-${idx}`} className="animate-pulse flex flex-col gap-4">
                      <div className="bg-slate-200 aspect-video rounded-3xl w-full" />
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                    </div>
                  ))
                ) : filteredLots.length > 0 ? (
                  filteredLots.map((lot) => (
                    <div key={lot.id} className="group cursor-pointer">
                      <LotCard {...lot} isLoading={false} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-200/50 p-12">
                    <SearchX className="w-16 h-16 text-slate-300 mb-6" />
                    <h3 className="text-2xl font-light text-slate-900 mb-3">No matches found</h3>
                    <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
                      We couldn't find any wholesale lots matching your current filters. Try adjusting them or clear your search.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-8 py-3.5 bg-slate-900 text-white rounded-full text-sm font-semibold transition-all hover:bg-black hover:shadow-lg hover:shadow-slate-900/20"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
};

export default BuyCatalog;
