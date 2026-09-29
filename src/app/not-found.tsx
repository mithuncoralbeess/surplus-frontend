import React from 'react';
import Link from 'next/link';
import { Search, Home, ArrowLeft, Package, Sparkles, HelpCircle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Surplus Market',
  description: 'The requested surplus inventory page or route could not be found on Surplus Market. Search our active marketplace or return to the homepage.',
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#fdfcf9] flex items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full text-center space-y-8 bg-white p-8 md:p-12 rounded-3xl border border-gray-200/80 shadow-xl relative overflow-hidden">
        
        {/* Background accent glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#0f7a61]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#0f7a61]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 bg-[#e6f7ef] text-[#0f7a61] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" /> 404 Error
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-lg mx-auto leading-relaxed font-normal">
            The page or surplus listing you are looking for might have been moved, sold out, or does not exist.
          </p>
        </div>

        {/* Quick Search */}
        <form action="/browse" method="GET" className="max-w-md mx-auto relative">
          <input 
            type="text" 
            name="q"
            placeholder="Search surplus inventory, lots, or categories..." 
            className="w-full pl-12 pr-28 py-3.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f7a61]/20 focus:border-[#0f7a61] transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <button 
            type="submit" 
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#0f7a61] hover:bg-[#0c6651] text-white px-4 py-2 rounded-full text-xs font-bold transition-colors"
          >
            Search
          </button>
        </form>

        {/* Quick Links Grid */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            Popular Destinations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link 
              href="/browse"
              className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-[#e6f7ef] hover:text-[#0f7a61] text-gray-700 text-xs font-semibold rounded-2xl border border-gray-200/60 transition-colors"
            >
              <Package className="w-4 h-4 text-[#0f7a61]" /> Browse Inventory
            </Link>
            <Link 
              href="/sell"
              className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-[#e6f7ef] hover:text-[#0f7a61] text-gray-700 text-xs font-semibold rounded-2xl border border-gray-200/60 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#0f7a61]" /> Sell Surplus
            </Link>
            <Link 
              href="/contact"
              className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-[#e6f7ef] hover:text-[#0f7a61] text-gray-700 text-xs font-semibold rounded-2xl border border-gray-200/60 transition-colors col-span-2 sm:col-span-1"
            >
              <HelpCircle className="w-4 h-4 text-[#0f7a61]" /> Support & FAQ
            </Link>
          </div>
        </div>

        {/* Home Button */}
        <div className="pt-2">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
