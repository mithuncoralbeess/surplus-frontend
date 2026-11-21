"use client";

import React from 'react';
import { ShieldCheck, FileText, Truck, Lock } from 'lucide-react';

export default function RegionalTrustBar() {
  const TRUST_ITEMS = [
    {
      id: 'verified',
      icon: ShieldCheck,
      title: 'Verified sellers',
      subtitle: 'Every listing is reviewed',
    },
    {
      id: 'inspected',
      icon: FileText,
      title: 'Pre-inspected lots',
      subtitle: 'Pallets and container manifests',
    },
    {
      id: 'dispatch',
      icon: Truck,
      title: 'Fast freight dispatch',
      subtitle: 'Ready to ship',
    },
    {
      id: 'private',
      icon: Lock,
      title: 'Private by design',
      subtitle: 'Identities are never disclosed',
    },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 md:p-6 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-start sm:items-center">
        {TRUST_ITEMS.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="text-[#0f7a61] shrink-0 mt-0.5">
              <item.icon className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-bold !text-black text-black text-sm sm:text-[15px] leading-tight">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
