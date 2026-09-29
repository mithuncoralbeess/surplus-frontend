"use client";

import React from 'react';
import { Users, Truck, ShieldCheck } from 'lucide-react';

const HOW_WE_OPERATE = [
  {
    title: "No Middlemen",
    desc: "Inventory goes directly from seller to buyer, eliminating unnecessary storage and handling.",
    icon: Users
  },
  {
    title: "Logistics Excellence",
    desc: "Our logistics partners make sure every shipment is safe, fast, and traceable.",
    icon: Truck
  },
  {
    title: "Rigorous Quality Control",
    desc: "Only inventory that meets our high standards is listed, ensuring quality with every purchase.",
    icon: ShieldCheck
  }
];

export default function AboutHowWeOperate() {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-widest block">
            HOW WE OPERATE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Transparent, efficient, built for scale.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_WE_OPERATE.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#e0f0e9] text-[#0a5c48] flex items-center justify-center font-bold mb-6">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-normal">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
