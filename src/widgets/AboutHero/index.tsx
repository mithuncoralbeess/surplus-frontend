"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from '../../lib/motion';

const STATS = [
  { value: "24,800+", label: "Verified transactions" },
  { value: "$412M", label: "Value recovered" },
  { value: "68,400 t", label: "CO₂e avoided" },
  { value: "3", label: "Regional offices" }
];

export default function AboutHero() {
  return (
    <section className="w-full bg-[#0a5c48] text-white py-10 sm:py-14 relative overflow-hidden">
      {/* Background Overlay Texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-[#ffffff]_1px,transparent_1px] [background-size:16px_16px] pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10 space-y-6 sm:space-y-8">
        
        {/* Breadcrumb Header */}
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-white/70 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="text-white">About Us</span>
        </nav>

        {/* Hero Content */}
        <div className="max-w-2xl space-y-2 sm:space-y-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            ABOUT SURPLUS MARKET
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Your trusted B2B liquidation partner.
          </h1>
          <p className="text-sm sm:text-base text-gray-100 font-normal leading-relaxed">
            Transforming idle inventory into circular value for businesses and the planet.
          </p>
        </div>

        {/* Stat Cards Grid (4 in a row) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-3 sm:p-4"
            >
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-0.5">
                {stat.value}
              </div>
              <div className="text-xs text-gray-200 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
