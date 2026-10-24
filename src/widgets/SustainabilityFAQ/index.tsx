"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does Surplus Market calculate and verify Scope 3 greenhouse gas (GHG) avoidance?",
    answer: "Our emission avoidance models follow the GHG Protocol Corporate Value Chain (Scope 3) Standard. We calculate the difference between the full cradle-to-gate embodied carbon of manufacturing virgin replacement goods and the minimal transport emissions required to redeploy existing surplus. When transactions complete, we generate an itemized carbon avoidance summary based on verified product mass and material taxonomy."
  },
  {
    question: "Can our enterprise obtain a Certificate of Circular Disposition for ESG & CSRD reporting?",
    answer: "Yes. For every verified wholesale lot liquidated through Surplus Market, corporate sellers and buyers receive a serialized Certificate of Circular Disposition. This document records the total metric tonnage diverted from landfill, serialized asset tags, counterparty KYC verification, and digital bill of lading confirmation, designed to satisfy external ESG auditors, GRI disclosures, and corporate CSRD filings."
  },
  {
    question: "How does the direct peer-to-peer logistics model reduce environmental impact?",
    answer: "Traditional surplus brokers transport bulk inventory to centralized distribution hubs, where items are unloaded, processed, stored in energy-intensive facilities, and then re-shipped. Surplus Market connects sellers and buyers directly. Freight is routed straight from the vendor's storage dock to the buyer's destination facility, reducing overall transit mileage by up to 64% and eliminating duplicate packaging and interim warehouse electricity consumption."
  },
  {
    question: "What types of inventory qualify for circular economy certification on your platform?",
    answer: "We support overstock batches, discontinued product lines, factory excess, cancelation orders, and shelf-pull inventory across Enterprise IT, Industrial Machinery & MRO, Building Materials, and Commercial Finished Goods. Items must be functional, un-tampered, and accurately represented on an itemized manifest. We strictly prohibit hazardous materials, contaminated industrial waste, or counterfeit products."
  },
  {
    question: "How does escrow protection guarantee compliance and accurate manifest delivery?",
    answer: "All buyer funds are deposited into an enterprise escrow account before freight dispatch. When the shipment arrives at the buyer's facility, the buyer has a standard 72-hour inspection window to audit the delivered batch against the itemized manifest. Funds are only settled to the seller once verified, preventing misrepresentation and ensuring only quality inventory enters the circular economy."
  }
];

export default function SustainabilityFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-[#f8faf9] border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#0a5c48] text-xs font-black uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ESG &amp; Compliance FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Frequently Asked Questions on Enterprise Sustainability
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            Understand how our platform structures verification, emissions reporting, and circular compliance.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/60 transition-colors"
                >
                  <span className="font-bold text-gray-900 text-sm sm:text-base leading-snug">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    isOpen ? 'bg-emerald-100 text-[#0a5c48] rotate-180' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
