import React from 'react';
import { Leaf } from 'lucide-react';

export default function SustainabilityWhyMatters() {
  return (
    <section className="w-full py-10 sm:py-14 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="rounded-3xl border border-slate-200/90 bg-slate-50/40 p-8 sm:p-12 text-center space-y-4 max-w-4xl mx-auto shadow-2xs">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white px-3.5 py-1 text-xs font-semibold text-[#0a5c48] shadow-2xs">
            <Leaf className="h-3.5 w-3.5 text-[#0a5c48]" />
            <span>Our Values</span>
          </div>

          <h2 className="h2 text-slate-900">
            Why Sustainability Matters to Us
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal max-w-3xl mx-auto">
            Sustainability is core to our values because it&apos;s essential for the future of both business and the environment. The stakes are high: waste from excess inventory contributes to pollution, resource depletion, and climate change. By championing a circular economy, we aim to shift the paradigm from disposable to sustainable.
          </p>
        </div>
      </div>
    </section>
  );
}
