"use client";

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from '../../lib/motion';

const SellerPromoBanner = () => {
  return (
    <section className="w-full py-12 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[#0d2a1f] to-[#1a5b42]"
        >
          
          {/* Left Side Content */}
          <div className="flex items-start gap-6 w-full md:w-auto">
            
            {/* Icon */}
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            {/* Text Content */}
            <div className="flex flex-col">
              
              {/* Badge / Subheading */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff9933]"></div>
                <span className="text-[11px] font-bold text-[#ff9933] tracking-widest uppercase">
                  Sellers
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                Ready to Recover Value from Your Excess Inventory?
              </h2>

              {/* Paragraph */}
              <p className="text-[15px] text-gray-300 max-w-2xl leading-relaxed">
                List surplus inventory in minutes. Our deal desk handles buyer contact, pricing, logistics, and payment - you stay anonymous.
              </p>
            </div>
          </div>

          {/* Right Side Button */}
          <div className="flex-shrink-0 w-full md:w-auto">
            <button className="w-full md:w-auto bg-[#ff9933] hover:bg-[#e68a2e] text-[#051d14] px-7 py-3.5 rounded-full font-bold text-[15px] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/10">
              Sell excess stock
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default SellerPromoBanner;
