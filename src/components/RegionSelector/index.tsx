"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, ChevronUp, Check } from 'lucide-react';
import flags from 'react-phone-number-input/flags';
import { useCurrency, REGIONS_LIST, getShortRegionName } from '../../context/CurrencyContext';

const REGION_FLAG_MAP: Record<string, keyof typeof flags> = {
  'United Arab Emirates': 'AE',
  'Saudi Arabia': 'SA',
  'Qatar': 'QA',
  'India': 'IN',
  'United Kingdom': 'GB',
  'United States': 'US',
};

const RegionSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedRegion, setSelectedRegion } = useCurrency();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ActiveFlag = flags[REGION_FLAG_MAP[selectedRegion] || 'US'] as any;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <div
        className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-gray-900 font-medium text-[12px] bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-full border border-gray-200/80 transition-colors header-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Change shopping region"
      >
        {ActiveFlag ? (
          <span 
            className="region-flag-container relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-[2px] border border-black/15 shadow-xs bg-white"
            style={{ width: '20px', height: '14px', minWidth: '20px', minHeight: '14px' }}
          >
            <ActiveFlag 
              title={selectedRegion} 
              className="region-flag-svg"
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
          </span>
        ) : (
          <Globe className="w-3.5 h-3.5 text-gray-500" />
        )}
        <span className="font-medium text-gray-800 text-[12px]">{getShortRegionName(selectedRegion)}</span>
        {isOpen ? (
          <ChevronUp className="selector-chevron w-3 h-3 text-gray-500 shrink-0" style={{ width: '12px', height: '12px' }} />
        ) : (
          <ChevronDown className="selector-chevron w-3 h-3 text-gray-500 shrink-0" style={{ width: '12px', height: '12px' }} />
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          data-lenis-prevent
          className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="p-4 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900 text-[15px] mb-1">Shopping region</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              We prioritize listings and shipping availability from your region.
            </p>
          </div>

          <div className="h-px bg-gray-100"></div>

          <div data-lenis-prevent className="py-2 max-h-64 overflow-y-auto" onWheel={(e) => e.stopPropagation()}>
            {REGIONS_LIST.map((region) => {
              const isSelected = region === selectedRegion;
              const CountryFlag = flags[REGION_FLAG_MAP[region] || 'US'] as any;

              return (
                <button
                  key={region}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-[15px] transition-colors ${isSelected
                    ? 'bg-[#e6f7ef] text-[#0f7a61] font-medium'
                    : 'text-gray-700 hover:bg-[#e6f7ef] hover:text-[#0f7a61]'
                    }`}
                  onClick={() => {
                    setSelectedRegion(region);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    {CountryFlag && (
                      <span 
                        className="region-flag-container relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-[2px] border border-gray-200/90 shadow-xs bg-white"
                        style={{ width: '24px', height: '16px', minWidth: '24px', minHeight: '16px' }}
                      >
                        <CountryFlag 
                          title={region} 
                          className="region-flag-svg"
                          style={{ width: '100%', height: '100%', display: 'block' }}
                        />
                      </span>
                    )}
                    <span>{region}</span>
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

export default RegionSelector;
