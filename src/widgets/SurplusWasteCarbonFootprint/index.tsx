import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

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
              How Surplus Market Reduces Waste &amp; Carbon Footprint
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
            How Surplus Market Reduces Waste and Carbon Footprint
          </h1>
        </div>
      </header>

      {/* 3. Pure Content-Only Editorial Body */}
      <div className="w-full bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12 sm:py-16">
          <div className="space-y-10 text-slate-700">
            
            {/* Understanding Surplus Market and Sustainability */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Understanding Surplus Market and Sustainability
              </h2>

              <div className="pt-3 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  What is Surplus Market?
                </h3>
                <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                  Surplus Market is an online marketplace for buying and selling excess or unused inventory. It allows businesses to list surplus items such as industrial tools, building materials, electronics, and furniture. The platform makes these products available at reduced prices, reducing the need for new production.
                </p>
              </div>

              <div className="pt-3 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Why Surplus Market Matters for Waste Reduction
                </h3>
                <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                  By facilitating the exchange of surplus goods, Surplus Market prevents brand-new items from being discarded. Businesses can reduce storage waste while ensuring products remain in circulation. This system encourages efficient resource management and responsible inventory handling.
                </p>
              </div>
            </section>

            {/* How Surplus Market Lowers Carbon Emissions */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                How Surplus Market Lowers Carbon Emissions
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Reducing the need for manufacturing new products lowers energy use and greenhouse gas emissions. Surplus trading decreases transportation requirements for raw materials and production supplies.
              </p>

              <div className="pt-3 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Eco-Friendly Solutions for Businesses on Surplus Market
                </h3>
                <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                  Companies can list excess inventory on Surplus Market instead of discarding it, supporting a more sustainable economy. Access to unused surplus items allows organizations to purchase with a lower environmental impact.
                </p>
              </div>
            </section>

            {/* Environmental Benefits of Surplus Market */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Environmental Benefits of Surplus Market
              </h2>
              <ul className="list-disc pl-6 space-y-2.5 text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                {benefits.map((benefit, idx) => (
                  <li key={idx}>
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>

            {/* Surplus Market and Carbon Footprint Reduction */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Surplus Market and Carbon Footprint Reduction
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                Each surplus product sold through Surplus Market contributes to fewer carbon emissions. By decreasing production and transportation requirements, businesses help mitigate climate impact. Surplus trading promotes energy and resource efficiency across industries.
              </p>
            </section>

            {/* Steps for Businesses to Use Surplus Market Effectively */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Steps for Businesses to Use Surplus Market Effectively
              </h2>
              <ol className="list-decimal pl-6 space-y-3 text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                {steps.map((step, idx) => (
                  <li key={idx}>
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            {/* Future of Surplus Market and Sustainability */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Future of Surplus Market and Sustainability
              </h2>
              <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-600">
                As more businesses adopt surplus trading, the environmental impact will continue to decrease. Surplus Market will expand its network, providing greater access to unused inventory. Companies can benefit economically while actively participating in reducing global waste and carbon emissions. The platform supports long-term sustainability goals for industries across regions.
              </p>
            </section>

          </div>
        </div>
      </div>
    </article>
  );
}
