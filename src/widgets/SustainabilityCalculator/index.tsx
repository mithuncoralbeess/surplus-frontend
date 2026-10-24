"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CategoryPreset {
  id: string;
  name: string;
  co2Factor: number;
  landfillFactor: number;
  capitalFactor: number;
}

const CATEGORIES: CategoryPreset[] = [
  { id: 'it', name: 'IT & Hardware', co2Factor: 1.28, landfillFactor: 0.45, capitalFactor: 4500 },
  { id: 'mro', name: 'Industrial & MRO', co2Factor: 1.42, landfillFactor: 0.65, capitalFactor: 3800 },
  { id: 'goods', name: 'Commercial Goods', co2Factor: 0.95, landfillFactor: 0.35, capitalFactor: 2400 },
  { id: 'materials', name: 'Building & Metals', co2Factor: 1.55, landfillFactor: 0.80, capitalFactor: 2900 },
];

export default function SustainabilityCalculator() {
  const [selectedId, setSelectedId] = useState('it');
  const [pallets, setPallets] = useState(25);

  const activeCategory = useMemo(() => {
    return CATEGORIES.find((c) => c.id === selectedId) || CATEGORIES[0];
  }, [selectedId]);

  const co2Avoided = (pallets * activeCategory.co2Factor).toFixed(1);
  const landfillTons = (pallets * activeCategory.landfillFactor).toFixed(1);
  const capital = Math.round(pallets * activeCategory.capitalFactor).toLocaleString();

  return (
    <section 
      id="sustainability-calculator" 
      className="w-full py-14 sm:py-20 bg-gray-50/70 border-b border-gray-100 scroll-mt-12"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Header */}
        <div className="max-w-xl mb-10">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0a5c48] mb-2">
            Interactive Estimator
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
            Estimate your lot's environmental &amp; economic return.
          </h2>
        </div>

        {/* Minimal Calculator Card */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-10 shadow-xs space-y-8">
          
          {/* Category Chips */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asset Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedId(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedId === cat.id
                      ? 'bg-[#0a5c48] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Volume Slider */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume: Pallet Count
              </label>
              <span className="text-lg font-mono font-bold text-[#0a5c48]">
                {pallets} {pallets === 1 ? 'Pallet' : 'Pallets'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={200}
              step={1}
              value={pallets}
              onChange={(e) => setPallets(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0a5c48]"
            />
            <div className="flex justify-between text-[11px] font-mono text-gray-400">
              <span>1 Pallet</span>
              <span>50 (1 FTL)</span>
              <span>100</span>
              <span>200 Pallets</span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                CO₂e Avoided
              </div>
              <div className="text-3xl font-bold font-mono text-gray-950">
                {co2Avoided} <span className="text-sm font-normal text-gray-500">MT</span>
              </div>
              <p className="text-xs text-gray-500">
                Lifecycle emissions offset
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Landfill Diverted
              </div>
              <div className="text-3xl font-bold font-mono text-gray-950">
                {landfillTons} <span className="text-sm font-normal text-gray-500">MT</span>
              </div>
              <p className="text-xs text-gray-500">
                Direct material recirculation
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recovered Capital
              </div>
              <div className="text-3xl font-bold font-mono text-gray-950">
                ${capital}
              </div>
              <p className="text-xs text-gray-500">
                Estimated balance sheet reclaim
              </p>
            </div>
          </div>

          {/* Footer inside card */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-500">
            <span>
              Calculated using GHG Protocol Scope 3 Category 1 &amp; 5 lifecycle emissions factors.
            </span>
            <Link
              href="/sell"
              className="text-xs font-semibold text-[#0a5c48] hover:text-[#084838] flex items-center gap-1 shrink-0"
            >
              <span>List your lots for circular audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
