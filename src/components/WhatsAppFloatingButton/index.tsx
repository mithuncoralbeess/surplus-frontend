"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, BellRing, Sparkles, X, ChevronRight, ShieldCheck } from 'lucide-react';
import WhatsAppSubscriptionModal from '../WhatsAppSubscriptionModal';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export default function WhatsAppFloatingButton({
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+974 3026 9988',
  defaultMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Hello Surplus Market, I have an inquiry about surplus inventory.',
}: WhatsAppFloatingButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };
    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  if (!mounted) return null;

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(defaultMessage);
  const directWhatsAppUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  const handleOpenDirectChat = () => {
    window.open(directWhatsAppUrl, '_blank');
    setIsPopoverOpen(false);
  };

  const handleOpenSubscription = () => {
    setIsSubscriptionModalOpen(true);
    setIsPopoverOpen(false);
  };

  return (
    <>
      <div 
        ref={containerRef}
        className="fixed bottom-6 right-6 z-40 flex flex-col items-end print:hidden select-none"
      >
        {/* Interactive Popover Menu */}
        {isPopoverOpen && (
          <div className="mb-3 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in origin-bottom-right transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0a5c48] via-[#0f7a61] to-[#074737] p-4 text-white relative">
              <button
                onClick={() => setIsPopoverOpen(false)}
                className="absolute top-3.5 right-3.5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                  Liquidation Desk • Online
                </span>
              </div>
              <h4 className="text-base font-extrabold text-white">
                Surplus WhatsApp Services
              </h4>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Fast-track inquiries, custom manifests & liquidation alerts.
              </p>
            </div>

            {/* Menu Options */}
            <div className="p-3 space-y-2">
              {/* Option 1: Direct WhatsApp Chat */}
              <button
                type="button"
                onClick={handleOpenDirectChat}
                className="w-full p-3 rounded-2xl bg-gray-50 hover:bg-[#e6f7ef] border border-gray-100 hover:border-emerald-200 transition-all flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0a5c48] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 group-hover:text-[#0a5c48] transition-colors">
                      Chat with Deals Desk
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Inquire on pricing, manifests, or logistics
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0a5c48] group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Option 2: Join WhatsApp Deal Alerts (50%-80% off drops) */}
              <button
                type="button"
                onClick={handleOpenSubscription}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-teal-50/50 hover:from-emerald-100/70 hover:to-teal-100/70 border border-emerald-100 transition-all flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0a5c48] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <BellRing className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-gray-900 group-hover:text-[#0a5c48] transition-colors">
                        VIP Liquidation Drops
                      </span>
                      <span className="text-[9px] font-extrabold uppercase bg-emerald-200/60 text-[#074737] px-1.5 py-0.2 rounded-full">
                        50-80% Off
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-600">
                      Receive matched drops directly via WhatsApp
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0a5c48] group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Bottom Footer Note */}
            <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified B2B Liquidation
              </span>
              <span>Sunday–Thursday</span>
            </div>
          </div>
        )}

        {/* Floating Action Button */}
        <div className="flex items-center gap-3">
          {/* Tooltip Pill */}
          {!isPopoverOpen && (
            <div 
              role="tooltip"
              onClick={() => setIsPopoverOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-white/95 text-gray-800 text-xs font-semibold px-3.5 py-2 rounded-full shadow-lg border border-gray-100 backdrop-blur-md opacity-0 hover:opacity-100 group-hover:opacity-100 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0a5c48] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0a5c48]"></span>
              </span>
              <span className="font-semibold text-gray-900">WhatsApp Desk & Drops</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            aria-label="Open WhatsApp Liquidation Menu"
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#0a5c48] hover:bg-[#084838] text-white shadow-[0_4px_20px_rgba(10,92,72,0.4)] hover:shadow-[0_6px_25px_rgba(10,92,72,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-[#0a5c48]/30 cursor-pointer"
          >
            {/* Radar Pulse Effect */}
            {!isPopoverOpen && (
              <span 
                aria-hidden="true" 
                className="absolute inset-0 rounded-full bg-[#0a5c48] opacity-30 animate-ping pointer-events-none"
              />
            )}

            {/* WhatsApp Icon */}
            <svg
              viewBox="0 0 32 32"
              className="w-7 h-7 fill-current relative z-10 text-white"
              aria-hidden="true"
            >
              <path d="M16 2C8.28 2 2 8.28 2 16c0 2.62.72 5.08 1.98 7.18L2 30l7.04-1.93A13.91 13.91 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm8.17 19.86c-.34.97-1.7 1.8-2.38 1.88-.63.07-1.42.1-4.07-.98-3.39-1.39-5.59-4.83-5.76-5.06-.17-.23-1.38-1.84-1.38-3.51 0-1.67.87-2.49 1.18-2.83.31-.34.68-.43.91-.43.23 0 .45.01.65.02.21.01.49-.08.77.59.29.68.98 2.39 1.07 2.56.09.17.15.37.03.6-.12.23-.18.37-.36.58-.18.21-.38.47-.54.63-.18.18-.37.38-.16.74.21.36.93 1.54 2 2.49 1.38 1.23 2.54 1.61 2.9 1.79.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.8-.18.33.12 2.07.98 2.42 1.15.36.18.6.27.69.42.09.15.09.89-.25 1.86z" />
            </svg>

            {/* Online Status Badge */}
            <span 
              aria-hidden="true" 
              className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full z-20 shadow-xs" 
            />
          </button>
        </div>
      </div>

      {/* Embedded Subscription Modal */}
      <WhatsAppSubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </>
  );
}
