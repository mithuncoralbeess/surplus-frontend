"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, ShieldCheck, Play, ArrowRight, BarChart2, Sparkles, Zap, Clock, TrendingUp, Mic, MicOff, X } from 'lucide-react';
import { parseNaturalLanguageQuery, getInstantSuggestions } from '../../lib/aiSearchEngine';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';

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

// Track if hero banner landing animation has played in this browser JS context
let hasHeroLandedInPageLoad = false;

const HomeBanner = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(DEFAULT_RECENT);
  const [isHeroLanding] = useState(() => !hasHeroLandedInPageLoad);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isListening, isSupported, toggleListening } = useVoiceSearch({
    onTranscript: (transcript) => {
      setSearchQuery(transcript);
      router.push(`/browse?q=${encodeURIComponent(transcript.trim())}`);
    }
  });

  useEffect(() => {
    hasHeroLandedInPageLoad = true;
  }, []);

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

  const handleAiSmartSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/browse?q=${encodeURIComponent(query)}&openDropdown=true`);
    } else {
      router.push('/browse?openDropdown=true');
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    setSearchQuery(promptText);
    setIsDropdownOpen(false);
    router.push(`/browse?q=${encodeURIComponent(promptText.trim())}`);
  };

  const handleQuickAccess = (tag: string) => {
    switch (tag) {
      case 'Sell Excess Inventory':
        router.push('/sell');
        break;
      case 'Get in Touch with Surplus Market':
        router.push('/contact');
        break;
      case 'Sustainability in Surplus Inventory':
        router.push('/sustainability');
        break;
      case 'Inventory Ageing Calculator':
        router.push('/inventory-calculator');
        break;
      default:
        router.push(`/browse?q=${encodeURIComponent(tag)}`);
        break;
    }
  };

  return (
    <section className="w-full py-16 min-[1350px]:min-h-[calc(100vh-81px)] min-[1350px]:py-0 flex items-center relative">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl w-full">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-3 items-center justify-between">

          {/* Left Column */}
          <div
            className={`w-full lg:w-[58%] flex flex-col items-start space-y-6 min-[1350px]:space-y-4 min-[1600px]:space-y-6 ${isHeroLanding ? 'animate-hero-landing' : ''
              }`}
          >

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-light text-primary px-4 py-1.5 rounded-full text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              B2B Liquidation Marketplace
            </div>

            {/* Headline */}
            <h1 className="h1 text-gray-900 tracking-tight">
              Buy And Sell Everything <br />
              <span className="text-primary">Surplus</span> Here.
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 leading-relaxed">
              Connect with verified global buyers and sellers of surplus inventory to unlock savings, maximize revenue and reduce waste.
            </p>

            {/* Quick Access */}
            <div className="flex flex-wrap items-center gap-3 min-[1350px]:gap-2 min-[1600px]:gap-3 pt-2 min-[1350px]:pt-1 min-[1600px]:pt-2">
              <span className="text-xs xxl:text-sm font-semibold text-gray-700 mr-2 min-[1350px]:mr-1 min-[1600px]:mr-2">Quick Access:</span>
              {['Surplus Inventory Buyers', 'Sell Excess Inventory', 'Get in Touch with Surplus Market', 'Overstock Solutions', 'Sustainability in Surplus Inventory', 'Inventory Ageing Calculator'].map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAccess(tag)}
                  className="bg-primary-light text-primary px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap hover:bg-primary-light-hover cursor-pointer transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Interactive Search Bar & Attached Search Dropdown */}
            <div className="relative w-full max-w-2xl" ref={dropdownRef}>
              <form
                onSubmit={handleSearchSubmit}
                className={`w-full bg-white border ${isDropdownOpen ? 'border-primary shadow-xl ring-2 ring-primary/20' : 'border-gray-200 shadow-lg shadow-gray-100/50'
                  } p-2 min-[1350px]:p-1.5 min-[1600px]:p-2 rounded-full flex items-center gap-3 mt-4 min-[1350px]:mt-2 min-[1600px]:mt-4 transition-all`}
              >
                <Search className="w-5 h-5 min-[1350px]:w-4 min-[1350px]:h-4 min-[1600px]:w-5 min-[1600px]:h-5 text-gray-400 ml-3 min-[1350px]:ml-2 min-[1600px]:ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories, part numbers, or brands..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-base min-[1350px]:text-sm min-[1600px]:text-base cursor-text"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
                    title="Clear"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {isSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      isListening 
                        ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-300' 
                        : 'text-gray-400 hover:text-[#0f7a61] hover:bg-emerald-50'
                    }`}
                    title={isListening ? "Listening..." : "Search by voice"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleAiSmartSearch}
                  className="hidden sm:flex items-center gap-1.5 text-primary font-bold text-sm min-[1350px]:text-xs min-[1600px]:text-sm bg-primary-light hover:bg-primary-light-hover transition-colors px-3.5 min-[1350px]:px-2.5 min-[1600px]:px-3.5 py-1.5 min-[1350px]:py-2 min-[1600px]:py-1.5 rounded-full cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>AI SMART SEARCH</span>
                </button>

                <button
                  type="submit"
                  className="btn btn-primary min-[1350px]:py-1.5 min-[1350px]:text-sm min-[1600px]:py-2.5 min-[1600px]:text-base shrink-0"
                >
                  Search
                </button>
              </form>


            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-6 min-[1350px]:mt-3 min-[1600px]:mt-6">
              <button
                onClick={() => router.push('/browse')}
                className="btn btn-primary"
              >
                Browse Inventory
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push('/sell')}
                className="btn btn-secondary"
              >
                Sell Inventory
              </button>
            </div>

          </div>

          {/* Right Column (Dark Dashboard Card) */}
          <div
            className={`relative w-full lg:w-[41%] aspect-square max-w-[600px] min-[1350px]:max-w-[520px] min-[1600px]:max-w-[600px] mx-auto lg:ml-auto lg:mr-0 ${isHeroLanding ? 'animate-hero-landing' : ''
              }`}
          >

            {/* Dark Card Container */}
            <div className="absolute inset-0 bg-dashboard-bg rounded-[2rem] shadow-2xl p-6 md:p-8 min-[1350px]:p-5 min-[1600px]:p-8 flex flex-col justify-between overflow-hidden">

              {/* Background grid overlay pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

              <div className="relative z-10 flex flex-col h-full space-y-6 min-[1350px]:space-y-3 min-[1600px]:space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-dashboard-card flex items-center justify-center">
                      <BarChart2 className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-[16px] text-white font-medium leading-tight mb-1">Live Market Intelligence</h3>
                      <p className="text-dashboard-text text-[12px] xxl:text-xs font-bold tracking-wider uppercase">Operating Dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-dashboard-card px-3 py-1.5 rounded-full border border-dashboard-border">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                    <span className="text-accent text-[10px] xxl:text-xs font-bold tracking-wider">LIVE</span>
                  </div>
                </div>

                {/* Tour Button */}
                <button className="w-full bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent py-3 rounded-full font-bold text-xs transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" /> PLATFORM TOUR
                </button>

                {/* How it works section */}
                <div className="flex-1 flex flex-col pt-2">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[14px] xxl:text-base text-white font-medium tracking-widest uppercase">How Surplus Market Works</h4>
                    <span className="text-accent text-[12px] xxltext-xs font-medium tracking-wider uppercase">2 Min Tour</span>
                  </div>

                  {/* Video Thumbnail */}
                  <div className="flex-1 rounded-3xl overflow-hidden relative group cursor-pointer bg-gray-900 border border-dashboard-border">
                    <Image
                      src="/hero-warehouse.jpg"
                      alt="Warehouse Surplus Tour"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px"
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                    {/* Play Button Center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(20,184,117,0.3)] group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
                      </div>
                    </div>

                    {/* Watch label */}
                    <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full text-xs font-bold text-gray-900 shadow-lg">
                      Watch - 2 min
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-2 pt-4 border-t border-dashboard-border">
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg">24,800+</p>
                    <p className="text-dashboard-text text-[0.65rem] font-bold tracking-wider mt-1 uppercase">Transactions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg">$412M</p>
                    <p className="text-dashboard-text text-[0.65rem] font-bold tracking-wider mt-1 uppercase">Value Recovered</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg">3,200+</p>
                    <p className="text-dashboard-text text-[0.65rem] font-bold tracking-wider mt-1 uppercase">Businesses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg">42</p>
                    <p className="text-dashboard-text text-[0.65rem] font-bold tracking-wider mt-1 uppercase">Countries</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
