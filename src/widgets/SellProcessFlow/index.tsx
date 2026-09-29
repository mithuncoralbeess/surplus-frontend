"use client";

import React from 'react';
import { motion } from '../../lib/motion';
import { FileUp, Cpu, Gavel, DollarSign } from 'lucide-react';

const STEPS = [
  {
    icon: FileUp,
    title: "1. Upload Inventory",
    description: "Upload your manifest or snap a few photos. Our platform handles bulk imports of any size."
  },
  {
    icon: Cpu,
    title: "2. AI Processing",
    description: "Our proprietary AI categorizes, enriches, and sets optimal starting prices for your lots."
  },
  {
    icon: Gavel,
    title: "3. Bidding & Sale",
    description: "Your inventory goes live to thousands of vetted buyers who compete to give you the best price."
  },
  {
    icon: DollarSign,
    title: "4. Ship & Get Paid",
    description: "We handle the logistics and freight scheduling. You just prep the pallets and get paid fast."
  }
];

const SellProcessFlow = () => {
  return (
    <section className="w-full py-24 bg-[#fdfcf9] relative border-y border-gray-100">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span className="text-[11px] font-bold text-primary tracking-widest uppercase">
              How It Works
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.1]">
            From Pallet to Profit in Days
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-gray-200 via-primary/30 to-gray-200 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-24 h-24 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary/20 transition-colors duration-500"></div>
                    <Icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
                    
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-md">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title.split('. ')[1]}
                  </h3>
                  <p className="text-[15px] text-gray-500 leading-relaxed max-w-[240px]">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SellProcessFlow;
