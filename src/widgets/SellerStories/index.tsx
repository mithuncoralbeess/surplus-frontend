"use client";

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StoryItem {
  id: string;
  category: string;
  badge?: string;
  companyName: string;
  location: string;
  recoveryRate: string;
  daysToSell: string;
  unitsCount: string;
  story: string;
  recoveredText: string;
}

const SELLER_STORIES: StoryItem[] = [
  {
    id: 'ab-limited',
    category: 'ELECTRICAL & LIGHTING',
    badge: 'SAMPLE',
    companyName: 'AB Limited',
    location: 'Dubai, UAE',
    recoveryRate: '68%',
    daysToSell: '14',
    unitsCount: '100',
    story: 'AB Limited was holding 100 units of overstocked lighting fixtures after a cancelled project. Listed as one lot, sold to a regional contractor.',
    recoveredText: 'Recovered: AED 184,000 on stock carried at AED 270,000',
  },
  {
    id: 'meridian-textiles',
    category: 'APPAREL & FOOTWEAR',
    badge: 'SAMPLE',
    companyName: 'Meridian Textiles',
    location: 'Surat, India',
    recoveryRate: '54%',
    daysToSell: '21',
    unitsCount: '2,400',
    story: 'End-of-season garments cleared through a spreadsheet upload, sold in pallet-sized batches to two buyers.',
    recoveredText: 'Recovered: ₹18.5 lakh on stock carried at ₹34 lakh',
  },
  {
    id: 'gulf-fabrication',
    category: 'INDUSTRIAL MACHINERY',
    badge: 'SAMPLE',
    companyName: 'Gulf Fabrication Co.',
    location: 'Dammam, Saudi Arabia',
    recoveryRate: '71%',
    daysToSell: '30',
    unitsCount: '18',
    story: 'Idle machining equipment and spare parts listed individually and sold without halting production.',
    recoveredText: 'Recovered: SAR 410,000 on equipment carried at SAR 580,000',
  },
  {
    id: 'al-rayyan',
    category: 'CONSTRUCTION & MRO',
    badge: 'SAMPLE',
    companyName: 'Al Rayyan Supplies',
    location: 'Doha, Qatar',
    recoveryRate: '64%',
    daysToSell: '17',
    unitsCount: '480',
    story: 'Commercial plumbing fittings and valves from completed project liquidated in bulk to regional MEP contractors.',
    recoveredText: 'Recovered: QAR 295,000 on stock carried at QAR 460,000',
  },
  {
    id: 'al-bahar',
    category: 'AUTOMOTIVE & FLEET',
    badge: 'SAMPLE',
    companyName: 'Al-Bahar Logistics',
    location: 'Kuwait City, Kuwait',
    recoveryRate: '69%',
    daysToSell: '24',
    unitsCount: '32',
    story: 'Commercial fleet surplus and maintenance spare parts package cleared to a regional transport contractor.',
    recoveredText: 'Recovered: KWD 48,000 on inventory carried at KWD 70,000',
  },
  {
    id: 'zenith-electronics',
    category: 'ELECTRONICS & ICT',
    badge: 'SAMPLE',
    companyName: 'Zenith Electronics',
    location: 'Bengaluru, India',
    recoveryRate: '58%',
    daysToSell: '12',
    unitsCount: '1,200',
    story: 'Overstock networking equipment and enterprise switches liquidated in one bulk consignment to IT service providers.',
    recoveredText: 'Recovered: ₹32 lakh on stock carried at ₹55 lakh',
  },
];

export default function SellerStories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const card = scrollContainerRef.current.firstElementChild as HTMLElement;
      const cardWidth = card ? card.offsetWidth + 20 : 360;
      scrollContainerRef.current.scrollBy({
        left: direction === 'right' ? cardWidth : -cardWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full bg-[#fbfaf6] py-14 sm:py-16 md:py-20 border-b border-gray-200/60 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header Row */}
        <div className="mb-8 sm:mb-10">
          <span className="block text-xs font-bold text-[#0f7a61] uppercase tracking-wider mb-2">
            SELLER STORIES
          </span>
          <h2 className="h2 font-black text-gray-900 tracking-tight leading-tight mb-2.5">
            How sellers turned excess stock into cash
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Real recovery, real timelines, from the sellers who listed with us.
          </p>
        </div>

        {/* Scroll Hint & Navigation Arrows */}
        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5">
          <span className="text-xs text-slate-400 font-medium select-none">
            Swipe or scroll to see more →
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-gray-400 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              aria-label="Scroll stories left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-gray-400 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              aria-label="Scroll stories right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel (3.4 slides per view on desktop) */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'thin' }}
        >
          {SELLER_STORIES.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-xs flex flex-col justify-between shrink-0 snap-start hover:shadow-md hover:border-gray-300 transition-all duration-200 w-[84vw] sm:w-[calc((100%-1.25rem)/1.8)] md:w-[calc((100%-2*1.25rem)/2.4)] lg:w-[calc((100%-3*1.25rem)/3.4)]"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-[#e8f5e9] text-[#0f7a61] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                  {item.badge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] text-[10px] font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Company Name & Location */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5 tracking-tight">
                  {item.companyName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                  {item.location}
                </p>

                {/* 3 Metric Stats */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 items-baseline">
                  {/* Recovery */}
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-[28px] font-black text-[#0f7a61] tracking-tight leading-none mb-1">
                      {item.recoveryRate}
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                      recovery
                    </div>
                  </div>

                  {/* Days */}
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-[28px] font-black text-slate-900 tracking-tight leading-none mb-1">
                      {item.daysToSell} <span className="text-sm sm:text-base font-bold">days</span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                      to sell
                    </div>
                  </div>

                  {/* Units */}
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-[28px] font-black text-slate-900 tracking-tight leading-none mb-1">
                      {item.unitsCount}
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                      units
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-5" />

                {/* Story Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {item.story}
                </p>
              </div>

              {/* Financial Recovery Line */}
              <div className="pt-2 text-xs sm:text-sm font-bold text-slate-900 border-t border-gray-100/80">
                {item.recoveredText}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
