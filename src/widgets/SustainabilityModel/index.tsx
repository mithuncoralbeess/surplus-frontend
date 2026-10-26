import React from 'react';
import { ShieldCheck, Package, Truck } from 'lucide-react';

export default function SustainabilityModel() {
  return (
    <section className="w-full py-10 sm:py-14 bg-slate-50/50 border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3.5 py-1 text-xs font-semibold text-[#0a5c48]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0a5c48]" />
            <span>Operational Model</span>
          </div>
          <h2 className="h2 text-slate-900">
            Our Model: Sustainability in Every Transaction
          </h2>
        </div>

        {/* 3 Model Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Direct from Seller to Buyer */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-[#0a5c48] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="h4 text-slate-900">
              Direct from Seller to Buyer
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Our no-warehouse model ensures that every product is shipped directly from the seller&apos;s location to the buyer, reducing additional transport and storage emissions.
            </p>
          </div>

          {/* Verified, Quality-Centric Listings */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-[#0a5c48] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="h4 text-slate-900">
              Verified, Quality-Centric Listings
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Only products that pass our rigorous quality checks are listed, ensuring buyers receive quality inventory that aligns with responsible sourcing practices.
            </p>
          </div>

          {/* Logistics Excellence */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-[#0a5c48] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="h4 text-slate-900">
              Logistics Excellence
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              We partner with logistics providers who prioritize eco-friendly practices, ensuring that every delivery minimizes environmental impact.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
