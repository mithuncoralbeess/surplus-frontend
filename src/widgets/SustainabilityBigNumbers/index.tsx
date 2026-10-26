import React from 'react';
import { TrendingUp, Recycle, BarChart3 } from 'lucide-react';

export default function SustainabilityBigNumbers() {
  return (
    <section className="w-full py-10 sm:py-14 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3.5 py-1 text-xs font-semibold text-[#0a5c48]">
            <TrendingUp className="h-3.5 w-3.5 text-[#0a5c48]" />
            <span>Proven Results</span>
          </div>
          <h2 className="h2 text-slate-900">
            Big Numbers, Big Impact
          </h2>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="rounded-3xl border border-slate-200/90 bg-slate-50/40 p-8 sm:p-10 text-center space-y-3 shadow-2xs hover:bg-white hover:border-slate-300 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/70 text-[#0a5c48] flex items-center justify-center mx-auto mb-2 shadow-2xs">
              <Recycle className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">
              1,000+ tons
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xs mx-auto font-normal">
              of surplus inventory diverted from waste annually through responsible transactions.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-slate-50/40 p-8 sm:p-10 text-center space-y-3 shadow-2xs hover:bg-white hover:border-slate-300 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/70 text-[#0a5c48] flex items-center justify-center mx-auto mb-2 shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">
              50%
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xs mx-auto font-normal">
              average reduction in storage costs for sellers who liquidate excess through our platform.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-slate-50/40 p-8 sm:p-10 text-center space-y-3 shadow-2xs hover:bg-white hover:border-slate-300 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/70 text-[#0a5c48] flex items-center justify-center mx-auto mb-2 shadow-2xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">
              70%
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xs mx-auto font-normal">
              savings for buyers on quality inventory compared to traditional retail channels.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <span className="text-xs text-slate-500 font-medium">
            (Sources: World Bank, Global Waste Report)
          </span>
        </div>

      </div>
    </section>
  );
}
