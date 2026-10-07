"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  FileCheck, 
  Truck, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Headphones, 
  ArrowRight, 
  CheckCircle2, 
  Building2,
  Sparkles,
  PhoneCall
} from 'lucide-react';

const TRUST_PILLARS = [
  {
    icon: FileCheck,
    title: "100% Itemized Manifest Accuracy",
    desc: "Every pallet lot includes an audited manifest with UPCs, part numbers, and retail MSRP benchmarks. If delivery variance exceeds 2%, our escrow covers the credit discrepancy immediately."
  },
  {
    icon: Lock,
    title: "72-Hour Escrow Inspection Hold",
    desc: "Your funds are securely held in third-party escrow. Payment is only released to the liquidating enterprise after your warehouse inspects and signs off on the delivered shipment."
  },
  {
    icon: ShieldCheck,
    title: "Tamper-Evident Warehouse Seals",
    desc: "Pallets undergo barcode verification and are wrapped with numbered tamper-evident security bands. Pre-loading photographs are archived in your buyer dashboard."
  },
  {
    icon: Truck,
    title: "Turnkey LTL & Freight Coordination",
    desc: "Access negotiated commercial freight rates for liftgate, dock-to-dock, or ocean container freight across the UAE, Qatar, Saudi Arabia, and international ports."
  }
];

const LIQUIDATION_FAQS = [
  {
    q: "How are inventory condition grades determined?",
    a: "Every lot is categorized using standardized B2B liquidation grading: 'Factory Sealed' (original manufacturer packaging intact), 'Overstock / Shelf Pulls' (unused store overstock with minor packaging wear), 'Tested Working' (open-box verified functionality), or 'Customer Returns' (uninspected raw store returns sold at maximum discount)."
  },
  {
    q: "Can I physically inspect lots prior to bidding or purchasing?",
    a: "Yes. For truckloads and high-value equipment lots exceeding $15,000, buyers may schedule an on-site physical inspection at the designated logistics facility in Jebel Ali, Doha, or Riyadh. Alternatively, our certified inspection team can provide a live video walk-through."
  },
  {
    q: "How does the escrow payment protection work?",
    a: "When you purchase or win a lot, your funds are deposited into an enterprise escrow account. The seller is notified to dispatch freight. You have a 72-hour window from arrival to verify the shipment against the manifest before funds are settled."
  },
  {
    q: "Can Surplus Market handle international customs and freight export?",
    a: "Yes. Our logistics network coordinates bill of lading (BOL), export documentation, and customs clearance for overseas container buyers across MENA, Europe, and Asia."
  },
  {
    q: "What documentation do I receive for resale tax exemption?",
    a: "Registered B2B buyers can upload their corporate tax registration or resale certificate during checkout to ensure 0% tax friction where applicable."
  }
];

export default function BuyTrustGuarantee() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#f8fafc] py-16 md:py-24 border-b border-slate-200">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#0a5c48] font-bold text-xs tracking-wider uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#14b875]" />
            <span>BUYER PROTECTION CHARTER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Institutional Trust & Risk-Free B2B Liquidation
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            We eliminate the opacity and counterparty risks historically associated with wholesale liquidation and excess inventory procurement.
          </p>
        </div>

        {/* 4 Trust Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {TRUST_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-start"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0a5c48] flex items-center justify-center border border-emerald-100 mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* FAQ Accordion & VIP Help Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FAQ Accordion (Left 7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-slate-900 font-extrabold text-xl">
              <HelpCircle className="w-5 h-5 text-[#0a5c48]" />
              <span>Frequently Asked Liquidation Questions</span>
            </div>

            <div className="space-y-3">
              {LIQUIDATION_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-slate-200/80 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-slate-50/60 hover:bg-slate-100/60 transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#0a5c48] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* VIP Sourcing Concierge Box (Right 5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#07362b] to-[#041e17] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between h-full border border-emerald-800/40">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
                <Headphones className="w-3.5 h-3.5 text-[#14b875]" />
                <span>DEDICATED BUYER DESK</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3 tracking-tight">
                Looking for Custom Pallet Sourcing or Contract Batches?
              </h3>

              <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed mb-6">
                Our institutional liquidation desk pairs enterprise liquidators and retail chains directly with certified volume resellers. Get notified of private off-market lots before public listing.
              </p>

              <div className="space-y-3 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#14b875] shrink-0" />
                  <span>Custom manifest notifications via WhatsApp / Email</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#14b875] shrink-0" />
                  <span>First access to unlisted full truckload manifests</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#14b875] shrink-0" />
                  <span>Dedicated logistics coordinator for port transfers</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/contact"
                className="w-full bg-[#14b875] hover:bg-[#109e64] text-slate-950 font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Talk to a Liquidation Specialist</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <p className="text-center text-[11px] text-emerald-200/60">
                Direct phone & WhatsApp support available Sunday to Thursday (8 AM - 6 PM GMT+4)
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
