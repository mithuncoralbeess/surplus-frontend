import React from 'react';
import { Sparkles, ShieldCheck, TrendingUp, Recycle } from 'lucide-react';

export default function SustainabilityMission() {
  return (
    <section className="w-full py-10 sm:py-14 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Minimalist Mission Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-slate-50/40 p-8 sm:p-12 lg:p-14 text-center max-w-5xl mx-auto space-y-8">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-semibold text-[#0a5c48] border border-slate-200 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#0a5c48]" />
              <span>Our Mission</span>
            </div>

            <h2 className="h2 text-slate-900">
              Our Mission for a <span className="text-[#0a5c48]">Sustainable Future</span>
            </h2>
          </div>

          {/* Statement */}
          <div className="max-w-3xl mx-auto">
            <p className="text-base sm:text-xl text-slate-800 leading-relaxed font-normal sm:font-medium">
              At Surplus Market, we believe that sustainability isn't just an option - it's our responsibility. Our mission is to turn excess inventory into opportunity, creating a marketplace that values every asset and ensures nothing is wasted. We are driven to empower businesses to transform surplus into value, while actively reducing environmental impact.
            </p>
          </div>

          {/* Key Principles - Minimalist Horizontal Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-left">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
              <span className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0a5c48] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="h6 text-slate-900">Responsibility First</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Sustainability is our foundational obligation.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
              <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </span>
              <div>
                <h3 className="h6 text-slate-900">Turn Excess into Value</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Transforming surplus inventory into recovered capital.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
              <span className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Recycle className="w-4 h-4" />
              </span>
              <div>
                <h3 className="h6 text-slate-900">Zero-Waste Vision</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Valuing every asset so nothing of utility is wasted.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
