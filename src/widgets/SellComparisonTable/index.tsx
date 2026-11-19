"use client";

import React from 'react';

interface ComparisonRow {
  dimension: string;
  surplusMarket: string;
  ownChannels: string;
  localDealer: string;
  holdAndWait: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    dimension: 'Reach',
    surplusMarket: 'Professional B2B buyers across regions',
    ownChannels: 'Existing customers only',
    localDealer: 'One or two local buyers',
    holdAndWait: 'None',
  },
  {
    dimension: 'Brand exposure',
    surplusMarket: 'Identities never disclosed',
    ownChannels: 'Visible to your customers',
    localDealer: 'Usually discreet',
    holdAndWait: 'N/A',
  },
  {
    dimension: 'Effort for you',
    surplusMarket: 'Low — we handle buyers, payment, delivery coordination',
    ownChannels: 'High — discounts, promotion, fulfilment',
    localDealer: 'Medium — negotiation',
    holdAndWait: 'None, but costs keep running',
  },
  {
    dimension: 'Upfront cost',
    surplusMarket: 'No upfront fees',
    ownChannels: 'Marketing and discount cost',
    localDealer: 'Often none',
    holdAndWait: 'Storage, insurance, ageing',
  },
  {
    dimension: 'Speed',
    surplusMarket: 'List, verify, sell',
    ownChannels: 'Slow and uneven',
    localDealer: 'Quick but often at lower value',
    holdAndWait: 'Unpredictable',
  },
];

export default function SellComparisonTable() {
  return (
    <section className="w-full bg-[#faf8f5] py-14 sm:py-16 md:py-20 border-b border-gray-200/60 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-[#0f172a] tracking-tight leading-tight mb-8 sm:mb-10">
          Selling excess inventory: how the options compare
        </h2>

        {/* Responsive Table Card */}
        <div className="w-full overflow-x-auto rounded-2xl border border-[#e5e0d5] bg-white shadow-xs">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm sm:text-[15px]">
            <thead>
              <tr className="border-b border-[#e5e0d5]">
                <th className="w-[18%] bg-[#f4efe6] px-5 py-4 font-semibold text-slate-700"></th>
                <th className="w-[26%] bg-[#e3efe7] px-5 sm:px-6 py-4.5 font-bold text-[#0f5c44]">
                  Sell on Surplus Market
                </th>
                <th className="w-[20%] bg-[#f4efe6] px-5 sm:px-6 py-4.5 font-bold text-slate-900">
                  Discount on your own channels
                </th>
                <th className="w-[20%] bg-[#f4efe6] px-5 sm:px-6 py-4.5 font-bold text-slate-900">
                  Local scrap / bulk dealer
                </th>
                <th className="w-[16%] bg-[#f4efe6] px-5 sm:px-6 py-4.5 font-bold text-slate-900">
                  Hold and wait
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebe6dc]">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.dimension} className="transition-colors hover:bg-stone-50/50">
                  {/* Dimension Name */}
                  <td className="px-5 py-4 sm:py-5 font-bold text-slate-900 bg-white align-top">
                    {row.dimension}
                  </td>

                  {/* Sell on Surplus Market (Highlighted column) */}
                  <td className="px-5 sm:px-6 py-4 sm:py-5 font-medium text-slate-800 bg-[#edf6f1] align-top leading-relaxed">
                    {row.surplusMarket}
                  </td>

                  {/* Discount on your own channels */}
                  <td className="px-5 sm:px-6 py-4 sm:py-5 text-slate-700 bg-white align-top leading-relaxed">
                    {row.ownChannels}
                  </td>

                  {/* Local scrap / bulk dealer */}
                  <td className="px-5 sm:px-6 py-4 sm:py-5 text-slate-700 bg-white align-top leading-relaxed">
                    {row.localDealer}
                  </td>

                  {/* Hold and wait */}
                  <td className="px-5 sm:px-6 py-4 sm:py-5 text-slate-700 bg-white align-top leading-relaxed">
                    {row.holdAndWait}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Disclaimer */}
        <p className="mt-4 sm:mt-5 text-xs text-stone-500 font-normal">
          Directional comparison. Confirm claims with the commercial team before publishing.
        </p>
      </div>
    </section>
  );
}
