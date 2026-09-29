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
  Truck
} from 'lucide-react';
import { motion } from '../../lib/motion';

const UAE_VALUE_PROPS = [
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
    title: "Greener UAE",
    desc: "Smarter path to a greener UAE",
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

const USER_TYPES = [
  {
    title: "Retailers & Wholesalers",
    desc: "Sourcing excess inventory for sale in UAE to stock stores with high-margin merchandise."
  },
  {
    title: "Manufacturers & Suppliers",
    desc: "Offloading unsold, surplus, or overstocked production runs swiftly to free warehouse capacity."
  },
  {
    title: "Exporters & Importers",
    desc: "Sourcing directly from export surplus stores in UAE for regional and international trade."
  },
  {
    title: "Entrepreneurs & Resellers",
    desc: "Hunting for value-packed opportunities, pallet deals, and discounted liquidation stock."
  },
  {
    title: "Inventory Liquidators",
    desc: "Connecting with trusted sellers and buyers in UAE seeking fast-moving wholesale lots."
  }
];

const UAE_BENEFITS = [
  {
    title: "Lower Procurement Costs",
    desc: "Access discounted bulk pricing directly from trusted sellers without intermediary markups.",
    icon: Tag
  },
  {
    title: "Fast Inventory Turnover",
    desc: "Stock up quickly and move products faster with localized UAE logistics and ready inventory.",
    icon: TrendingUp
  },
  {
    title: "Variety of Categories",
    desc: "From fashion and furniture to tools, industrial machinery, and consumer electronics.",
    icon: Boxes
  },
  {
    title: "Branded Goods at Low Prices",
    desc: "Discover authentic, verified branded surplus inventory in UAE at heavily reduced prices.",
    icon: ShieldCheck
  },
  {
    title: "Local and Global Sourcing",
    desc: "Easily browse surplus supply in UAE for local pickup or export across GCC and global markets.",
    icon: Globe
  }
];

const GOOD_TO_KNOW_FAQS = [
  {
    q: "Can I explore verified export surplus stores in UAE?",
    a: "Yes. You can explore verified export surplus stores in UAE directly through the Surplus Market platform with itemized manifests and documentation."
  },
  {
    q: "What does surplus wholesale in UAE refer to?",
    a: "Surplus wholesale in UAE refers to bulk buying of surplus goods at wholesale rates, which is an ideal choice for resellers, small businesses, and inventory liquidators looking to maximize margins."
  },
  {
    q: "How does Surplus Market partner with inventory liquidators in UAE?",
    a: "Surplus Market partners with leading Surplus Liquidators in UAE to help you find and sell excess stock effectively through transparent lot listings and verified buyer networks."
  },
  {
    q: "How can I source export surplus relevant to my sector?",
    a: "To source export surplus, you can use filters and category-wise listings on Surplus Market’s official site to find export surplus in UAE relevant to your sector and budget."
  },
  {
    q: "Are local pickup options available for surplus stores near me in UAE?",
    a: "Yes. Our platform includes listings from surplus stores and warehouses in UAE that offer local viewing and pickup options."
  },
  {
    q: "How do I list my items to sell excess inventory in UAE?",
    a: "Simply list your items on Surplus Market to instantly connect with verified B2B buyers ready to buy excess inventory in UAE."
  },
  {
    q: "How can I connect with liquidators directly?",
    a: "You can use Surplus Market’s 'Connect with Liquidators' feature instead of spending hours browsing to discover top-rated inventory liquidators near you in UAE."
  },
  {
    q: "Which companies typically buy excess inventory in UAE?",
    a: "Retail chains, resellers, exporters, liquidation firms, and e-commerce platforms are the primary companies actively buying excess inventory in UAE."
  },
  {
    q: "Which sectors generate the largest volume of excess stock in UAE?",
    a: "Retail, construction, textiles, consumer electronics, and industrial equipment generate the largest volumes of excess stock in the UAE market."
  },
  {
    q: "How is excess stock in UAE priced?",
    a: "Excess stock in UAE is typically priced based on condition, volume, and urgency. You can find many items listed as excess inventory for sale in UAE with attractive deals."
  },
  {
    q: "What are 'Quick Ship' tags?",
    a: "Our 'Quick Ship' tags help you identify excess stock for sale in UAE that is stored in local warehouses and ready for immediate dispatch."
  },
  {
    q: "How does Surplus Market verify sellers and liquidators?",
    a: "Surplus Market verifies and features trusted inventory liquidators in UAE with proven delivery records, verified trade licenses, and deal histories."
  },
  {
    q: "What is the best way to liquidate excess inventory in UAE?",
    a: "An appropriate way to liquidate excess inventory is to use a trusted online marketplace like Surplus Market, where listing is easy and active B2B buyers are searching daily."
  },
  {
    q: "What regulations should I know before selling excess inventory in UAE?",
    a: "Before selling excess inventory in the UAE, make sure that you comply with VAT rules, import/export regulations, and product authenticity standards set by UAE trade authorities."
  },
  {
    q: "How do I start placing bulk surplus orders?",
    a: "Register on Surplus Market, browse category listings, and connect directly with sellers for bulk surplus orders across UAE."
  },
  {
    q: "What product categories are available in UAE surplus listings?",
    a: "Our listings cover all surplus supply in UAE categories, including overstocked electronics, apparel, home decor, construction tools, industrial equipment, and more."
  },
  {
    q: "Can I find authentic branded surplus in UAE?",
    a: "Yes. Our sellers offer vetted, authentic branded surplus in UAE across major categories, with original manifests and documentation provided where applicable."
  }
];

export default function UaeMarketplaceWidget() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col items-center bg-gray-50/50">
      
      {/* Banner / Hero Header */}
      <CommonBanner 
        title="Buy & Sell Excess Inventory in UAE"
        subtitle="Surplus Market connects buyers and sellers through a dynamic, transparent platform built for excess inventory sale in UAE."
        align="center"
        image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Regional Marketplace' },
          { label: 'UAE' }
        ]}
      />

      {/* Hero Action Buttons Bar */}
      <div className="w-full bg-[#0a1e17] py-6 text-white border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider block mb-1">Regional Marketplace</span>
            <p className="text-sm text-gray-300 font-medium">Export-grade merchandise, surplus goods, and liquidation deals in UAE</p>
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

        {/* Section 1: Why Surplus Market for UAE? */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0a5c48] uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" /> Purpose-Built for UAE Trade
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              Why Surplus Market for UAE?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
              Surplus Market is purpose-built to meet the unique trade demands of the UAE. With strong connections to surplus warehouses in UAE, we bring together trusted sellers and serious buyers looking to scale efficiently. Businesses benefit from real-time access to excess inventory in UAE, whether it’s branded apparel, tools, electronics, or industrial items. Our platform removes the guesswork and makes it easy to liquidate excess inventory in UAE with confidence.
            </p>
          </div>

          {/* 4 Feature Props Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {UAE_VALUE_PROPS.map((prop, idx) => {
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

        {/* Section 2: Who Can Use Surplus Market? */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-wider block mb-2">Designed for Every Trader</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Who Can Use the Surplus Market?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              Searching for a surplus shop near me in UAE or looking to sell excess stock in UAE, Surplus Market makes it easy and efficient for all. Our platform is designed for a wide range of users:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {USER_TYPES.map((type, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:border-[#0a5c48]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#e0f0e9] text-[#0a5c48] flex items-center justify-center text-xs font-bold mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{type.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{type.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Benefits of Buying Excess Inventory in UAE */}
        <section className="bg-[#0a1e17] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold text-green-400 uppercase tracking-wider block mb-2">Strategic Sourcing</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Benefits of Buying Excess Inventory in UAE
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Buying from a surplus market isn't just cost-effective, but a strategic move enterprises can make. Stay competitive by sourcing from a trusted discount surplus warehouse ecosystem optimized for the UAE.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {UAE_BENEFITS.map((benefit, idx) => {
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

        {/* Section 4: Good to Know (UAE FAQs & Knowledge Base Accordion) */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#e0f0e9] text-[#0a5c48] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Good to Know – UAE Market Guide</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Frequently asked questions and insights about excess inventory in UAE</p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            {GOOD_TO_KNOW_FAQS.map((faq, idx) => {
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

        {/* Section 5: Bottom CTA Banner */}
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
