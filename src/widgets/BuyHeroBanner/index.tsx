"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  FileSpreadsheet,
  Truck
} from 'lucide-react';

interface BuyHeroBannerProps {
  onSearchChange?: (query: string) => void;
  activeFilter?: string;
  onFilterSelect?: (tag: string) => void;
}

export default function BuyHeroBanner({ 
  onSearchChange,
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
      router.push(`/buy?q=${encodeURIComponent(query)}#liquidation-catalog`);
    } else {
      router.push('/buy#liquidation-catalog');
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#062c22] via-[#094234] to-[#0c5341] text-white py-10 md:py-14 border-b border-emerald-900/40">
      {/* Background Decorative Ambient Gradients & Subtle Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#14b875]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-emerald-200/80 mb-4">
          <Link href="/" className="hover:text-white transition-colors cursor-pointer">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-white font-semibold">Buy & Sourcing Hub</span>
        </nav>

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-[#14b875] animate-pulse" />
          <span>B2B LIQUIDATION & SURPLUS MARKET</span>
        </div>

        {/* Main Title & Condensed Subtitle */}
        <div className="max-w-3xl mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight text-white mb-3">
            Source Verified Surplus Lots & Liquidation Pallets <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-[#86efac] to-teal-200">
              at 60%–85% Below Retail MSRP
            </span>
          </h1>

          <p className="text-emerald-100/80 text-sm sm:text-base font-normal leading-relaxed">
            Acquire manifested bulk lots, factory-sealed overstock, and commercial returns directly with 100% manifest verification and escrow protection.
          </p>
        </div>

        {/* Streamlined Search Bar */}
        <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/20 max-w-2xl mb-6">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search manifested lots by SKU, title, or brand..."
                className="w-full pl-10 pr-3 py-2.5 bg-transparent text-gray-900 placeholder-gray-400 text-xs sm:text-sm font-medium focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-[#0a5c48] hover:bg-[#074737] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              <span>Search Lots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Compact Key Trust Badges Strip (Single Sleek Row) */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-emerald-200/90 font-medium">
          <div className="flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#14b875]" />
            <span>100% Itemized Manifests</span>
          </div>
          <span className="text-white/20 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#14b875]" />
            <span>72-Hour Escrow Inspection</span>
          </div>
          <span className="text-white/20 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#14b875]" />
            <span>Direct LTL & FTL Freight Dispatch</span>
          </div>
        </div>

      </div>
    </section>
  );
}
