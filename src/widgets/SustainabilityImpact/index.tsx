import React from 'react';
import { Recycle, Trash2, Building2 } from 'lucide-react';

export default function SustainabilityImpact() {
  return (
    <section className="w-full py-10 sm:py-14 bg-slate-50/50 border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3.5 py-1 text-xs font-semibold text-[#0a5c48]">
            <Recycle className="h-3.5 w-3.5 text-[#0a5c48]" />
            <span>Measurable Action</span>
          </div>
          <h2 className="h2 text-slate-900">
            Our Impact: Turning Surplus into Sustainable Success
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Together, We Make a Difference. Every transaction on Surplus Market contributes to a larger mission. Buyers and sellers who partner with us are helping reduce waste, cut down on new production, and support a more circular economy.
          </p>
        </div>

        {/* 3 Impact Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Preventing Waste */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-[#0a5c48] flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="h4 text-slate-900">
              Preventing Waste
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              We focus on liquidating slow-moving and obsolete stock (SLOB), reducing the volume of goods that would otherwise end up in landfills or incinerators.
            </p>
          </div>

          {/* Empowering Businesses */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-[#0a5c48] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="h4 text-slate-900">
              Empowering Businesses
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Our marketplace allows companies to reclaim value from unused assets, converting potential losses into revenue.
            </p>
          </div>

          {/* Fostering a Circular Economy */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-[#0a5c48] flex items-center justify-center">
              <Recycle className="w-5 h-5" />
            </div>
            <h3 className="h4 text-slate-900">
              Fostering a Circular Economy
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              We are building a sustainable ecosystem where surplus inventory is repurposed, reused, and reintegrated into the economy.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
