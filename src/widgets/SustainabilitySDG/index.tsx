"use client";

import React from 'react';

const FRAMEWORKS = [
  {
    tag: "UN SDG 12",
    title: "Responsible Consumption",
    detail: "Preventing industrial waste via direct asset reuse."
  },
  {
    tag: "UN SDG 13",
    title: "Climate Action",
    detail: "Scope 3 carbon reduction across enterprise supply chains."
  },
  {
    tag: "UAE 2050",
    title: "UAE Net Zero",
    detail: "Supporting the national Circular Economy Policy."
  },
  {
    tag: "KSA 2030",
    title: "Saudi Green Initiative",
    detail: "Diversified industrial sustainability and secondary trade."
  }
];

export default function SustainabilitySDG() {
  return (
    <section className="w-full py-12 sm:py-16 bg-gray-50/50 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Global &amp; Regional Alignment
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Aligned with international climate frameworks
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {FRAMEWORKS.map((fw, idx) => (
            <div 
              key={idx}
              className="p-4 sm:p-5 rounded-xl bg-white border border-gray-200/70 text-left space-y-1.5"
            >
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-100 text-gray-800">
                {fw.tag}
              </span>
              <div className="text-sm font-bold text-gray-900">
                {fw.title}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {fw.detail}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
