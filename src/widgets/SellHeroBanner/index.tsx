"use client";

import React from 'react';
import Link from 'next/link';

export default function SellHeroBanner() {
  const handleScrollToListing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('listing-options');
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full bg-[#fbfaf6] text-slate-900 py-10 sm:py-14 md:py-16 lg:py-20 border-b border-gray-200/60 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Breadcrumb, H1 Title, Paragraph, Action Buttons */}
          <div className="lg:col-span-7">
            {/* Breadcrumb: Home › Sell */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3 sm:mb-5">
              <Link href="/" className="hover:text-slate-900 transition-colors">
                Home
              </Link>
              <span className="text-slate-400">›</span>
              <span className="text-slate-700 font-semibold">Sell</span>
            </nav>

            {/* H1 Title */}
            <h1 className="h1 font-black text-gray-900 tracking-tight leading-[1.15] mb-4 sm:mb-5">
              Sell surplus stock to <br />
              verified B2B buyers
            </h1>

            {/* Description Paragraph */}
            <p className="text-slate-600 text-sm sm:text-base md:text-[17px] leading-relaxed mb-6 sm:mb-8 max-w-xl">
              Turn surplus stock into recovered value. You never deal with buyers: we verify, negotiate, collect payment and deliver from our global buyer network. No upfront fees.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5">
              <a
                href="#listing-options"
                onClick={handleScrollToListing}
                className="px-6 py-3.5 bg-[#175c43] hover:bg-[#124935] text-white font-bold text-sm sm:text-base rounded-lg transition-all shadow-xs text-center inline-flex items-center justify-center cursor-pointer"
              >
                Sell Inventory
              </a>
              <Link
                href="/inventory-calculator"
                className="px-6 py-3.5 bg-white hover:bg-gray-50 text-slate-900 border border-slate-700/80 hover:border-slate-900 font-bold text-sm sm:text-base rounded-lg transition-all shadow-xs text-center inline-flex items-center justify-center cursor-pointer"
              >
                Calculate aging stock cost
              </Link>
            </div>
          </div>

          {/* Right Column: Hero image (Warehouse with palletised stock) */}
          <div className="lg:col-span-5 w-full">
            <div className="relative w-full aspect-[4/3] sm:aspect-[1.15/1] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#e2e8e3] border border-gray-200/80 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
                alt="Warehouse with palletised stock"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
