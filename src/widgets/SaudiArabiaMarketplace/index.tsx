"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Plus,
  Minus,
  UserPlus,
  PackagePlus,
  MessageSquareCheck,
  CheckCircle
} from 'lucide-react';
import { SAUDI_BENEFITS_LIST, SAUDI_STEPS, SAUDI_FAQS } from './saudiData';
import RegionalHeroBanner from '../RegionalHeroBanner';
import RegionalTrustBar from '../RegionalTrustBar';
import RegionalCategoryGrid from '../RegionalCategoryGrid';
import CuratedProducts from '../CuratedProducts';
import RegionalBuyRequestBanner from '../RegionalBuyRequestBanner';
import PalletDeals from '../PalletDeals';
import RegionalSellCTA from '../RegionalSellCTA';
import RegionalDeadStockSection from '../RegionalDeadStockSection';

const STEP_ICONS = [UserPlus, PackagePlus, MessageSquareCheck, CheckCircle];

export default function SaudiArabiaMarketplaceWidget() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#f8fafc]">

      {/* Hero Header Section */}
      <RegionalHeroBanner
        countryName="Saudi Arabia"
        countrySlug="saudi-arabia"
        title={
          <>
            Buy &amp; Sell Excess Inventory in <br />
            Saudi Arabia with Surplus Market
          </>
        }
        description="Managing unsold goods and unused stock can be challenging for businesses in Saudi Arabia. Surplus Market makes the process easier by connecting sellers with genuine buyers who are looking for discounted, ready-to-purchase items. Our platform works across industries, enabling businesses of any size to clear storage space, recover capital, and keep stock moving. You can list your products quickly and start receiving interest from surplus buyers without dealing with complicated processes."
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
        <RegionalBuyRequestBanner countryName="Saudi Arabia" countrySlug="saudi-arabia" />

        {/* Full Lots & Pallet Deals */}
        <PalletDeals isRegional={true} />

        {/* Sell CTA Banner */}
        <RegionalSellCTA countryName="Saudi Arabia" countrySlug="saudi-arabia" />

        {/* Dead Stock Buyers Section */}
        <RegionalDeadStockSection countryName="Saudi Arabia" countrySlug="saudi-arabia" />

        {/* Section 1: Why Choose Surplus Market for Excess Inventory in Saudi Arabia? */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold !text-black text-black tracking-tight mb-3.5 sm:mb-4">
            Why Choose Surplus Market for Excess Inventory in Saudi Arabia?
          </h2>
          <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-normal">
            <p>
              Surplus Market is designed to make buying and selling excess inventory in Saudi Arabia simple, transparent, and fast. We bring together a network of verified surplus inventory buyers who are actively searching for deals on overstock, end-of-line goods, and bulk lots. Sellers can list items without paying high fees or spending weeks finding the right buyer. Buyers get access to genuine stock at competitive prices, with clear details on quantity, specifications, and availability.
            </p>
            <p>
              By working with surplus liquidators in Saudi Arabia, we help ensure smooth transactions and quick turnarounds for both sides. If you are clearing warehouse space or sourcing discounted goods for resale, Surplus Market offers a trusted platform to get deals done efficiently.
            </p>
          </div>
        </section>

        {/* Section 2: Buy & Sell Excess Inventory in Saudi Arabia at Discount Prices */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold !text-black text-black tracking-tight mb-3.5 sm:mb-4">
            Buy &amp; Sell Excess Inventory in Saudi Arabia at Discount Prices
          </h2>
          <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-normal">
            <p>
              Our platform enables businesses to sell excess stock in Saudi Arabia without long delays. Every listing is visible to a wide audience, including resellers, traders, and wholesalers who value bulk purchase opportunities. This makes it easier to turn unsold stock into immediate revenue.
            </p>
            <p>
              For buyers, Surplus Market is like a surplus store in Saudi Arabia that is always open online. You can browse available goods in different categories and find products at attractive prices. This approach benefits both sides, as sellers reduce holding costs and buyers secure high-value stock at discounted rates.
            </p>
          </div>
        </section>

        {/* Section 3: Benefits of Selling Excess Stock in Saudi Arabia Through Surplus Market */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold !text-black text-black tracking-tight mb-2.5 sm:mb-3">
            Benefits of Selling Excess Stock in Saudi Arabia Through Surplus Market
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
            Many businesses use Surplus Market not only to sell but also to discover new sources of supply. Our{' '}
            <Link href="/blog" className="text-[#0f7a61] font-semibold hover:underline">
              Overstock Solutions
            </Link>{' '}
            section shares practical tips and insights for making the most of surplus opportunities.
          </p>
          <p className="text-xs sm:text-sm md:text-base font-bold text-gray-900 mb-4 sm:mb-6">
            Selling excess inventory through our platform offers several advantages:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {SAUDI_BENEFITS_LIST.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-gray-50/70 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-emerald-200 transition-all flex items-start gap-3.5 group"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-[#0f7a61] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <p className="text-xs sm:text-sm text-gray-800 font-medium leading-snug">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: How to Get Started with Surplus Market */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold !text-black text-black tracking-tight mb-2.5 sm:mb-3">
            How to Get Started with Surplus Market
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mb-6 sm:mb-8">
            Getting started is simple:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
            {SAUDI_STEPS.map((item, idx) => {
              const StepIcon = STEP_ICONS[idx % STEP_ICONS.length];
              return (
                <div
                  key={idx}
                  className="bg-gray-50/70 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-100 hover:border-emerald-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="text-[11px] sm:text-xs font-black text-[#0f7a61] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                        Step {item.step}
                      </span>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white text-[#0f7a61] flex items-center justify-center shadow-2xs border border-gray-100">
                        <StepIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </div>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold !text-black text-black mb-1.5 sm:mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#f0f9f5] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-emerald-100 text-xs sm:text-sm text-gray-700 leading-relaxed">
            If you are ready to sell, visit our{' '}
            <Link href="/sell" className="text-[#0f7a61] font-bold hover:underline">
              Sell Excess Inventory
            </Link>{' '}
            page. Buyers can start browsing by checking{' '}
            <Link href="/buy" className="text-[#0f7a61] font-bold hover:underline">
              Surplus Inventory Buyers
            </Link>
            . For any questions, you can{' '}
            <Link href="/contact" className="text-[#0f7a61] font-bold hover:underline">
              Get in Touch with Surplus Market
            </Link>
            .
          </div>
        </section>

        {/* Section 5: FAQ – Excess Inventory Sale in Saudi Arabia */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold !text-black text-black tracking-tight mb-6 sm:mb-8">
            FAQ – Excess Inventory Sale in Saudi Arabia
          </h2>

          <div className="space-y-3 sm:space-y-3.5">
            {SAUDI_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 ${isOpen
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
                    <span className="text-xs sm:text-sm md:text-base font-bold text-gray-900 pr-3 sm:pr-4">
                      {faq.q}
                    </span>
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-[#0f7a61] text-white' : 'bg-gray-200/80 text-gray-600'
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
