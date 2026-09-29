"use client";

import React from 'react';
import { Truck, Handshake, Leaf, Sparkles } from 'lucide-react';

const WHAT_WE_DO = [
  {
    title: "Direct-to-Buyer Shipments",
    desc: "We ship directly from seller warehouses, maintaining quality through rigorous checks.",
    icon: Truck
  },
  {
    title: "Inclusive Trading Model",
    desc: "Buyers can become sellers and vice versa, creating a fluid marketplace for all.",
    icon: Handshake
  },
  {
    title: "Focused on Sustainability",
    desc: "We align with global climate goals, partnering to reduce waste and promote eco-friendly practices.",
    icon: Leaf
  },
  {
    title: "Tech-Driven Efficiency",
    desc: "We leverage cutting-edge technology to streamline operations, enhance user experiences, and ensure transparency.",
    icon: Sparkles
  }
];

export default function AboutWhatWeDo() {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl space-y-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-widest block">
            WHAT WE DO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            A flexible, circular marketplace for surplus stock.
          </h2>
          <p className="text-base text-gray-600 leading-relaxed font-normal">
            We facilitate the seamless liquidation of distressed inventory - dead stock, slow-moving goods, and near-expiry items - by connecting verified buyers and sellers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHAT_WE_DO.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#e0f0e9] text-[#0a5c48] flex items-center justify-center font-bold mb-6">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
