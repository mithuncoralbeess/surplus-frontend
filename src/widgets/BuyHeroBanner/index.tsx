"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  ArrowRight, 
  Clock, 
  Truck, 
  FileSpreadsheet, 
  DollarSign, 
  CheckCircle2, 
  Package, 
  Building2,
  ChevronRight
} from 'lucide-react';

const QUICK_TAGS = [
  { label: "All Formats", query: "" },
  { label: "Full Truckloads (FTL)", query: "truckload" },
  { label: "Pallet Lots (LTL)", query: "pallet" },
  { label: "Factory Sealed", query: "sealed" },
  { label: "Enterprise Servers", query: "server" },
  { label: "Power Tools", query: "tools" },
  { label: "Ending Soon", query: "ending" },
];

const PLATFORM_STATS = [
  {
    icon: DollarSign,
    value: "$18.4M+",
    label: "Total Manifested Value",
    subtext: "Cleared via surplus lots"
  },
  {
    icon: TrendingUp,
    value: "76.4%",
    label: "Average Buyer Margin",
    subtext: "Discount vs retail MSRP"
  },
  {
    icon: FileSpreadsheet,
    value: "100%",
    label: "Itemized Manifests",
    subtext: "Line-by-line verified"
  },
  {
    icon: ShieldCheck,
    value: "72-Hour",
    label: "Inspection Escrow",
    subtext: "Protected checkout hold"
  }
];

interface BuyHeroBannerProps {
  onSearchChange?: (query: string) => void;
  activeFilter?: string;
  onFilterSelect?: (tag: string) => void;
}

export default function BuyHeroBanner({ 
  onSearchChange,
  activeFilter = "",
  onFilterSelect 
}: BuyHeroBannerProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (onSearchChange) {
      onSearchChange(query);
    }
    if (query) {
      router.push(`/browse?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/browse');
    }
  };

  const handleTagClick = (tagQuery: string) => {
    setSearchTerm(tagQuery);
    if (onFilterSelect) {
      onFilterSelect(tagQuery);
    }
    if (onSearchChange) {
      onSearchChange(tagQuery);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#062c22] via-[#094234] to-[#0c5341] text-white pt-10 pb-20 md:pt-14 md:pb-24 border-b border-emerald-900/40">
      {/* Background Decorative Ambient Gradients & Subtle Grid */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#14b875]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-emerald-200/80 mb-6">
          <Link href="/" className="hover:text-white transition-colors cursor-pointer">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-white font-semibold">Buy & Sourcing Hub</span>
        </nav>

        {/* Live Status Pill & Header Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#14b875] animate-pulse" />
            <span>LIVE B2B LIQUIDATION HUB</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-emerald-200 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#14b875]" />
            <span>Enterprise Escrow Protected</span>
          </div>

          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-emerald-200 text-xs font-medium">
            <Truck className="w-3.5 h-3.5 text-[#14b875]" />
            <span>Direct Warehouse LTL & FTL Dispatch</span>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.12] mb-5 text-white">
            Source Verified Surplus Lots & Liquidation Pallets <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-[#86efac] to-teal-200">
              at 60%–85% Below Retail MSRP
            </span>
          </h1>

          <p className="text-emerald-100/90 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-3xl mb-8">
            Acquire factory-sealed overstock, commercial returns, and manifested bulk inventories directly from enterprise liquidators, certified distributors, and regional hubs. Complete manifest transparency, zero counterparty risk.
          </p>
        </div>

        {/* High-Impact Sourcing Search & Filter Bar */}
        <div className="bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-3xl shadow-2xl border border-white/30 max-w-4xl mb-6">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <div className="absolute left-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search manifested lots by SKU, model, category, or brand (e.g. Cisco, Bosch, Cat6, Dell)..."
                className="w-full pl-12 pr-4 py-3.5 bg-transparent text-gray-900 placeholder-gray-400 text-sm sm:text-base font-medium focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#0a5c48] hover:bg-[#074737] text-white px-7 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Search Lots</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Sourcing Quick Filters */}
          <div className="pt-3 mt-2 border-t border-gray-100 flex flex-wrap items-center gap-1.5 px-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1">
              Popular Formats:
            </span>
            {QUICK_TAGS.map((tag, idx) => {
              const isSelected = activeFilter === tag.query || (tag.query === "" && activeFilter === "");
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTagClick(tag.query)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0a5c48] text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200/80 text-gray-700'
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Platform Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mt-8">
          {PLATFORM_STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/15 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-200/90 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-400/20 flex items-center justify-center text-emerald-300">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-emerald-200/70 font-medium mt-0.5">
                    {stat.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
