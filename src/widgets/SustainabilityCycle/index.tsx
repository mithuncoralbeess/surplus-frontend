"use client";

import React from 'react';

const STEPS = [
  {
    number: "01",
    title: "Manifest & Verification",
    description: "Sellers upload the inventory manifest. Specs, quantities, condition grades, and MSRPs are verified to ensure transparent lot data."
  },
  {
    number: "02",
    title: "Escrow-Protected Trade",
    description: "Verified institutional buyers place bids. Buyer funds remain securely held in escrow until goods are physically delivered and inspected."
  },
  {
    number: "03",
    title: "Direct Route & ESG Proof",
    description: "Freight moves directly from the seller's dock to the buyer, cutting transit emissions. An itemized Scope 3 ESG certificate is issued upon settlement."
  }
];

export default function SustainabilityCycle() {
  return (
    <section className="w-full py-14 sm:py-20 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Minimal Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0a5c48] mb-2">
            The Circular Mechanism
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
            How surplus inventory stays out of landfills.
          </h2>
        </div>

        {/* 3 Clean Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {STEPS.map((step, idx) => (
            <div key={idx} className="space-y-3 pt-6 border-t border-gray-200">
              <span className="text-sm font-mono font-bold text-[#0a5c48]">
                {step.number}
              </span>
              <h3 className="text-lg font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
