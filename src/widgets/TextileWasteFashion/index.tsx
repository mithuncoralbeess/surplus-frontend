import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function TextileWasteFashion() {
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
            Textile Waste
          </span>
        </nav>

        {/* Eyebrow */}
        <div className="text-xs font-semibold uppercase tracking-wider text-[#0a5c48] mb-3">
          Surplus Market
        </div>

        {/* Main Title */}
        <h1 className="h1 text-slate-900 tracking-tight mb-10">
          The Fashion Industry Generates 92 Million Tons of Textile Waste Annually
        </h1>

        {/* Article Body - Content Only */}
        <div className="space-y-12 text-slate-800">
          
          {/* Section: What is Textile Waste? */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              What is Textile Waste?
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Textile waste refers to discarded materials derived from fabrics, garments, and textile production processes. It includes everything no longer usable in its original form, contributing significantly to global waste statistics.
            </p>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                Definition and Types of Textile Waste
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Textile waste encompasses fibers, yarns, fabrics, and finished garments discarded during manufacturing or after consumer use. It broadly splits into two categories: production waste from cutting, dyeing, and finishing processes, and post-use waste from worn-out or discarded clothing.
              </p>
            </div>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                Pre-consumer vs Post-consumer Textile Waste
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Pre-consumer textile waste emerges during manufacturing stages including cutting scraps, defective fabrics, and unsold inventory. Post-consumer textile waste originates from households and includes used garments that are thrown away or donated.
              </p>
            </div>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                Common Materials Contributing to Waste
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Cotton and synthetic fibers such as polyester dominate the waste stream. Cotton demands intensive water usage, while polyester contributes to microplastic pollution. Mixed fabrics further complicate recycling efforts.
              </p>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section: Textile Waste Statistics & Global Impact */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Textile Waste Statistics &amp; Global Impact
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Globally, approximately &ldquo;92 million tonnes of textile waste is generated annually.&rdquo; If current trends persist, this figure will rise significantly. The fashion sector contributes nearly 10% of global carbon emissions, positioning it among the largest polluting industries.
            </p>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                How Much Textile Waste is Produced Each Year?
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Around 92 million tonnes of textile waste is produced globally each year, with projections indicating substantial increases if present patterns continue.
              </p>
            </div>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                Textile Waste in India and Global Markets
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                India&apos;s textile waste is rising due to rapidly growing consumption and manufacturing output. In 2026, India implemented updated Solid Waste Management Rules requiring four-stream segregation, directly affecting textile waste management practices in the region.
              </p>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section: Causes of Textile Waste in the Fashion Industry */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Causes of Textile Waste in the Fashion Industry
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Textile waste originates from production practices, consumer behavior, and supply chain inefficiencies deeply embedded in the industry.
            </p>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                Fast Fashion and Textile Waste Growth
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Fast fashion textile waste has expanded due to rapid production cycles and low-cost garments. Consumers purchase more frequently and discard items quickly, accelerating fashion textile waste generation and straining recycling systems.
              </p>
            </div>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                Overstock, Unsold Inventory, and Production Waste
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Unsold inventory remains a major contributor to textile waste. The Atacama Desert landfill in Chile became a global symbol of waste, with new garments bearing tags illegally dumped there. In 2025, Chile introduced a national strategy to eliminate such dumping practices.
              </p>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section: Environmental Impact of Textile Waste */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Environmental Impact of Textile Waste
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Producing a single cotton T-shirt requires approximately 2,700 liters of water, equivalent to one person&apos;s lifetime drinking water consumption. Synthetic textiles contribute to &ldquo;35% of primary microplastics in oceans.&rdquo; The fashion industry accounts for nearly 10% of global CO2 emissions.
            </p>
          </section>

          <hr className="border-slate-200" />

          {/* Section: Where Does Textile Waste Go? */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Where Does Textile Waste Go?
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              A large portion of textile waste ends up in landfills or is incinerated, contributing to pollution and resource loss.
            </p>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                Landfills vs Recycling vs Resale Markets
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Landfills remain the primary destination for textile waste, where materials take decades to decompose. Recycling converts textiles into new materials, though it remains limited due to fiber complexity. Resale markets provide practical solutions by extending product life cycles.
              </p>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section: How to Reduce Textile Waste */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              How to Reduce Textile Waste
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Reducing textile waste requires better consumption habits, improved recycling systems, and efficient redistribution networks.
            </p>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                Reuse, Resell, and Circular Economy
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Circular fashion is gaining momentum, with the market projected to reach $7.04 billion by 2026, growing at a CAGR of 8.7%. Reuse and resale extend product lifecycles and reduce the need for new production.
              </p>
            </div>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                Role of Surplus Marketplaces in Waste Reduction
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Surplus marketplaces enable efficient textile waste management by connecting excess inventory with buyers who can use it productively, reducing disposal and promoting waste reduction at scale.
              </p>
            </div>
          </section>

        </div>

      </div>
    </article>
  );
}
