import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function SustainabilityProblem() {
  return (
    <section className="w-full py-10 sm:py-14 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50/60 px-3.5 py-1 text-xs font-semibold text-amber-800">
            <AlertCircle className="h-3.5 w-3.5 text-amber-700" />
            <span>Global Challenge</span>
          </div>
          <h2 className="h2 text-slate-900">
            The Problem with Surplus Waste
          </h2>
        </div>

        {/* 2 Big Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto mb-8">
          <div className="rounded-3xl border border-slate-200/90 bg-slate-50/40 p-8 sm:p-10 shadow-2xs hover:bg-white hover:border-slate-300 transition-all space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Volume</span>
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">01</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-mono">
              2.01 Billion Metric Tons
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              of global waste generated each year, with manufacturing and retail as major contributors.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-slate-50/40 p-8 sm:p-10 shadow-2xs hover:bg-white hover:border-slate-300 transition-all space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Projected by 2050</span>
              <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-xs">02</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-amber-800 tracking-tight font-mono">
              3.4 Billion Metric Tons
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              projected global waste by 2050 if no action is taken.
            </p>
          </div>
        </div>

        {/* Narrative Box with Data Source */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs text-center space-y-3">
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            Each year, the manufacturing and retail industries add significantly to the world&apos;s waste, with slow-moving and obsolete stock (SLOB) often ending up in landfills. Surplus Market aims to change this by connecting buyers and sellers in a system that maximizes resource use and minimizes waste, transforming surplus into opportunity.
          </p>
          <div className="pt-1">
            <span className="text-xs text-slate-500 font-medium">
              (Data Source: World Bank)
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
