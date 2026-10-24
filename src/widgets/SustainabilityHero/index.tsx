"use client";

import React from 'react';
import Image from 'next/image';
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
    <section className="relative w-full overflow-hidden bg-[#0a1e17] text-white pt-8 sm:pt-12 pb-14 sm:pb-20 border-b border-emerald-950">
      {/* Background Banner Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#041a13]/95 via-[#041a13]/85 to-[#041a13]/60 z-10" />
        <Image 
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80" 
          alt="Sustainability & Circular Economy Banner"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-45 mix-blend-luminosity"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-20">
        
        {/* Subtle Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-emerald-200/70 mb-8 font-medium">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60" />
          <span className="text-white font-semibold">
            Sustainability
          </span>
        </nav>

        {/* Hero Header Content */}
        <div className="max-w-3xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Circular Economy &amp; Scope 3</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.12]">
            Divert industrial surplus. <br />
            <span className="text-emerald-400">Quantify your carbon impact.</span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/80 leading-relaxed max-w-2xl font-normal">
            Surplus connects enterprise sellers directly with qualified buyers across the GCC, turning excess inventory into working capital and audited Scope 3 emissions certificates.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/sell"
              className="px-6 py-3 rounded-full bg-[#107b5f] hover:bg-[#0c664e] text-white font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>List Surplus Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/browse"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer backdrop-blur-sm"
            >
              <span>Browse Lots</span>
            </Link>

            <button
              onClick={scrollToCalculator}
              className="px-4 py-3 text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Impact</span>
            </button>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="mt-14 sm:mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {METRICS.map((metric, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 space-y-1">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                {metric.value}
              </div>
              <div className="text-xs sm:text-sm text-emerald-200/80 font-medium">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
