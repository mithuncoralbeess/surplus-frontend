import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function SurplusWasteCarbonFootprint() {
  const benefits = [
    "Reduces the demand for new production",
    "Prevents brand-new items from being discarded",
    "Minimizes waste accumulation in storage and landfills",
    "Lowers greenhouse gas emissions associated with manufacturing",
    "Promotes efficient use of resources across industries",
    "Supports sustainable procurement practices for businesses"
  ];

  const steps = [
    "Sign up on Surplus Market and create a business profile.",
    "List surplus inventory to make items visible to potential buyers.",
    "Search for products using category filters or brand-specific searches.",
    "Connect with sellers via email, call, or WhatsApp to complete transactions.",
    "Track purchases to measure impact on waste reduction and sustainability.",
    "For location-specific sourcing, explore request a product option."
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
            Waste &amp; Carbon Footprint
          </span>
        </nav>

        {/* Eyebrow */}
        <div className="text-xs font-semibold uppercase tracking-wider text-[#0a5c48] mb-3">
          Surplus Market
        </div>

        {/* Main Title */}
        <h1 className="h1 text-slate-900 tracking-tight mb-10">
          How Surplus Market Reduces Waste and Carbon Footprint
        </h1>

        {/* Article Body - Content Only */}
        <div className="space-y-12 text-slate-800">
          
          {/* Section: Understanding Surplus Market and Sustainability */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Understanding Surplus Market and Sustainability
            </h2>

            <div className="space-y-4 pt-2">
              <h3 className="h3 text-slate-900">
                What is Surplus Market?
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Surplus Market is an online marketplace for buying and selling excess or unused inventory. It allows businesses to list surplus items such as industrial tools, building materials, electronics, and furniture. The platform makes these products available at reduced prices, reducing the need for new production.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="h3 text-slate-900">
                Why Surplus Market Matters for Waste Reduction
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                By facilitating the exchange of surplus goods, Surplus Market prevents brand-new items from being discarded. Businesses can reduce storage waste while ensuring products remain in circulation. This system encourages efficient resource management and responsible inventory handling.
              </p>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section: How Surplus Market Lowers Carbon Emissions & Solutions */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              How Surplus Market Lowers Carbon Emissions
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Reducing the need for manufacturing new products lowers energy use and greenhouse gas emissions. Surplus trading decreases transportation requirements for raw materials and production supplies.
            </p>

            <div className="space-y-4 pt-2">
              <h3 className="h3 text-slate-900">
                Eco-Friendly Solutions for Businesses on Surplus Market
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Companies can list excess inventory on Surplus Market instead of discarding it, supporting a more sustainable economy. Access to unused surplus items allows organizations to purchase with a lower environmental impact.
              </p>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section: Environmental Benefits of Surplus Market */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Environmental Benefits of Surplus Market
            </h2>
            
            <ul className="list-disc pl-6 space-y-2.5 text-base sm:text-lg text-slate-700 leading-relaxed">
              {benefits.map((benefit, idx) => (
                <li key={idx}>
                  {benefit}
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-slate-200" />

          {/* Section: Surplus Market and Carbon Footprint Reduction */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Surplus Market and Carbon Footprint Reduction
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Each surplus product sold through Surplus Market contributes to fewer carbon emissions. By decreasing production and transportation requirements, businesses help mitigate climate impact. Surplus trading promotes energy and resource efficiency across industries.
            </p>
          </section>

          <hr className="border-slate-200" />

          {/* Section: Steps for Businesses to Use Surplus Market Effectively */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Steps for Businesses to Use Surplus Market Effectively
            </h2>

            <ol className="list-decimal pl-6 space-y-3 text-base sm:text-lg text-slate-700 leading-relaxed">
              {steps.map((step, idx) => (
                <li key={idx}>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <hr className="border-slate-200" />

          {/* Section: Future of Surplus Market and Sustainability */}
          <section className="space-y-5">
            <h2 className="h2 text-slate-900">
              Future of Surplus Market and Sustainability
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              As more businesses adopt surplus trading, the environmental impact will continue to decrease. Surplus Market will expand its network, providing greater access to unused inventory. Companies can benefit economically while actively participating in reducing global waste and carbon emissions. The platform supports long-term sustainability goals for industries across regions.
            </p>
          </section>

        </div>

      </div>
    </article>
  );
}
