"use client";

import React from 'react';
import { motion } from '../../lib/motion';

const SustainabilityMission = () => {
  return (
    <section className="w-full py-20 bg-white relative">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        
        {/* Mission Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Mission for a Sustainable Future
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl">
            At Surplus Market, we believe that sustainability isn't just an option - it's our responsibility. Our mission is to turn excess inventory into opportunity, creating a marketplace that values every asset and ensures nothing is wasted. We are driven to empower businesses to transform surplus into value, while actively reducing environmental impact.
          </p>
        </motion.div>

        {/* Problem Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            The Problem with Surplus Waste
          </h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-8 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col justify-center">
              <div className="text-4xl md:text-5xl font-extrabold text-[#0a5c48] tracking-tight mb-4">
                2.01 Billion Metric Tons
              </div>
              <p className="text-gray-600 text-[15px] leading-relaxed">
                of global waste generated each year, with manufacturing and retail as major contributors.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col justify-center">
              <div className="text-4xl md:text-5xl font-extrabold text-[#0a5c48] tracking-tight mb-4">
                3.4 Billion Metric Tons
              </div>
              <p className="text-gray-600 text-[15px] leading-relaxed">
                projected global waste by 2050 if no action is taken.
              </p>
            </div>
          </div>

          {/* Description below stats */}
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mb-6">
            Each year, the manufacturing and retail industries add significantly to the world's waste, with slow-moving and obsolete stock (SLOB) often ending up in landfills. Surplus Market aims to change this by connecting buyers and sellers in a system that maximizes resource use and minimizes waste, transforming surplus into opportunity.
          </p>
          
          <p className="text-sm text-gray-400">
            (Data Source: World Bank)
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default SustainabilityMission;
