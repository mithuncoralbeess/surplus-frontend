import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, ArrowRight, Calculator, ChevronRight } from 'lucide-react';

export default function SustainabilityHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#051711] text-white pt-12 pb-20 sm:pt-16 sm:pb-24 border-b border-emerald-950">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#041a13]/92 via-[#041a13]/88 to-[#051711] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,123,95,0.25),transparent_60%)] z-10" />
        <Image
          src="/sustainability-hero.jpg"
          alt="Sustainability at Surplus Market"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-35 mix-blend-luminosity"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-emerald-200/80 mb-6 font-medium">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60" />
          <span className="text-white font-semibold">
            Sustainability
          </span>
        </nav>

        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-950/80 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-emerald-300 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Leaf className="h-3.5 w-3.5 text-emerald-400" />
            <span>Sustainability at Surplus Market</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-white">
            Reducing Waste, Boosting Impact: <br />
            <span className="text-emerald-400">Building a Sustainable Future Together</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            Transform excess inventory into measurable carbon offsets, circular savings, and recovered capital.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/inventory-calculator"
              className="inline-flex items-center gap-2 rounded-full bg-[#107b5f] hover:bg-[#0c664e] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
            >
              <Calculator className="h-4 w-4" />
              <span>Inventory Aging Calculator</span>
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all cursor-pointer hover:border-white/40"
            >
              <span>Explore Surplus Deals</span>
              <ArrowRight className="h-4 w-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
