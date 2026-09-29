"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutCTA() {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="bg-gradient-to-r from-[#0a5c48] to-[#0f3d32] text-white rounded-3xl p-8 sm:p-14 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-green-300 uppercase tracking-widest block">Join the Circular Economy</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Partner with Surplus Market Today
            </h2>
            <p className="text-base text-gray-200 leading-relaxed font-normal">
              Whether you are an enterprise clearing warehouse space or a buyer looking for discounted wholesale stock, our team is here to support you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
            <Link 
              href="/partner" 
              className="w-full sm:w-auto text-center bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-full text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Partner with us <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/contact" 
              className="w-full sm:w-auto text-center border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-full text-sm font-bold transition-all shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
