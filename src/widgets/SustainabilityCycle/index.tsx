"use client";

import React from 'react';
import { 
  FileSpreadsheet, 
  ShieldCheck, 
  Truck, 
  Recycle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  BarChart3,
  Factory
} from 'lucide-react';

interface CycleStep {
  step: string;
  title: string;
  description: string;
  details: string[];
  icon: React.ElementType;
}

const STEPS: CycleStep[] = [
  {
    step: "Stage 01",
    title: "Manifest Ingestion & Taxonomy Standardization",
    description: "Sellers upload raw warehouse manifests or inventory logs. Our pipeline standardizes technical specifications, validates manufacturer part numbers, and benchmarks retail MSRP against historical liquidation indices.",
    details: [
      "Automated category code harmonization",
      "Condition & spec integrity verification",
      "Removal of non-compliant or hazardous entries"
    ],
    icon: FileSpreadsheet
  },
  {
    step: "Stage 02",
    title: "Direct B2B Market Matching & Escrow Protection",
    description: "Verified institutional buyers discover pallet lots through targeted filters and real-time inventory tools. Offers and bids are formalized with binding escrow deposit holds.",
    details: [
      "Enterprise KYC / AML verified counterparties",
      "Transparent MOQ and volume pallet pricing",
      "Contractual export restriction enforcement"
    ],
    icon: ShieldCheck
  },
  {
    step: "Stage 03",
    title: "Direct Point-to-Point Freight Dispatch",
    description: "Upon escrow confirmation, freight logistics are triggered directly from the vendor's storage dock to the buyer's warehouse. Bypassing middleman hubs slashes transit carbon and packaging waste.",
    details: [
      "Direct LTL/FTL route optimization",
      "Digital Bill of Lading (BOL) tracking",
      "72-hour buyer receipt inspection window"
    ],
    icon: Truck
  },
  {
    step: "Stage 04",
    title: "Circular Re-Deployment & ESG Certificate",
    description: "Assets are successfully re-integrated into production, assembly, or secondary retail distribution. Both parties receive audited Circular Economy documentation for corporate sustainability reports.",
    details: [
      "Serialized landfill diversion certificate",
      "Verified GHG Scope 3 Category 5 metrics",
      "Full capital release to seller upon inspection"
    ],
    icon: Recycle
  }
];

export default function SustainabilityCycle() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-[#f8faf9] border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#0a5c48] text-xs font-black uppercase tracking-wider">
            <Recycle className="w-3.5 h-3.5" />
            <span>Closed-Loop Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            The 4-Stage Industrial Circular Lifecycle
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            A transparent, audit-ready operational loop designed to recover enterprise capital while maximizing environmental material diversion at every mile.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6 sm:p-7 flex flex-col justify-between hover:shadow-md hover:border-[#0a5c48]/50 transition-all relative group"
              >
                <div>
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-black uppercase tracking-wider font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-[#0a5c48]">
                      {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-emerald-50 text-gray-700 group-hover:text-[#0a5c48] flex items-center justify-center transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base leading-snug mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed font-normal mb-5">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2">
                  {item.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 text-[11px] text-gray-700 leading-tight">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
