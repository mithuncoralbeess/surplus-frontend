"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Leaf, 
  TrendingDown, 
  Scale, 
  Droplet, 
  DollarSign, 
  FileCheck2, 
  HelpCircle,
  Building,
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface CategoryPreset {
  id: string;
  name: string;
  co2FactorPerPallet: number; // MT CO2e avoided per pallet
  landfillTonPerPallet: number; // MT waste diverted per pallet
  waterLitersPerPallet: number; // Liters of industrial water conserved
  capitalRecoveryPerPallet: number; // Estimated average $ USD recovered
  description: string;
}

const CATEGORIES: CategoryPreset[] = [
  {
    id: 'it',
    name: 'Enterprise IT & Telecommunications',
    co2FactorPerPallet: 1.28,
    landfillTonPerPallet: 0.45,
    waterLitersPerPallet: 12500,
    capitalRecoveryPerPallet: 4500,
    description: 'High embedded-carbon hardware (servers, networking gears, modules, and electronics)'
  },
  {
    id: 'mro',
    name: 'Industrial Machinery, MRO & Motors',
    co2FactorPerPallet: 1.42,
    landfillTonPerPallet: 0.65,
    waterLitersPerPallet: 8400,
    capitalRecoveryPerPallet: 3800,
    description: 'Heavy industrial components, pumps, bearings, valves, and electrical switchgear'
  },
  {
    id: 'apparel',
    name: 'Commercial Apparel & Finished Goods',
    co2FactorPerPallet: 0.95,
    landfillTonPerPallet: 0.35,
    waterLitersPerPallet: 16200,
    capitalRecoveryPerPallet: 2400,
    description: 'Overstock apparel, footwear, retail consumer packages, and commercial goods'
  },
  {
    id: 'construction',
    name: 'Building Materials, Hardware & Metals',
    co2FactorPerPallet: 1.55,
    landfillTonPerPallet: 0.80,
    waterLitersPerPallet: 6200,
    capitalRecoveryPerPallet: 2900,
    description: 'Architectural surplus, structural metal fittings, fasteners, and MEP inventory'
  }
];

const PRESET_VOLUMES = [10, 25, 50, 100, 250];

export default function SustainabilityCalculator() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('it');
  const [palletCount, setPalletCount] = useState<number>(25);

  const selectedCategory = useMemo(() => {
    return CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0];
  }, [selectedCategoryId]);

  const calculations = useMemo(() => {
    const totalCo2 = (palletCount * selectedCategory.co2FactorPerPallet).toFixed(1);
    const totalLandfillTons = (palletCount * selectedCategory.landfillTonPerPallet).toFixed(1);
    const totalWater = Math.round(palletCount * selectedCategory.waterLitersPerPallet);
    const totalCapital = Math.round(palletCount * selectedCategory.capitalRecoveryPerPallet);
    
    // Concrete human-scale equivalents
    const matureTreesEquivalent = Math.round(Number(totalCo2) * 45); // ~45 trees absorb 1 MT CO2e/yr
    const passengerCarsOffRoad = (Number(totalCo2) / 4.6).toFixed(1); // Avg passenger car emits ~4.6 MT CO2e/yr

    return {
      totalCo2,
      totalLandfillTons,
      totalWater: totalWater.toLocaleString(),
      totalCapital: totalCapital.toLocaleString(),
      matureTreesEquivalent: matureTreesEquivalent.toLocaleString(),
      passengerCarsOffRoad
    };
  }, [palletCount, selectedCategory]);

  return (
    <section 
      id="sustainability-calculator" 
      className="w-full py-16 sm:py-20 lg:py-24 bg-[#f8faf9] border-b border-gray-200/90 scroll-mt-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#0a5c48] text-xs font-black uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Environmental Impact Estimator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Calculate Your Scope 3 Carbon &amp; Landfill Diversion
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            Estimate the verified greenhouse gas (GHG) emissions avoided, landfill tonnage diverted, and capital recovered by liquidating or sourcing through our circular marketplace.
          </p>
        </div>

        {/* Main Calculator Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Inputs (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-8">
            
            {/* Step 1: Asset Category Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between">
                <span>1. Select Asset Inventory Classification</span>
                <span className="text-[#0a5c48] font-semibold text-[11px]">Lifecycle Adjusted</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = cat.id === selectedCategoryId;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#0a5c48] bg-emerald-50/60 ring-2 ring-[#0a5c48]/20 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/70 bg-white'
                      }`}
                    >
                      <div className="font-bold text-gray-900 text-sm leading-snug mb-1">
                        {cat.name}
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Inventory Volume (Pallet Batches) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  2. Select Estimated Pallet Volume
                </label>
                <div className="text-base sm:text-lg font-black text-[#0a5c48] font-mono">
                  {palletCount} {palletCount === 1 ? 'Pallet' : 'Pallets'}
                </div>
              </div>

              {/* Slider Control */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={1}
                  max={300}
                  step={1}
                  value={palletCount}
                  onChange={(e) => setPalletCount(Number(e.target.value))}
                  className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0a5c48]"
                />
                <div className="flex justify-between text-[11px] font-mono text-gray-400">
                  <span>1 Pallet</span>
                  <span>50 (1x FTL)</span>
                  <span>150</span>
                  <span>300+ Pallets</span>
                </div>
              </div>

              {/* Quick Volume Preset Buttons */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-xs text-gray-500 font-medium">Quick Select:</span>
                {PRESET_VOLUMES.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPalletCount(preset)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      palletCount === preset
                        ? 'bg-[#0a5c48] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset} Pallets
                  </button>
                ))}
              </div>
            </div>

            {/* Benchmark Note */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3 text-xs text-gray-500 leading-relaxed">
              <HelpCircle className="w-4 h-4 text-[#0a5c48] shrink-0 mt-0.5" />
              <span>
                Calculations are derived from open industrial lifecycle emission factors (GHG Protocol Scope 3 Category 1 &amp; Category 5) comparing peer-to-peer asset re-use against primary manufacturing extraction and landfilling.
              </span>
            </div>

          </div>

          {/* Right Column: Live Output Metrics (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#06291e] to-[#041a13] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-emerald-800/50 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Projected Environmental Yield
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Circular Impact Summary
                </h3>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              
              {/* Metric 1: CO2 Avoided */}
              <div className="bg-emerald-950/60 border border-emerald-700/40 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-emerald-300 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider">CO₂e Avoided</span>
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {calculations.totalCo2} <span className="text-xs font-semibold text-emerald-400">MT</span>
                  </div>
                  <div className="text-[11px] text-emerald-200/70 mt-1">
                    ≈ {calculations.matureTreesEquivalent} trees planted/yr
                  </div>
                </div>
              </div>

              {/* Metric 2: Waste Diverted */}
              <div className="bg-emerald-950/60 border border-emerald-700/40 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-emerald-300 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Landfill Diverted</span>
                  <Scale className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {calculations.totalLandfillTons} <span className="text-xs font-semibold text-teal-400">MT</span>
                  </div>
                  <div className="text-[11px] text-emerald-200/70 mt-1">
                    Saved from regional tipping
                  </div>
                </div>
              </div>

              {/* Metric 3: Water Saved */}
              <div className="bg-emerald-950/60 border border-emerald-700/40 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-emerald-300 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Water Conserved</span>
                  <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {calculations.totalWater} <span className="text-xs font-semibold text-cyan-400">L</span>
                  </div>
                  <div className="text-[11px] text-emerald-200/70 mt-1">
                    Process water preserved
                  </div>
                </div>
              </div>

              {/* Metric 4: Est Capital Reclaimed */}
              <div className="bg-emerald-950/60 border border-emerald-700/40 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-emerald-300 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Capital Value</span>
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    ${calculations.totalCapital}
                  </div>
                  <div className="text-[11px] text-emerald-200/70 mt-1">
                    Secondary recovered capital
                  </div>
                </div>
              </div>

            </div>

            {/* Audit Certificate Callout Banner */}
            <div className="bg-emerald-900/40 border border-emerald-600/40 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <FileCheck2 className="w-4 h-4 text-[#14b875] shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-100/90 leading-relaxed">
                  <strong className="text-white font-bold">Audit-Ready CSRD &amp; GRI Compliance:</strong> Every completed transaction includes an itemized Certificate of Circular Disposition recording serialized batch weights and verified carbon offset coordinates.
                </div>
              </div>

              <Link
                href="/sell"
                className="w-full py-2.5 px-4 bg-[#14b875] hover:bg-[#109961] text-[#041a13] font-black rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Initiate Inventory Circular Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
