"use client";

import React, { useState, useEffect } from 'react';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export default function WhatsAppFloatingButton({
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+974 3026 9988',
  defaultMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Hello Surplus Market, I have an inquiry about surplus inventory.',
}: WhatsAppFloatingButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Format clean international digits without spaces, pluses, or dashes
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 print:hidden group">
      {/* Interactive Tooltip Pill (Desktop) */}
      <div 
        role="tooltip"
        className="hidden sm:flex items-center gap-2 bg-white/95 text-gray-800 text-xs font-semibold px-3.5 py-2 rounded-full shadow-lg border border-gray-100 backdrop-blur-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0a5c48] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0a5c48]"></span>
        </span>
        <span className="font-semibold text-gray-900">Chat on WhatsApp</span>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Surplus Market on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#0a5c48] hover:bg-[#084838] text-white shadow-[0_4px_20px_rgba(10,92,72,0.4)] hover:shadow-[0_6px_25px_rgba(10,92,72,0.6)] hover:scale-110 active:scale-95 transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-[#0a5c48]/30 cursor-pointer"
      >
        {/* Radar Pulse Effect */}
        <span 
          aria-hidden="true" 
          className="absolute inset-0 rounded-full bg-[#0a5c48] opacity-30 animate-ping pointer-events-none"
        />

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
      </a>
    </div>
  );
}
