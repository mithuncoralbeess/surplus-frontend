import React from 'react';
import Link from 'next/link';
import { Leaf, ArrowRight } from 'lucide-react';

export default function SustainabilityCTA() {
  return (
    <section className="w-full py-10 sm:py-14 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="relative rounded-3xl bg-[#0a5c48] border border-emerald-800 p-8 sm:p-12 lg:p-14 text-center text-white shadow-2xs overflow-hidden space-y-5">
          
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-950/40 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-emerald-200 border border-white/20">
              <Leaf className="h-3.5 w-3.5" />
              <span>Get Involved</span>
            </div>

            <h2 className="h2 text-white max-w-3xl mx-auto">
              Join Us in Making a Difference
            </h2>

            <p className="mx-auto max-w-2xl text-emerald-100/90 text-base sm:text-lg leading-relaxed font-normal">
              Every business has the power to make a positive impact. By joining Surplus Market, you're supporting a marketplace that values sustainability, reduces waste, and offers significant savings. Let's turn surplus into success, one transaction at a time.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0a5c48] hover:bg-emerald-50 shadow-xs transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <span>Join the Sustainable Movement Today</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
