import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function GccLocalSourcing() {
  return (
    <article className="w-full bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pt-24 pb-16 sm:pt-28 sm:pb-20">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/sustainability" className="hover:text-slate-900 transition-colors">
            Sustainability
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">
            GCC Local Sourcing
          </span>
        </nav>

        {/* Eyebrow */}
        <div className="text-xs font-semibold uppercase tracking-wider text-[#0a5c48] mb-3">
          Surplus Market
        </div>

        {/* Main Title */}
        <h1 className="h1 text-slate-900 tracking-tight mb-10">
          How GCC Businesses Source Surplus &amp; Overstock Locally to Reduce Emissions
        </h1>

        {/* Article Body - Content Only */}
        <div className="space-y-12 text-slate-800">
          
          {/* Section: Why GCC Businesses Are Rethinking Global Surplus Imports */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Why GCC Businesses Are Rethinking Global Surplus Imports
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Companies across the Gulf Cooperation Council region are reconsidering their approach to acquiring excess inventory. Historically, sourcing surplus items globally seemed convenient, but this strategy now faces challenges from sustainability mandates, rising transportation costs, and supply chain delays that disrupt inventory cycles.
            </p>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              &ldquo;Local surplus sourcing GCC-wide reduces these risks while keeping operations flexible,&rdquo; addressing environmental and financial concerns simultaneously.
            </p>
          </section>

          <hr className="border-slate-200" />

          {/* Section: The Environmental Cost of Shipping from Europe and Asia */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              The Environmental Cost of Shipping from Europe and Asia
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              International freight transportation-via ocean, air, and inland routes-generates substantial emissions proportional to distance traveled. Sourcing surplus regionally eliminates long-haul shipping and unnecessary fuel consumption. Additionally, local sourcing reduces packaging requirements typically necessary for overseas transport.
            </p>
          </section>

          <hr className="border-slate-200" />

          {/* Section: Fuel Emissions and Long Supply Chains in Global Surplus */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Fuel Emissions and Long Supply Chains in Global Surplus
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Extended supply chains multiply carbon output at each stage: trucks, ships, and port operations all contribute emissions. Regional sourcing shortens these chains, accelerates movement, and improves traceability of surplus assets already circulating within the region.
            </p>
          </section>

          <hr className="border-slate-200" />

          {/* Section: Delays, Duties, and Hidden Costs of Overseas Sourcing */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Delays, Duties, and Hidden Costs of Overseas Sourcing
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              International sourcing introduces customs delays, tariff expenses, and currency fluctuations affecting cash flow. Platforms offer assessment tools to help businesses evaluate holding costs and make informed surplus decisions.
            </p>
          </section>

          <hr className="border-slate-200" />

          {/* Section: How Local Surplus Sourcing Benefits GCC Businesses */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              How Local Surplus Sourcing Benefits GCC Businesses
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Regional sourcing improves procurement speed, enables pricing control, and strengthens sustainability reporting. Companies gain rapid access to verified regional suppliers who understand local demand patterns and can respond flexibly to market changes.
            </p>
          </section>

          <hr className="border-slate-200" />

          {/* Section: Regional Market Opportunities */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Regional Market Opportunities
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              The UAE and Saudi Arabia maintain robust industrial and retail sectors generating consistent surplus inventory suitable for construction, retail, manufacturing, and hospitality. Qatar&apos;s infrastructure expansion creates additional market opportunities for local surplus transactions.
            </p>
          </section>

        </div>

      </div>
    </article>
  );
}
