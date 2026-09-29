"use client";

import React from 'react';
import { motion } from '../../lib/motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const SellCTA = () => {
  return (
    <section className="w-full py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#0a1e17] rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 blur-[80px] rounded-full pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
              Ready to clear out your warehouse?
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Join hundreds of manufacturers, liquidators, and retailers who use our AI-driven platform to recover capital from surplus inventory.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-white text-[#0a1e17] hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-[15px] transition-all flex items-center justify-center group"
              >
                Become a Seller
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-transparent border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold text-[15px] transition-all"
              >
                Talk to Sales
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>No upfront fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>Global buyer network</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>Logistics included</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default SellCTA;
