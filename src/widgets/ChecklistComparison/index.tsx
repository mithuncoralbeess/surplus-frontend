"use client";

import React from 'react';
import Link from 'next/link';
import CommonBanner from '../CommonBanner';
import { 
  FileText, 
  CheckSquare, 
  ArrowRight, 
  Sparkles, 
  Scale, 
  Clock, 
  BookOpen, 
  Boxes,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Tag
} from 'lucide-react';
import { motion } from '../../lib/motion';

const COMPARISON_GUIDES = [
  {
    id: "branded-vs-non-branded-surplus-which-offers-better-value",
    title: "Branded vs Non-Branded Surplus: Which Offers Better Value?",
    desc: "Compare branded and non-branded surplus stock across price, resale demand, quality and margins to decide which delivers better value for your business.",
    href: "/blog/unlocking-value-from-aging-surplus-inventory-in-2026",
    tag: "Value Evaluation",
    badge: "Featured Comparison"
  },
  {
    id: "auction-vs-fixed-price-surplus-buying",
    title: "Auction Lots vs Fixed-Price Surplus: Choosing the Right Purchase Model",
    desc: "Analyze competitive lot bidding vs instant buy-it-now transactions. Determine which procurement model suits your cash flow and inventory turnover goals.",
    href: "/blog/wholesale-liquidation-buyer-guide-bidding-strategies",
    tag: "Buying Strategy",
    badge: "Procurement Guide"
  },
  {
    id: "ltl-vs-ftl-wholesale-shipping-gcc",
    title: "LTL vs FTL Wholesale Shipping: Freight Cost & Transit Time Comparison",
    desc: "Evaluate Less-Than-Truckload (LTL) pallet consolidation versus dedicated Full-Truckload (FTL) dispatch for GCC cross-border surplus shipments.",
    href: "/blog/navigating-gcc-cross-border-freight-logistics-lots",
    tag: "Logistics Breakdown",
    badge: "Freight Comparison"
  }
];

const PREVIEW_CHECKLISTS = [
  {
    title: "New Buyer Procurement Checklist",
    desc: "Essential step-by-step checklist for evaluating manifests, calculating landed costs, verifying lot condition, and inspecting goods.",
    status: "Coming Soon",
    category: "Buyer Guide"
  },
  {
    title: "Seller Overstock Liquidation Checklist",
    desc: "Comprehensive preparation guide covering SKU enrichment, photo standards, VAT documentation, and unlabeling options.",
    status: "Coming Soon",
    category: "Seller Guide"
  },
  {
    title: "GCC Cross-Border Customs Clearance Checklist",
    desc: "Border paperwork checklist covering manifests, origin certificates, Euro-pallet standards, and duty exemption filings.",
    status: "Coming Soon",
    category: "Logistics Guide"
  }
];

export default function ChecklistComparisonWidget() {
  return (
    <div className="w-full flex flex-col items-center bg-gray-50/50">
      
      {/* Banner / Hero Header */}
      <CommonBanner 
        title="Checklist & Comparison"
        subtitle="Detailed checklists and easy-to-understand comparison guides to help you evaluate and simplify your buying and selling process."
        align="center"
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Guides' },
          { label: 'Checklist & Comparison' }
        ]}
      />

      {/* Sub-Header Tagline Bar */}
      <div className="w-full bg-[#0a1e17] py-6 text-white border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider block mb-1">Guides & Decision Tools</span>
            <p className="text-sm text-gray-300 font-medium">Empowering enterprise buyers & sellers with actionable market comparison benchmarks</p>
          </div>
          <Link 
            href="/blog" 
            className="bg-[#0a5c48] hover:bg-[#084838] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Explore Blog Insights
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-16 space-y-16">

        {/* Section 1: Comparison Guides */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0a5c48] uppercase tracking-wider mb-2">
                <Scale className="w-4 h-4" /> Practical Market Analysis
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Comparison Guides
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md">
              Side-by-side breakdowns evaluating price, margins, resale demand, and logistics options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMPARISON_GUIDES.map((guide, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#e0f0e9] text-[#0a5c48] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                      {guide.badge}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">{guide.tag}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 leading-snug mb-3 hover:text-[#0a5c48] transition-colors">
                    {guide.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {guide.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <Link 
                    href={guide.href}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#0a5c48] hover:underline"
                  >
                    View comparison <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 2: Checklists */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full bg-[#e0f0e9] text-[#0a5c48] flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Checklists</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Step-by-step guidance for surplus inventory operations</p>
            </div>
          </div>

          {/* Notice Box */}
          <div className="bg-[#e0f0e9]/50 border border-[#0a5c48]/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0a5c48]" /> Interactive Checklists Coming Soon
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                New buyer and seller checklists are on the way. In the meantime, explore our comparison guides and blog for practical, step-by-step guidance.
              </p>
            </div>
            <Link 
              href="/blog" 
              className="bg-[#0a5c48] text-white hover:bg-[#084838] px-6 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 shadow-md"
            >
              Browse Blog Guides
            </Link>
          </div>

          {/* Preview Checklist Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {PREVIEW_CHECKLISTS.map((chk, idx) => (
              <div 
                key={idx} 
                className="bg-gray-50/80 border border-gray-200 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{chk.category}</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {chk.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-2">{chk.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{chk.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200/60 flex items-center text-xs text-gray-400 font-medium">
                  <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" /> Publishing soon
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-gradient-to-r from-[#0a5c48] to-[#0f3d32] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-green-300 uppercase tracking-widest block mb-2">Surplus Market</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
              Ready to turn surplus into working capital?
            </h2>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
              List your excess inventory or source verified surplus stock - buyers and sellers connect through Surplus Market's B2B marketplace across the GCC and India.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <Link 
              href="/browse" 
              className="w-full sm:w-auto text-center bg-white text-gray-900 hover:bg-gray-100 px-8 py-3.5 rounded-full text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Browse surplus <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/sell" 
              className="w-full sm:w-auto text-center border-2 border-white text-white hover:bg-white/10 px-8 py-3.5 rounded-full text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Sell inventory
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
