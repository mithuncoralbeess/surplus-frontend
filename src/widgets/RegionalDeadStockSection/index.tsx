"use client";

import React from 'react';

export interface RegionalDeadStockSectionProps {
  countryName?: string;
  countrySlug?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}

const REGIONAL_DEFAULTS: Record<string, { eyebrow: string; title: string; description: string }> = {
  uae: {
    eyebrow: 'DEAD STOCK BUYERS UAE',
    title: 'Dead stock buyers in UAE: sell or source in Dubai, Abu Dhabi and Sharjah',
    description:
      'Slow-moving, obsolete or overstocked inventory sitting in your warehouse? List it once on Surplus Market and reach verified dead stock buyers across the UAE. Looking to buy instead? Browse discounted surplus from sellers in your emirate.',
  },
  qatar: {
    eyebrow: 'DEAD STOCK BUYERS QATAR',
    title: 'Dead stock buyers in Qatar: sell or source in Doha, Al Rayyan and Al Wakrah',
    description:
      'Slow-moving, obsolete or overstocked inventory sitting in your warehouse? List it once on Surplus Market and reach verified dead stock buyers across Qatar. Looking to buy instead? Browse discounted surplus from sellers in your municipality.',
  },
  'saudi-arabia': {
    eyebrow: 'DEAD STOCK BUYERS SAUDI ARABIA',
    title: 'Dead stock buyers in Saudi Arabia: sell or source in Riyadh, Jeddah and Dammam',
    description:
      'Slow-moving, obsolete or overstocked inventory sitting in your warehouse? List it once on Surplus Market and reach verified dead stock buyers across Saudi Arabia. Looking to buy instead? Browse discounted surplus from sellers in your province.',
  },
  india: {
    eyebrow: 'DEAD STOCK BUYERS INDIA',
    title: 'Dead stock buyers in India: sell or source in Mumbai, Delhi and Bengaluru',
    description:
      'Slow-moving, obsolete or overstocked inventory sitting in your warehouse? List it once on Surplus Market and reach verified dead stock buyers across India. Looking to buy instead? Browse discounted surplus from sellers in your region.',
  },
};

export default function RegionalDeadStockSection({
  countryName = 'UAE',
  countrySlug = 'uae',
  eyebrow,
  title,
  description,
}: RegionalDeadStockSectionProps) {
  const defaults = REGIONAL_DEFAULTS[countrySlug.toLowerCase()] || REGIONAL_DEFAULTS.uae;

  const displayEyebrow = eyebrow || defaults.eyebrow;
  const displayTitle = title || defaults.title;
  const displayDescription = description || defaults.description;

  return (
    <section className="w-full bg-white rounded-3xl py-12 sm:py-16 md:py-20 px-8 sm:px-12 md:px-16 border border-gray-200/80 shadow-xs my-2">
      <span className="block text-xs sm:text-[14px] font-black tracking-wider text-[#0f7a61] uppercase mb-3">
        {displayEyebrow}
      </span>
      <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-black text-[#0f172a] tracking-tight leading-[1.25] mb-5 max-w-5xl">
        {displayTitle}
      </h2>
      <p className="text-slate-600 text-base sm:text-lg md:text-[18px] leading-relaxed font-normal max-w-5xl">
        {displayDescription}
      </p>
    </section>
  );
}

