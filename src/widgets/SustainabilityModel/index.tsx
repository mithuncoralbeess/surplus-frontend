"use client";

import React from 'react';
import { motion, Variants } from '../../lib/motion';
import { Package, ShieldCheck, Truck } from 'lucide-react';

const MODELS = [
  {
    icon: Package,
    title: "Direct from Seller to Buyer",
    description: "Our no-warehouse model ensures that every product is shipped directly from the seller's location to the buyer, reducing additional transport and storage emissions."
  },
  {
    icon: ShieldCheck,
    title: "Verified, Quality-Centric Listings",
    description: "Only products that pass our rigorous quality checks are listed, ensuring buyers receive quality inventory that aligns with responsible sourcing practices."
  },
  {
    icon: Truck,
    title: "Logistics Excellence",
    description: "We partner with logistics providers who prioritize eco-friendly practices, ensuring that every delivery minimizes environmental impact."
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

const SustainabilityModel = () => {
  return (
    <section className="w-full pb-24 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Model: Sustainability in Every Transaction
          </h2>
        </motion.div>

        {/* 3 Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {MODELS.map((model, index) => {
            const Icon = model.icon;
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="p-8 rounded-3xl border border-gray-200 bg-white shadow-sm flex flex-col"
              >
                <div className="w-12 h-12 rounded-full bg-[#e0f0e9] flex items-center justify-center text-[#0a5c48] mb-6">
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {model.title}
                </h3>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  {model.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default SustainabilityModel;
