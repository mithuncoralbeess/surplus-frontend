"use client";

import React from 'react';
import { Check } from 'lucide-react';

export default function SellTrustBar() {
  const TRUST_ITEMS = [
    {
      id: 'sellers',
      title: 'Hundreds of sellers',
      subtitle: 'Manufacturers, liquidators and retailers',
    },
    {
      id: 'verified',
      title: 'Every listing verified',
      subtitle: 'Reviewed by our compliance team before it goes live',
    },
    {
      id: 'identities',
      title: 'Identities never disclosed',
      subtitle: 'You never see or speak to buyers',
    },
    {
      id: 'fees',
      title: 'No upfront fees',
      subtitle: 'Logistics coordinated for you',
    },
  ];

  return (
    <section className="w-full bg-transparent py-10 sm:py-12 md:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 items-start">
          {TRUST_ITEMS.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#e6f4ea] text-[#0f7a61] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-[15px] leading-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
