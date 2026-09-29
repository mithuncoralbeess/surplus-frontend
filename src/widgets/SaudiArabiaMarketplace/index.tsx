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
  Store,
  UserPlus,
  PackagePlus,
  MessageSquareCheck,
  CheckCircle,
  Coins
} from 'lucide-react';
import { motion } from '../../lib/motion';

const SAUDI_VALUE_PROPS = [
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
    title: "Greener Saudi Arabia",
    desc: "Smarter path to a greener Saudi Arabia",
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

const SAUDI_BENEFITS = [
  {
    title: "Network of Genuine Liquidators",
    desc: "Direct access to verified inventory liquidators and bulk buyers across Saudi Arabia.",
    icon: ShieldCheck
  },
  {
    title: "Quick Listing Process",
    desc: "Fast, hassle-free listing tools to get your overstock live and in front of buyers immediately.",
    icon: TrendingUp
  },
  {
    title: "Lower Storage & Holding Costs",
    desc: "Clear warehouse storage space efficiently and reduce recurring holding overhead.",
    icon: Boxes
  },
  {
    title: "Increased Cash Flow",
    desc: "Unlock tied-up working capital by converting idle stock into immediate revenue.",
    icon: Coins
  },
  {
    title: "Cross-Industry Exposure",
    desc: "Reach buyers across construction, retail, electronics, textiles, and industrial sectors.",
    icon: Globe
  }
];

const GET_STARTED_STEPS = [
  {
    step: "01",
    title: "Create an Account",
    desc: "Sign up as a seller or buyer in under 2 minutes with verified business details.",
    icon: UserPlus
  },
  {
    step: "02",
    title: "List Your Stock",
    desc: "Add product descriptions, high-res photos, manifests, quantities, and pricing terms.",
    icon: PackagePlus
  },
  {
    step: "03",
    title: "Connect with Buyers",
    desc: "Receive instant inquiries and offers from verified surplus buyers in Saudi Arabia.",
    icon: MessageSquareCheck
  },
  {
    step: "04",
    title: "Complete the Sale",
    desc: "Finalize payment terms, arrange delivery or local pickup, and release escrow funds.",
    icon: CheckCircle
  }
];

const GOOD_TO_KNOW_SAUDI_FAQS = [
  {
    q: "What is considered excess inventory in Saudi Arabia?",
    a: "Excess inventory refers to goods that remain unsold after a certain operational period, including overstock, discontinued product lines, customer returns, or bulk stock exceeding local market demand."
  },
  {
    q: "How can businesses sell excess stock in Saudi Arabia?",
    a: "You can create a seller account on Surplus Market, list your products with accurate descriptions and manifests, and connect directly with buyers interested in purchasing at discounted rates."
  },
  {
    q: "Who are the top inventory liquidators in Saudi Arabia?",
    a: "Top inventory liquidators in Saudi Arabia are companies, trading houses, and wholesalers specializing in purchasing large volumes of overstock for secondary distribution. Surplus Market works with a verified network of such buyers."
  },
  {
    q: "How does Surplus Market simplify connecting with liquidators?",
    a: "Surplus Market makes it easy by connecting sellers directly with verified surplus liquidators in Saudi Arabia through our centralized B2B marketplace."
  },
  {
    q: "What is the most effective approach to managing warehouse overstock?",
    a: "Clearing space regularly every 30-90 days, working with verified surplus buyers, and listing inventory on trusted online platforms are the most effective liquidation strategies."
  },
  {
    q: "Can small and medium-sized enterprises (SMEs) list stock?",
    a: "Yes. Our platform is open to small, medium, and enterprise-level businesses in Saudi Arabia looking to liquidate overstock."
  },
  {
    q: "How does buying and selling work on Surplus Market?",
    a: "We provide an online B2B marketplace where sellers post their stock and buyers can view details, negotiate terms, and purchase directly with full transparency."
  },
  {
    q: "Does Surplus Market function as an online surplus store in Saudi Arabia?",
    a: "Yes. Surplus Market functions as an online surplus store in Saudi Arabia that is always open, giving buyers continuous access to a wide variety of discounted wholesale stock."
  },
  {
    q: "Which industries are most active in Saudi Arabia surplus trading?",
    a: "Key active industries include construction materials, retail consumer goods, electronics, furniture, tools, hardware, and industrial supplies."
  },
  {
    q: "How quickly do sellers receive inquiries after listing?",
    a: "Many sellers receive buyer inquiries within days (or even hours) of listing, depending on product category, pricing competitiveness, and demand."
  },
  {
    q: "How is pricing determined for surplus stock in Saudi Arabia?",
    a: "Pricing is based on product condition (Overstock vs Returns vs Refurbished), quantity, market demand, MSRP benchmark, and seller clearance urgency."
  },
  {
    q: "Does liquidating excess stock help recover capital?",
    a: "Yes. Selling overstock allows businesses to recover cash, reduce financial losses, free up valuable storage space, and reinvest working capital into high-turnover inventory."
  }
];

export default function SaudiArabiaMarketplaceWidget() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col items-center bg-gray-50/50">
      
      {/* Banner / Hero Header */}
      <CommonBanner 
        title="Buy & Sell Excess Inventory in Saudi Arabia"
        subtitle="Surplus Market connects sellers with genuine buyers looking for discounted, ready-to-purchase items across KSA."
        align="center"
        image="https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Regional Marketplace' },
          { label: 'Saudi Arabia' }
        ]}
      />

      {/* Hero Action Buttons Sub-Bar */}
      <div className="w-full bg-[#0a1e17] py-6 text-white border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider block mb-1">Regional Marketplace</span>
            <p className="text-sm text-gray-300 font-medium">B2B overstock liquidation and bulk sourcing across Riyadh, Jeddah, & Dammam</p>
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

        {/* Section 1: Overview & Why Choose Surplus Market for Saudi Arabia */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0a5c48] uppercase tracking-wider bg-[#e0f0e9] px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> Simple, Transparent, & Fast Liquidation
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Buy & Sell Excess Inventory in Saudi Arabia with Surplus Market
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Managing unsold goods and unused stock can be challenging for businesses in Saudi Arabia. Surplus Market makes the process easier by connecting sellers with genuine buyers who are looking for discounted, ready-to-purchase items.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Our platform works across industries, enabling businesses of any size to clear storage space, recover capital, and keep stock moving. You can list your products quickly and start receiving interest from surplus buyers without dealing with complicated processes.
              </p>
            </div>

            <div className="lg:col-span-5 bg-[#0a1e17] text-white rounded-2xl p-8 space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">
                Why Choose Surplus Market in KSA?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Surplus Market is designed to make buying and selling excess inventory in Saudi Arabia simple, transparent, and fast. We bring together a network of verified surplus inventory buyers actively searching for deals on overstock, end-of-line goods, and bulk lots.
              </p>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                By working with surplus liquidators in Saudi Arabia, we help ensure smooth transactions and quick turnarounds. If you are clearing warehouse space or sourcing discounted goods for resale, Surplus Market offers a trusted platform to get deals done efficiently.
              </p>
            </div>
          </div>

          {/* 4 Feature Props Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-100">
            {SAUDI_VALUE_PROPS.map((prop, idx) => {
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

        {/* Section 2: Buy & Sell Excess Inventory in Saudi Arabia at Discount Prices */}
        <section className="bg-[#e0f0e9]/40 border border-[#0a5c48]/20 rounded-3xl p-8 sm:p-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-wider block mb-2">Discounted Wholesale B2B</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Buy & Sell Excess Inventory in Saudi Arabia at Discount Prices
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              Our platform enables businesses to sell excess stock in Saudi Arabia without long delays. Every listing is visible to a wide audience, including resellers, traders, and wholesalers who value bulk purchase opportunities. This makes it easier to turn unsold stock into immediate revenue.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              For buyers, Surplus Market is like a surplus store in Saudi Arabia that is always open online. You can browse available goods in different categories and find products at attractive prices. This approach benefits both sides, as sellers reduce holding costs and buyers secure high-value stock at discounted rates.
            </p>
          </div>
        </section>

        {/* Section 3: Benefits of Selling Excess Stock in Saudi Arabia Through Surplus Market */}
        <section className="bg-[#0a1e17] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold text-green-400 uppercase tracking-wider block mb-2">Sellers & Buyers Advantages</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Benefits of Selling Excess Stock in Saudi Arabia Through Surplus Market
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Many businesses use Surplus Market not only to sell but also to discover new sources of supply. Selling excess inventory through our platform offers several key advantages:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SAUDI_BENEFITS.map((benefit, idx) => {
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

        {/* Section 4: How to Get Started with Surplus Market */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-wider block mb-2">Simple 4-Step Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              How to Get Started with Surplus Market
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Getting started on Surplus Market is straightforward and fast:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GET_STARTED_STEPS.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-[#0a5c48]/30">{step.step}</span>
                      <div className="w-10 h-10 rounded-full bg-[#e0f0e9] text-[#0a5c48] flex items-center justify-center">
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5: Good to Know (Saudi Arabia FAQs & Market Insights) */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#e0f0e9] text-[#0a5c48] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Good to Know – Saudi Arabia Market Insights</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Essential details about surplus inventory liquidation in Saudi Arabia</p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            {GOOD_TO_KNOW_SAUDI_FAQS.map((faq, idx) => {
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
