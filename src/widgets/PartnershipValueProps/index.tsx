"use client";

import React from 'react';
import { motion, Variants } from '../../lib/motion';
import { TrendingUp, Leaf, Truck, Recycle, ArrowRight } from 'lucide-react';

const BENEFITS = [
  {
    category: "Revenue Share",
    icon: TrendingUp,
    title: "Referral Partners",
    description: "Connect us with businesses and earn from successful referrals."
  },
  {
    category: "Sustainability",
    icon: Leaf,
    title: "ESG Partners",
    description: "Help businesses turn surplus into measurable ESG impact."
  },
  {
    category: "Fulfillment",
    icon: Truck,
    title: "Logistics Partners",
    description: "Support seamless movement, storage, and fulfilment of inventory."
  },
  {
    category: "Value Recovery",
    icon: Recycle,
    title: "Liquidation Partners",
    description: "Help businesses unlock value from surplus inventory."
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const PartnershipValueProps = () => {
  return (
    <section className="w-full pt-24 pb-12 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-bold text-[#0a5c48] tracking-widest uppercase">
              PARTNERSHIP OPPORTUNITIES
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.1] max-w-2xl">
            Our Collaboration Models
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-3xl">
            Explore the different ways we partner with businesses to create mutual value and scale operations across the surplus ecosystem.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="group p-8 rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:shadow-black/[0.03] hover:border-[#0a5c48]/30 transition-all duration-300 flex flex-col h-full cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#e0f0e9] flex items-center justify-center text-[#0a5c48] group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-semibold text-[#0a5c48] bg-[#e0f0e9]/50 px-3 py-1 rounded-full">{benefit.category}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-[15px] text-gray-500 leading-relaxed flex-grow mb-8">
                  {benefit.description}
                </p>
                <div className="flex items-center text-[#0a5c48] font-semibold text-sm group-hover:gap-3 transition-all duration-300 gap-2 mt-auto">
                  Explore opportunities <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default PartnershipValueProps;
