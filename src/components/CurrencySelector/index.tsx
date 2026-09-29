"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useCurrency, CURRENCY_OPTIONS } from '../../context/CurrencyContext';

const CurrencySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, setCurrency, activeOption, currencyOptions, isLiveRates } = useCurrency();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <div 
        className="flex items-center cursor-pointer text-gray-600 hover:text-gray-900 font-medium text-[14px] bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200/80 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        title="Change currency"
      >
        <span className="font-semibold text-gray-800 text-[13px]">{activeOption.code} ({activeOption.symbol})</span>
        {isOpen ? (
          <ChevronUp className="ml-1 w-3.5 h-3.5 text-gray-500" />
        ) : (
          <ChevronDown className="ml-1 w-3.5 h-3.5 text-gray-500" />
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          data-lenis-prevent
          className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="p-3 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-[14px]">Select Currency</h3>
              <p className="text-gray-500 text-[11px] mt-0.5">All prices update dynamically.</p>
            </div>
            {isLiveRates && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Live Rates
              </span>
            )}
          </div>
          
          <div className="h-px bg-gray-100"></div>
          
          <div data-lenis-prevent className="py-1.5 max-h-64 overflow-y-auto" onWheel={(e) => e.stopPropagation()}>
            {currencyOptions.map((opt) => {
              const isSelected = opt.code === currency;
              return (
                <button
                  key={opt.code}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-[14px] transition-colors ${
                    isSelected
                      ? 'bg-[#e6f7ef] text-[#0f7a61] font-medium'
                      : 'text-gray-700 hover:bg-[#e6f7ef] hover:text-[#0f7a61]'
                  }`}
                  onClick={() => {
                    setCurrency(opt.code);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900 w-10">{opt.code}</span>
                    <span className="text-xs text-gray-500">{opt.name} ({opt.symbol})</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#0f7a61]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
