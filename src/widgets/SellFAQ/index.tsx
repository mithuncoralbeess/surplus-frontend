"use client";

import React from 'react';
import Accordion from '../../components/Accordion';
import { SELL_FAQS } from './faqData';

export default function SellFAQ() {
  return (
    <section className="w-full bg-white py-14 sm:py-16 md:py-20 border-b border-gray-200/60 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Section Heading */}
        <div className="text-center md:text-left mb-8 sm:mb-10">
          <h2 className="h2 font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            Everything you need to know about selling surplus inventory, buyer verification, privacy, and payouts.
          </p>
        </div>

        {/* Accordion Component */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-gray-200/80 shadow-xs">
          <Accordion
            items={SELL_FAQS}
            defaultOpenIndex={0}
            allowMultiple={false}
          />
        </div>
      </div>
    </section>
  );
}
