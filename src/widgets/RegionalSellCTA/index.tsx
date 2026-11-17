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
    <div className="w-full bg-[#eaf5f0] text-slate-900 rounded-3xl py-8 sm:py-10 md:py-12 lg:py-14 px-6 sm:px-8 md:px-10 lg:px-12 border border-emerald-200/50 shadow-xs my-2">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
        
        {/* Left Column: Badge, Title & Description */}
        <div className="max-w-2xl">
          <span className="inline-block bg-[#7c3aed] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full mb-3">
            NEW
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-black text-[#081a36] tracking-tight leading-tight mb-3">
            Sitting on excess stock in {countryFormatted}?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Turn unsold inventory into cash. List with Surplus Market for faster listings and verified buyers. Not sure of the cost of holding it? Try the Inventory Aging Calculator.
          </p>
        </div>

        {/* Right Column: CTA Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5 shrink-0">
          <Link
            href="/sell"
            className="px-6 py-3.5 bg-[#081a36] hover:bg-[#06142a] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm hover:shadow cursor-pointer text-center whitespace-nowrap"
          >
            Sell Excess Stock
          </Link>
          <Link
            href="/calculator"
            className="px-6 py-3.5 bg-transparent hover:bg-white/60 text-slate-800 border border-slate-700/80 hover:border-slate-800 font-bold text-sm sm:text-base rounded-xl transition-all cursor-pointer text-center whitespace-nowrap"
          >
            Inventory Aging Calculator
          </Link>
        </div>

      </div>
    </div>
  );
}

