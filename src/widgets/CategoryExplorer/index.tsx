"use client";

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search, ArrowRight, Filter,
  Hammer, Zap, Wrench, PenTool, HardHat, Drill, Lamp, Disc, Laptop, Truck, Box, Cpu, Stethoscope, Layers, Sparkles
} from 'lucide-react';
import { useAppSelector } from '../../store';

const ICON_MAP: Record<string, any> = {
  'building materials': Hammer,
  'electricals': Zap,
  'electricals & lighting': Zap,
  'hand tools': Wrench,
  'hand tools & hardware': Wrench,
  'power tools': Drill,
  'power tools & equipment': Drill,
  'ppe': HardHat,
  'ppe & safety gear': HardHat,
  'automation & controls': Cpu,
  'industrial machinery & pumps': Box,
  'ict, electronics & telecom': Laptop,
  'furniture & office interiors': Lamp,
  'logistics & material handling': Truck,
  'medical & laboratory': Stethoscope,
  'abrasives & paints': Disc,
};

const getCategoryIcon = (name: string) => {
  const normalized = name.toLowerCase().trim();
  return ICON_MAP[normalized] || Layers;
};

// Pastel icon container background colors for visual variety matching reference UI
const BG_COLORS = [
  'bg-blue-50 text-blue-600 border-blue-100',
  'bg-purple-50 text-purple-600 border-purple-100',
  'bg-emerald-50 text-emerald-600 border-emerald-100',
  'bg-amber-50 text-amber-600 border-amber-100',
  'bg-indigo-50 text-indigo-600 border-indigo-100',
  'bg-rose-50 text-rose-600 border-rose-100',
  'bg-teal-50 text-teal-600 border-teal-100',
  'bg-cyan-50 text-cyan-600 border-cyan-100',
];

export default function CategoryExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJumpCategory, setSelectedJumpCategory] = useState<string>('all');
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

  // Filter categories and subcategories dynamically based on search query & selected jump pill
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return categories.filter((cat) => {
      if (selectedJumpCategory !== 'all' && String(cat.id) !== selectedJumpCategory && cat.slug !== selectedJumpCategory) {
        return false;
      }

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
  }, [categories, searchQuery, selectedJumpCategory]);

  const handleJumpTo = (catId: string) => {
    setSelectedJumpCategory(catId);
    if (catId !== 'all' && cardRefs.current[catId]) {
      cardRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="w-full bg-[#f8faf9] py-10 lg:py-16 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1600px]">

        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              Explore All Categories
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              Browse through our complete catalog of {totalCategories > 0 ? totalCategories : 'all'} categories, curated collections, and specialized subcategories.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-[380px] shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4.5 h-4.5 text-[#0f7a61]" />
            </div>
            <input
              type="text"
              placeholder="Search category or subcategory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200/90 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f7a61]/20 focus:border-[#0f7a61] transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Jump To Navigation Bar */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 scrollbar-none">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1 shrink-0 pr-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" /> JUMP TO:
            </span>

            <button
              onClick={() => handleJumpTo('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedJumpCategory === 'all'
                ? 'bg-[#0f7a61] text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200/80 hover:bg-gray-100/80'
                }`}
            >
              All Categories
            </button>

            {categories.map((cat) => {
              const catId = String(cat.id);
              const isActive = selectedJumpCategory === catId || selectedJumpCategory === cat.slug;
              const Icon = getCategoryIcon(cat.name);

              return (
                <button
                  key={cat.id}
                  onClick={() => handleJumpTo(catId)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${isActive
                    ? 'bg-[#0f7a61] text-white border-[#0f7a61] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200/80 hover:border-[#0f7a61]/40 hover:bg-[#e6f7ef]/40 hover:text-[#0f7a61]'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}

        {/* 4-Column Grid of Category Cards */}
        {loading && categories.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse flex flex-col justify-between h-[340px]">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                    <div className="w-16 h-4 bg-gray-100 rounded-full"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded-full w-2/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3.5 bg-gray-100 rounded-full w-4/5"></div>
                    <div className="h-3.5 bg-gray-100 rounded-full w-3/5"></div>
                    <div className="h-3.5 bg-gray-100 rounded-full w-5/6"></div>
                    <div className="h-3.5 bg-gray-100 rounded-full w-2/3"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded-full w-1/2 mt-4 pt-3 border-t border-gray-100"></div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCategories.map((cat, idx) => {
              const catId = String(cat.id);
              const Icon = getCategoryIcon(cat.name);
              const colorClass = BG_COLORS[idx % BG_COLORS.length];
              const subs = cat.displaySubs || [];
              const catSlug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const categoryUrl = `/shop-by-category/${catSlug}`;

              return (
                <div
                  key={cat.id}
                  ref={(el) => { cardRefs.current[catId] = el; }}
                  className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#0f7a61]/30 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Icon + Item Count */}
                    <Link href={categoryUrl} className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorClass} group-hover:scale-105 transition-transform duration-300`}>
                        <Icon className="w-6 h-6" strokeWidth={1.75} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 bg-gray-100/80 px-2.5 py-1 rounded-full group-hover:bg-[#e6f7ef] group-hover:text-[#0f7a61] transition-colors">
                        {subs.length} subcategories
                      </span>
                    </Link>

                    {/* Category Title Link */}
                    <Link href={categoryUrl} className="block mb-3">
                      <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-[#0f7a61] transition-colors truncate">
                        {cat.name}
                      </h3>
                    </Link>

                    {/* Subcategories Vertical List */}
                    <div className="space-y-1.5 mb-4">
                      {subs.slice(0, 7).map((sub: any, sIdx: number) => {
                        const subSlug = sub.slug || sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        return (
                          <Link
                            key={sub.id || sIdx}
                            href={`${categoryUrl}?sub=${subSlug}`}
                            className="text-[13.5px] font-medium text-gray-600 hover:text-[#0f7a61] hover:translate-x-1 transition-all block truncate"
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                      {subs.length > 7 && (
                        <Link href={categoryUrl} className="text-xs font-bold text-[#0f7a61] hover:underline block pt-1">
                          + {subs.length - 7} more subcategories
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Bottom Link Button */}
                  <Link
                    href={categoryUrl}
                    className="text-xs font-extrabold text-[#0f7a61] hover:text-[#0b5c49] flex items-center justify-between pt-3.5 border-t border-gray-100 group/link transition-colors"
                  >
                    <span>Explore All ({subs.length} subcategories)</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-20 bg-white rounded-3xl border border-gray-200 text-center max-w-lg mx-auto p-8 shadow-xs">
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">No matching categories</h3>
            <p className="text-sm text-gray-500 mb-6">
              We couldn't find any category or subcategory matching <span className="font-bold text-gray-800">"{searchQuery}"</span>.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedJumpCategory('all');
              }}
              className="bg-[#0f7a61] text-white font-bold text-xs px-6 py-2.5 rounded-full hover:bg-[#0c6651] transition-colors"
            >
              Reset Search
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
