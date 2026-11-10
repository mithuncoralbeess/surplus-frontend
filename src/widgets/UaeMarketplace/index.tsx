"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Tag, 
  TrendingUp, 
  Boxes, 
  ShieldCheck, 
  Globe,
  ShoppingBag,
  Store
} from 'lucide-react';

import { USER_TYPES, UAE_BENEFITS, UAE_FAQS } from './uaeData';

const BENEFIT_ICONS = [Tag, TrendingUp, Boxes, ShieldCheck, Globe];

export default function UaeMarketplaceWidget() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#f8fafc]">
      
      {/* Hero Header Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#051c14] via-[#082d20] to-[#0c402e] text-white py-12 sm:py-16 md:py-20 border-b border-emerald-900/40">
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#14b875]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-emerald-200/80 mb-5">
            <Link href="/" className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-white font-semibold">UAE</span>
          </nav>

          {/* H1 Title & Intro Paragraph */}
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-5 leading-[1.18]">
              Buy &amp; Sell Excess Inventory in UAE with Surplus Market
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base md:text-lg leading-relaxed mb-8">
              Entering the thriving world of surplus trade in the UAE? Surplus Market connects buyers and sellers through a dynamic, transparent platform built for excess inventory sale in UAE. Our ecosystem simplifies the process for businesses of all sizes, be it offloading unsold stock or sourcing bulk goods at competitive rates. Explore export-grade merchandise, surplus goods, and liquidation deals that meet your needs with fast, reliable, and hassle-free access.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/buy"
                className="px-6 py-3 bg-[#14b875] hover:bg-[#119e64] text-[#051c14] font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy Excess Inventory</span>
              </Link>
              <Link
                href="/sell"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>Sell Excess Stock</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Sections */}
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-12 md:py-16 space-y-12">

        {/* Section 1: Why Surplus Market for UAE? */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
            Why Surplus Market for UAE?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
            Surplus Market is purpose-built to meet the unique trade demands of the UAE. With strong connections to surplus warehouses in UAE, we bring together trusted sellers and serious buyers looking to scale efficiently. Businesses benefit from real-time access to excess inventory in UAE, whether it’s branded apparel, tools, electronics, or industrial items. Our platform removes the guesswork and makes it easy to liquidate excess inventory in UAE with confidence.
          </p>
        </section>

        {/* Section 2: Who Can Use the Surplus Market? */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Who Can Use the Surplus Market?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
            Searching for a surplus shop near me in UAE or looking to sell excess stock in UAE, Surplus Market makes it easy and efficient for all.
          </p>
          <p className="text-sm sm:text-base font-bold text-gray-900 mb-6">
            Our platform is designed for a wide range of users:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {USER_TYPES.map((userType, idx) => (
              <div 
                key={idx}
                className="bg-gray-50/70 rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 transition-all flex items-start gap-3.5 group"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#0f7a61] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-sm text-gray-800 font-medium leading-snug">
                  {userType}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Benefits of Buying Excess Inventory in UAE */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Benefits of Buying Excess Inventory in UAE
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8">
            Buying from a surplus market isn&apos;t just cost-effective, but a strategic move enterprises can make. Stay competitive by sourcing from a trusted discount surplus warehouse ecosystem optimized for the UAE.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {UAE_BENEFITS.map((benefit, idx) => {
              const IconComp = BENEFIT_ICONS[idx % BENEFIT_ICONS.length];
              return (
                <div 
                  key={idx}
                  className="bg-gray-50/70 border border-gray-100 hover:border-emerald-200 rounded-2xl p-6 transition-all hover:bg-white hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${benefit.color} mb-4`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1.5">
                      {benefit.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: FAQ – Excess Inventory Sale in UAE */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
            FAQ – Excess Inventory Sale in UAE
          </h2>

          <div className="space-y-3.5">
            {UAE_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isOpen 
                      ? 'border-[#0f7a61] bg-[#e6f7ef]/20 shadow-2xs' 
                      : 'border-gray-200/80 bg-gray-50/40 hover:border-gray-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-gray-900 pr-4">
                      {faq.q}
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-[#0f7a61] text-white' : 'bg-gray-200/80 text-gray-600'
                    }`}>
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-[#0f7a61]/10 mt-1">
                      <p className="pt-3.5">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Concluding CTA Section */}
        <section className="bg-gradient-to-br from-[#051c14] via-[#082d20] to-[#0c402e] text-white rounded-3xl p-8 sm:p-12 border border-emerald-900/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <p className="text-base sm:text-lg lg:text-xl font-bold text-white leading-relaxed">
              Ready to buy or sell excess inventory in UAE? Join Surplus Market today for faster listings, verified sellers, and smarter surplus sourcing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link 
              href="/register" 
              className="w-full sm:w-auto text-center px-6 py-3.5 bg-[#14b875] hover:bg-[#119e64] text-[#051c14] font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Join Surplus Market</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
            <Link 
              href="/buy" 
              className="w-full sm:w-auto text-center px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              Browse Inventory
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
