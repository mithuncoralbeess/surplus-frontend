import React from 'react';
import Link from 'next/link';
import { Leaf, ArrowRight, Calculator, ChevronRight } from 'lucide-react';

export default function SustainabilityHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-10 pb-14 sm:pt-14 sm:pb-18 border-b border-slate-100">
      {/* Subtle Minimal Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-50/50 via-slate-50/30 to-transparent pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">
            Sustainability
          </span>
        </nav>

        <div className="max-w-4xl space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/60 px-3.5 py-1 text-xs font-semibold text-[#0a5c48]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <Leaf className="h-3.5 w-3.5 text-[#0a5c48]" />
            <span>Sustainability at Surplus Market</span>
          </div>

          {/* Heading */}
          <h1 className="h1 text-slate-900 tracking-tight">
            Reducing Waste, Boosting Impact: <br />
            <span className="text-[#0a5c48]">Building a Sustainable Future Together</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Transform excess inventory into measurable carbon offsets, circular savings, and recovered capital.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/inventory-calculator"
              className="inline-flex items-center gap-2 rounded-full bg-[#0a5c48] hover:bg-[#084b3b] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5"
            >
              <Calculator className="h-4 w-4" />
              <span>Inventory Aging Calculator</span>
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 px-6 py-3 text-sm font-semibold text-slate-800 transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <span>Explore Surplus Deals</span>
              <ArrowRight className="h-4 w-4 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
