"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useLanguage, Locale } from '../../context/LanguageContext';

const LANGUAGES: { code: Locale; label: string; nativeName: string; flag: string }[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', flag: '🇦🇪' },
];

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();
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

  const activeLang = LANGUAGES.find(l => l.code === locale) || LANGUAGES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <div
        className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-gray-900 font-medium text-[12px] bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-full border border-gray-200/80 transition-colors header-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={t('common.language', 'Language')}
      >
        <Globe className="w-3 h-3 text-[#0f7a61]" />
        <span className="font-medium text-gray-800 text-[12px] uppercase">{activeLang.code}</span>
        {isOpen ? (
          <ChevronUp className="w-3 h-3 text-gray-500" />
        ) : (
          <ChevronDown className="w-3 h-3 text-gray-500" />
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          data-lenis-prevent
          className="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="p-3 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900 text-[14px]">{t('common.language', 'Language')}</h3>
            <p className="text-gray-500 text-[11px] mt-0.5">Select interface language</p>
          </div>

          <div className="h-px bg-gray-100"></div>

          <div data-lenis-prevent className="py-1.5" onWheel={(e) => e.stopPropagation()}>
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === locale;
              return (
                <button
                  key={lang.code}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-[14px] transition-colors ${isSelected
                      ? 'bg-[#e6f7ef] text-[#0f7a61] font-medium'
                      : 'text-gray-700 hover:bg-[#e6f7ef] hover:text-[#0f7a61]'
                    }`}
                  onClick={() => {
                    setLocale(lang.code);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                    <span className="text-base">{lang.flag}</span>
                    <span className="font-medium text-gray-900">{lang.nativeName}</span>
                    <span className="text-xs text-gray-400">({lang.label})</span>
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

export default LanguageSelector;
