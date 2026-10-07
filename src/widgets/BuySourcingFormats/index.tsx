"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Boxes, 
  Gavel, 
  Truck, 
  Repeat, 
  Calculator, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  DollarSign, 
  Percent, 
  Sparkles,
  Info
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const SOURCING_CHANNELS = [
  {
    icon: Boxes,
    badge: "Immediate Dispatch",
    title: "Instant Buy-Now Pallets (LTL)",
    desc: "Fixed-price liquidation pallets available for instant checkout. Manifests are 100% itemized and locked with zero bidding delays.",
    specs: ["1 - 6 Pallets per order", "Dispatched in 24-48 hours", "Direct LTL freight quote at checkout"],
    cta: "Browse Buy-Now Lots",
    query: "pallet"
  },
  {
    icon: Gavel,
    badge: "Sealed Bidding",
    title: "High-Value Liquidation Auctions",
    desc: "Compete transparently for large excess batches, seasonal inventory pullbacks, and retail customer return truckloads with fixed close dates.",
    specs: ["Sealed or open bidding", "Low reserve pricing thresholds", "Transparent bidder dashboard"],
    cta: "View Active Auctions",
    query: "auction"
  },
  {
    icon: Truck,
    badge: "Maximum Margin",
    title: "Full Truckload Batches (FTL)",
    desc: "Factory-direct 24-to-26 pallet loads shipped dock-to-dock from enterprise fulfillment centers. Minimize freight cost per unit.",
    specs: ["24 - 26 Pallets (FTL)", "Bulk volume discount tier", "Direct dock appointment loading"],
    cta: "Explore Truckloads",
    query: "truckload"
  },
  {
    icon: Repeat,
    badge: "Contract Supply",
    title: "Recurring Liquidation Programs",
    desc: "Secure contractual access to ongoing salvage, overstock, and store-closure pipelines. Tailored for high-volume regional distributors and refurbishers.",
    specs: ["Scheduled monthly allocations", "Custom category filtering", "Dedicated enterprise account manager"],
    cta: "Request Enterprise Access",
    query: "contract"
  }
];

export default function BuySourcingFormats() {
  const { formatPrice } = useCurrency();

  // Interactive Liquidation Profit Calculator State
  const [lotCost, setLotCost] = useState<number>(12000);
  const [retailMsrp, setRetailMsrp] = useState<number>(48000);
  const [logisticsCost, setLogisticsCost] = useState<number>(1500);

  // Calculations
  const totalCost = lotCost + logisticsCost;
  const grossProfit = Math.max(0, retailMsrp - totalCost);
  const roiPercent = totalCost > 0 ? Math.round((grossProfit / totalCost) * 100) : 0;
  const marginPercent = retailMsrp > 0 ? Math.round((grossProfit / retailMsrp) * 100) : 0;

  return (
    <section className="w-full bg-[#f1f5f9] py-16 md:py-24 border-b border-slate-200/90">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#0a5c48] font-bold text-xs tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#14b875]" />
            <span>FLEXIBLE SOURCING CHANNELS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Enterprises Buy Liquidation on Surplus Market
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Whether you need a single fast-turn pallet or multi-container monthly contracted allocations, choose the procurement model that matches your operational capacity.
          </p>
        </div>

        {/* 4 Formats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {SOURCING_CHANNELS.map((channel, idx) => {
            const Icon = channel.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0a5c48] flex items-center justify-center border border-emerald-100 group-hover:bg-[#0a5c48] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {channel.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#0a5c48] transition-colors">
                    {channel.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
                    {channel.desc}
                  </p>

                  <div className="space-y-2 mb-6 pt-3 border-t border-slate-100">
                    {channel.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/browse?q=${channel.query}`}
                  className="w-full mt-auto py-2.5 px-4 rounded-xl border border-slate-200 hover:border-[#0a5c48] hover:bg-emerald-50 text-[#0a5c48] font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{channel.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Interactive Resale Margin & Profitability Calculator */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0b2820] to-[#041a14] rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-emerald-900/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Explainer & Inputs */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-2">
                  <Calculator className="w-3.5 h-3.5 text-[#14b875]" />
                  <span>INTERACTIVE LIQUIDATION ROI CALCULATOR</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Calculate Your Projected Lot Margin & Cash Yield
                </h3>
                <p className="text-emerald-200/80 text-xs sm:text-sm mt-1 max-w-xl">
                  Adjust the sliders to simulate purchase cost, retail value, and freight to see your estimated return on capital.
                </p>
              </div>

              {/* Sliders Area */}
              <div className="space-y-5 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                {/* Lot Purchase Cost Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-300">Lot Wholesale Purchase Price</span>
                    <span className="text-white font-mono text-sm font-bold bg-white/10 px-2.5 py-0.5 rounded-lg">
                      {formatPrice(lotCost)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={50000}
                    step={1000}
                    value={lotCost}
                    onChange={(e) => setLotCost(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>$2,000</span>
                    <span>$50,000</span>
                  </div>
                </div>

                {/* Retail MSRP Value Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-300">Total Retail MSRP (Manifest Value)</span>
                    <span className="text-emerald-300 font-mono text-sm font-bold bg-white/10 px-2.5 py-0.5 rounded-lg">
                      {formatPrice(retailMsrp)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={150000}
                    step={2500}
                    value={retailMsrp}
                    onChange={(e) => setRetailMsrp(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>$10,000</span>
                    <span>$150,000</span>
                  </div>
                </div>

                {/* Estimated Freight & Handling Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-300">Estimated Freight & Prep Handling</span>
                    <span className="text-slate-200 font-mono text-sm font-bold bg-white/10 px-2.5 py-0.5 rounded-lg">
                      {formatPrice(logisticsCost)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={6000}
                    step={250}
                    value={logisticsCost}
                    onChange={(e) => setLogisticsCost(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>$500</span>
                    <span>$6,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Profit Summary Card */}
            <div className="lg:col-span-5 bg-gradient-to-b from-white/10 to-white/5 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
                  Projected Financial Return
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                  +{formatPrice(grossProfit)}
                </div>

                <div className="space-y-3 pb-6 border-b border-white/10 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Total Invested Capital:</span>
                    <span className="font-bold text-white font-mono">{formatPrice(totalCost)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span>Gross Profit Margin:</span>
                    <span className="font-bold text-emerald-400 font-mono">{marginPercent}%</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span>Return on Investment (ROI):</span>
                    <span className="font-bold text-emerald-300 font-mono">+{roiPercent}% ROI</span>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="pt-5">
                  <div className="text-[11px] font-semibold text-slate-300 mb-2 flex justify-between">
                    <span>Capital Distribution</span>
                    <span className="text-emerald-400 font-mono">{roiPercent}% Multiplier</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex">
                    <div 
                      style={{ width: `${Math.min(100, Math.round((lotCost / retailMsrp) * 100))}%` }} 
                      className="bg-amber-400 h-full"
                      title="Lot Cost"
                    />
                    <div 
                      style={{ width: `${Math.min(100, Math.round((logisticsCost / retailMsrp) * 100))}%` }} 
                      className="bg-blue-400 h-full"
                      title="Freight"
                    />
                    <div 
                      style={{ width: `${Math.max(0, 100 - Math.round((totalCost / retailMsrp) * 100))}%` }} 
                      className="bg-[#14b875] h-full"
                      title="Net Profit"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Lot Cost</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Freight</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#14b875]" /> Net Margin</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/browse"
                  className="w-full bg-[#14b875] hover:bg-[#119e64] text-slate-950 font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer active:scale-[0.98]"
                >
                  <span>Source High-Yield Lots Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
