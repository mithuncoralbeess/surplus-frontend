import React from 'react';
import { Recycle, Trash2, Building2 } from 'lucide-react';

export default function SustainabilityImpact() {
  return (
    <section className="w-full py-16 sm:py-24 bg-slate-50/70 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-[#0a5c48] border border-emerald-100">
            <Recycle className="h-3.5 w-3.5" />
            <span>Measurable Action</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950 leading-tight">
            Our Impact: Turning Surplus into Sustainable Success
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
            Together, We Make a Difference. Every transaction on Surplus Market contributes to a larger mission. Buyers and sellers who partner with us are helping reduce waste, cut down on new production, and support a more circular economy.
          </p>
        </div>

        {/* 3 Impact Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Preventing Waste */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 leading-snug">
              Preventing Waste
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              We focus on liquidating slow-moving and obsolete stock (SLOB), reducing the volume of goods that would otherwise end up in landfills or incinerators.
            </p>
          </div>

          {/* Empowering Businesses */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 leading-snug">
              Empowering Businesses
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              Our marketplace allows companies to reclaim value from unused assets, converting potential losses into revenue.
            </p>
          </div>

          {/* Fostering a Circular Economy */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0a5c48] ring-1 ring-emerald-600/20 flex items-center justify-center">
              <Recycle className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 leading-snug">
              Fostering a Circular Economy
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              We are building a sustainable ecosystem where surplus inventory is repurposed, reused, and reintegrated into the economy.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
