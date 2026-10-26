import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export default function TrackSurplusTrends() {
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
            <span className="text-slate-500">
              User Guide
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-900 font-semibold truncate">
              Track Surplus Trends
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
            How to Track Surplus Trends &amp; Surplus Deals on SurplusMarket
          </h1>
        </div>
      </header>

      {/* 3. Pure Content-Only Editorial Body */}
      <div className="w-full bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12 sm:py-16">
          <div className="space-y-10 text-slate-700">
            
            {/* Blog Section */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Blog Section
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Surplus Market maintains a dedicated blog functioning as &ldquo;a knowledge hub focused on industry updates, procurement insights, and surplus trend analysis.&rdquo; Regular posts highlight high-demand product categories, liquidation opportunities, and purchasing patterns across construction, oil and gas, manufacturing, and facility management sectors. This resource helps procurement managers evaluate upcoming opportunities rather than relying solely on urgent purchasing cycles.
              </p>
            </section>

            {/* Resources For Smarter Surplus */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Resources For Smarter Surplus
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                The resources section provides structured guidance for businesses seeking to improve surplus sourcing efficiency. Educational materials explain how surplus inventory enters markets, how buyers evaluate listings, and how organizations manage excess stock recovery. These materials assist procurement teams in interpreting listing quality, supplier credibility, and product lifecycle value.
              </p>
            </section>

            {/* Surplus Newsletter */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Surplus Newsletter
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Subscribers receive updates highlighting &ldquo;recently available stock, urgent liquidation opportunities, and trending product categories.&rdquo; Early visibility often leads to better pricing and improved negotiation scope. Companies can also request specific products after receiving updates, allowing sourcing teams to locate matching surplus inventory efficiently. Newsletter patterns contribute to stronger understanding of surplus movements over time.
              </p>
            </section>

            {/* Follow Surplus Market Social Media Accounts */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Follow Surplus Market Social Media Accounts
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Platforms including Instagram, Facebook, LinkedIn, and YouTube provide real-time visibility into surplus deals and newly listed inventory. Social engagement reveals which categories receive strong attention, offering practical indicators about current surplus trend direction.
              </p>
            </section>

            {/* Analyze Demand Through Product Requests */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Analyze Demand Through Product Requests
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Product request activity provides valuable demand intelligence. When multiple buyers request similar equipment or materials, it signals growing industry requirements and emerging procurement gaps. Sellers gain insight into attractive inventory types, while buyers recognize industries experiencing active purchasing cycles.
              </p>
            </section>

            {/* Monitor High-Movement Categories */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Monitor High-Movement Categories
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Electrical components, construction materials, mechanical equipment, industrial tools, and facility maintenance supplies consistently demonstrate faster turnover rates. Regular monitoring helps procurement teams anticipate availability fluctuations and prioritize purchases based on urgency rather than last-minute sourcing pressures.
              </p>
            </section>

          </div>
        </div>
      </div>
    </article>
  );
}
