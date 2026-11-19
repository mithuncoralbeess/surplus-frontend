"use client";

import React from 'react';
import Link from 'next/link';

export default function SellValueProps() {
  const handleScrollToListing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('listing-options');
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="w-full bg-[#155e43] text-white py-14 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 max-w-3xl">
          <span className="block text-xs font-bold text-white/80 tracking-widest uppercase mb-2.5 sm:mb-3">
            THE SELLER JOURNEY
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] mb-4 sm:mb-5">
            List. We handle the rest. Get paid.
          </h2>
          <p className="text-sm sm:text-base md:text-[17px] text-white/85 leading-relaxed max-w-2xl">
            No long forms upfront. AI drafts your listing, and our team verifies every one before it goes live.
          </p>
        </div>

        {/* 3 Step Cards Layout */}
        <div className="space-y-5 sm:space-y-6">
          {/* Row 1: Steps 1 & 2 (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Step 1: List */}
            <div className="bg-white/[0.08] border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:bg-white/[0.11] transition-colors">
              <div>
                <div className="w-9 h-9 rounded-full bg-white text-[#155e43] font-bold text-sm sm:text-base flex items-center justify-center shrink-0 mb-4 sm:mb-5 shadow-xs select-none">
                  1
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-2.5 tracking-tight">
                  List
                </h3>
                <p className="text-white/85 text-sm sm:text-[15px] leading-relaxed">
                  Open a form, add your items or drop a spreadsheet. AI drafts the title, category, condition and specs for you to review.
                </p>
              </div>
            </div>

            {/* Step 2: We verify & find buyers */}
            <div className="bg-white/[0.08] border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:bg-white/[0.11] transition-colors">
              <div>
                <div className="w-9 h-9 rounded-full bg-white text-[#155e43] font-bold text-sm sm:text-base flex items-center justify-center shrink-0 mb-4 sm:mb-5 shadow-xs select-none">
                  2
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-2.5 tracking-tight">
                  We verify &amp; find buyers
                </h3>
                <p className="text-white/85 text-sm sm:text-[15px] leading-relaxed">
                  Our team verifies your listing, then negotiates with buyers from our global network. You never deal with them.
                </p>
              </div>
            </div>

          </div>

          {/* Row 2: Step 3: Get paid (Full Width) */}
          <div className="bg-white/[0.08] border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-white/[0.11] transition-colors">
            <div className="w-9 h-9 rounded-full bg-white text-[#155e43] font-bold text-sm sm:text-base flex items-center justify-center shrink-0 mb-4 sm:mb-5 shadow-xs select-none">
              3
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-2.5 tracking-tight">
              Get paid
            </h3>
            <p className="text-white/85 text-sm sm:text-[15px] leading-relaxed max-w-3xl">
              We collect payment and coordinate delivery. Track offers and payouts in your seller dashboard.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 sm:mt-10">
          <a
            href="#listing-options"
            onClick={handleScrollToListing}
            className="px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm hover:shadow inline-flex items-center justify-center cursor-pointer"
          >
            Start your first listing
          </a>
        </div>

      </div>
    </section>
  );
}
