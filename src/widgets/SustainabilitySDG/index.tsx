"use client";

import React from 'react';
import { 
  Globe2, 
  Target, 
  Award, 
  CheckCircle2, 
  ShieldCheck,
  Building,
  Factory
} from 'lucide-react';

interface SDGItem {
  number: string;
  badgeColor: string;
  title: string;
  tagline: string;
  targets: string[];
}

const SDGS: SDGItem[] = [
  {
    number: "SDG 12",
    badgeColor: "bg-amber-600",
    title: "Responsible Consumption & Production",
    tagline: "Promoting reuse, reduction, and circular material flows across B2B commerce.",
    targets: [
      "Target 12.5: Substantially reduce industrial waste generation through direct prevention, reduction, and reuse.",
      "Target 12.7: Promote sustainable procurement practices aligned with national circular policies."
    ]
  },
  {
    number: "SDG 09",
    badgeColor: "bg-orange-600",
    title: "Industry, Innovation & Infrastructure",
    tagline: "Building resilient wholesale supply chain networks and sustainable secondary trading platforms.",
    targets: [
      "Target 9.4: Upgrade infrastructure and retrofit industries to make them sustainable, with increased resource-use efficiency.",
      "Adoption of clean and environmentally sound technologies in surplus asset recovery."
    ]
  },
  {
    number: "SDG 13",
    badgeColor: "bg-emerald-700",
    title: "Climate Action",
    tagline: "Preventing industrial greenhouse gas emissions by conserving primary manufactured assets.",
    targets: [
      "Mitigating Scope 3 upstream and disposal emissions across manufacturing, IT, and retail sectors.",
      "Itemized carbon avoidance reporting for enterprise ESG compliance."
    ]
  },
  {
    number: "SDG 17",
    badgeColor: "bg-blue-800",
    title: "Partnerships for the Goals",
    tagline: "Connecting enterprises, financial institutions, and global freight networks for circular trade.",
    targets: [
      "Cross-border wholesale liquidation channels supporting emerging market access to quality goods.",
      "Multi-stakeholder collaboration for zero-waste industrial standard adoption."
    ]
  }
];

export default function SustainabilitySDG() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0a5c48] text-xs font-black uppercase tracking-wider">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Global &amp; Regional Alignment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Supporting United Nations SDGs &amp; GCC National Visions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            Our operational metrics directly contribute to global climate benchmarks and national environmental diversification roadmaps across the Middle East.
          </p>
        </div>

        {/* 4 SDG Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 sm:mb-16">
          {SDGS.map((sdg, idx) => (
            <div 
              key={idx}
              className="p-6 sm:p-8 rounded-3xl border border-gray-200/90 bg-gray-50/50 hover:bg-white hover:border-[#0a5c48]/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`${sdg.badgeColor} text-white font-mono font-black text-xs px-3 py-1 rounded-full shadow-xs`}>
                    {sdg.number}
                  </span>
                  <Target className="w-4 h-4 text-gray-400" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {sdg.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal mb-5">
                  {sdg.tagline}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200/60 space-y-2.5">
                {sdg.targets.map((tgt, tIdx) => (
                  <div key={tIdx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{tgt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* GCC Regional Framework Cards */}
        <div className="bg-[#041a13] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                GCC National Sustainability Frameworks
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Powering Circular Trade Across the UAE, Saudi Arabia, and Qatar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              
              <div className="bg-emerald-950/60 border border-emerald-800/40 rounded-2xl p-5 space-y-2">
                <div className="font-bold text-emerald-300 text-sm">
                  UAE Net Zero 2050
                </div>
                <p className="text-xs text-emerald-100/70 leading-relaxed">
                  Actively supporting the UAE Circular Economy Policy by diverting commercial inventory from municipal landfills and boosting local wholesale re-use.
                </p>
              </div>

              <div className="bg-emerald-950/60 border border-emerald-800/40 rounded-2xl p-5 space-y-2">
                <div className="font-bold text-emerald-300 text-sm">
                  Saudi Green Initiative &amp; Vision 2030
                </div>
                <p className="text-xs text-emerald-100/70 leading-relaxed">
                  Advancing the Kingdom&apos;s non-oil industrial diversification through transparent, secondary market infrastructure and enterprise asset recovery.
                </p>
              </div>

              <div className="bg-emerald-950/60 border border-emerald-800/40 rounded-2xl p-5 space-y-2">
                <div className="font-bold text-emerald-300 text-sm">
                  Qatar National Vision 2030
                </div>
                <p className="text-xs text-emerald-100/70 leading-relaxed">
                  Fulfilling the Environmental Pillar by promoting responsible industrial consumption, reducing surplus waste, and championing eco-friendly trade.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
