"use client";

import React from 'react';
import Link from 'next/link';

export interface RegionalBuyRequestBannerProps {
  countryName?: string;
  countrySlug?: string;
}

export default function RegionalBuyRequestBanner({
  countryName = 'UAE',
}: RegionalBuyRequestBannerProps) {
  const handleScrollToQuote = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('quote-form');
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus the input if available
      const input = el.querySelector('input');
      if (input) {
        setTimeout(() => input.focus(), 400);
      }
    }
  };

  return (
    <div className="w-full bg-[#081a36] text-white rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
        
        {/* Left Column: Badge, Title & Description */}
        <div className="max-w-2xl">
          <span className="inline-block bg-[#7c3aed] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full mb-3">
            NEW
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-black text-white tracking-tight leading-tight mb-3">
            Can&apos;t find what you need? Let sellers come to you.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Post a buy request with your quantity and target price. Verified {countryName} and international sellers reply with offers.
          </p>
        </div>

        {/* Right Column: CTA Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5 shrink-0">
          <a
            href="#quote-form"
            onClick={handleScrollToQuote}
            className="px-6 py-3.5 bg-[#0f7a61] hover:bg-[#0c6651] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm hover:shadow cursor-pointer text-center whitespace-nowrap"
          >
            Post a Buy Request
          </a>
          <Link
            href="/browse"
            className="px-6 py-3.5 bg-transparent hover:bg-white/5 text-white border border-slate-700 hover:border-slate-500 font-bold text-sm sm:text-base rounded-xl transition-all cursor-pointer text-center whitespace-nowrap"
          >
            Browse Inventory
          </Link>
        </div>

      </div>
    </div>
  );
}

