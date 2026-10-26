import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export default function GccLocalSourcing() {
  return (
    <article className="w-full bg-white">
      {/* 1. Breadcrumb Bar */}
      <div className="w-full bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-3.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <Link href="/sustainability" className="hover:text-slate-900 transition-colors">
              Sustainability Data
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-900 font-semibold truncate">
              GCC Local Sourcing
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Banner with Dark Grid Texture */}
      <header className="relative w-full overflow-hidden bg-[#06241c] text-white py-16 sm:py-20 lg:py-24 border-b border-emerald-950/60">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 text-center space-y-4">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            SURPLUS MARKET
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How GCC Businesses Source Surplus &amp; Overstock Locally to Reduce Emissions
          </h1>
        </div>
      </header>

      {/* 3. Pure Content-Only Editorial Body */}
      <div className="w-full bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12 sm:py-16">
          <div className="space-y-10 text-slate-700">
            
            {/* Why GCC Businesses Are Rethinking Global Surplus Imports */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Why GCC Businesses Are Rethinking Global Surplus Imports
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Companies across the Gulf Cooperation Council region are reconsidering their approach to acquiring excess inventory. Historically, sourcing surplus items globally seemed convenient, but this strategy now faces challenges from sustainability mandates, rising transportation costs, and supply chain delays that disrupt inventory cycles.
              </p>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                &ldquo;Local surplus sourcing GCC-wide reduces these risks while keeping operations flexible,&rdquo; addressing environmental and financial concerns simultaneously.
              </p>
            </section>

            {/* The Environmental Cost of Shipping from Europe and Asia */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                The Environmental Cost of Shipping from Europe and Asia
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                International freight transportation-via ocean, air, and inland routes-generates substantial emissions proportional to distance traveled. Sourcing surplus regionally eliminates long-haul shipping and unnecessary fuel consumption. Additionally, local sourcing reduces packaging requirements typically necessary for overseas transport.
              </p>
            </section>

            {/* Fuel Emissions and Long Supply Chains in Global Surplus */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Fuel Emissions and Long Supply Chains in Global Surplus
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Extended supply chains multiply carbon output at each stage: trucks, ships, and port operations all contribute emissions. Regional sourcing shortens these chains, accelerates movement, and improves traceability of surplus assets already circulating within the region.
              </p>
            </section>

            {/* Delays, Duties, and Hidden Costs of Overseas Sourcing */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Delays, Duties, and Hidden Costs of Overseas Sourcing
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                International sourcing introduces customs delays, tariff expenses, and currency fluctuations affecting cash flow. Platforms offer assessment tools to help businesses evaluate holding costs and make informed surplus decisions.
              </p>
            </section>

            {/* How Local Surplus Sourcing Benefits GCC Businesses */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                How Local Surplus Sourcing Benefits GCC Businesses
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Regional sourcing improves procurement speed, enables pricing control, and strengthens sustainability reporting. Companies gain rapid access to verified regional suppliers who understand local demand patterns and can respond flexibly to market changes.
              </p>
            </section>

            {/* Regional Market Opportunities */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Regional Market Opportunities
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                The UAE and Saudi Arabia maintain robust industrial and retail sectors generating consistent surplus inventory suitable for construction, retail, manufacturing, and hospitality. Qatar&apos;s infrastructure expansion creates additional market opportunities for local surplus transactions.
              </p>
            </section>

          </div>
        </div>
      </div>
    </article>
  );
}
