import React from 'react';
import Link from 'next/link';
import { Leaf, ArrowRight } from 'lucide-react';

export default function SustainabilityCTA() {
  return (
    <section className="w-full py-16 sm:py-24 bg-[#0a5c48] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="rounded-3xl border border-emerald-400/30 bg-gradient-to-b from-[#0e745b] to-[#0a5c48] p-8 sm:p-14 text-center shadow-xl space-y-6">
          
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-emerald-200 border border-white/20">
            <Leaf className="h-3.5 w-3.5" />
            <span>Get Involved</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Join Us in Making a Difference
          </h2>

          <p className="mx-auto max-w-2xl text-emerald-100 text-base sm:text-lg leading-relaxed font-normal">
            Every business has the power to make a positive impact. By joining Surplus Market, you're supporting a marketplace that values sustainability, reduces waste, and offers significant savings. Let's turn surplus into success, one transaction at a time.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[#0a5c48] hover:bg-emerald-50 shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
            >
              <span>Join the Sustainable Movement Today</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
