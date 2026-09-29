"use client";

import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { motion } from '../../lib/motion';

const PromoBanner = () => {
  return (
    <section className="w-full py-12 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[#ffb861] to-[#ffaa41]"
        >
          
          {/* Left Side Content */}
          <div className="flex items-start gap-6">
            
            {/* Icon */}
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-white/30 flex items-center justify-center">
              <Flame className="w-6 h-6 text-gray-900" />
            </div>

            {/* Text Content */}
            <div className="flex flex-col">
              
              {/* Badge / Subheading */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900"></div>
                <span className="text-[11px] font-bold text-gray-900 tracking-wider uppercase">
                  Top Surplus Wholesale & Overstock Deals
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                Top Surplus Wholesale & Overstock Deals – Save Up to 80%
              </h2>

              {/* Paragraph */}
              <p className="text-[15px] text-gray-800/80 max-w-2xl leading-relaxed">
                Explore branded surplus, wholesale goods, and excess inventory for sale at unbeatable wholesale prices.
              </p>
            </div>
          </div>

          {/* Right Side Button */}
          <div className="flex-shrink-0">
            <button className="bg-[#051d14] hover:bg-[#082e20] text-white px-6 py-3.5 rounded-full font-medium text-[15px] transition-colors flex items-center gap-2 shadow-lg shadow-black/10">
              Shop the sale
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default PromoBanner;
