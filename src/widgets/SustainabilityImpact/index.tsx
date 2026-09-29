"use client";

import React from 'react';
import { motion, Variants } from '../../lib/motion';
import { Trash2, Building2, Recycle } from 'lucide-react';

const IMPACTS = [
  {
    icon: Trash2,
    title: "Preventing Waste",
    description: "We focus on liquidating slow-moving and obsolete stock (SLOB), reducing the volume of goods that would otherwise end up in landfills or incinerators."
  },
  {
    icon: Building2,
    title: "Empowering Businesses",
    description: "Our marketplace allows companies to reclaim value from unused assets, converting potential losses into revenue."
  },
  {
    icon: Recycle,
    title: "Fostering a Circular Economy",
    description: "We are building a sustainable ecosystem where surplus inventory is repurposed, reused, and reintegrated into the economy."
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

const SustainabilityImpact = () => {
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
            Our Impact: Turning Surplus into Sustainable Success
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl">
            <strong className="text-gray-900 font-bold">Together, We Make a Difference.</strong> Every transaction on Surplus Market contributes to a larger mission. Buyers and sellers who partner with us are helping reduce waste, cut down on new production, and support a more circular economy.
          </p>
        </motion.div>

        {/* 3 Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {IMPACTS.map((impact, index) => {
            const Icon = impact.icon;
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
                  {impact.title}
                </h3>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  {impact.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Big Numbers Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-10 md:p-12 rounded-[2.5rem] bg-gray-50 border border-gray-100"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">
            Big Numbers, Big Impact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-[#0a5c48] tracking-tight mb-4">
                1,000+ tons
              </div>
              <p className="text-gray-600 text-[15px] leading-relaxed">
                of surplus inventory diverted from waste annually through responsible transactions.
              </p>
            </div>
            
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-[#0a5c48] tracking-tight mb-4">
                50%
              </div>
              <p className="text-gray-600 text-[15px] leading-relaxed">
                average reduction in storage costs for sellers who liquidate excess through our platform.
              </p>
            </div>
            
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-[#0a5c48] tracking-tight mb-4">
                70%
              </div>
              <p className="text-gray-600 text-[15px] leading-relaxed">
                savings for buyers on quality inventory compared to traditional retail channels.
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            (Sources: World Bank, Global Waste Report)
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default SustainabilityImpact;
