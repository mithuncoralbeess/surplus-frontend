import React from 'react';
import { TrendingUp, Recycle, BarChart3 } from 'lucide-react';

export default function SustainabilityBigNumbers() {
  return (
    <section className="w-full py-16 sm:py-24 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-[#0a5c48] border border-emerald-100">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Proven Results</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950 leading-tight">
            Big Numbers, Big Impact
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="rounded-3xl border border-gray-200 bg-slate-50/60 p-8 text-center space-y-3 hover:border-emerald-200 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0a5c48] ring-1 ring-emerald-600/20 flex items-center justify-center mx-auto mb-2">
              <Recycle className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0a5c48] tracking-tight font-mono">
              1,000+ tons
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xs mx-auto font-normal">
              of surplus inventory diverted from waste annually through responsible transactions.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-slate-50/60 p-8 text-center space-y-3 hover:border-emerald-200 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0a5c48] tracking-tight font-mono">
              50%
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xs mx-auto font-normal">
              average reduction in storage costs for sellers who liquidate excess through our platform.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-slate-50/60 p-8 text-center space-y-3 hover:border-emerald-200 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-600/20 flex items-center justify-center mx-auto mb-2">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0a5c48] tracking-tight font-mono">
              70%
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xs mx-auto font-normal">
              savings for buyers on quality inventory compared to traditional retail channels.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            (Sources: World Bank, Global Waste Report)
          </span>
        </div>

      </div>
    </section>
  );
}
