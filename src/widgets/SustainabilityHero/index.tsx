"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Leaf, 
  ArrowRight,
  Calculator,
  ChevronRight
} from 'lucide-react';

const METRICS = [
  { value: "18,450 MT", label: "Landfill Diverted" },
  { value: "42,800 MT", label: "CO₂e Avoided" },
  { value: "$24.5M+", label: "Capital Recovered" },
  { value: "100%", label: "Direct P2P Logistics" },
];

export default function SustainabilityHero() {
  const scrollToCalculator = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('sustainability-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="w-full bg-white text-gray-900 pt-8 sm:pt-12 pb-12 sm:pb-16 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Subtle Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-semibold">
            Sustainability
          </span>
        </nav>

        {/* Minimal Hero Header */}
        <div className="max-w-3xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0a5c48] text-xs font-semibold tracking-wide">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Circular Economy &amp; Scope 3</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-gray-950 leading-[1.12]">
            Divert industrial surplus. <br />
            <span className="text-[#0a5c48]">Quantify your carbon impact.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl font-normal">
            Surplus connects enterprise sellers directly with qualified buyers across the GCC, turning excess inventory into working capital and audited Scope 3 emissions certificates.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/sell"
              className="px-6 py-3 rounded-full bg-[#0a5c48] hover:bg-[#084838] text-white font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>List Surplus Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/browse"
              className="px-6 py-3 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Browse Lots</span>
            </Link>

            <button
              onClick={scrollToCalculator}
              className="px-4 py-3 text-xs font-semibold text-[#0a5c48] hover:text-[#084838] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Impact</span>
            </button>
          </div>
        </div>

        {/* Minimalist Metrics Strip */}
        <div className="mt-14 sm:mt-16 pt-8 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {METRICS.map((metric, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 font-mono">
                {metric.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
