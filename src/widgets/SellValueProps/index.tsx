"use client";

import React from 'react';
import { motion, Variants } from '../../lib/motion';
import { Boxes, UserPlus, MailCheck, PackagePlus, Eye, Send, Building, ClipboardCheck, LayoutDashboard } from 'lucide-react';

const STEPS = [
  {
    id: "01",
    icon: Boxes,
    title: "Choose a method",
    description: "Pick how you want to list - simple inventory listing (1-10 items) or lot inventory listing (>10 SKUs)."
  },
  {
    id: "02",
    icon: UserPlus,
    title: "Seller signup",
    description: "Just your name and email to create a draft seller profile."
  },
  {
    id: "03",
    icon: MailCheck,
    title: "Verify email",
    description: "Confirm the 6-digit code we send. Takes 30 seconds."
  },
  {
    id: "04",
    icon: PackagePlus,
    title: "Add inventory",
    description: "Enter item details, upload media, or drop your spreadsheet."
  },
  {
    id: "05",
    icon: Eye,
    title: "Preview listing",
    description: "Review the auto-drafted title, category, condition and specs."
  },
  {
    id: "06",
    icon: Send,
    title: "Publish draft",
    description: "Send the listing to Surplus Market for verification."
  },
  {
    id: "07",
    icon: Building,
    title: "Company details",
    description: "Add trade licence, contact and payout information."
  },
  {
    id: "08",
    icon: ClipboardCheck,
    title: "Submit for review",
    description: "Our compliance team verifies before it goes live."
  },
  {
    id: "09",
    icon: LayoutDashboard,
    title: "Seller dashboard",
    description: "Track offers, buyer interest and payouts in one place."
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const SellValueProps = () => {
  return (
    <section className="w-full pt-24 pb-12 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-bold text-[#0a5c48] tracking-widest uppercase">
              THE SELLER JOURNEY
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.1] max-w-2xl">
            List first. Verify before publishing.
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-3xl">
            A guided 9-step flow - no long forms upfront, AI does the heavy lifting, and our team verifies every listing before it goes live.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group p-8 rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:shadow-black/[0.03] hover:border-[#0a5c48]/30 transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#e0f0e9] flex items-center justify-center text-[#0a5c48] group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-semibold text-gray-400">{step.id}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default SellValueProps;
