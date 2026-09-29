"use client";

import React from 'react';
import { motion } from '../../lib/motion';
import { Target, Globe } from 'lucide-react';

const GOALS = [
  {
    id: "Goal 12:",
    text: "Ensuring sustainable consumption and production patterns by promoting the reuse and repurposing of excess inventory."
  },
  {
    id: "Goal 12.5:",
    text: "By 2030, substantially reduce waste generation through prevention, reduction, recycling, and reuse."
  },
  {
    id: "Goal 12.7:",
    text: "Promote sustainable procurement practices that align with national policies and priorities."
  },
  {
    id: "Goal 9:",
    text: "Building resilient infrastructure and fostering sustainable industrialization."
  },
  {
    id: "Goal 9.4:",
    text: "By 2030, upgrade infrastructure to improve resource efficiency and adopt clean technologies."
  }
];

const SustainabilityGoals = () => {
  return (
    <section className="w-full py-16 bg-white relative">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        
        {/* Alignment Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            How We Align with Global and National Sustainability Goals
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mb-8">
            <strong className="text-gray-900 font-bold">Supporting the UN's Sustainable Development Goals (SDGs).</strong> Surplus Market is aligned with key sustainability and climate action goals, specifically:
          </p>

          <div className="space-y-6 mb-12">
            {GOALS.map((goal, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#e0f0e9] flex items-center justify-center text-[#0a5c48] shrink-0 mt-1">
                  <Target className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <p className="text-[16px] text-gray-600 leading-relaxed pt-2">
                  <strong className="text-gray-900 font-semibold">{goal.id}</strong> {goal.text}
                </p>
              </div>
            ))}
          </div>

          {/* Qatar Vision Callout */}
          <div className="p-6 md:p-8 rounded-2xl border border-[#0a5c48]/20 bg-[#e0f0e9]/40 flex items-start gap-4">
            <Globe className="w-6 h-6 text-[#0a5c48] shrink-0 mt-1" strokeWidth={2} />
            <p className="text-[16px] text-gray-800 leading-relaxed">
              <strong className="text-gray-900 font-bold">Qatar National Vision 2030.</strong> We proudly align with Qatar's national vision for environmental responsibility by actively supporting sustainable industry practices and encouraging the responsible use of resources.
            </p>
          </div>
        </motion.div>

        {/* Why it matters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Sustainability Matters to Us
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl">
            Sustainability is core to our values because it's essential for the future of both business and the environment. The stakes are high: waste from excess inventory contributes to pollution, resource depletion, and climate change. By championing a circular economy, we aim to shift the paradigm from disposable to sustainable.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default SustainabilityGoals;
