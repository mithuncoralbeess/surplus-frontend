"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SustainabilityCTA() {
  return (
    <section className="w-full py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="rounded-3xl bg-[#0a5c48] p-8 sm:p-14 text-white text-center space-y-6">
          
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Start recovering value from surplus inventory today.
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 max-w-lg mx-auto font-normal">
              List surplus lots for circular liquidation or browse pre-verified wholesale inventory with escrow protection and Scope 3 certificates.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/sell"
              className="px-6 py-3 rounded-full bg-white hover:bg-gray-100 text-[#0a5c48] font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>List Surplus Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/browse"
              className="px-6 py-3 rounded-full bg-[#084838] hover:bg-[#06382b] text-white border border-emerald-600/40 font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Browse Marketplace</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
