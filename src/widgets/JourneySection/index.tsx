"use client";

import React from 'react';
import {
  Search, ShieldCheck, ClipboardList, BarChart2, Users, Leaf,
  Plus, Camera, Sparkles, Shield, Globe, DollarSign,
  ArrowRight, Package
} from 'lucide-react';
import { motion } from '../../lib/motion';

const BUYER_STEPS = [
  {
    icon: <Search className="w-4 h-4 text-white" />,
    title: "Search inventory",
    desc: "AI-ranked results across 82 markets and 14 currencies."
  },
  {
    icon: <ShieldCheck className="w-4 h-4 text-white" />,
    title: "Review verified listings",
    desc: "Identity, compliance and condition validated before listing."
  },
  {
    icon: <ClipboardList className="w-4 h-4 text-white" />,
    title: "Add to RFQ",
    desc: "Bundle multiple SKUs across sellers into one quote brief."
  },
  {
    icon: <BarChart2 className="w-4 h-4 text-white" />,
    title: "Compare quotes",
    desc: "Side-by-side pricing, lead times and logistics."
  },
  {
    icon: <Users className="w-4 h-4 text-white" />,
    title: "Negotiate",
    desc: "Counter-offer, request samples, lock terms in-platform."
  },
  {
    icon: <Leaf className="w-4 h-4 text-white" />,
    title: "ESG impact summary",
    desc: "Audit-grade CO2e, waste-diverted and circularity report."
  }
];

const SELLER_STEPS = [
  {
    icon: <Plus className="w-4 h-4 text-white" />,
    title: "Upload inventory",
    desc: "Single SKU or thousands - drag, drop, done."
  },
  {
    icon: <Camera className="w-4 h-4 text-white" />,
    title: "Photo, video, Excel or ERP feed",
    desc: "Capture any way that fits your operation."
  },
  {
    icon: <Sparkles className="w-4 h-4 text-white" />,
    title: "AI enrichment",
    desc: "Titles, categories, condition grading and ESG estimates."
  },
  {
    icon: <Shield className="w-4 h-4 text-white" />,
    title: "Verification queue",
    desc: "Compliance and listing review before going live."
  },
  {
    icon: <Globe className="w-4 h-4 text-white" />,
    title: "Listing goes live",
    desc: "Distributed to verified buyers across 82 markets."
  },
  {
    icon: <DollarSign className="w-4 h-4 text-white" />,
    title: "Track recovered value",
    desc: "Real-time enquiries, offers and settlement dashboard."
  }
];

const JourneySection = () => {
  return (
    <section className="w-full bg-white py-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span className="text-[11px] font-bold text-primary tracking-widest uppercase">
              Buyer & Seller
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
            One platform. Two journeys.<br />
            <span className="text-primary">Intelligence at every step.</span>
          </h2>
          <p className="text-gray-600 text-[17px] leading-relaxed">
            Whether you're sourcing verified surplus or recovering value from excess stock - every step is guided and intelligent.
          </p>
        </motion.div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* BUYER JOURNEY */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="rounded-[2.5rem] p-5 md:p-6 flex flex-col relative overflow-hidden border border-[#9ecfb5]"
            style={{ backgroundImage: 'linear-gradient(135deg, #ecfdf5 0%, #fff 55%, #d1fae5 100%)' }}
          >
            {/* Top Bar */}
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/80 backdrop-blur-sm border border-[#c4e8d6] px-3 py-1.5 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Buyer Journey</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#9ecfb5]">
                <Search className="w-5 h-5 text-gray-600" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-0.5">Buyer Journey</h3>
            <p className="text-[13px] text-gray-600 mb-4 font-medium">Search. RFQ. Compare. Close.</p>

            {/* Steps */}
            <div className="flex flex-col gap-1.5 flex-1 mb-5">
              {BUYER_STEPS.map((step, idx) => (
                <div key={idx} className="bg-white/90 backdrop-blur-sm border border-white rounded-2xl py-2 px-3 flex items-start gap-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-0.5">
                  <div className="w-9 h-9 rounded-full bg-[#185545] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-primary tracking-wider uppercase mb-0.5">Step {idx + 1}</div>
                    <div className="font-bold text-gray-900 text-[14px] leading-tight mb-1">{step.title}</div>
                    <div className="text-[13px] text-gray-500 leading-snug">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between mt-auto pt-4">
              <div>
                <div className="text-3xl font-extrabold text-gray-900 leading-none mb-1">82 markets</div>
                <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">AI-Ranked Verified Inventory</div>
              </div>
              <button className="bg-[#185545] hover:bg-[#0f3b2f] text-white px-7 py-3 rounded-full font-bold text-[15px] transition-colors flex items-center gap-2 shadow-md">
                Start Buying <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </motion.div>

          {/* SELLER JOURNEY */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="rounded-[2.5rem] p-5 md:p-6 flex flex-col relative overflow-hidden border border-[#d6efe3]"
            style={{ backgroundImage: 'linear-gradient(135deg, #ecfdf5 0%, #fff 55%, #d1fae5 100%)' }}
          >
            {/* Top Bar */}
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/80 backdrop-blur-sm border border-[#c4e8d6] px-3 py-1.5 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Seller Journey</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#d6efe3]">
                <Package className="w-5 h-5 text-gray-600" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-0.5">Seller Journey</h3>
            <p className="text-[13px] text-gray-600 mb-4 font-medium">Upload. Enrich. Verify. Recover.</p>

            {/* Steps */}
            <div className="flex flex-col gap-1.5 flex-1 mb-5">
              {SELLER_STEPS.map((step, idx) => (
                <div key={idx} className="bg-white/90 backdrop-blur-sm border border-white rounded-2xl py-2 px-3 flex items-start gap-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-0.5">
                  <div className="w-9 h-9 rounded-full bg-[#185545] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-primary tracking-wider uppercase mb-0.5">Step {idx + 1}</div>
                    <div className="font-bold text-gray-900 text-[14px] leading-tight mb-1">{step.title}</div>
                    <div className="text-[13px] text-gray-500 leading-snug">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between mt-auto pt-4">
              <div>
                <div className="text-3xl font-extrabold text-gray-900 leading-none mb-1">$412M</div>
                <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Value Recovered For Sellers</div>
              </div>
              <button className="bg-[#185545] hover:bg-[#0f3b2f] text-white px-7 py-3 rounded-full font-bold text-[15px] transition-colors flex items-center gap-2 shadow-md">
                Start Selling <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default JourneySection;
