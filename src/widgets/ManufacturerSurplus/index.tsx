"use client";

import React from 'react';
import Link from 'next/link';

export default function ManufacturerSurplus() {
  const handleScrollToListing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('listing-options');
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const SURPLUS_TAGS = [
    'Finished goods overruns',
    'Raw materials and components',
    'Spare parts and MRO stock',
    'Packaging and consumables',
    'Idle or unused machinery',
    'End-of-line products',
  ];

  const VALUE_CARDS = [
    {
      id: 'brand',
      title: 'Protect your brand and pricing',
      description: "Identities are never disclosed, so you aren't discounting in front of your own customers.",
    },
    {
      id: 'format',
      title: 'Sell in the format that fits',
      description: 'Individual SKUs, full lots or pallet-level batches.',
    },
    {
      id: 'bulk',
      title: 'Upload in bulk',
      description: 'Use Lot Inventory Listing to load more than 10 SKUs from a spreadsheet.',
    },
    {
      id: 'focus',
      title: 'Keep your team focused',
      description: 'No buyer calls, no price haggling, no chasing payments. We manage that side.',
    },
  ];

  return (
    <section className="w-full bg-white py-14 sm:py-16 md:py-20 border-b border-gray-200/60 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Column: Heading, Description, Pills, Buttons */}
          <div className="lg:col-span-7">
            <h2 className="h2 font-black text-[#0f172a] tracking-tight leading-[1.18] mb-4 sm:mb-5">
              Manufacturers: sell surplus factory inventory without disrupting production
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 sm:mb-7 max-w-2xl">
              Factories end up with surplus for reasons that have nothing to do with quality: production overruns, cancelled or reduced purchase orders, specification changes, discontinued lines, excess raw materials and end-of-season output.
            </p>

            {/* Surplus Tags Pills Grid */}
            <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-8 sm:mb-9">
              {SURPLUS_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 sm:px-3.5 py-1.5 rounded-full bg-[#e8f5e9] text-[#0f7a61] text-xs font-semibold select-none transition-colors hover:bg-[#d8eedb]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5">
              <a
                href="#listing-options"
                onClick={handleScrollToListing}
                className="px-6 py-3.5 bg-[#175c43] hover:bg-[#124935] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-xs text-center inline-flex items-center justify-center cursor-pointer"
              >
                List factory surplus
              </a>
              <Link
                href="/contact"
                className="px-6 py-3.5 bg-white hover:bg-gray-50 text-slate-900 border border-slate-700/80 hover:border-slate-900 font-bold text-sm sm:text-base rounded-xl transition-all shadow-xs text-center inline-flex items-center justify-center cursor-pointer"
              >
                Speak to our team
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Value Cards */}
          <div className="lg:col-span-5 flex flex-col gap-3.5 sm:gap-4">
            {VALUE_CARDS.map((card) => (
              <div
                key={card.id}
                className="bg-[#f8faf8] border border-gray-200/80 rounded-2xl p-5 sm:p-5.5 transition-all hover:bg-white hover:shadow-xs"
              >
                <h3 className="h3 font-bold text-slate-900 text-base sm:text-[17px] mb-1.5 leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
