"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import CommonBanner from '../CommonBanner';
import { 
  ShoppingBag, 
  TrendingUp, 
  Boxes, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Plus, 
  Minus,
  Sparkles,
  ShieldCheck,
  Globe,
  Tag,
  Building2,
  Factory,
  Store,
  Quote,
  Star,
  Coins,
  Search,
  PackageCheck
} from 'lucide-react';
import { motion } from '../../lib/motion';

const TOP_BRANDS = ["JCB", "Bosch", "Makita", "Milwaukee", "Metabo", "Ingco", "Cumet", "Uken"];

const INDIA_WHY_PROPS = [
  {
    title: "Verified buyers & sellers",
    desc: "Pre-verified businesses ensure secure and reliable surplus transactions.",
    icon: ShieldCheck,
    color: "bg-blue-50 text-blue-600 border-blue-200"
  },
  {
    title: "100% B2B platform",
    desc: "Built exclusively for manufacturers, traders, distributors, and enterprises.",
    icon: Building2,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200"
  },
  {
    title: "Bulk, wholesale & liquidation",
    desc: "Supports large-volume surplus, wholesale, and overstock liquidation.",
    icon: Boxes,
    color: "bg-[#e0f0e9] text-[#0a5c48] border-[#0a5c48]/30"
  },
  {
    title: "Wide range across industries",
    desc: "Industrial, retail, branded surplus, raw material, and finished goods.",
    icon: Globe,
    color: "bg-amber-50 text-amber-600 border-amber-200"
  }
];

const BUY_SURPLUS_PILLARS = [
  {
    title: "Discounted surplus",
    desc: "Cost-effective surplus goods priced below market value.",
    icon: Tag
  },
  {
    title: "Branded surplus",
    desc: "Authentic brand surplus stock available for bulk purchase.",
    icon: Sparkles
  },
  {
    title: "Bulk inventory",
    desc: "Large-quantity surplus items ready for wholesale trade.",
    icon: Boxes
  },
  {
    title: "Direct sourcing",
    desc: "Connect directly with surplus sellers without intermediaries.",
    icon: Search
  }
];

const SELL_SURPLUS_PILLARS = [
  {
    title: "Excess inventory",
    desc: "Move slow-moving stock and unsold surplus inventory.",
    icon: TrendingUp
  },
  {
    title: "Overstock liquidation",
    desc: "Liquidate surplus items quickly through verified buyers.",
    icon: PackageCheck
  },
  {
    title: "Faster selling",
    desc: "Reach active surplus buyers and close deals faster.",
    icon: ArrowRight
  },
  {
    title: "Working capital",
    desc: "Unlock cash blocked in surplus goods.",
    icon: Coins
  }
];

const INDIA_PARTICIPANTS = [
  {
    title: "Manufacturers",
    desc: "Sell surplus raw material, components, and finished goods.",
    icon: Factory
  },
  {
    title: "Trade & Distribution",
    desc: "Source and resell surplus wholesale inventory efficiently.",
    icon: Boxes
  },
  {
    title: "Retail & Commerce",
    desc: "Liquidate unsold stock and branded surplus items.",
    icon: Store
  },
  {
    title: "Cross-Border Trade",
    desc: "Access international surplus buyers and sellers across markets.",
    icon: Globe
  }
];

const TESTIMONIALS = [
  {
    quote: "We had a surplus of construction raw materials adding to our overhead. Surplus Market connected us with buyers faster than other channels.",
    author: "Ali Hussain",
    role: "Operations Director",
    company: "Crescent Construction",
    location: "Dubai"
  },
  {
    quote: "I have a small interior design business, and Surplus Market is now the first place I check for unique materials at unbeatable prices.",
    author: "Zahra Al-Farsi",
    role: "Founder",
    company: "ZAF Interiors",
    location: "Oman"
  },
  {
    quote: "Try it to believe it. I moved outdated electronics easily thanks to Surplus Market.",
    author: "Rohit Sharma",
    role: "Inventory Manager",
    company: "TechRecycle",
    location: "India"
  }
];

const GOOD_TO_KNOW_INDIA_FAQS = [
  {
    q: "How can I buy and sell surplus inventory in India through Surplus Market?",
    a: "You can register as a business user, complete verification, and start listing or browsing surplus goods. Buyers and sellers connect directly for bulk trade."
  },
  {
    q: "Is Surplus Market a trusted surplus website in India?",
    a: "Yes. The platform verifies all users and operates strictly as a B2B marketplace focused on genuine surplus trade."
  },
  {
    q: "How do I find surplus deals in India online?",
    a: "Surplus Market allows you to search by category, industry, and quantity, making it easy to locate surplus deals that fit your requirements."
  },
  {
    q: "Who can sell surplus goods on Surplus Market India?",
    a: "Manufacturers, distributors, retailers, exporters, and traders with surplus material or surplus items can sell on the platform."
  },
  {
    q: "Can I buy surplus items in bulk or wholesale quantities?",
    a: "Yes. The platform is designed for surplus wholesale transactions and bulk inventory purchases."
  },
  {
    q: "What types of surplus material can be listed for sale in India?",
    a: "Listings include industrial surplus, retail stock, branded surplus online items, raw materials, and finished goods."
  },
  {
    q: "Are there verified surplus buyers in India on Surplus Market?",
    a: "All buyers on the platform are verified businesses, making it easier to conduct reliable, professional transactions with confidence."
  }
];

export default function IndiaMarketplaceWidget() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col items-center bg-gray-50/50">
      
      {/* Banner / Hero Header */}
      <CommonBanner 
        title="Buy & Sell Excess Inventory in India"
        subtitle="Surplus India represents a growing opportunity for businesses to unlock value from unused stock and slow-moving goods."
        align="center"
        image="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Regional Marketplace' },
          { label: 'India' }
        ]}
      />

      {/* Hero Action Buttons Sub-Bar */}
      <div className="w-full bg-[#0a1e17] py-6 text-white border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider block mb-1">Regional Marketplace</span>
            <p className="text-sm text-gray-300 font-medium">B2B surplus deals, branded inventory & liquidation in India</p>
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

        {/* Overview Section & Brands Bar */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0a5c48] uppercase tracking-wider bg-[#e0f0e9] px-3 py-1 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Expanding B2B Surplus Ecosystem
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              Buy & Sell Excess Inventory in India with Surplus Market
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
              Surplus India represents a growing opportunity for businesses to unlock value from unused stock and slow-moving goods. The Surplus Market platform began as a portal to buy excess inventory in Qatar and has since expanded to support Indian businesses seeking reliable, budget-friendly surplus deals. This B2B platform enables companies to buy and sell surplus goods online in a secure, professional environment focused on trust, speed, and scale.
            </p>
          </div>

          {/* Top Brands Showcase */}
          <div className="pt-6 border-t border-gray-100">
            <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-widest block mb-4">
              Top Inventory Brands Available
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {TOP_BRANDS.map((brand, idx) => (
                <span 
                  key={idx}
                  className="bg-gray-100 hover:bg-[#e0f0e9] border border-gray-200 text-gray-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Why Surplus Market – India’s Trusted Surplus Trading Platform */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-wider block mb-2">B2B Trading Advantage</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Why Surplus Market – India’s Trusted Surplus Trading Platform
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              Surplus Market operates as a focused B2B surplus trading platform designed for businesses that deal in bulk inventory. Every buyer and seller is verified to ensure safe transactions and genuine surplus deals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INDIA_WHY_PROPS.map((prop, idx) => {
              const IconComp = prop.icon;
              return (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-gray-200 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${prop.color} mb-4`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{prop.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">{prop.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Dual Grid: Buy Surplus vs Sell Surplus in India */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Buy Surplus Goods Online in India */}
          <div className="bg-[#0a1e17] text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-green-400 text-[#0a1e17] flex items-center justify-center font-bold mb-4">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-3">Buy Surplus Goods Online in India</h3>
              <p className="text-sm text-gray-300 mb-8 leading-relaxed">
                Source authenticated overstock, industrial components, and wholesale merchandise directly from verified suppliers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUY_SURPLUS_PILLARS.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <div key={idx} className="bg-white/10 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-green-400 font-bold text-sm mb-1">
                        <Icon className="w-4 h-4" /> {pillar.title}
                      </div>
                      <p className="text-xs text-gray-300">{pillar.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-8">
              <Link 
                href="/browse" 
                className="inline-flex items-center gap-2 bg-green-400 text-[#0a1e17] hover:bg-green-300 font-bold text-sm px-6 py-3 rounded-full transition-all shadow-md"
              >
                Explore Buying Opportunities <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Sell Excess Inventory & Overstock Items in India */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#e0f0e9] text-[#0a5c48] flex items-center justify-center font-bold mb-4">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Sell Excess Inventory in India</h3>
              <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                Liquidate slow-moving stock, clear warehouse space, and convert non-moving inventory into liquid working capital.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SELL_SURPLUS_PILLARS.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-[#0a5c48] font-bold text-sm mb-1">
                        <Icon className="w-4 h-4" /> {pillar.title}
                      </div>
                      <p className="text-xs text-gray-600">{pillar.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-8">
              <Link 
                href="/sell" 
                className="inline-flex items-center gap-2 bg-[#0a5c48] text-white hover:bg-[#084838] font-bold text-sm px-6 py-3 rounded-full transition-all shadow-md"
              >
                List Your Inventory <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section: Who Can Buy & Sell Surplus Inventory in India? */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-wider block mb-2">Industry Participants</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Who Can Buy & Sell Surplus Inventory in India?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INDIA_PARTICIPANTS.map((part, idx) => {
              const IconComp = part.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-[#0a5c48]/50 transition-all">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#e0f0e9] text-[#0a5c48] flex items-center justify-center font-bold mb-4">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{part.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{part.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-wider block mb-1">Trader Experiences</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">What Our Buyers & Sellers Say</h2>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <Quote className="w-8 h-8 text-[#0a5c48]/30 mb-3" />
                  <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <strong className="block text-sm font-bold text-gray-900">{t.author}</strong>
                  <span className="block text-xs text-gray-500 font-medium">{t.role}, {t.company}</span>
                  <span className="inline-block mt-1 text-[11px] font-bold text-[#0a5c48] uppercase bg-[#e0f0e9] px-2 py-0.5 rounded-md">
                    {t.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Good to Know FAQs Section */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#e0f0e9] text-[#0a5c48] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Buying & selling surplus inventory in India</p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            {GOOD_TO_KNOW_INDIA_FAQS.map((faq, idx) => {
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
