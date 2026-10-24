"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Leaf, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck2, 
  Calculator, 
  Sparkles 
} from 'lucide-react';

export default function SustainabilityCTA() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        <div className="bg-gradient-to-br from-[#041a13] via-[#06291e] to-[#041a13] rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 lg:p-16 text-white text-center relative overflow-hidden shadow-2xl border border-emerald-900/40">
          
          {/* Subtle Ambient Light Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#14b875]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-[#14b875]" />
              <span>Partner for Enterprise Sustainability</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Accelerate Your Circular Transition Today.
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-emerald-100/80 leading-relaxed max-w-2xl font-normal">
              Join leading global enterprises transforming excess assets into verified carbon offsets, working capital recovery, and zero-waste compliance across the GCC and international markets.
            </p>

            {/* Micro Highlights */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-emerald-200/90 font-medium flex-wrap pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Escrow-Guaranteed Settlement</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Scope 3 Audit Certificates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Zero Landfill Disposal</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full pt-4">
              <Link
                href="/sell"
                className="w-full sm:w-auto bg-[#14b875] hover:bg-[#109961] text-[#041a13] px-8 py-3.5 rounded-full font-black text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>List Surplus for Circular Liquidation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/browse"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse Verified Green Lots</span>
              </Link>

              <Link
                href="/inventory-calculator"
                className="w-full sm:w-auto bg-transparent hover:bg-white/5 border border-emerald-500/30 text-emerald-300 px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>Inventory Aging Tool</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
