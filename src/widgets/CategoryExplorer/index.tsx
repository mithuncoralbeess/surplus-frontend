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

const TOP_SEO_CATEGORIES = [
  { name: 'Electricals & Lighting', slug: 'electricals' },
  { name: 'Industrial Machinery', slug: 'industrial-machinery-pumps' },
  { name: 'Power Tools & Equipment', slug: 'power-tools' },
  { name: 'Hand Tools & Hardware', slug: 'hand-tools' },
  { name: 'PPE & Safety Gear', slug: 'ppe' },
  { name: 'Building Materials', slug: 'building-materials' },
  { name: 'Consumer Electronics', slug: 'consumer-electronics' },
  { name: 'Automotive', slug: 'automotive' },
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
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#051c14] via-[#082d20] to-[#0c402e] text-white py-10 sm:py-14 lg:py-16 border-b border-emerald-900/40">
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
          
          {/* Top Row: Breadcrumbs & Live Liquidation Status Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-emerald-200/80">
              <Link href="/" className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span className="text-white font-semibold">Buy</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#14b875] animate-pulse" />
              <span>Verified B2B Liquidation &amp; Excess Inventory</span>
            </div>
          </div>

          {/* Main Title & Descriptive SEO Copy */}
          <div className="max-w-3xl mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white mb-3.5 leading-[1.2]">
              Buy Surplus Inventory, Wholesale Lots &amp; Liquidation Pallets
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm md:text-base leading-relaxed">
              Source verified enterprise excess stock, industrial machinery, and manifested wholesale liquidation inventory across {totalCategories > 0 ? totalCategories : 'all'} categories at <span className="text-emerald-300 font-semibold">60%–85% below retail MSRP</span>. Every listing features 100% manifest transparency, buyer escrow protection, and regional freight dispatch across the UAE, Saudi Arabia, Qatar, and global markets.
            </p>
          </div>

          {/* SEO Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Link
              href="/buy/lot"
              className="px-5 py-2.5 bg-[#14b875] hover:bg-[#119e64] text-[#051c14] font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Boxes className="w-4 h-4" />
              <span>Explore Wholesale Lots &amp; Pallets</span>
            </Link>
            <Link
              href="/buy/product"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>Browse Individual Surplus</span>
            </Link>
            <Link
              href="/contact?type=sourcing"
              className="px-4 py-2.5 text-emerald-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Custom Lot Sourcing Desk</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>

          {/* Key Value & SEO Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-7">
            <div className="bg-white/[0.06] backdrop-blur-xs border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:bg-white/[0.09] transition-colors">
              <div className="text-xl sm:text-2xl font-black text-emerald-300 mb-0.5">60%–85%</div>
              <div className="text-xs font-bold text-white mb-0.5">Below Retail MSRP</div>
              <div className="text-[11px] text-emerald-200/70 leading-snug">Direct B2B excess liquidation pricing</div>
            </div>

            <div className="bg-white/[0.06] backdrop-blur-xs border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:bg-white/[0.09] transition-colors">
              <div className="text-xl sm:text-2xl font-black text-emerald-300 mb-0.5">100%</div>
              <div className="text-xs font-bold text-white mb-0.5">Manifest Verified</div>
              <div className="text-[11px] text-emerald-200/70 leading-snug">Audited UPCs, counts &amp; serial numbers</div>
            </div>

            <div className="bg-white/[0.06] backdrop-blur-xs border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:bg-white/[0.09] transition-colors">
              <div className="text-xl sm:text-2xl font-black text-emerald-300 mb-0.5">72-Hour</div>
              <div className="text-xs font-bold text-white mb-0.5">Inspection Hold</div>
              <div className="text-[11px] text-emerald-200/70 leading-snug">Buyer funds protected until arrival</div>
            </div>

            <div className="bg-white/[0.06] backdrop-blur-xs border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:bg-white/[0.09] transition-colors">
              <div className="text-xl sm:text-2xl font-black text-emerald-300 mb-0.5">Turnkey</div>
              <div className="text-xs font-bold text-white mb-0.5">GCC &amp; Global Freight</div>
              <div className="text-[11px] text-emerald-200/70 leading-snug">Direct LTL, FTL &amp; export dispatch</div>
            </div>
          </div>

          {/* SEO Crawl Links: Popular Categories */}
          <div className="pt-5 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-emerald-200/80 font-bold mr-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              Popular Categories:
            </span>
            {TOP_SEO_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/buy/${cat.slug}`}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-emerald-400/20 text-emerald-100 hover:text-white border border-white/15 hover:border-emerald-300/40 transition-all font-medium cursor-pointer"
              >
                {cat.name}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 3. CATEGORY EXPLORER GRID SECTION */}
      <section className="w-full bg-[#f8fafc] py-12 lg:py-18 min-h-[600px]">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-gray-200/80">
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

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter categories..."
                  className="w-full pl-9 rtl:pl-4 rtl:pr-9 pr-8 rtl:pr-4 py-2 bg-white text-xs sm:text-sm text-gray-900 placeholder-gray-400 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0f7a61] shadow-2xs transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rtl:right-auto rtl:left-2.5 text-gray-400 hover:text-gray-600 p-0.5 rounded-full cursor-pointer"
                    aria-label="Clear filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap hidden sm:inline">
                <strong>{filteredCategories.length}</strong> categories
              </span>
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
                const categoryUrl = `/buy/${catSlug}`;

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
