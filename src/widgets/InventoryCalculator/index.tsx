"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import CommonBanner from '../CommonBanner';
import { 
  Calculator, 
  RotateCcw, 
  ArrowRight, 
  HelpCircle, 
  Sparkles,
  TrendingDown,
  Building2,
  Boxes,
  PieChart
} from 'lucide-react';
import { motion } from '../../lib/motion';

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "AED", symbol: "AED" },
  { code: "SAR", symbol: "SAR" },
  { code: "QAR", symbol: "QAR" },
  { code: "INR", symbol: "₹" }
];

export default function InventoryCalculatorWidget() {
  const [currency, setCurrency] = useState("USD");
  const [valueInput, setValueInput] = useState("");
  const [volumeInput, setVolumeInput] = useState("");
  const [storageCostInput, setStorageCostInput] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [lifetimeInput, setLifetimeInput] = useState("");

  const [results, setResults] = useState<{
    depreciationToDate: number | null;
    storageCostToDate: number | null;
    currentInventoryValue: number | null;
    percentChange: number | null;
    monthlyHoldingCost: number | null;
    inPercentage: number | null;
  }>({
    depreciationToDate: null,
    storageCostToDate: null,
    currentInventoryValue: null,
    percentChange: null,
    monthlyHoldingCost: null,
    inPercentage: null,
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const val = parseFloat(valueInput) || 0;
    const monthlyStorage = parseFloat(storageCostInput) || 0;
    const age = parseFloat(ageInput) || 0;
    const lifetime = parseFloat(lifetimeInput) || 1;

    if (val <= 0 || age <= 0 || lifetime <= 0) {
      return;
    }

    // Footnote Formula:
    // Effective age is taken as half the inventory age
    const effectiveAge = age / 2;
    
    // Depreciation = Value * (effective age / lifetime)
    const depreciationToDate = val * (effectiveAge / lifetime);
    
    // Storage cost = monthly storage * effective age
    const storageCostToDate = monthlyStorage * effectiveAge;
    
    // Current Inventory Value
    const currentInventoryValue = Math.max(0, val - depreciationToDate);
    
    // % Change in Value (Total loss percentage including depreciation)
    const percentChange = val > 0 ? ((val - currentInventoryValue) / val) * 100 : 0;
    
    // Monthly Holding Cost
    const monthlyHoldingCost = monthlyStorage;
    
    // In Percentage (Monthly storage as % of initial value)
    const inPercentage = val > 0 ? (monthlyStorage / val) * 100 : 0;

    setResults({
      depreciationToDate,
      storageCostToDate,
      currentInventoryValue,
      percentChange,
      monthlyHoldingCost,
      inPercentage,
    });
  };

  const handleClear = () => {
    setValueInput("");
    setVolumeInput("");
    setStorageCostInput("");
    setAgeInput("");
    setLifetimeInput("");
    setResults({
      depreciationToDate: null,
      storageCostToDate: null,
      currentInventoryValue: null,
      percentChange: null,
      monthlyHoldingCost: null,
      inPercentage: null,
    });
  };

  const formatCurrency = (val: number | null) => {
    if (val === null) return "-";
    return `${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  };

  const formatPercent = (val: number | null) => {
    if (val === null) return "-";
    return `${val.toFixed(2)}%`;
  };

  return (
    <div className="w-full flex flex-col items-center bg-gray-50/50">
      
      {/* Banner / Hero Header */}
      <CommonBanner 
        title="Inventory Ageing Calculator"
        subtitle="Estimate how much value your surplus stock is losing to depreciation and storage over time - so you know when to liquidate."
        align="center"
        image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Resource' },
          { label: 'Inventory Ageing Calculator' }
        ]}
      />

      <section className="w-full py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl space-y-12">
          
          {/* Main Title Badge */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-extrabold text-[#0a5c48] uppercase tracking-widest bg-[#e0f0e9] px-3 py-1 rounded-full inline-block mb-1">
              FREE TOOL
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Inventory Ageing Calculator
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              Estimate how much value your surplus stock is losing to depreciation and storage over time - so you know when to liquidate.
            </p>
          </div>

          {/* Calculator Grid: Form (Left) & Results (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Card: Input Form */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900">Your inventory</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">Currency</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0a5c48]"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <form onSubmit={handleCalculate} className="space-y-4">
                
                {/* Field 1: Inventory Value */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Inventory Value ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#0a5c48] focus:bg-white transition-colors"
                  />
                </div>

                {/* Field 2: Inventory Volume */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Inventory Volume (CBM)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={volumeInput}
                    onChange={(e) => setVolumeInput(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#0a5c48] focus:bg-white transition-colors"
                  />
                </div>

                {/* Field 3: Total Storage Cost per Month */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Total Storage Cost per Month ({currency}/month)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={storageCostInput}
                    onChange={(e) => setStorageCostInput(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#0a5c48] focus:bg-white transition-colors"
                  />
                </div>

                {/* Field 4 & 5: Inventory Age & Lifetime (2 Columns) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Inventory Age (Months)
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="0"
                      value={ageInput}
                      onChange={(e) => setAgeInput(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#0a5c48] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Inventory Lifetime (Months)
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="0"
                      value={lifetimeInput}
                      onChange={(e) => setLifetimeInput(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#0a5c48] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Buttons: Calculate & Clear */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-[#0a5c48] hover:bg-[#084838] text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md flex-1 text-center"
                  >
                    Calculate
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-bold text-sm transition-colors"
                  >
                    Clear
                  </button>
                </div>

              </form>

            </div>

            {/* Right Card: Results Display */}
            <div className="lg:col-span-6 bg-[#0a1e17] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between min-h-[480px]">
              
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">
                  Results
                </h3>

                <div className="space-y-4 text-sm">
                  
                  {/* Result Item 1 */}
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-gray-300 font-medium">Depreciation to Date</span>
                    <span className="font-bold text-white text-base">
                      {formatCurrency(results.depreciationToDate)}
                    </span>
                  </div>

                  {/* Result Item 2 */}
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-gray-300 font-medium">Storage Cost to Date</span>
                    <span className="font-bold text-white text-base">
                      {formatCurrency(results.storageCostToDate)}
                    </span>
                  </div>

                  {/* Result Item 3 */}
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-gray-300 font-medium">Current Inventory Value</span>
                    <span className="font-bold text-green-400 text-base">
                      {formatCurrency(results.currentInventoryValue)}
                    </span>
                  </div>

                  {/* Result Item 4 */}
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-gray-300 font-medium">% Change in Value</span>
                    <span className="font-bold text-amber-400 text-base">
                      {formatPercent(results.percentChange)}
                    </span>
                  </div>

                  {/* Result Item 5 */}
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-gray-300 font-medium">Monthly Holding Cost</span>
                    <span className="font-bold text-white text-base">
                      {formatCurrency(results.monthlyHoldingCost)}
                    </span>
                  </div>

                  {/* Result Item 6 */}
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-gray-300 font-medium">In Percentage</span>
                    <span className="font-bold text-white text-base">
                      {formatPercent(results.inPercentage)}
                    </span>
                  </div>

                </div>
              </div>

              {/* Footnote Formula */}
              <div className="pt-6 border-t border-white/10 mt-6">
                <p className="text-[11px] text-gray-400 leading-relaxed font-normal">
                  Estimates for guidance only. Effective age is taken as half the inventory age. Depreciation = Value × (effective age / lifetime); storage cost = monthly storage × effective age.
                </p>
              </div>

            </div>

          </div>

          {/* Bottom CTA Banner */}
          <section className="bg-gradient-to-r from-[#0a5c48] to-[#0f3d32] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-green-300 uppercase tracking-widest block mb-2">Turn Idle Stock Into Cash</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
                Is your inventory losing value right now?
              </h2>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
                List your excess inventory before storage and depreciation eat into your gross margins. Connect with verified bulk buyers on Surplus Market.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
              <Link 
                href="/sell" 
                className="w-full sm:w-auto text-center bg-white text-gray-900 hover:bg-gray-100 px-8 py-3.5 rounded-full text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Liquidate Inventory <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

        </div>
      </section>
    </div>
  );
}
