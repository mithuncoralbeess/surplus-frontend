"use client";

import React from 'react';
import Link from 'next/link';

export default function SellRegionalMarkets() {
  const REGIONAL_MARKETS = [
    { country: 'UAE', href: '/uae' },
    { country: 'Qatar', href: '/qatar' },
    { country: 'Saudi Arabia', href: '/saudi-arabia' },
    { country: 'India', href: '/india' },
  ];

  return (
    <section className="w-full bg-[#0b1f17] text-white py-10 sm:py-12 md:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-[28px] font-black text-white tracking-tight">
            Selling across the Gulf and India
          </h2>
          <span className="text-xs sm:text-sm text-emerald-100/75 font-medium">
            Plus a global buyer network
          </span>
        </div>

        {/* 4 Regional Market Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
          {REGIONAL_MARKETS.map((market) => (
            <Link
              key={market.country}
              href={market.href}
              className="bg-[#fbfaf6] hover:bg-white text-slate-900 rounded-2xl p-4 sm:p-5 flex items-center justify-between transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
            >
              <span className="font-bold text-slate-900 text-base sm:text-lg">
                {market.country}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#0f7a61] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore <span className="font-bold">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
