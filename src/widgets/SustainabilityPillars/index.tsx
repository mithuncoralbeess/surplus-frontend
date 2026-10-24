"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShoppingCart, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  TrendingDown, 
  FileSpreadsheet, 
  Scale, 
  Clock, 
  Leaf
} from 'lucide-react';

export default function SustainabilityPillars() {
  const [activeTab, setActiveTab] = useState<'sellers' | 'buyers' | 'logistics'>('sellers');

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0a5c48] text-xs font-black uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Dual-Sided Circular Economics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            How Surplus Market Delivers Value to Both Sides of the Circular Loop
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            Circularity only succeeds when it makes financial sense. We align sustainability with corporate profitability across the entire liquidation and procurement chain.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center mb-10">
          <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('sellers')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'sellers'
                  ? 'bg-white text-[#0a5c48] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>For Enterprise Sellers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('buyers')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'buyers'
                  ? 'bg-white text-[#0a5c48] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>For Institutional Buyers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('logistics')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'logistics'
                  ? 'bg-white text-[#0a5c48] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Direct P2P Logistics Model</span>
            </button>
          </div>
        </div>

        {/* Tab 1: For Sellers */}
        {activeTab === 'sellers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between space-y-4 hover:border-[#0a5c48]/50 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0a5c48] flex items-center justify-center font-bold">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Eliminate Disposal &amp; Storage Costs
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  Dormant inventory depreciates by 15%–30% annually while consuming warehouse square footage. We liquidate sealed batches rapidly, replacing landfill tipping fees with liquidity.
                </p>
              </div>
              <ul className="text-xs text-gray-700 space-y-2 pt-2 border-t border-gray-200/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Immediate warehouse space liberation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Zero hazardous or landfill dumping liability</span>
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between space-y-4 hover:border-[#0a5c48]/50 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0a5c48] flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Serialized Chain of Custody
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  Our structured manifests enforce manufacturer part numbers, serial tagging, and condition grading. Your brand equity and proprietary specifications remain protected.
                </p>
              </div>
              <ul className="text-xs text-gray-700 space-y-2 pt-2 border-t border-gray-200/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Escrow-gated buyer qualification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Regional export restriction enforcement</span>
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between space-y-4 hover:border-[#0a5c48]/50 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0a5c48] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Audited ESG Offset Certificates
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  Receive verifiable circular economy documentation certifying the tonnage diverted from municipal landfills, directly supporting corporate CSRD &amp; GRI reporting.
                </p>
              </div>
              <ul className="text-xs text-gray-700 space-y-2 pt-2 border-t border-gray-200/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Recognized GHG Scope 3 Category 5 metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Signed compliance audit manifest</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: For Buyers */}
        {activeTab === 'buyers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between space-y-4 hover:border-[#0a5c48]/50 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0a5c48] flex items-center justify-center font-bold">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Scope 3 Upstream Carbon Reduction
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  Procuring existing surplus equipment eliminates the intense raw material extraction and factory manufacturing footprint associated with commissioning virgin goods.
                </p>
              </div>
              <ul className="text-xs text-gray-700 space-y-2 pt-2 border-t border-gray-200/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Up to 82% lower embedded carbon footprint</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Meets sustainable procurement mandates</span>
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between space-y-4 hover:border-[#0a5c48]/50 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0a5c48] flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  40%–75% Cost Reduction vs Retail MSRP
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  Access enterprise wholesale pallets and container batches at liquidation economics, radically lowering project CAPEX and MRO operating budgets.
                </p>
              </div>
              <ul className="text-xs text-gray-700 space-y-2 pt-2 border-t border-gray-200/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified line-item manifest pricing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Volume pallet pricing with escrow security</span>
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between space-y-4 hover:border-[#0a5c48]/50 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0a5c48] flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Zero Factory Lead Times
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  Bypass global supply chain delays and semiconductor factory queues. Listed inventory is physical, pre-inspected, and staged for 48-hour freight dispatch.
                </p>
              </div>
              <ul className="text-xs text-gray-700 space-y-2 pt-2 border-t border-gray-200/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Immediate dispatch from regional facilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>72-hour freight inspection window</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: For Logistics */}
        {activeTab === 'logistics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between space-y-4 hover:border-[#0a5c48]/50 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0a5c48] flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Direct Point-to-Point Freight
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  Traditional liquidators haul goods to a central sorting hub, repackage, store, and reship. Surplus Market routes freight directly from the seller's facility to the buyer's destination.
                </p>
              </div>
              <ul className="text-xs text-gray-700 space-y-2 pt-2 border-t border-gray-200/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Up to 64% reduction in transport carbon</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Elimination of duplicate loading cycles</span>
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between space-y-4 hover:border-[#0a5c48]/50 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0a5c48] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Zero Intermediate Storage Waste
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  By operating on a lean virtual warehouse framework, we eliminate energy-intensive interim warehouse HVAC, cross-dock lighting, and unnecessary handling packaging.
                </p>
              </div>
              <ul className="text-xs text-gray-700 space-y-2 pt-2 border-t border-gray-200/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Minimal packaging and re-palletizing waste</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Zero intermediate facility electricity load</span>
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between space-y-4 hover:border-[#0a5c48]/50 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0a5c48] flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Full Bill-of-Lading Escrow
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  Funds remain protected in verified escrow until the freight bill of lading (BOL) is executed and the buyer verifies physical delivered goods match the itemized manifest.
                </p>
              </div>
              <ul className="text-xs text-gray-700 space-y-2 pt-2 border-t border-gray-200/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>72-hour manifest verification window</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Full freight dispute resolution protocol</span>
                </li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
