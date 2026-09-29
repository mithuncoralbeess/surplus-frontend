"use client";

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion } from '../../lib/motion';

const FAQ_DATA = [
  {
    question: "What types of surplus inventory can I sell?",
    answer: "We accept a wide range of surplus, including electronics, apparel, industrial equipment, and consumer goods. All items must pass our condition verification process before being listed to our verified buyers."
  },
  {
    question: "How does the AI enrichment process work?",
    answer: "Our proprietary AI automatically categorizes your uploads, generates optimized titles, estimates ESG impact, and grades condition based on photos and descriptions, saving your team hours of manual data entry."
  },
  {
    question: "Are the buyers on the platform verified?",
    answer: "Yes, every buyer undergoes a strict identity, financial, and compliance verification process before they are approved to bid on or purchase wholesale lots."
  },
  {
    question: "How is shipping and logistics handled?",
    answer: "You can choose to handle logistics independently or leverage our integrated freight partners for discounted, fully-tracked LTL and FTL shipping across 82 global markets."
  },
  {
    question: "How long does it take for a listing to go live?",
    answer: "Once you upload your inventory, our automated verification and enrichment queue typically processes and approves listings within 24 hours."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      className="w-full py-24 relative"
      style={{ backgroundColor: 'oklch(18% .02 180)' }}
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            <span className="text-[11px] font-bold text-green-400 tracking-widest uppercase">
              Support
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[16px] text-gray-300">
            Everything you need to know about buying and selling on Surplus Market.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                  isOpen 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-transparent border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-[17px] font-bold text-white pr-8">
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-green-400 text-[#0f291e]' : 'bg-white/10 text-white'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 pt-0 text-gray-300 text-[15px] leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default FAQ;
