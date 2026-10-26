import React from 'react';
import { Leaf } from 'lucide-react';

export default function SustainabilityWhyMatters() {
  return (
    <section className="w-full py-16 sm:py-24 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-[#0a5c48] border border-emerald-100">
          <Leaf className="h-3.5 w-3.5" />
          <span>Our Values</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950 leading-tight">
          Why Sustainability Matters to Us
        </h2>

        <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal max-w-3xl mx-auto">
          Sustainability is core to our values because it's essential for the future of both business and the environment. The stakes are high: waste from excess inventory contributes to pollution, resource depletion, and climate change. By championing a circular economy, we aim to shift the paradigm from disposable to sustainable.
        </p>
      </div>
    </section>
  );
}
