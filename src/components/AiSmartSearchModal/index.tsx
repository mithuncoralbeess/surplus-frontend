"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, Search, X, Trash2, TrendingUp, Clock, Zap, 
  Grid, FileText, Wrench, Hammer, HardHat, Drill, PenTool, Lamp, Package, Smartphone, Truck
} from 'lucide-react';

interface AiSmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const DEFAULT_RECENT_SEARCHES = [
  "Disposable Underpad",
  "apron",
  "Neox PVC Electrical Tape, 0.13Mmx19Mmx10Yard, Glossy Film, Colour: Yellow",
  "Neox 12W LED Round Recessed Slim Panel 170mm, 6500K",
  "Neox",
  "Neox 12W LED Round Recessed Slim Pane"
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
  { name: "Auto Spare Parts & Accessories", count: 7812, icon: Truck },
  { name: "Plumbing materials", count: 610, icon: Wrench },
  { name: "Electricals", count: 362, icon: Zap },
  { name: "PPE", count: 66, icon: HardHat },
  { name: "Power tools", count: 63, icon: Drill },
  { name: "Chisels And Drill bits", count: 63, icon: PenTool },
  { name: "Decor", count: 56, icon: Lamp },
  { name: "Food Containers", count: 50, icon: Package },
  { name: "Mobile Phone And Accessories", count: 48, icon: Smartphone },
  { name: "Hand tools", count: 45, icon: Hammer }
];

export default function AiSmartSearchModal({ isOpen, onClose, initialQuery = '' }: AiSmartSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState<string[]>(DEFAULT_RECENT_SEARCHES);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // Update recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== searchQuery.toLowerCase());
      return [searchQuery.trim(), ...filtered].slice(0, 8);
    });

    onClose();
    router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-6xl bg-white rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.2)] border border-gray-200/90 overflow-hidden flex flex-col z-50"
        data-lenis-prevent
      >
        {/* Modal Search Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 shadow-inner focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mr-3 animate-pulse" />
            <input 
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(query);
                }
              }}
              placeholder="Search naturally by brand, category, budget, location, or industry..."
              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-base md:text-lg font-medium"
            />

            <div className="hidden sm:flex items-center gap-1.5 bg-primary-light text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wide mr-2 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NATURAL LANGUAGE AI</span>
            </div>

            <button
              onClick={() => handleSearch(query)}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full font-bold text-sm transition-colors shrink-0 cursor-pointer shadow-sm"
            >
              Search
            </button>
          </div>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            title="Close Search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body: 3 Columns Layout */}
        <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto space-y-8" data-lenis-prevent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Column 1: RECENT SEARCHES */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 tracking-wider uppercase">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Recent Searches</span>
                </div>
                {recentSearches.length > 0 && (
                  <button 
                    onClick={clearRecentSearches}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 font-medium transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {recentSearches.length > 0 ? (
                <div className="space-y-1">
                  {recentSearches.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(item)}
                      className="w-full text-left py-2 px-3 rounded-xl hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 hover:text-primary transition-colors group cursor-pointer"
                    >
                      <Search className="w-4 h-4 text-gray-400 group-hover:text-primary shrink-0" />
                      <span className="truncate font-medium">{item}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic py-2">No recent searches</p>
              )}
            </div>

            {/* Column 2: TRENDING SURPLUS */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 tracking-wider uppercase mb-4">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span>Trending Surplus</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {TRENDING_SURPLUS.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(tag)}
                    className="bg-gray-100 hover:bg-primary-light text-gray-700 hover:text-primary border border-gray-200/60 hover:border-primary/30 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: SMART ACTIONS */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 tracking-wider uppercase mb-4">
                <Zap className="w-4 h-4 text-gray-400" />
                <span>Smart Actions</span>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    inputRef.current?.focus();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200 hover:border-primary/40 hover:bg-gray-50 transition-all text-left text-sm font-semibold text-gray-800 shadow-sm cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4 text-gray-600" />
                  </div>
                  <span>Search by product</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    router.push('/browse');
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200 hover:border-primary/40 hover:bg-gray-50 transition-all text-left text-sm font-semibold text-gray-800 shadow-sm cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Grid className="w-4 h-4 text-gray-600" />
                  </div>
                  <span>Search by category</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    router.push('/profile');
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200 hover:border-primary/40 hover:bg-gray-50 transition-all text-left text-sm font-semibold text-gray-800 shadow-sm cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-gray-600" />
                  </div>
                  <span>Upload RFQ</span>
                </button>

                <button
                  onClick={() => handleSearch("surplus inventory")}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200 hover:border-primary/40 hover:bg-primary-light/40 transition-all text-left text-sm font-semibold text-gray-800 shadow-sm cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-primary">Find similar products</span>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Section: POPULAR CATEGORIES */}
          <div className="pt-6 border-t border-gray-100">
            <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-4">
              Popular Categories
            </div>

            <div className="flex flex-wrap gap-2.5">
              {POPULAR_CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSearch(cat.name)}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-primary-light text-gray-800 hover:text-primary border border-gray-200/80 hover:border-primary/30 px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-primary shrink-0" />
                    <span>{cat.name}</span>
                    <span className="text-gray-400 font-normal">({cat.count})</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
