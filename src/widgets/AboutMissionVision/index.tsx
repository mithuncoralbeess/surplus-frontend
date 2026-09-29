"use client";

import React from 'react';
import { Target, Eye } from 'lucide-react';

export default function AboutMissionVision() {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="bg-[#e2f7ed] rounded-3xl p-8 sm:p-14 border border-[#0a5c48]/20 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Our Mission */}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#0a5c48] text-white flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900">Our Mission</h3>
              <p className="text-base text-gray-700 leading-relaxed font-normal">
                Transform inventory liquidation by turning distressed assets into growth opportunities.
              </p>
            </div>

            {/* Our Vision */}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#0a5c48] text-white flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900">Our Vision</h3>
              <p className="text-base text-gray-700 leading-relaxed font-normal">
                A world where excess inventory fuels sustainable business and community ecosystems.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
