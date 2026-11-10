"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  Minus, 
  ShoppingBag,
  Store,
  TrendingUp,
  ShieldCheck,
  Tag,
  Recycle,
  Globe
} from 'lucide-react';
import { 
  QATAR_SUPPORT_POINTS, 
  QATAR_PARTICIPANTS, 
  QATAR_BENEFITS, 
  QATAR_FAQS 
} from './qatarData';

const BENEFIT_ICONS = [TrendingUp, ShieldCheck, Tag, Recycle, Globe];

export default function QatarMarketplaceWidget() {
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
            <span className="text-white font-semibold">Qatar</span>
          </nav>

          {/* H1 Title & Intro Paragraphs */}
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-5 leading-[1.18]">
              Buy &amp; Sell Excess Inventory in Qatar With Surplus Market
            </h1>
            <div className="space-y-4 text-emerald-100/90 text-sm sm:text-base md:text-lg leading-relaxed mb-8">
              <p>
                Managing unsold or unused stock can be challenging for businesses in Qatar. Surplus Market makes the process simple by connecting sellers with serious buyers in one trusted space. If you want to clear warehouse space, recover value from idle goods, or find affordable stock for your business, our platform is built to help you act quickly and efficiently.
              </p>
              <p>
                Our marketplace allows businesses to showcase surplus goods to verified buyers, making the sale process straightforward and transparent. We support small batches to bulk inventory sales in Qatar, helping sellers to turn excess stock into cash, while enabling buyers to access high-quality products at competitive prices.
              </p>
            </div>

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

        {/* Section 1: Why Choose Surplus Market to Buy & Sell Excess Inventory in Qatar? */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
            Why Choose Surplus Market to Buy &amp; Sell Excess Inventory in Qatar?
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
            <p>
              Surplus Market brings sellers and buyers together in a way that saves time and resources. By listing your stock with us, you instantly reach a network of surplus stock buyers in Qatar who are actively seeking products. This eliminates the need for multiple cold calls or complicated advertising.
            </p>
            <p>
              For buyers, our platform is an opportunity to find reliable suppliers who are ready for quick deals. We ensure clear product descriptions, quality checks where applicable, and a system that promotes trust between parties. By focusing on overstock liquidation in Qatar, we help reduce waste and encourage smart sourcing for all kinds of businesses.
            </p>
          </div>
        </section>

        {/* Section 2: How Surplus Market Supports Inventory Liquidation in Qatar */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
            How Surplus Market Supports Inventory Liquidation in Qatar
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
            Storage costs and expired contracts can make excess stock a burden. Surplus Market simplifies excess stock clearance in Qatar by offering:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {QATAR_SUPPORT_POINTS.map((pt, idx) => (
              <div 
                key={idx}
                className="bg-gray-50/70 rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 transition-all flex items-start gap-3.5 group"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#0f7a61] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-sm text-gray-800 font-medium leading-snug">
                  {pt.text ? (
                    pt.text
                  ) : (
                    <>
                      {pt.prefix}{' '}
                      <Link href={pt.linkHref || '/'} className="text-[#0f7a61] font-bold hover:underline">
                        {pt.linkText}
                      </Link>
                      {pt.suffix}
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#f0f9f5] rounded-2xl p-5 border border-emerald-100 text-sm text-gray-700 leading-relaxed">
            We also provide tips and insights for both sellers looking for fast stock movement and buyers who want valuable deals. Our{' '}
            <Link href="/blog" className="text-[#0f7a61] font-bold hover:underline">
              Overstock Solutions
            </Link>{' '}
            section to help you improve your liquidation strategy.
          </div>
        </section>

        {/* Section 3: Who Can Buy & Sell on Our Surplus Marketplace in Qatar? */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Who Can Buy &amp; Sell on Our Surplus Marketplace in Qatar?
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
            <p>
              Our platform is open to a wide range of industries. Buyers range from small businesses seeking discounted supplies to bulk purchasers interested in wholesale lots. Our surplus marketplace in Qatar makes it easy for both ends to meet and complete transactions with confidence.
            </p>
            <p className="font-medium text-gray-800">
              If you have unused, overstocked, or clearance items, you can connect with buyers in just a few steps. Our common participants include:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QATAR_PARTICIPANTS.map((participant, idx) => (
              <div 
                key={idx}
                className="bg-gray-50/70 rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 transition-all flex items-start gap-3.5 group"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#0f7a61] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-sm text-gray-800 font-medium leading-snug">
                  {participant}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Benefits of Buying & Selling Overstock & Excess Stock in Qatar */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Benefits of Buying &amp; Selling Overstock &amp; Excess Stock in Qatar
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed mb-8">
            <p>
              By choosing Surplus Market, you gain more than just a selling platform. You become part of a growing trading network built for reliability and opportunity. This makes it easier to sell excess inventory in Qatar while also giving buyers a dependable source for stock replenishment.
            </p>
            <p className="font-medium text-gray-800">
              Using Surplus Market for bulk inventory sales in Qatar comes with many advantages:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {QATAR_BENEFITS.map((benefit, idx) => {
              const IconComp = BENEFIT_ICONS[idx % BENEFIT_ICONS.length];
              return (
                <div 
                  key={idx}
                  className="bg-gray-50/70 border border-gray-100 hover:border-emerald-200 rounded-2xl p-6 transition-all hover:bg-white hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-emerald-200 bg-emerald-50 text-[#0f7a61] mb-4">
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

        {/* Section 5: FAQ – Sale Excess Inventory in Qatar */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
            FAQ – Sale Excess Inventory in Qatar
          </h2>

          <div className="space-y-3.5">
            {QATAR_FAQS.map((faq, idx) => {
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
              Ready to turn your surplus stock into value?{' '}
              <Link href="/contact" className="text-[#14b875] underline hover:text-[#4ade80] transition-colors">
                Get in Touch with Surplus Market
              </Link>{' '}
              today and start selling smarter in Qatar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link 
              href="/contact" 
              className="w-full sm:w-auto text-center px-6 py-3.5 bg-[#14b875] hover:bg-[#119e64] text-[#051c14] font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get in Touch</span>
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
