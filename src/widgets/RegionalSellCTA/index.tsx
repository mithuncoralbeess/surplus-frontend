"use client";

import React from 'react';
import Link from 'next/link';

export interface RegionalSellCTAProps {
  countryName?: string;
  countrySlug?: string;
}

export default function RegionalSellCTA({
  countryName = 'UAE',
}: RegionalSellCTAProps) {
  const countryFormatted = countryName.toLowerCase() === 'uae' ? 'the UAE' : countryName;

  return (
    <div className="w-full bg-[#eaf5f0] text-slate-900 rounded-2xl sm:rounded-3xl py-6 sm:py-10 md:py-12 lg:py-14 px-5 sm:px-8 md:px-10 lg:px-12 border border-emerald-200/50 shadow-xs my-2">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
        
        {/* Left Column: Title & Description */}
        <div className="max-w-2xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-[#081a36] tracking-tight leading-tight mb-2.5 sm:mb-3">
            Sitting on excess stock in {countryFormatted}?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            Turn unsold inventory into cash. List with Surplus Market for faster listings and verified buyers. Not sure of the cost of holding it? Try the Inventory Aging Calculator.
          </p>
        </div>

        {/* Right Column: CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
          <Link
            href="/sell"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#0f7a61] hover:bg-[#0c6651] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm hover:shadow cursor-pointer text-center whitespace-nowrap"
          >
            Sell Excess Stock
          </Link>
          <Link
            href="/calculator"
            className="w-full sm:w-auto px-6 py-3.5 bg-transparent hover:bg-white/60 text-slate-800 border border-slate-700/80 hover:border-slate-800 font-bold text-sm sm:text-base rounded-xl transition-all cursor-pointer text-center whitespace-nowrap"
          >
            Inventory Aging Calculator
          </Link>
        </div>

      </div>
    </div>
  );
}

