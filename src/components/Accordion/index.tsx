"use client";

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export interface AccordionItemData {
  id?: string | number;
  question: string;
  answer: string | React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenIndex?: number | null;
  allowMultiple?: boolean;
  className?: string;
  activeBorderColor?: string;
  activeButtonColor?: string;
}

export default function Accordion({
  items,
  defaultOpenIndex = 0,
  allowMultiple = false,
  className = '',
  activeBorderColor = 'border-[#0f7a61]',
  activeButtonColor = 'bg-[#0f7a61] text-white',
}: AccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>(() => {
    return defaultOpenIndex !== null && defaultOpenIndex !== undefined && defaultOpenIndex >= 0
      ? [defaultOpenIndex]
      : [];
  });

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={`space-y-3 sm:space-y-3.5 ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        return (
          <div
            key={item.id ?? idx}
            className={`border rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 bg-white ${
              isOpen
                ? `${activeBorderColor} shadow-2xs`
                : 'border-gray-200/90 hover:border-gray-300'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleItem(idx)}
              className="w-full flex items-center justify-between p-3.5 sm:p-5 text-left focus:outline-none cursor-pointer group"
              aria-expanded={isOpen}
            >
              <span className="text-sm sm:text-base md:text-[17px] font-bold text-gray-900 pr-3 sm:pr-4 leading-snug">
                {item.question}
              </span>
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isOpen
                    ? activeButtonColor
                    : 'bg-[#f1f5f9] text-gray-500 group-hover:bg-gray-200/80 group-hover:text-gray-700'
                }`}
              >
                {isOpen ? (
                  <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                ) : (
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-5 pt-0 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-gray-100/90">
                <div className="pt-3 sm:pt-3.5">
                  {typeof item.answer === 'string' ? (
                    <p>{item.answer}</p>
                  ) : (
                    item.answer
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
