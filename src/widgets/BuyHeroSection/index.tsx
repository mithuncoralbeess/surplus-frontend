"use client";

import React, { useEffect } from 'react';
import { ShieldCheck, Truck, Clock, RefreshCcw } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const BuyHeroSection = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <>
      {/* Premium Hero Section */}
      <section className="relative bg-[#0f7a61] text-white pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f7a61] to-[#064233] opacity-90" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#14a382]/20 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4" />

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10 text-center" data-aos="fade-up">

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Source Verified Surplus <br className="hidden md:block" />
            <span className="text-[#a8e6cf]">at Clearance Prices</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-50 max-w-2xl mx-auto mb-8 font-medium">
            Discover high-quality overstock, customer returns, and wholesale liquidation inventory. Unbeatable prices, verified conditions.
          </p>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="relative -mt-8 z-20 container mx-auto px-4 lg:px-8 max-w-7xl mb-12">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6" data-aos="fade-up" data-aos-delay="100">
          {[
            { icon: ShieldCheck, title: "Verified Inventory", desc: "100% quality checked" },
            { icon: Truck, title: "Fast Shipping", desc: "Nationwide delivery" },
            { icon: Clock, title: "24/7 Support", desc: "Always here to help" },
            { icon: RefreshCcw, title: "Hassle-Free", desc: "Easy purchasing process" },
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <feature.icon className="w-6 h-6 text-[#0f7a61]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{feature.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default BuyHeroSection;
