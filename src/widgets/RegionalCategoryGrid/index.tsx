"use client";

import React from 'react';
import Link from 'next/link';

interface RegionalCategory {
  abbr: string;
  name: string;
  count: string;
  slug: string;
}

const REGIONAL_CATEGORIES: RegionalCategory[] = [
  {
    abbr: 'IM',
    name: 'Industrial Machinery & Equipment',
    count: '184 items',
    slug: 'industrial-machinery-equipment',
  },
  {
    abbr: 'EI',
    name: 'Electronics & ICT',
    count: '246 items',
    slug: 'electronics-ict',
  },
  {
    abbr: 'EL',
    name: 'Electrical & Lighting',
    count: '312 items',
    slug: 'electrical-lighting',
  },
  {
    abbr: 'CH',
    name: 'Construction, Hardware & MRO',
    count: '198 items',
    slug: 'construction-hardware-mro',
  },
  {
    abbr: 'OG',
    name: 'Oil & Gas Equipment & MRO',
    count: '95 items',
    slug: 'oil-gas-equipment-mro',
  },
  {
    abbr: 'AF',
    name: 'Apparel, Footwear & Accessories',
    count: '142 items',
    slug: 'apparel-footwear-accessories',
  },
  {
    abbr: 'AU',
    name: 'Automotive',
    count: '87 items',
    slug: 'automotive',
  },
  {
    abbr: 'ML',
    name: 'Medical, Laboratory & Scientific',
    count: '64 items',
    slug: 'medical-laboratory-scientific-equipment',
  },
];

export default function RegionalCategoryGrid() {
  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="mb-5 sm:mb-6">
        <span className="block text-xs font-black tracking-wider text-[#0f7a61] uppercase mb-1.5">
          SHOP BY CATEGORY
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-black !text-black text-black tracking-tight">
            Find surplus stock in your industry
          </h2>
          <Link
            href="/buy"
            className="text-xs sm:text-sm font-bold text-[#0f7a61] hover:text-[#0c6651] inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 group pt-1 sm:pt-0"
          >
            <span>All categories</span>
            <span className="group-hover:translate-x-0.5 transition-transform font-bold">→</span>
          </Link>
        </div>
      </div>

      {/* Categories Grid (2 cols on mobile, 4 cols on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {REGIONAL_CATEGORIES.map((cat) => (
          <Link
            key={cat.abbr}
            href={`/buy/${cat.slug}`}
            className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 p-3.5 sm:p-5 hover:border-[#0f7a61]/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group cursor-pointer min-h-[130px] sm:min-h-[145px]"
          >
            <div>
              <span className="inline-flex items-center justify-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-[#e8f5f1] text-[#0f7a61] font-bold text-[10px] sm:text-xs mb-2 sm:mb-3 group-hover:bg-[#0f7a61] group-hover:text-white transition-colors">
                {cat.abbr}
              </span>
              <h3 className="text-xs sm:text-sm md:text-base font-bold !text-black text-black group-hover:text-[#0f7a61] transition-colors leading-snug line-clamp-2">
                {cat.name}
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-2 sm:mt-3">
              {cat.count}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

