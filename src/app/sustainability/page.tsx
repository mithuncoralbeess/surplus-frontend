import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Leaf,
  Trash2,
  Recycle,
  Building2,
  Package,
  Globe,
  Target,
  ShieldCheck,
  Truck,
  ArrowRight,
  Calculator,
  ChevronRight,
} from 'lucide-react';
import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata: Metadata = {
  title: "Sustainability & Circular Impact | Surplus Market",
  description: "How Surplus Market reduces waste, empowers a circular economy, and aligns with the UN SDGs and Qatar National Vision 2030 by turning excess inventory into circular value.",
  keywords: [
    "circular economy",
    "B2B sustainability",
    "waste reduction",
    "carbon savings",
    "ESG inventory reporting",
    "UN SDGs",
    "Qatar National Vision 2030",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('sustainability', fallbackMetadata);
}

const impactCards = [
  {
    icon: Trash2,
    title: "Preventing Waste",
    body: "We focus on liquidating slow-moving and obsolete stock (SLOB), reducing the volume of goods that would otherwise end up in landfills or incinerators.",
  },
  {
    icon: Building2,
    title: "Empowering Businesses",
    body: "Our marketplace allows companies to reclaim value from unused assets, converting potential losses into revenue.",
  },
  {
    icon: Recycle,
    title: "Fostering a Circular Economy",
    body: "We are building a sustainable ecosystem where surplus inventory is repurposed, reused, and reintegrated into the economy.",
  },
];

const bigNumbers = [
  {
    value: "1,000+ tons",
    label: "of surplus inventory diverted from waste annually through responsible transactions.",
  },
  {
    value: "50%",
    label: "average reduction in storage costs for sellers who liquidate excess through our platform.",
  },
  {
    value: "70%",
    label: "savings for buyers on quality inventory compared to traditional retail channels.",
  },
];

const sdgs = [
  {
    code: "Goal 12",
    text: "Ensuring sustainable consumption and production patterns by promoting the reuse and repurposing of excess inventory.",
  },
  {
    code: "Goal 12.5",
    text: "By 2030, substantially reduce waste generation through prevention, reduction, recycling, and reuse.",
  },
  {
    code: "Goal 12.7",
    text: "Promote sustainable procurement practices that align with national policies and priorities.",
  },
  {
    code: "Goal 9",
    text: "Building resilient infrastructure and fostering sustainable industrialization.",
  },
  {
    code: "Goal 9.4",
    text: "By 2030, upgrade infrastructure to improve resource efficiency and adopt clean technologies.",
  },
];

const modelPoints = [
  {
    icon: Package,
    title: "Direct from Seller to Buyer",
    body: "Our no-warehouse model ensures that every product is shipped directly from the seller's location to the buyer, reducing additional transport and storage emissions.",
  },
  {
    icon: ShieldCheck,
    title: "Verified, Quality-Centric Listings",
    body: "Only products that pass our rigorous quality checks are listed, ensuring buyers receive quality inventory that aligns with responsible sourcing practices.",
  },
  {
    icon: Truck,
    title: "Logistics Excellence",
    body: "We partner with logistics providers who prioritize eco-friendly practices, ensuring that every delivery minimizes environmental impact.",
  },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
      {children}
    </h2>
  );
}

export default function SustainabilityPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      {/* 1. Hero Banner with Real Image */}
      <section className="relative w-full overflow-hidden bg-[#0a1e17] text-white pt-12 pb-20 sm:pt-16 sm:pb-28">
        {/* Background Image & Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#041a13]/95 via-[#041a13]/85 to-[#041a13]/60 z-10" />
          <Image
            src="/sustainability-hero.jpg"
            alt="Sustainability at Surplus Market"
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-50 mix-blend-luminosity"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-20 text-center">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs text-emerald-200/70 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60" />
            <span className="text-white font-semibold">
              Sustainability
            </span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/70 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-emerald-300 shadow-xs">
            <Leaf className="h-3.5 w-3.5 text-emerald-400" />
            <span>Sustainability at Surplus Market</span>
          </div>

          <h1 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white max-w-4xl mx-auto">
            Reducing Waste, Boosting Impact: <br />
            <span className="text-emerald-400">Building a Sustainable Future Together</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            Transform excess inventory into measurable carbon offsets, circular savings, and recovered capital.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/inventory-calculator"
              className="inline-flex items-center gap-2 rounded-full bg-[#107b5f] hover:bg-[#0c664e] px-7 py-3.5 text-sm font-bold text-white shadow-md transition-colors cursor-pointer"
            >
              <Calculator className="h-4 w-4" />
              <span>Inventory Aging Calculator</span>
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 hover:bg-white/15 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors cursor-pointer"
            >
              <span>Explore Surplus Deals</span>
              <ArrowRight className="h-4 w-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="mx-auto max-w-5xl space-y-16 sm:space-y-20 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        
        {/* 2. Our Mission */}
        <section className="bg-emerald-50/50 rounded-3xl p-6 sm:p-10 border border-emerald-100/80">
          <SectionHeading>Our Mission for a Sustainable Future</SectionHeading>
          <p className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed">
            At Surplus Market, we believe that sustainability isn't just an option — it's our
            responsibility. Our mission is to turn excess inventory into opportunity, creating a
            marketplace that values every asset and ensures nothing is wasted. We are driven to
            empower businesses to transform surplus into value, while actively reducing
            environmental impact.
          </p>
        </section>

        {/* 3. The Problem with Surplus Waste */}
        <section className="space-y-6">
          <SectionHeading>The Problem with Surplus Waste</SectionHeading>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0a5c48]">
                2.01 Billion Metric Tons
              </div>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                of global waste generated each year, with manufacturing and retail as major
                contributors.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0a5c48]">
                3.4 Billion Metric Tons
              </div>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                projected global waste by 2050 if no action is taken.
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl">
            Each year, the manufacturing and retail industries add significantly to the world's
            waste, with slow-moving and obsolete stock (SLOB) often ending up in landfills. Surplus
            Market aims to change this by connecting buyers and sellers in a system that maximizes
            resource use and minimizes waste, transforming surplus into opportunity.
          </p>
          <p className="text-xs text-gray-400 font-medium">(Data Source: World Bank)</p>
        </section>

        {/* 4. Our Impact */}
        <section className="space-y-6">
          <SectionHeading>Our Impact: Turning Surplus into Sustainable Success</SectionHeading>
          <p className="max-w-3xl text-sm sm:text-base text-gray-600 leading-relaxed">
            <strong className="font-semibold text-gray-900">Together, We Make a Difference.</strong> Every
            transaction on Surplus Market contributes to a larger mission. Buyers and sellers who
            partner with us are helping reduce waste, cut down on new production, and support a more
            circular economy.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {impactCards.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-[#0a5c48] mb-4">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-base font-bold text-gray-900">{c.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{c.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Impact Supporting Visual */}
          <div className="relative w-full h-[220px] sm:h-[300px] rounded-2xl overflow-hidden border border-gray-200 shadow-xs mt-6">
            <Image
              src="/sustainability-impact.jpg"
              alt="Sustainable Impact & Waste Prevention"
              fill
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
              <span className="text-white text-xs sm:text-sm font-semibold">
                Directing verified industrial surplus toward productive reuse across global supply chains.
              </span>
            </div>
          </div>
        </section>

        {/* 5. Big Numbers, Big Impact */}
        <section className="rounded-3xl border border-emerald-100 bg-[#f8faf9] p-6 sm:p-10">
          <SectionHeading>Big Numbers, Big Impact</SectionHeading>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {bigNumbers.map((n) => (
              <div key={n.value} className="space-y-2">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0a5c48]">
                  {n.value}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">{n.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-gray-400 font-medium">(Sources: World Bank, Global Waste Report)</p>
        </section>

        {/* 6. Global and National Sustainability Goals */}
        <section className="space-y-6">
          <SectionHeading>How We Align with Global and National Sustainability Goals</SectionHeading>
          <p className="max-w-3xl text-sm sm:text-base text-gray-600 leading-relaxed">
            <strong className="font-semibold text-gray-900">Supporting the UN's Sustainable Development Goals (SDGs).</strong> Surplus
            Market is aligned with key sustainability and climate action goals, specifically:
          </p>

          <ul className="space-y-3.5 pt-2">
            {sdgs.map((g) => (
              <li key={g.code} className="flex items-start gap-3.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-100 text-[#0a5c48]">
                  <Target className="h-4 w-4" />
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong className="font-bold text-gray-900">{g.code}:</strong> {g.text}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-start gap-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
            <Globe className="mt-0.5 h-6 w-6 shrink-0 text-[#0a5c48]" />
            <p className="text-sm text-emerald-950 leading-relaxed">
              <strong className="font-bold text-[#0a5c48]">Qatar National Vision 2030.</strong> We proudly align with
              Qatar's national vision for environmental responsibility by actively supporting
              sustainable industry practices and encouraging the responsible use of resources.
            </p>
          </div>
        </section>

        {/* 7. Why Sustainability Matters to Us */}
        <section className="space-y-4">
          <SectionHeading>Why Sustainability Matters to Us</SectionHeading>
          <p className="max-w-3xl text-sm sm:text-base text-gray-600 leading-relaxed">
            Sustainability is core to our values because it's essential for the future of both
            business and the environment. The stakes are high: waste from excess inventory
            contributes to pollution, resource depletion, and climate change. By championing a
            circular economy, we aim to shift the paradigm from disposable to sustainable.
          </p>
        </section>

        {/* 8. Our Model */}
        <section className="space-y-6">
          <SectionHeading>Our Model: Sustainability in Every Transaction</SectionHeading>
          
          <div className="grid gap-4 sm:grid-cols-3">
            {modelPoints.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-[#0a5c48] mb-4">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-base font-bold text-gray-900">{m.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{m.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Model Supporting Visual */}
          <div className="relative w-full h-[220px] sm:h-[300px] rounded-2xl overflow-hidden border border-gray-200 shadow-xs mt-6">
            <Image
              src="/sustainability-model.jpg"
              alt="Sustainable Supply Chain & Zero-Warehouse Model"
              fill
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
              <span className="text-white text-xs sm:text-sm font-semibold">
                Direct P2P liquidation model eliminating secondary warehousing and minimizing transit emissions.
              </span>
            </div>
          </div>
        </section>

        {/* 9. Closing CTA */}
        <section className="overflow-hidden rounded-3xl border border-[#0f7a61] bg-[#0a5c48] p-8 text-center text-white sm:p-12 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Join Us in Making a Difference</h2>
          <p className="mx-auto mt-4 max-w-2xl text-emerald-100 text-sm sm:text-base leading-relaxed">
            Every business has the power to make a positive impact. By joining Surplus Market, you're
            supporting a marketplace that values sustainability, reduces waste, and offers
            significant savings. Let's turn surplus into success, one transaction at a time.
          </p>
          <Link
            href="/sell"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#0a5c48] hover:bg-emerald-50 shadow-md transition-colors cursor-pointer"
          >
            <span>Join the Sustainable Movement Today</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

      </div>
    </main>
  );
}
