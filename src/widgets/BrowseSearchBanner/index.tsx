"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Search, Zap, Clock, TrendingUp, Tag } from 'lucide-react';

const AI_PROMPTS = [
  { text: "Overstock Power Tools & Industrial Machinery", tag: "Power Tools" },
  { text: "Wholesale Consumer Electronics & TWS Earbuds", tag: "Electronics" },
  { text: "Enterprise Servers & IT Networking Hardware", tag: "ICT & Servers" },
  { text: "Home Decor & Bulk Candle Liquidation Lots", tag: "Decor & Home" }
];

const DEFAULT_RECENT = [
  "Disposable Underpad",
  "apron",
  "Neox PVC Electrical Tape",
  "Neox 12W LED Round Recessed Slim Panel"
];

const TRENDING_SURPLUS = [
  "Electrical surplus",
  "MRO equipment",
  "Packaging stock",
  "Oil & gas equipment",
  "Construction materials",
  "Clearance lots"
];

const POPULAR_CATEGORIES = [
  { name: "Auto Spare Parts & Accessories", count: 7812 },
  { name: "Plumbing materials", count: 610 },
  { name: "Electricals", count: 362 },
  { name: "PPE", count: 66 },
  { name: "Power tools", count: 63 },
  { name: "Hand tools", count: 45 }
];

const BrowseSearchBanner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(DEFAULT_RECENT);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    if (searchParams.get('openDropdown') === 'true' || searchParams.get('ai') === 'true') {
      setIsDropdownOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsDropdownOpen(false);
      router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/browse');
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    setSearchQuery(promptText);
    setIsDropdownOpen(false);
    router.push(`/browse?q=${encodeURIComponent(promptText.trim())}`);
  };

  return (
    <section className="w-full bg-[#fdfcf9] py-14 border-b border-gray-100 relative">
      <div className="container max-w-5xl mx-auto px-4">
        {/* AI Tag */}
        <div className="flex items-center text-primary-alt font-bold text-xs tracking-wider mb-4">
          <Sparkles className="w-4 h-4 mr-1.5 text-[#14b875]" />
          <span>AI SMART SEARCH ENGINE</span>
        </div>

        {/* Headings */}
        <h1 className="text-[42px] font-bold text-gray-900 mb-2 tracking-tight">
          Surplus inventory, verified.
        </h1>
        <p className="text-gray-500 text-[17px] mb-8">
          Search naturally by brand, category, budget, location, or industry.
        </p>

        {/* Search Bar Container with Dropdown Attachment */}
        <div className="relative w-full" ref={dropdownRef}>
          <form 
            onSubmit={handleSearchSubmit}
            className={`relative flex items-center w-full bg-white border ${
              isDropdownOpen ? 'border-[#0f7a61] ring-2 ring-[#0f7a61]/20 shadow-xl' : 'border-gray-200 shadow-[0_2px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
            } rounded-full transition-all p-2`}
          >
            <Search className="absolute left-6 w-5 h-5 text-gray-400" />
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Refurbished Dell rack servers with wa..."
              className="w-full pl-16 pr-4 py-3.5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-[17px]"
            />
            
            <div className="flex items-center space-x-2 md:space-x-3 shrink-0 pr-1">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center bg-emerald-50 text-[#0f7a61] hover:bg-emerald-100 px-3 md:px-4 py-2.5 rounded-full text-xs font-bold tracking-wider transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 md:mr-1.5" />
                <span className="hidden sm:inline">AI SMART SEARCH</span>
                <span className="sm:hidden">AI SEARCH</span>
              </button>
              <button
                type="submit"
                className="bg-[#0f7a61] hover:bg-[#0c6651] text-white px-8 py-3.5 rounded-full font-medium text-[15px] transition-colors whitespace-nowrap cursor-pointer shadow-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Attached Search Dropdown */}
          {isDropdownOpen && (
            <div 
              className="absolute left-0 right-0 top-full mt-3 bg-white rounded-3xl border border-gray-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-50 p-6 overflow-hidden animate-in fade-in duration-150"
              data-lenis-prevent
            >
              {/* Section 1: AI Natural Language Prompts */}
              <div className="pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[#0f7a61] font-bold text-xs tracking-wider uppercase">
                    <Sparkles className="w-4 h-4 text-[#14b875]" />
                    <span>AI Natural Language Prompts</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">Click any query to try AI search</span>
                </div>

                <div className="space-y-1.5 max-h-[220px] overflow-y-auto" data-lenis-prevent>
                  {AI_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPrompt(item.text)}
                      className="w-full text-left p-3 rounded-2xl hover:bg-emerald-50/70 transition-colors flex items-center justify-between group border border-transparent hover:border-emerald-200/60 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-[#0f7a61] shrink-0 opacity-70 group-hover:opacity-100" />
                        <span className="text-sm text-gray-800 font-medium group-hover:text-[#0f7a61] transition-colors">
                          {item.text}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-50 text-[#0f7a61] px-2.5 py-1 rounded-full shrink-0 ml-2 whitespace-nowrap">
                        {item.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2: Recent & Trending Surplus */}
              <div className="py-4 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Searches */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Recent Searches</span>
                    </div>
                    {recentSearches.length > 0 && (
                      <button 
                        type="button"
                        onClick={() => setRecentSearches([])}
                        className="text-[11px] text-gray-400 hover:text-red-600 font-medium cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPrompt(term)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-2.5 text-xs text-gray-700 hover:text-[#0f7a61] transition-colors cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate font-medium">{term}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Surplus */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                    <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                    <span>Trending Surplus</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {TRENDING_SURPLUS.map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPrompt(tag)}
                        className="bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#0f7a61] border border-gray-200/60 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Popular Categories */}
              <div className="pt-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                  Popular Categories
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CATEGORIES.map((cat, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPrompt(cat.name)}
                      className="flex items-center gap-1.5 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-[#0f7a61] border border-gray-200/70 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
                    >
                      <span>{cat.name}</span>
                      <span className="text-gray-400 text-[10px]">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>


      </div>
    </section>
  );
};

export default BrowseSearchBanner;
