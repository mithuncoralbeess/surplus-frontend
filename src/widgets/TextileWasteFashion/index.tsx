import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export default function TextileWasteFashion() {
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
              Textile Waste Fashion Industry 92 Million Tons
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Banner with Dark Grid Texture */}
      <header className="relative w-full overflow-hidden bg-[#06241c] text-white py-16 sm:py-20 lg:py-24 border-b border-emerald-950/60">
        {/* Subtle Engineering Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
        {/* Radial Ambient Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 text-center space-y-4">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            SURPLUS MARKET
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            The Fashion Industry Generates 92 Million Tons of Textile Waste Annually
          </h1>
        </div>
      </header>

      {/* 3. Pure Content-Only Editorial Body */}
      <div className="w-full bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12 sm:py-16">
          <div className="space-y-10 text-slate-700">
            
            {/* What is Textile Waste? */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                What is Textile Waste?
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Textile waste refers to discarded materials derived from fabrics, garments, and textile production processes. It includes everything no longer usable in its original form, contributing significantly to global waste statistics.
              </p>

              <div className="pt-3 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Definition and Types of Textile Waste
                </h3>
                <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                  Textile waste encompasses fibers, yarns, fabrics, and finished garments discarded during manufacturing or after consumer use. It broadly splits into two categories: production waste from cutting, dyeing, and finishing processes, and post-use waste from worn-out or discarded clothing.
                </p>
              </div>

              <div className="pt-3 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Pre-consumer vs Post-consumer Textile Waste
                </h3>
                <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                  Pre-consumer textile waste emerges during manufacturing stages including cutting scraps, defective fabrics, and unsold inventory. Post-consumer textile waste originates from households and includes used garments that are thrown away or donated.
                </p>
              </div>

              <div className="pt-3 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Common Materials Contributing to Waste
                </h3>
                <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                  Cotton and synthetic fibers such as polyester dominate the waste stream. Cotton demands intensive water usage, while polyester contributes to microplastic pollution. Mixed fabrics further complicate recycling efforts.
                </p>
              </div>
            </section>

            {/* Textile Waste Statistics & Global Impact */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Textile Waste Statistics &amp; Global Impact
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Globally, approximately &ldquo;92 million tonnes of textile waste is generated annually.&rdquo; If current trends persist, this figure will rise significantly. The fashion sector contributes nearly 10% of global carbon emissions, positioning it among the largest polluting industries.
              </p>

              <div className="pt-3 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  How Much Textile Waste is Produced Each Year?
                </h3>
                <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                  Around 92 million tonnes of textile waste is produced globally each year, with projections indicating substantial increases if present patterns continue.
                </p>
              </div>

              <div className="pt-3 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Textile Waste in India and Global Markets
                </h3>
                <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                  India&apos;s textile waste is rising due to rapidly growing consumption and manufacturing output. In 2026, India implemented updated Solid Waste Management Rules requiring four-stream segregation, directly affecting textile waste management practices in the region.
                </p>
              </div>
            </section>

            {/* Causes of Textile Waste in the Fashion Industry */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Causes of Textile Waste in the Fashion Industry
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Textile waste originates from production practices, consumer behavior, and supply chain inefficiencies deeply embedded in the industry.
              </p>

              <div className="pt-3 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Fast Fashion and Textile Waste Growth
                </h3>
                <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                  Fast fashion textile waste has expanded due to rapid production cycles and low-cost garments. Consumers purchase more frequently and discard items quickly, accelerating fashion textile waste generation and straining recycling systems.
                </p>
              </div>

              <div className="pt-3 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Overstock, Unsold Inventory, and Production Waste
                </h3>
                <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                  Unsold inventory remains a major contributor to textile waste. The Atacama Desert landfill in Chile became a global symbol of waste, with new garments bearing tags illegally dumped there. In 2025, Chile introduced a national strategy to eliminate such dumping practices.
                </p>
              </div>
            </section>

            {/* Environmental Impact of Textile Waste */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Environmental Impact of Textile Waste
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Producing a single cotton T-shirt requires approximately 2,700 liters of water, equivalent to one person&apos;s lifetime drinking water consumption. Synthetic textiles contribute to &ldquo;35% of primary microplastics in oceans.&rdquo; The fashion industry accounts for nearly 10% of global CO2 emissions.
              </p>
            </section>

            {/* Where Does Textile Waste Go? */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Where Does Textile Waste Go?
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                A large portion of textile waste ends up in landfills or is incinerated, contributing to pollution and resource loss.
              </p>

              <div className="pt-3 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Landfills vs Recycling vs Resale Markets
                </h3>
                <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                  Landfills remain the primary destination for textile waste, where materials take decades to decompose. Recycling converts textiles into new materials, though it remains limited due to fiber complexity. Resale markets provide practical solutions by extending product life cycles.
                </p>
              </div>
            </section>

            {/* How to Reduce Textile Waste */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                How to Reduce Textile Waste
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Reducing textile waste requires better consumption habits, improved recycling systems, and efficient redistribution networks.
              </p>

              <div className="pt-3 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Reuse, Resell, and Circular Economy
                </h3>
                <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                  Circular fashion is gaining momentum, with the market projected to reach $7.04 billion by 2026, growing at a CAGR of 8.7%. Reuse and resale extend product lifecycles and reduce the need for new production.
                </p>
              </div>

              <div className="pt-3 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Role of Surplus Marketplaces in Waste Reduction
                </h3>
                <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                  Surplus marketplaces enable efficient textile waste management by connecting excess inventory with buyers who can use it productively, reducing disposal and promoting waste reduction at scale.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </article>
  );
}
