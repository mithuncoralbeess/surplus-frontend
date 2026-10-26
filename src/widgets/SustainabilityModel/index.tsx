import React from 'react';
import { ShieldCheck, Package, Truck } from 'lucide-react';

export default function SustainabilityModel() {
  return (
    <section className="w-full py-16 sm:py-24 bg-slate-50/70 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-[#0a5c48] border border-emerald-100">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Operational Model</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950 leading-tight">
            Our Model: Sustainability in Every Transaction
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Direct from Seller to Buyer */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0a5c48] ring-1 ring-emerald-600/20 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 leading-snug">
              Direct from Seller to Buyer
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              Our no-warehouse model ensures that every product is shipped directly from the seller's location to the buyer, reducing additional transport and storage emissions.
            </p>
          </div>

          {/* Verified, Quality-Centric Listings */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0a5c48] ring-1 ring-emerald-600/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 leading-snug">
              Verified, Quality-Centric Listings
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              Only products that pass our rigorous quality checks are listed, ensuring buyers receive quality inventory that aligns with responsible sourcing practices.
            </p>
          </div>

          {/* Logistics Excellence */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0a5c48] ring-1 ring-emerald-600/20 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 leading-snug">
              Logistics Excellence
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              We partner with logistics providers who prioritize eco-friendly practices, ensuring that every delivery minimizes environmental impact.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
