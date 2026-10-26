import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function HiddenEconomySurplus() {
  const faqs = [
    {
      q: "What is surplus re-commerce?",
      a: "Surplus re-commerce refers to selling, refurbishing, or distributing surplus stock. This strategy works for consumer goods and industrial stock, enabling companies to gain value out of surplus goods."
    },
    {
      q: "How does surplus trading impact sustainability?",
      a: "Using surplus stock limits wastage, production activities, and environmental pollution, while generating revenue simultaneously."
    },
    {
      q: "Which industries benefit most from industrial surplus marketplaces?",
      a: "Energy, healthcare, manufacturing, and electronics are the primary industries utilizing surplus stock to benefit financially."
    },
    {
      q: "Can surplus become a revenue source for small and medium enterprises?",
      a: "Yes, SMEs can leverage surplus stock and generate revenue through online trading platforms."
    },
    {
      q: "How does certification in re-commerce work?",
      a: "Certified re-commerce ensures that products are inspected, refurbished if necessary, and backed by warranties. This gives buyers confidence comparable to new goods."
    }
  ];

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
            The $257 Billion Hidden Economy
          </span>
        </nav>

        {/* Eyebrow */}
        <div className="text-xs font-semibold uppercase tracking-wider text-[#0a5c48] mb-3">
          Surplus Market
        </div>

        {/* Main Title */}
        <h1 className="h1 text-slate-900 tracking-tight mb-10">
          The $257 Billion &ldquo;Hidden Economy&rdquo;: Why Surplus is the New Strategic Asset
        </h1>

        {/* Article Body - Content Only */}
        <div className="space-y-12 text-slate-800">
          
          {/* Section: Why Re-Commerce is Redefining Value */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Why Re-Commerce is Redefining Value
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              The surge in re-commerce represents a transformation in how value is recognized. The era of surplus is evolving into a capital surplus economy, where unused assets are monetized, and trust drives the transaction.
            </p>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                The Value-Seeker Shift
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                High cost-of-living pressures are reshaping purchasing behavior. In 2026, &ldquo;47% of global households identify as value seekers,&rdquo; actively pursuing deals on pre-owned and refurbished goods. Notably, &ldquo;35% of high-income households also participate, seeking quality surplus items such as premium tech and luxury watches to offset inflation.&rdquo; These consumers prioritize verified quality, transparency, and product authenticity.
              </p>
            </div>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                The Rise of Certified Re-Commerce
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                The biggest shift in the surplus economy in 2026 is the emergence of &ldquo;Trust-as-a-Service.&rdquo; Leading platforms such as Amazon and eBay, along with specialized B2B marketplaces, are now offering certified refurbishment programs backed by warranties that closely match new products. This development has directly addressed one of the biggest barriers in the re-commerce market: quality skepticism.
              </p>
            </div>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                Sustainability Meets Profitability
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Businesses are increasingly connecting surplus management to sustainability goals. Selling or repurposing excess inventory reduces landfill waste, lowers production strain, and positions surplus as both an economic and environmental asset.
              </p>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section: The B2B Surge */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              The B2B Surge: Industrial Re-Commerce at Scale
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              While consumer resale dominates headlines, the real scale lies in B2B. The global B2B e-commerce market is projected to reach $36 trillion by late 2026, with a substantial share driven by industrial re-commerce. This includes the exchange of surplus energy equipment, healthcare devices, and advanced manufacturing components.
            </p>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                High-Value Industrial Categories
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Surplus trading is thriving across energy equipment, healthcare devices, and advanced manufacturing components. Companies can convert underutilized inventory into immediate working capital, effectively transforming static stock into dynamic cash flow.
              </p>
            </div>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                APAC as the Growth Engine
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                The Asia-Pacific region is emerging as the fastest-growing market in the global surplus economy. A &ldquo;34.9% increase in the production of electronic and optical products&rdquo; has created a strong secondary market for components and surplus distribution.
              </p>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section: Inventory is the New Liquidity */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Inventory is the New Liquidity
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Rising financing costs have made holding unsold stock significantly more expensive. Companies are rethinking excess inventory management and treating surplus as a liquidity lever. Instead of relying on high-interest borrowing, businesses are liquidating overstock inventory to unlock immediate working capital and maintain operational flexibility.
            </p>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                From Cost Center to Cash Flow
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Transforming inventory into cash flow allows companies to fund operations without incurring additional debt. Selling or redistributing excess stock provides immediate capital, reduces storage overheads, and accelerates operational agility.
              </p>
            </div>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                Why Surplus is the New Strategic Asset
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                The strategic value of surplus is no longer a niche concept. It has become a core component of modern enterprise management. Surplus assets can strengthen supply chains, buffer against production uncertainties, and provide rapid access to materials for new projects.
              </p>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section: How Digital Marketplaces Power the Surplus Economy */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              How Digital Marketplaces Power the Surplus Economy
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Digital marketplaces have transformed the surplus ecosystem. These platforms enable rapid discovery, transaction, and distribution of excess inventory across industries and geographies.
            </p>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                Demand-Driven Buying
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                By harnessing analytics and user-driven demand, surplus marketplaces anticipate buyer needs and match them with available inventory. This model accelerates inventory turnover, enhances efficiency, and ensures high-demand items find buyers quickly.
              </p>
            </div>

            <div className="space-y-4 pt-3">
              <h3 className="h3 text-slate-900">
                Expanding Across Global Markets
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                The surplus economy is no longer confined to local markets. Global trading of surplus allows companies to access opportunities in strategic geographies, particularly in Qatar, Saudi Arabia, and the UAE, where surplus trading platforms are creating robust industrial networks.
              </p>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section: The Future of Re-Commerce */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              The Future of Re-Commerce
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              The outlook for the re-commerce market is robust. Digital innovation, coupled with rising consumer and industrial adoption, points toward continued growth in the surplus economy. Surplus is poised to redefine global trading norms, integrate sustainability with profitability, and reshape how businesses perceive value.
            </p>
          </section>

          <hr className="border-slate-200" />

          {/* Section: Frequently Asked Questions */}
          <section className="space-y-6">
            <h2 className="h2 text-slate-900">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6 pt-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="h4 text-slate-900 font-semibold">
                    {faq.q}
                  </h3>
                  <p className="text-base text-slate-700 leading-relaxed font-normal">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>
    </article>
  );
}
