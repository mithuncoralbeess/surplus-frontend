"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import CommonBanner from '../CommonBanner';
import { 
  ShoppingBag, 
  TrendingUp, 
  Leaf, 
  Boxes, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Building2, 
  Plus, 
  Minus,
  Sparkles,
  ShieldCheck,
  Globe,
  Tag,
  Warehouse,
  Layers,
  Recycle,
  Users
} from 'lucide-react';
import { motion } from '../../lib/motion';

const QATAR_VALUE_PROPS = [
  {
    title: "Low-Cost Sourcing",
    desc: "Quality goods at the best prices",
    icon: Tag,
    color: "bg-blue-50 text-blue-600 border-blue-200"
  },
  {
    title: "Fast Turnover",
    desc: "Sell faster, earn more",
    icon: TrendingUp,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200"
  },
  {
    title: "Greener Qatar",
    desc: "Smarter path to a greener Qatar",
    icon: Leaf,
    color: "bg-green-50 text-green-600 border-green-200"
  },
  {
    title: "Bulk Deals",
    desc: "Save more with large quantity",
    icon: Boxes,
    color: "bg-amber-50 text-amber-600 border-amber-200"
  }
];

const LIQUIDATION_SUPPORT_POINTS = [
  "A user-friendly system to sell excess inventory quickly.",
  "Access to a growing network of surplus inventory buyers.",
  "Listings visible to both local and international surplus buyers in Qatar.",
  "Support for bulk inventory sales with smooth transaction handling."
];

const QATAR_PARTICIPANTS = [
  {
    title: "Wholesalers",
    desc: "Clearing seasonal products and overstocked wholesale inventory efficiently."
  },
  {
    title: "Retailers",
    desc: "Looking to free up shelf space and monetize non-moving retail items."
  },
  {
    title: "Manufacturers",
    desc: "Offloading surplus raw materials or discontinued product lines."
  },
  {
    title: "Distributors",
    desc: "Managing short-dated, overstock, or secondary market surplus lots."
  },
  {
    title: "Importers",
    desc: "Moving slow-moving imported goods and clearing warehouse storage."
  }
];

const QATAR_BENEFITS = [
  {
    title: "Fast Turnaround",
    desc: "List your products and reach verified buyers in Qatar quickly.",
    icon: TrendingUp
  },
  {
    title: "Verified Network",
    desc: "Deal with reputable, vetted sellers and buyers across Qatar and the GCC.",
    icon: ShieldCheck
  },
  {
    title: "Cost Savings",
    desc: "Buyers get access to reduced prices on high-quality, authentic goods.",
    icon: Tag
  },
  {
    title: "Reduced Waste",
    desc: "Give products a second chance instead of discarding them, fostering a circular economy.",
    icon: Recycle
  },
  {
    title: "Market Reach",
    desc: "Access both domestic Qatar buyers and international trade partners.",
    icon: Globe
  }
];

const GOOD_TO_KNOW_QATAR_FAQS = [
  {
    q: "How does Surplus Market make transactions simple and clear?",
    a: "Our system makes transactions simple and clear. You can register on our platform, list your products, and connect with buyers or sellers directly without unnecessary intermediaries."
  },
  {
    q: "Is Surplus Market an active inventory liquidator network in Qatar?",
    a: "Surplus Market is one of the most active and trusted inventory liquidator platforms in Qatar, connecting you with buyers who seek and sellers who offer diverse product categories."
  },
  {
    q: "Does the platform work with verified buyers and sellers in Qatar?",
    a: "Yes, our platform works exclusively with verified buyers and sellers to ensure transparency, security, and safe B2B transactions."
  },
  {
    q: "Can buyers purchase surplus goods in Qatar for resale or retail stocking?",
    a: "Yes, many of our buyers purchase goods for resale, retail store stocking, e-commerce sales, or manufacturing use."
  },
  {
    q: "Who can benefit from listing surplus inventory in Qatar?",
    a: "Wholesalers, retailers, manufacturers, distributors, and importers in Qatar can all benefit from listing their stock to recover working capital."
  },
  {
    q: "How do I list my stock on Surplus Market?",
    a: "Simply register your account, upload product details, quantities, and images, set your price, and wait for verified buyer inquiries."
  },
  {
    q: "Does Surplus Market maintain an active buyer network for Qatar?",
    a: "Yes, we maintain a dedicated network of active, verified buyers looking for diverse products across Qatar and regional GCC markets."
  },
  {
    q: "What are the main advantages of using Surplus Market in Qatar?",
    a: "It saves time, reduces warehouse costs, connects you with verified partners, accelerates liquidity, and helps reduce waste."
  },
  {
    q: "Can sellers connect directly with bulk buyers and liquidators?",
    a: "Yes, many sellers on our platform connect directly with bulk buyers, enterprise liquidators, and trade dealers."
  },
  {
    q: "Can listings in Qatar be viewed and purchased by international buyers?",
    a: "Yes, listings can be viewed and purchased by buyers outside Qatar as well, facilitating regional cross-border trade."
  },
  {
    q: "How does Surplus Market provide visibility for listings?",
    a: "We provide an online B2B platform with search optimization and visibility to thousands of active traders across the region."
  },
  {
    q: "What types of products can be listed on Surplus Market in Qatar?",
    a: "Products can include consumer electronics, industrial machinery, clothing, apparel, food items, furniture, building materials, and more."
  },
  {
    q: "What is the sign-up process for Qatar buyers and sellers?",
    a: "Sign up, list your stock or browse inventory, and connect with interested buyers — the process is completely straightforward."
  },
  {
    q: "Which product categories are in highest demand in Qatar?",
    a: "Preferences vary, but high-demand categories in Qatar include consumer electronics, building & construction materials, apparel, and household goods."
  }
];

export default function QatarMarketplaceWidget() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col items-center bg-gray-50/50">
      
      {/* Banner / Hero Header */}
      <CommonBanner 
        title="Buy & Sell Excess Inventory in Qatar"
        subtitle="Surplus Market connects sellers with serious buyers in one trusted space across Qatar. Clear warehouse space and recover value from idle goods."
        align="center"
        image="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Regional Marketplace' },
          { label: 'Qatar' }
        ]}
      />

      {/* Hero Action Buttons Sub-Bar */}
      <div className="w-full bg-[#0a1e17] py-6 text-white border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider block mb-1">Regional Marketplace</span>
            <p className="text-sm text-gray-300 font-medium">Turn idle inventory into liquid working capital in Qatar</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/browse" 
              className="bg-[#0a5c48] hover:bg-[#084838] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Buy Surplus
            </Link>
            <Link 
              href="/sell" 
              className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Boxes className="w-4 h-4" /> Sell Surplus
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-16 space-y-20">

        {/* Section 1: Overview & Why Choose Surplus Market in Qatar */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0a5c48] uppercase tracking-wider bg-[#e0f0e9] px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> Trusted B2B Trade Network in Qatar
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Buy & Sell Excess Inventory in Qatar with Surplus Market
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Managing unsold or unused stock can be challenging for businesses in Qatar. Surplus Market makes the process simple by connecting sellers with serious buyers in one trusted space. If you want to clear warehouse space, recover value from idle goods, or find affordable stock for your business, our platform is built to help you act quickly and efficiently.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Our marketplace allows businesses to showcase surplus goods to verified buyers, making the sale process straightforward and transparent. We support small batches to bulk inventory sales in Qatar, helping sellers to turn excess stock into cash, while enabling buyers to access high-quality products at competitive prices.
              </p>
            </div>

            <div className="lg:col-span-5 bg-[#0a1e17] text-white rounded-2xl p-8 space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">
                Why Choose Surplus Market in Qatar?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Surplus Market brings sellers and buyers together in a way that saves time and resources. By listing your stock with us, you instantly reach a network of surplus stock buyers in Qatar who are actively seeking products.
              </p>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                For buyers, our platform is an opportunity to find reliable suppliers who are ready for quick deals. We ensure clear product descriptions, quality checks where applicable, and a system that promotes trust between parties.
              </p>
            </div>
          </div>

          {/* 4 Feature Props Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-100">
            {QATAR_VALUE_PROPS.map((prop, idx) => {
              const IconComp = prop.icon;
              return (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-gray-50/80 border border-gray-200 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${prop.color} mb-4`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{prop.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">{prop.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Section 2: How Surplus Market Supports Inventory Liquidation in Qatar */}
        <section className="bg-[#e0f0e9]/40 border border-[#0a5c48]/20 rounded-3xl p-8 sm:p-12">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-wider block mb-2">Liquidation Solutions</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              How Surplus Market Supports Inventory Liquidation in Qatar
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Storage costs and expired contracts can make excess stock a burden. Surplus Market simplifies excess stock clearance in Qatar by offering structured tools and direct trade channels:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LIQUIDATION_SUPPORT_POINTS.map((point, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0a5c48] text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-800 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Who Can Buy & Sell on Our Surplus Marketplace in Qatar? */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-wider block mb-2">Market Participants</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Who Can Buy & Sell on Our Surplus Marketplace in Qatar?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              Our platform is open to a wide range of industries. Buyers range from small businesses seeking discounted supplies to bulk purchasers interested in wholesale lots. Our surplus marketplace in Qatar makes it easy for both ends to meet and complete transactions with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {QATAR_PARTICIPANTS.map((part, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:border-[#0a5c48]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#e0f0e9] text-[#0a5c48] flex items-center justify-center text-xs font-bold mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{part.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{part.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Benefits of Buying & Selling Excess Stock in Qatar */}
        <section className="bg-[#0a1e17] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold text-green-400 uppercase tracking-wider block mb-2">Trade Advantage</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Benefits of Buying & Selling Excess Stock in Qatar
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                By choosing Surplus Market, you gain more than just a selling platform. You become part of a growing trading network built for reliability and opportunity. This makes it easier to sell excess inventory in Qatar while also giving buyers a dependable source for stock replenishment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {QATAR_BENEFITS.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-green-400 text-[#0a1e17] flex items-center justify-center font-bold mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{benefit.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 5: Good to Know (Qatar Market Guide & FAQs) */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#e0f0e9] text-[#0a5c48] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Good to Know – Qatar Market Insights</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Common questions about trading surplus inventory in Qatar</p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            {GOOD_TO_KNOW_QATAR_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? 'border-[#0a5c48] bg-[#e0f0e9]/20 shadow-sm' 
                      : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-bold text-gray-900 pr-4">
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-[#0a5c48] text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-[#0a5c48]/10 mt-1">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 6: Bottom CTA Banner */}
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
