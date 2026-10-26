import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, ArrowRight, Calculator, ChevronRight } from 'lucide-react';

export default function SustainabilityHero() {
  return (
    <section className="relative w-full overflow-hidden min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-center pt-24 pb-14 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24 border-b border-slate-200/90">
      {/* Background Banner Image with Lightweight, Subtle Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/sustainability-banner.jpg"
          alt="Sustainable circular economy warehouse and green logistics at Surplus Market"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft, light gradient overlay - keeps image bright and clearly visible while ensuring text contrast on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/35 sm:to-white/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40 pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-600 mb-6 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">
            Sustainability
          </span>
        </nav>

        <div className="max-w-3xl space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/90 backdrop-blur-sm px-3.5 py-1 text-xs font-semibold text-[#0a5c48] shadow-2xs">
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
          <p className="max-w-2xl text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
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
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-slate-400 px-6 py-3 text-sm font-semibold text-slate-800 transition-all cursor-pointer hover:-translate-y-0.5 shadow-2xs"
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
