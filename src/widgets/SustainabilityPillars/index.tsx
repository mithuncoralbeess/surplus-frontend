"use client";

import React from 'react';
import { ShieldCheck, Truck, Recycle } from 'lucide-react';

const PILLARS = [
  {
    icon: Recycle,
    title: "Zero Landfill Waste",
    description: "Functional assets are recirculated back into manufacturing, commercial use, or verified wholesale channels instead of being written off to municipal dumps."
  },
  {
    icon: Truck,
    title: "Direct Point-to-Point Freight",
    description: "Goods dispatch directly from seller warehouses to buyer receiving docks. Eliminating intermediate sorting hubs cuts logistics mileage and emissions."
  },
  {
    icon: ShieldCheck,
    title: "Audit-Ready ESG Certificates",
    description: "Both counterparties receive an itemized Certificate of Circular Disposition documenting exact lot weights, product classifications, and avoided Scope 3 emissions."
  }
];

export default function SustainabilityPillars() {
  return (
    <section className="w-full py-14 sm:py-20 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Minimal Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0a5c48] mb-2">
            The Three Commitments
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
            Built for enterprise circularity.
          </h2>
        </div>

        {/* 3 Clean Column Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx} 
                className="p-6 sm:p-8 rounded-2xl border border-gray-200/80 bg-white hover:border-gray-300 transition-colors space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0a5c48] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {pillar.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
