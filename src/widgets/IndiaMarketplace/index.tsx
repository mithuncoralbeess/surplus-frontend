"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Store, 
  ShieldCheck, 
  Building2, 
  Boxes, 
  Globe, 
  Tag, 
  Sparkles, 
  TrendingUp, 
  Coins, 
  PackageCheck, 
  Factory 
} from 'lucide-react';
import { 
  INDIA_TRUST_POINTS, 
  INDIA_BUY_POINTS, 
  INDIA_SELL_POINTS, 
  INDIA_PARTICIPANTS, 
  INDIA_FAQS 
} from './indiaData';
import RegionalHeroBanner from '../RegionalHeroBanner';
import RegionalTrustBar from '../RegionalTrustBar';
import RegionalCategoryGrid from '../RegionalCategoryGrid';
import CuratedProducts from '../CuratedProducts';
import RegionalBuyRequestBanner from '../RegionalBuyRequestBanner';
import PalletDeals from '../PalletDeals';
import RegionalSellCTA from '../RegionalSellCTA';
import RegionalDeadStockSection from '../RegionalDeadStockSection';

const TRUST_ICONS = [ShieldCheck, Building2, Boxes, Globe];
const BUY_ICONS = [Tag, Sparkles, Boxes, Globe];
const SELL_ICONS = [TrendingUp, PackageCheck, CheckCircle2, Coins];
const PARTICIPANT_ICONS = [Factory, Boxes, Store, Globe];

export default function IndiaMarketplaceWidget() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#f8fafc]">
      
      {/* Hero Header Section */}
      <RegionalHeroBanner
        countryName="India"
        countrySlug="india"
        title={
          <>
            Buy &amp; Sell Surplus Inventory in <br />
            India with Surplus Market
          </>
        }
        description={
          <p>
            Surplus India is a growing opportunity for businesses to unlock value from unused stock and slow-moving goods. The platform Surplus Market began as a portal to{' '}
            <Link href="/qatar" className="text-[#0f7a61] hover:underline font-semibold transition-colors">
              buy excess inventory in Qatar
            </Link>{' '}
            and has since expanded to support Indian businesses seeking reliable, budget-friendly surplus deals. The B2B platform enables companies to buy and sell surplus goods online in a secure, professional environment focused on trust, speed, and scale. Surplus Market helps organizations reduce inventory pressure, improve cash flow, and access verified surplus opportunities across industries, making it a practical surplus website for Indian businesses.
          </p>
        }
      />

      {/* Main Content Sections */}
      <div className="container mx-auto px-3.5 sm:px-4 lg:px-8 max-w-7xl py-6 sm:py-10 md:py-14 space-y-8 sm:space-y-12">

        {/* Trust Features Bar */}
        <RegionalTrustBar />

        {/* Shop By Category Section */}
        <RegionalCategoryGrid />

        {/* Top Liquidated Inventory Products */}
        <CuratedProducts isRegional={true} />

        {/* Buy Request Banner */}
        <RegionalBuyRequestBanner countryName="India" countrySlug="india" />

        {/* Full Lots & Pallet Deals */}
        <PalletDeals isRegional={true} />

        {/* Sell CTA Banner */}
        <RegionalSellCTA countryName="India" countrySlug="india" />

        {/* Dead Stock Buyers Section */}
        <RegionalDeadStockSection countryName="India" countrySlug="india" />

        {/* Section 1: Surplus Market – India’s Trusted Surplus Trading Platform */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold !text-black text-black tracking-tight mb-3.5 sm:mb-4">
            Surplus Market – India’s Trusted Surplus Trading Platform
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-normal mb-6 sm:mb-8">
            Surplus Market operates as a focused B2B surplus trading platform designed for businesses that deal in bulk inventory to sell and{' '}
            <Link href="/saudi-arabia" className="text-[#0f7a61] font-semibold hover:underline">
              buy excess inventory in Saudi Arabia
            </Link>{' '}
            and across the GCC. Every buyer and seller is verified to ensure safe transactions and genuine surplus deals. This makes it easier for companies to list surplus items and connect with trusted{' '}
            <Link href="/buy" className="text-[#0f7a61] font-semibold hover:underline">
              surplus inventory buyers
            </Link>{' '}
            who understand wholesale trade. The platform supports surplus India trade across multiple sectors, including industrial goods, retail stock, branded surplus online listings, raw surplus material, and finished surplus goods. With Surplus Market, businesses benefit from structured listings, clear pricing, and access to serious buyers and verified demand across India.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {INDIA_TRUST_POINTS.map((pt, idx) => {
              const IconComp = TRUST_ICONS[idx % TRUST_ICONS.length];
              return (
                <div 
                  key={idx}
                  className="bg-gray-50/70 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-100 hover:border-emerald-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-[#0f7a61] flex items-center justify-center font-bold mb-3 border border-emerald-100">
                      <IconComp className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-gray-900 mb-1.5">
                      <span className="text-emerald-600 text-xs sm:text-sm">✔️</span>
                      <h3 className="leading-snug !text-black text-black">{pt.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Buy Surplus Goods Online in India With Surplus Market */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold !text-black text-black tracking-tight mb-3.5 sm:mb-4">
            Buy Surplus Goods Online in India With Surplus Market
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-normal mb-6 sm:mb-8">
            There are no limitations to{' '}
            <Link href="/" className="text-[#0f7a61] font-semibold hover:underline">
              buy &amp; sell excess inventory &amp; overstock items
            </Link>{' '}
            online in India with informal networks and verified listings. Surplus Market functions as a surplus online store where businesses can discover discounted surplus, brand surplus, and surplus wholesale lots at competitive rates.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {INDIA_BUY_POINTS.map((pt, idx) => {
              const IconComp = BUY_ICONS[idx % BUY_ICONS.length];
              return (
                <div 
                  key={idx}
                  className="bg-gray-50/70 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-100 hover:border-emerald-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-3 border border-blue-100">
                      <IconComp className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-gray-900 mb-1.5">
                      <span className="text-emerald-600 text-xs sm:text-sm">✔️</span>
                      <h3 className="leading-snug !text-black text-black">{pt.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Sell Excess Inventory & Overstock Items in India */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold !text-black text-black tracking-tight mb-3.5 sm:mb-4">
            Sell Excess Inventory &amp; Overstock Items in India
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-normal mb-6 sm:mb-8">
            Holding excess inventory ties up space and capital, and Surplus Market provides a structured way to list overstock liquidation deals and reach buyers who actively seek surplus for sale. Sellers can move excess inventory faster while maintaining control over pricing and buyer communication. At the same time, businesses with excess stock make use of{' '}
            <Link href="/inventory-calculator" className="text-[#0f7a61] font-semibold hover:underline">
              inventory ageing calculators
            </Link>{' '}
            to identify items that should be listed for surplus sale at the right time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {INDIA_SELL_POINTS.map((pt, idx) => {
              const IconComp = SELL_ICONS[idx % SELL_ICONS.length];
              return (
                <div 
                  key={idx}
                  className="bg-gray-50/70 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-100 hover:border-emerald-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold mb-3 border border-amber-100">
                      <IconComp className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-gray-900 mb-1.5">
                      <span className="text-emerald-600 text-xs sm:text-sm">✔️</span>
                      <h3 className="leading-snug !text-black text-black">{pt.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Who Can Buy & Sell Surplus Inventory in India? */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold !text-black text-black tracking-tight mb-3.5 sm:mb-4">
            Who Can Buy &amp; Sell Surplus Inventory in India?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-normal mb-6 sm:mb-8">
            Surplus Market enables manufacturers, traders, distributors, and retailers to buy and sell surplus inventory within surplus India trade networks. Businesses can list excess raw material, finished goods, overstock, and branded surplus online while buyers source surplus wholesale stock for resale or operations. The platform also supports cross-border trade, allowing companies to explore regional surplus opportunities and{' '}
            <Link href="/uae" className="text-[#0f7a61] font-semibold hover:underline">
              buy and sell excess inventory in the UAE
            </Link>
            , and beyond for wider market access.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {INDIA_PARTICIPANTS.map((pt, idx) => {
              const IconComp = PARTICIPANT_ICONS[idx % PARTICIPANT_ICONS.length];
              return (
                <div 
                  key={idx}
                  className="bg-gray-50/70 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-100 hover:border-emerald-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold mb-3 border border-purple-100">
                      <IconComp className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-gray-900 mb-1.5">
                      <span className="text-emerald-600 text-xs sm:text-sm">✔️</span>
                      <h3 className="leading-snug !text-black text-black">{pt.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5: FAQs */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold !text-black text-black tracking-tight mb-6 sm:mb-8">
            FAQs
          </h2>

          <div className="space-y-3 sm:space-y-3.5">
            {INDIA_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className={`border rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 ${
                    isOpen 
                      ? 'border-[#0f7a61] bg-[#e6f7ef]/20 shadow-2xs' 
                      : 'border-gray-200/80 bg-gray-50/40 hover:border-gray-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-3.5 sm:p-5 text-left focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs sm:text-sm md:text-base font-bold !text-black text-black pr-3 sm:pr-4">
                      {faq.q}
                    </span>
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-[#0f7a61] text-white' : 'bg-gray-200/80 text-gray-600'
                    }`}>
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-[#0f7a61]/10 mt-1">
                      <p className="pt-3 sm:pt-3.5">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
