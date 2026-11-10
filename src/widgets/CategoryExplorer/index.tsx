"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, ArrowRight, ChevronRight,
  Hammer, Zap, Wrench, PenTool, HardHat, Drill, Lamp, Disc, Laptop, Truck, Box, Cpu, Stethoscope, Layers, Sparkles,
  Tag, ShoppingBag, Package, ShieldCheck, Lock, CheckCircle2, Boxes, FileSpreadsheet, Headphones, X
} from 'lucide-react';
import { useAppSelector } from '../../store';
import { useLanguage } from '../../context/LanguageContext';

const ICON_MAP: Record<string, any> = {
  'building materials': Hammer,
  'electricals': Zap,
  'electricals & lighting': Zap,
  'electrical parts': Zap,
  'hand tools': Wrench,
  'hand tools & hardware': Wrench,
  'power tools': Drill,
  'power tools & equipment': Drill,
  'ppe': HardHat,
  'ppe & safety gear': HardHat,
  'automation & controls': Cpu,
  'industrial machinery & pumps': Box,
  'industrial equipment': Box,
  'ict, electronics & telecom': Laptop,
  'electronics-ict': Laptop,
  'consumer electronics': Laptop,
  'furniture & office interiors': Lamp,
  'books, stationery & office supplies': Lamp,
  'logistics & material handling': Truck,
  'medical & laboratory': Stethoscope,
  'abrasives & paints': Disc,
  'automotive': Truck,
  'apparel, footwear & accessories': Tag,
  'oil & gas equipment & mro': Layers,
  'oil-gas-equipment-mro': Layers,
  'chisels and punches': PenTool,
};

const getCategoryIcon = (name: string) => {
  const normalized = name.toLowerCase().trim();
  return ICON_MAP[normalized] || Layers;
};

// Refined pastel badge colors for visual categorization
const BG_COLORS = [
  'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  'bg-blue-50 text-blue-700 border-blue-200/80',
  'bg-amber-50 text-amber-700 border-amber-200/80',
  'bg-purple-50 text-purple-700 border-purple-200/80',
  'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  'bg-teal-50 text-teal-700 border-teal-200/80',
  'bg-rose-50 text-rose-700 border-rose-200/80',
  'bg-cyan-50 text-cyan-700 border-cyan-200/80',
];

const POPULAR_SEARCH_TAGS = [
  'Building Materials',
  'Electricals',
  'Power tools',
  'PPE',
  'Consumer Electronics',
  'Automotive',
];

export default function CategoryExplorer() {
  const { t, tCategory } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Get categories strictly from Redux store (which auto-caches to localStorage)
  const { categories, loading } = useAppSelector((state) => state.categories);

  // Calculate total counts
  const totalCategories = categories.length;
  const totalSubcategories = useMemo(() => {
    return categories.reduce((acc, cat) => {
      const subs = cat.subcategories || cat.sub_categories || [];
      return acc + (subs.length || 0);
    }, 0);
  }, [categories]);

  // Filter categories and subcategories dynamically based on search query
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return categories.filter((cat) => {
      if (!q) return true;

      const catMatch = cat.name.toLowerCase().includes(q);
      const subs = cat.subcategories || cat.sub_categories || [];
      const subMatch = subs.some((s: any) => s.name.toLowerCase().includes(q));

      return catMatch || subMatch;
    }).map((cat) => {
      const subs = cat.subcategories || cat.sub_categories || [];
      if (!q) return { ...cat, displaySubs: subs };

      const filteredSubs = subs.filter((s: any) => s.name.toLowerCase().includes(q) || cat.name.toLowerCase().includes(q));
      return {
        ...cat,
        displaySubs: filteredSubs.length > 0 ? filteredSubs : subs,
      };
    });
  }, [categories, searchQuery]);

  return (
    <div className="w-full flex flex-col">
      {/* 1. HERO SOURCING BANNER */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#051c14] via-[#082d20] to-[#0c402e] text-white py-8 sm:py-10 md:py-12 border-b border-emerald-900/40">
        {/* Background Decorative Ambient Gradients & Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#14b875]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-emerald-200/80 mb-4">
            <Link href="/" className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-white font-semibold">Buy</span>
          </nav>

          {/* Title & Concise Subtitle */}
          <div className="max-w-2xl mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              Buy Surplus &amp; Wholesale Inventory
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm font-normal leading-relaxed">
              Source verified enterprise excess stock, industrial machinery, and wholesale liquidation inventory across {totalCategories > 0 ? totalCategories : 'all'} categories.
            </p>
          </div>

          {/* Streamlined Category & Inventory Search Bar */}
          <div className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 max-w-3xl">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-gray-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search across categories or subcategories (e.g. Electricals, Fasteners, Tools)..."
                  className="w-full pl-11 rtl:pl-4 rtl:pr-11 pr-10 rtl:pr-4 py-2.5 sm:py-3 bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 rtl:right-auto rtl:left-3 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hidden sm:inline-flex bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Popular Category Tag Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-4 max-w-3xl text-xs">
            <span className="text-emerald-200/70 font-semibold mr-1">Popular categories:</span>
            {POPULAR_SEARCH_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className={`px-3 py-1 rounded-full border transition-all cursor-pointer font-medium ${
                  searchQuery.toLowerCase() === tag.toLowerCase()
                    ? 'bg-emerald-400 text-emerald-950 border-emerald-400 font-bold shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-emerald-100 border-white/15'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 2. BUYER ASSURANCE TRUST STRIP */}
      <section className="w-full bg-white border-b border-gray-200/80 shadow-2xs">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="flex items-center gap-3 py-2 md:py-0 md:px-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0f7a61] flex items-center justify-center shrink-0 border border-emerald-100">
                <FileSpreadsheet className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">100% Manifest Verified</div>
                <div className="text-[11px] text-gray-500">Audited UPCs & serial numbers</div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2 md:py-0 md:px-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0f7a61] flex items-center justify-center shrink-0 border border-emerald-100">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Inspection Protection</div>
                <div className="text-[11px] text-gray-500">72-hour review before fund release</div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2 md:py-0 md:px-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0f7a61] flex items-center justify-center shrink-0 border border-emerald-100">
                <Truck className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Turnkey Freight & LTL</div>
                <div className="text-[11px] text-gray-500">Liftgate, dock, and export dispatch</div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2 md:py-0 md:px-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0f7a61] flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Direct Enterprise Sourcing</div>
                <div className="text-[11px] text-gray-500">Tier-1 distributors & liquidators</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY EXPLORER GRID SECTION */}
      <section className="w-full bg-[#f8fafc] py-12 lg:py-18 min-h-[600px]">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-5 border-b border-gray-200/80">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold text-[#0f7a61] uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  Catalog Directory
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs font-semibold text-gray-500">
                  {totalCategories} Categories &amp; {totalSubcategories} Specialized Subcategories
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse by Product Category'}
              </h2>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
              <span>Showing <strong>{filteredCategories.length}</strong> categories</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-[#0f7a61] hover:underline cursor-pointer"
                >
                  Reset filter
                </button>
              )}
            </div>
          </div>

          {/* Category Cards Grid */}
          {loading && categories.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs animate-pulse flex flex-col justify-between h-[360px]">
                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                      <div className="w-20 h-5 bg-gray-100 rounded-full"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded-full w-3/4 mb-4"></div>
                    <div className="space-y-2.5">
                      <div className="h-4 bg-gray-100 rounded-lg w-full"></div>
                      <div className="h-4 bg-gray-100 rounded-lg w-5/6"></div>
                      <div className="h-4 bg-gray-100 rounded-lg w-4/5"></div>
                      <div className="h-4 bg-gray-100 rounded-lg w-2/3"></div>
                    </div>
                  </div>
                  <div className="h-5 bg-gray-100 rounded-lg w-1/2 mt-4 pt-3 border-t border-gray-100"></div>
                </div>
              ))}
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {filteredCategories.map((cat, idx) => {
                const Icon = getCategoryIcon(cat.name);
                const colorClass = BG_COLORS[idx % BG_COLORS.length];
                const subs = cat.displaySubs || [];
                const catSlug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const categoryUrl = `/shop-by-category/${catSlug}`;

                return (
                  <div
                    key={cat.id}
                    className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-gray-200/80 hover:border-[#0f7a61]/40 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top Accent Line on hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0f7a61] to-[#14b875] opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div>
                      {/* Top Row: Dual-tone Icon + Subcategory Count Pill */}
                      <div className="flex items-center justify-between mb-4">
                        <Link href={categoryUrl} className="block cursor-pointer">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorClass} group-hover:scale-105 transition-transform duration-300 shadow-2xs`}>
                            <Icon className="w-6 h-6" strokeWidth={1.75} />
                          </div>
                        </Link>
                        <span className="text-[11px] font-bold text-gray-600 bg-gray-100/90 group-hover:bg-[#e6f7ef] group-hover:text-[#0f7a61] px-2.5 py-1 rounded-full transition-colors border border-gray-200/60">
                          {subs.length} {t('megamenu.subcategories', 'subcategories')}
                        </span>
                      </div>

                      {/* Category Title */}
                      <Link href={categoryUrl} className="block mb-4 cursor-pointer">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#0f7a61] transition-colors leading-snug line-clamp-2">
                          {tCategory(cat.name)}
                        </h3>
                      </Link>

                      {/* Interactive Subcategory Chip / Pill Rows */}
                      <div className="space-y-1.5 mb-5">
                        {subs.slice(0, 5).map((sub: any, sIdx: number) => {
                          const subSlug = sub.slug || sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                          return (
                            <Link
                              key={sub.id || sIdx}
                              href={`${categoryUrl}?sub=${subSlug}`}
                              className="text-xs font-medium text-gray-600 bg-gray-50/70 hover:bg-[#e6f7ef] hover:text-[#0f7a61] px-2.5 py-1.5 rounded-lg border border-gray-100/90 hover:border-emerald-200 transition-all flex items-center justify-between group/sub truncate cursor-pointer"
                            >
                              <span className="truncate">{tCategory(sub.name)}</span>
                              <ChevronRight className="w-3 h-3 text-gray-400 group-hover/sub:text-[#0f7a61] group-hover/sub:translate-x-0.5 rtl:group-hover/sub:-translate-x-0.5 transition-all shrink-0 ml-1.5" />
                            </Link>
                          );
                        })}

                        {subs.length > 5 && (
                          <Link
                            href={categoryUrl}
                            className="text-xs font-bold text-[#0f7a61] hover:text-[#0c6651] inline-flex items-center gap-1 pt-1 pl-1 cursor-pointer"
                          >
                            <span>+ {subs.length - 5} more subcategories</span>
                            <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action CTA */}
                    <Link
                      href={categoryUrl}
                      className="text-xs font-extrabold text-[#0f7a61] hover:text-[#0c6651] flex items-center justify-between pt-3.5 border-t border-gray-100 group/link transition-colors cursor-pointer"
                    >
                      <span>Explore Category Inventory</span>
                      <div className="w-6 h-6 rounded-full bg-emerald-50 group-hover/link:bg-[#0f7a61] text-[#0f7a61] group-hover/link:text-white flex items-center justify-center transition-all">
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover/link:translate-x-0.5 rtl:group-hover/link:-translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty Search State */
            <div className="py-16 sm:py-20 bg-white rounded-3xl border border-gray-200/80 text-center max-w-lg mx-auto p-8 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0f7a61] flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">No matching categories found</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                We couldn&apos;t find any categories matching <strong className="text-gray-800">&quot;{searchQuery}&quot;</strong>. Try searching for a broader term like &quot;tools&quot;, &quot;materials&quot;, or &quot;electronics&quot;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="bg-[#0f7a61] hover:bg-[#0c6651] text-white font-bold text-xs px-6 py-3 rounded-full transition-colors cursor-pointer shadow-sm"
              >
                Clear Search &amp; View All Categories
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 4. ENTERPRISE CUSTOM SOURCING CTA */}
      <section className="w-full bg-white border-t border-gray-200/80 py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="bg-gradient-to-br from-[#062c22] via-[#094234] to-[#0c5341] rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#14b875]/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
              <div className="max-w-2xl text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/15 mb-3">
                  <Headphones className="w-3.5 h-3.5" />
                  Custom Sourcing Desk
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  Need Specific Liquidation Lots or Pallets?
                </h3>
                <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed">
                  Our corporate sourcing specialists locate off-market industrial inventory, bulk manufacturer overstock, and manifested return truckloads directly for verified enterprise buyers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  href="/contact?type=sourcing"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#14b875] hover:bg-[#119e64] text-[#051c14] font-extrabold text-sm rounded-xl transition-all shadow-md text-center cursor-pointer"
                >
                  Submit Sourcing Request
                </Link>
                <Link
                  href="/buy/lot"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-xl transition-all text-center cursor-pointer"
                >
                  View Active Lots
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
