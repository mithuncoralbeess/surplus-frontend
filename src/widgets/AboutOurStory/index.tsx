"use client";

import React from 'react';
import Image from 'next/image';

export default function AboutOurStory() {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Warehouse Image */}
            <div className="relative lg:col-span-6 rounded-3xl overflow-hidden shadow-lg border border-gray-200 h-[380px] sm:h-[440px]">
              <Image 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80" 
                alt="Surplus Market Warehouse Logistics"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover" 
              />
            </div>

            {/* Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-widest block">
                OUR STORY
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Turning "slow and obsolete" into something valuable.
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
                Surplus Market was founded with a mission to reduce waste and maximize value from underused inventory. We're more than a platform; we're a community dedicated to creating a ripple effect that benefits businesses and the planet alike.
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
                Our roots are in Qatar, but our vision is global - where no inventory goes to waste, and every surplus finds a purpose.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
