"use client";

import React, { useState } from 'react';
import { Sparkles, ArrowRight, BellRing, ShieldCheck } from 'lucide-react';
import WhatsAppSubscriptionModal from '../WhatsAppSubscriptionModal';

interface WhatsAppAlertBannerProps {
  category?: string;
  className?: string;
}

export default function WhatsAppAlertBanner({
  category,
  className = '',
}: WhatsAppAlertBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a5c48] via-[#0f7a61] to-[#084838] p-5 sm:p-6 text-white shadow-md border border-emerald-600/30 ${className}`}
      >
        {/* Glow Effects */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Real-Time Wholesale Drops</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Get Instant Liquidation Drops on WhatsApp ⚡
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Wholesale pallets and excess inventories are often claimed within 2 hours. Subscribe your WhatsApp to receive verified manifests with <strong>50%–80% off</strong> before public release.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="py-3 px-5 bg-white hover:bg-emerald-50 text-[#0a5c48] rounded-full font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <BellRing className="w-4 h-4 text-[#0a5c48]" />
              <span>Subscribe for Drops</span>
              <ArrowRight className="w-4 h-4 text-[#0a5c48]" />
            </button>
          </div>
        </div>

        {/* Bottom micro trust row */}
        <div className="relative z-10 mt-3 pt-3 border-t border-emerald-600/40 flex flex-wrap items-center gap-4 text-[10px] sm:text-[11px] text-emerald-200/80">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            Verified corporate sellers
          </span>
          <span>•</span>
          <span>Zero spam guarantee</span>
          <span>•</span>
          <span>Unsubscribe anytime via WhatsApp</span>
        </div>
      </div>

      <WhatsAppSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCategory={category}
      />
    </>
  );
}
