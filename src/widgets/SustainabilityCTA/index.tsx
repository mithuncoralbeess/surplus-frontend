"use client";

import React from 'react';
import { motion } from '../../lib/motion';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

const SustainabilityCTA = () => {
  return (
    <section className="w-full py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#0a5c48] rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0a1e17]/30 blur-[80px] rounded-full pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
              Join the Circular Economy
            </h2>
            
            <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-2xl">
              Start buying and selling surplus inventory today. Reduce your footprint, recover value, and help us build a more sustainable future for global trade.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link
                href="/sell"
                className="w-full sm:w-auto bg-white text-[#0a5c48] hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-[15px] transition-all flex items-center justify-center"
              >
                Start Selling
              </Link>
              <Link
                href="/browse"
                className="w-full sm:w-auto bg-transparent border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold text-[15px] transition-all flex items-center justify-center"
              >
                Browse Inventory
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default SustainabilityCTA;
