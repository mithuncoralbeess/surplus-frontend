"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Leaf, 
  ShieldCheck, 
  ChevronRight, 
  Calculator, 
  ArrowRight,
  TrendingDown,
  Recycle,
  Building2,
  Truck
} from 'lucide-react';

interface MetricItem {
  value: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const METRICS: MetricItem[] = [
  {
    value: "18,450+ MT",
    label: "Landfill Waste Diverted",
    sublabel: "Verified industrial surplus redirected into active supply chains",
    icon: Recycle
  },
  {
    value: "42,800+ MT",
    label: "CO₂e Avoided Emissions",
    sublabel: "Lifecycle carbon avoided by eliminating virgin manufacturing",
    icon: TrendingDown
  },
  {
    value: "$24.5M+",
    label: "Capital Recovered",
    sublabel: "Working capital reclaimed by liquidating dormant enterprise stock",
    icon: Building2
  },
  {
    value: "0 Intermediate Hubs",
    label: "Direct P2P Logistics",
    sublabel: "Direct seller-to-buyer dispatch eliminates secondary warehouse miles",
    icon: Truck
  }
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
    <section className="relative w-full bg-[#041a13] text-white pt-12 pb-16 lg:pt-16 lg:pb-20 overflow-hidden border-b border-emerald-900/40">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-[#14b875]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-emerald-200/70 mb-6 font-medium">
          <Link href="/" className="hover:text-emerald-300 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-500/70" />
          <span className="text-white font-semibold">
            Sustainability &amp; Circular Economy
          </span>
        </nav>

        {/* Hero Header Content */}
        <div className="max-w-3xl space-y-5 mb-12 sm:mb-16">
          
          {/* Executive Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <Leaf className="w-3.5 h-3.5 text-[#14b875]" />
            <span>Industrial Circular Economy &amp; ESG Governance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.15] text-white">
            Transforming Enterprise Surplus into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-200">Verified Carbon Avoidance</span> &amp; Recovered Capital.
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/80 leading-relaxed font-normal">
            Surplus Market provides an enterprise-grade closed-loop trade infrastructure for wholesale liquidation. We empower manufacturers, distributors, and procurement teams across the GCC and international markets to eliminate disposal waste, recover balance sheet value, and obtain audited Scope 3 sustainability disclosures.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              onClick={scrollToCalculator}
              className="px-6 py-3.5 rounded-full bg-[#14b875] hover:bg-[#109961] text-[#041a13] font-extrabold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Your Scope 3 ESG Impact</span>
            </button>

            <Link
              href="/browse"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Verified Surplus Lots</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>

        {/* Real-World Audited Impact Metric Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {METRICS.map((metric, idx) => {
            const IconComponent = metric.icon;
            return (
              <div 
                key={idx}
                className="bg-emerald-950/50 backdrop-blur-md rounded-2xl border border-emerald-800/40 p-5 sm:p-6 flex flex-col justify-between hover:border-emerald-600/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-400/90 uppercase tracking-wider">
                    {metric.label}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {metric.value}
                  </div>
                  <p className="text-xs text-emerald-200/70 leading-relaxed font-medium">
                    {metric.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
