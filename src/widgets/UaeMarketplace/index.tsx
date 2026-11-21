"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  Tag, 
  TrendingUp, 
  Boxes, 
  ShieldCheck, 
  Globe
} from 'lucide-react';

import { USER_TYPES, UAE_BENEFITS, UAE_FAQS } from './uaeData';
import Accordion from '../../components/Accordion';
import RegionalHeroBanner from '../RegionalHeroBanner';
import RegionalTrustBar from '../RegionalTrustBar';
import RegionalCategoryGrid from '../RegionalCategoryGrid';
import CuratedProducts from '../CuratedProducts';
import RegionalBuyRequestBanner from '../RegionalBuyRequestBanner';
import PalletDeals from '../PalletDeals';
import RegionalSellCTA from '../RegionalSellCTA';
import RegionalDeadStockSection from '../RegionalDeadStockSection';

const BENEFIT_ICONS = [Tag, TrendingUp, Boxes, ShieldCheck, Globe];

export default function UaeMarketplaceWidget() {
  return (
    <div className="w-full flex flex-col items-center bg-[#f8fafc]">
      
      {/* Hero Header Section */}
      <RegionalHeroBanner
        countryName="UAE"
        countrySlug="uae"
        title={
          <>
            Buy &amp; Sell Excess Inventory in <br />
            UAE with Surplus Market
          </>
        }
        description="Entering the thriving world of surplus trade in the UAE? Surplus Market connects buyers and sellers through a dynamic, transparent platform built for excess inventory sale in UAE. Explore export-grade merchandise, surplus goods, and liquidation deals that meet your needs with fast, reliable, and hassle-free access."
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
        <RegionalBuyRequestBanner countryName="UAE" countrySlug="uae" />

        {/* Full Lots & Pallet Deals */}
        <PalletDeals isRegional={true} />

        {/* Sell CTA Banner */}
        <RegionalSellCTA countryName="UAE" countrySlug="uae" />

        {/* Dead Stock Buyers Section */}
        <RegionalDeadStockSection countryName="UAE" countrySlug="uae" />

        {/* Section 1: Why Surplus Market for UAE? */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3.5 sm:mb-4">
            Why Surplus Market for UAE?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-normal">
            Surplus Market is purpose-built to meet the unique trade demands of the UAE. With strong connections to surplus warehouses in UAE, we bring together trusted sellers and serious buyers looking to scale efficiently. Businesses benefit from real-time access to excess inventory in UAE, whether it’s branded apparel, tools, electronics, or industrial items. Our platform removes the guesswork and makes it easy to liquidate excess inventory in UAE with confidence.
          </p>
        </section>

        {/* Section 2: Who Can Use the Surplus Market? */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2.5 sm:mb-3">
            Who Can Use the Surplus Market?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
            Searching for a surplus shop near me in UAE or looking to sell excess stock in UAE, Surplus Market makes it easy and efficient for all.
          </p>
          <p className="text-xs sm:text-sm md:text-base font-bold text-gray-900 mb-4 sm:mb-6">
            Our platform is designed for a wide range of users:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {USER_TYPES.map((userType, idx) => (
              <div 
                key={idx}
                className="bg-gray-50/70 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-emerald-200 transition-all flex items-start gap-3.5 group"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-[#0f7a61] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <p className="text-xs sm:text-sm text-gray-800 font-medium leading-snug">
                  {userType}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Benefits of Buying Excess Inventory in UAE */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2.5 sm:mb-3">
            Benefits of Buying Excess Inventory in UAE
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mb-6 sm:mb-8">
            Buying from a surplus market isn&apos;t just cost-effective, but a strategic move enterprises can make. Stay competitive by sourcing from a trusted discount surplus warehouse ecosystem optimized for the UAE.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {UAE_BENEFITS.map((benefit, idx) => {
              const IconComp = BENEFIT_ICONS[idx % BENEFIT_ICONS.length];
              return (
                <div 
                  key={idx}
                  className="bg-gray-50/70 border border-gray-100 hover:border-emerald-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 transition-all hover:bg-white hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border ${benefit.color} mb-3 sm:mb-4`}>
                      <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-1.5">
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
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-6 sm:mb-8">
            FAQ – Excess Inventory Sale in UAE
          </h2>

          <Accordion
            items={UAE_FAQS.map((faq, idx) => ({
              id: idx,
              question: faq.q,
              answer: faq.a,
            }))}
            defaultOpenIndex={0}
          />
        </section>

        {/* Concluding CTA Section */}
        <section className="bg-gradient-to-br from-[#051c14] via-[#082d20] to-[#0c402e] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-emerald-900/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
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
