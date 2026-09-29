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
    <section className="w-full bg-[#0a5c48] text-white py-16 lg:py-24 relative overflow-hidden">
      {/* Background Overlay Texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-[#ffffff]_1px,transparent_1px] [background-size:16px_16px] pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10 space-y-12">
        
        {/* Breadcrumb Header */}
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-white/70 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="text-white">About Us</span>
        </nav>

        {/* Hero Content */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            ABOUT SURPLUS MARKET
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
            Your trusted B2B liquidation partner.
          </h1>
          <p className="text-lg sm:text-xl text-gray-100 font-normal leading-relaxed pt-2">
            Rooted in Qatar, built for the world - we transform idle inventory into circular value for enterprises, SMEs, and the planet.
          </p>
        </div>

        {/* Stat Cards Grid (4 in a row) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6">
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-200 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
