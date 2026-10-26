import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SustainabilityMissionProblem() {
  return (
    <section className="w-full py-16 sm:py-24 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left: Our Mission for a Sustainable Future */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-[#0a5c48] border border-emerald-100">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Our Mission</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950 leading-tight">
              Our Mission for a <br />
              <span className="text-[#0a5c48]">Sustainable Future</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
              At Surplus Market, we believe that sustainability isn't just an option - it's our responsibility. Our mission is to turn excess inventory into opportunity, creating a marketplace that values every asset and ensures nothing is wasted. We are driven to empower businesses to transform surplus into value, while actively reducing environmental impact.
            </p>
          </div>

          {/* Right: The Problem with Surplus Waste */}
          <div className="lg:col-span-6 bg-slate-50/90 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Global Challenge
              </span>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">(Data Source: World Bank)</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 leading-snug">
              The Problem with Surplus Waste
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0a5c48] tracking-tight font-mono">
                  2.01 Billion Metric Tons
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  of global waste generated each year, with manufacturing and retail as major contributors.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2">
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-700 tracking-tight font-mono">
                  3.4 Billion Metric Tons
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  projected global waste by 2050 if no action is taken.
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              Each year, the manufacturing and retail industries add significantly to the world's waste, with slow-moving and obsolete stock (SLOB) often ending up in landfills. Surplus Market aims to change this by connecting buyers and sellers in a system that maximizes resource use and minimizes waste, transforming surplus into opportunity.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
