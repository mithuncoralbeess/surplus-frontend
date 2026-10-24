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
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Clock,
  ArrowUpRight,
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

const impactPillars = [
  {
    icon: Trash2,
    badge: "Waste Prevention",
    title: "Preventing Waste at the Source",
    body: "We focus on liquidating slow-moving and obsolete stock (SLOB), drastically reducing the volume of commercial goods that would otherwise end up in landfills or incinerators.",
    metric: "Zero Landfill Objective",
    accent: "from-amber-500/10 to-emerald-500/10",
    iconBg: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
  },
  {
    icon: Building2,
    badge: "Capital Recovery",
    title: "Empowering Enterprises",
    body: "Our marketplace allows companies to reclaim tied-up capital and warehouse capacity from unused assets, converting holding liabilities into immediate liquidity.",
    metric: "Up to 50% Storage Saved",
    accent: "from-blue-500/10 to-emerald-500/10",
    iconBg: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
  },
  {
    icon: Recycle,
    badge: "Circular Economy",
    title: "Fostering a Circular System",
    body: "We are actively engineering an ecosystem where surplus inventory is repurposed, resold, and reintegrated into productive industries rather than discarded.",
    metric: "100% Productive Reuse",
    accent: "from-emerald-500/10 to-teal-500/10",
    iconBg: "bg-emerald-50 text-[#0a5c48] ring-1 ring-emerald-600/20",
  },
];

const bigNumbers = [
  {
    value: "1,000+ Tons",
    subtitle: "Surplus Diverted Annually",
    label: "of usable inventory diverted from municipal dumps annually through responsible B2B redistribution.",
    icon: Recycle,
    badge: "Waste Diverted",
  },
  {
    value: "50%",
    subtitle: "Storage Cost Reduction",
    label: "average reduction in holding and warehousing overhead for sellers liquidating through our network.",
    icon: TrendingUp,
    badge: "Enterprise Efficiency",
  },
  {
    value: "70%",
    subtitle: "Purchasing Savings",
    label: "savings achieved by verified buyers on quality commercial inventory compared to traditional retail channels.",
    icon: BarChart3,
    badge: "Buyer Value",
  },
  {
    value: "100%",
    subtitle: "Direct P2P Logistics",
    label: "peer-to-peer distribution eliminating redundant intermediate warehouse stops and transit emissions.",
    icon: Truck,
    badge: "Scope 3 Optimization",
  },
];

const sdgs = [
  {
    code: "Goal 12",
    title: "Responsible Consumption & Production",
    text: "Ensuring sustainable consumption and production patterns by promoting the reuse and repurposing of commercial excess inventory across industries.",
    color: "bg-[#bf8b2e] text-white",
  },
  {
    code: "Target 12.5",
    title: "Substantial Waste Reduction",
    text: "By 2030, substantially reduce waste generation through prevention, reduction, recycling, and reuse of functional assets.",
    color: "bg-[#cf9938] text-white",
  },
  {
    code: "Target 12.7",
    title: "Sustainable Public & B2B Procurement",
    text: "Promote sustainable procurement practices that align with national policies, environmental criteria, and corporate ESG standards.",
    color: "bg-[#a87a27] text-white",
  },
  {
    code: "Goal 9",
    title: "Industry, Innovation & Infrastructure",
    text: "Building resilient infrastructure, promoting inclusive and sustainable industrialization, and fostering regional supply innovation.",
    color: "bg-[#f26a2e] text-white",
  },
  {
    code: "Target 9.4",
    title: "Clean Technology & Upgraded Assets",
    text: "By 2030, upgrade infrastructure and retrofit industries to improve resource-use efficiency and adopt environmentally sound tech.",
    color: "bg-[#df561a] text-white",
  },
];

const modelPoints = [
  {
    icon: Package,
    badge: "Zero Secondary Warehousing",
    title: "Direct from Seller to Buyer",
    body: "Our peer-to-peer model ensures every product ships straight from the seller's location to the buyer's receiving dock. Eliminating intermediary sorting facilities cuts transit mileage, handling damage, and logistics emissions.",
  },
  {
    icon: ShieldCheck,
    badge: "Strict Verification",
    title: "Verified, Quality-Centric Listings",
    body: "Only inventory items that pass rigorous catalog and documentation checks are approved for sale. Buyers receive dependable, compliant stock that satisfies enterprise procurement standards.",
  },
  {
    icon: Truck,
    badge: "Green Transport Network",
    title: "Logistics Excellence",
    body: "We partner with trusted regional freight carriers prioritizing optimized load consolidation and eco-friendly routes, ensuring every shipment minimizes Scope 3 carbon footprint.",
  },
];

export default function SustainabilityPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      {/* 1. Hero Banner */}
      <section className="relative w-full overflow-hidden bg-[#051711] text-white pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-emerald-950">
        {/* Background Image & Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#041a13]/90 via-[#041a13]/85 to-[#051711] z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,123,95,0.25),transparent_60%)] z-10" />
          <Image
            src="/sustainability-hero.jpg"
            alt="Sustainability at Surplus Market"
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-40 mix-blend-luminosity"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-20">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-emerald-200/80 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60" />
            <span className="text-white font-semibold">
              Sustainability
            </span>
          </nav>

          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-950/80 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-emerald-300 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              <span>Circular Economy &amp; ESG Scope 3 Impact</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-white">
              Reducing Waste, Boosting Impact: <br />
              <span className="text-emerald-400">Building a Sustainable Future Together</span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
              Transform slow-moving and excess inventory into measurable carbon savings, circular value, and recovered working capital across GCC enterprise supply chains.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/inventory-calculator"
                className="inline-flex items-center gap-2 rounded-full bg-[#107b5f] hover:bg-[#0c664e] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
              >
                <Calculator className="h-4 w-4" />
                <span>Inventory Aging Calculator</span>
              </Link>
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all cursor-pointer hover:border-white/40"
              >
                <span>Explore Surplus Deals</span>
                <ArrowRight className="h-4 w-4 text-emerald-400" />
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300 hover:text-white px-3 py-2 transition-colors cursor-pointer"
              >
                <span>List Your Surplus</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-14 pt-10 border-t border-emerald-900/60 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bigNumbers.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-emerald-800/40 bg-emerald-950/50 backdrop-blur-md p-5 sm:p-6 transition-all hover:border-emerald-700/60 hover:bg-emerald-950/70"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                      {item.badge}
                    </span>
                    <Icon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
                    {item.value}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-emerald-200 mt-1">
                    {item.subtitle}
                  </div>
                  <p className="text-xs text-emerald-100/70 mt-2 leading-relaxed line-clamp-2">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Mission & The Global Waste Problem */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Mission */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-[#0a5c48] border border-emerald-100">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Our Core Purpose</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950 leading-[1.18]">
                Our Mission for a <br />
                <span className="text-[#0a5c48]">Sustainable Enterprise Future</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
                At Surplus Market, we believe that sustainability isn't just an option — it's our foundational responsibility. Our mission is to turn excess inventory into opportunity, creating a transparent marketplace that values every asset and ensures nothing of utility is wasted.
              </p>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                We empower businesses across the GCC to transform slow-moving stock into immediate working capital, while actively curbing the carbon extraction required to manufacture replacement goods.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 flex-1">
                  <CheckCircle2 className="h-5 w-5 text-[#0a5c48] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Preventing Landfill Write-offs</h4>
                    <p className="text-xs text-gray-600 mt-0.5">Diverting SLOB stock to active industrial operations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 flex-1">
                  <CheckCircle2 className="h-5 w-5 text-[#0a5c48] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Capital Reclamation</h4>
                    <p className="text-xs text-gray-600 mt-0.5">Freeing warehouse floor space and returning cash to balance sheets.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: The Problem With Surplus Waste */}
            <div className="lg:col-span-6 bg-slate-50/90 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Global Challenge
                </span>
                <span className="text-xs text-gray-500 font-medium">Source: World Bank</span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-gray-950">
                The Scale of Surplus Waste
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0a5c48] tracking-tight">
                    2.01 Billion
                  </div>
                  <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Metric Tons Annually
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    of global municipal and industrial waste generated each year, with manufacturing and retail as major contributors.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2">
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 tracking-tight">
                    3.4 Billion
                  </div>
                  <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Projected by 2050
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    estimated global annual waste if linear "take-make-dispose" consumption models continue unchecked.
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                Each year, industrial manufacturing adds millions of tons of obsolete and slow-moving stock (SLOB) to landfills. Surplus Market bridges the gap by connecting sellers directly with verified buyers, converting dormant resources into commercial advantage.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Our Impact: Turning Surplus into Sustainable Success */}
      <section className="w-full py-16 sm:py-24 bg-slate-50/70 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-[#0a5c48] border border-emerald-100">
              <Recycle className="h-3.5 w-3.5" />
              <span>Measurable Impact</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">
              Our Impact: Turning Surplus into Sustainable Success
            </h2>
            <p className="text-base text-gray-600 leading-relaxed font-normal">
              <strong className="text-gray-900 font-semibold">Together, We Make a Real Difference.</strong> Every transaction on Surplus Market prevents unnecessary disposal, curbs new production demands, and powers the regional circular economy.
            </p>
          </div>

          {/* 3 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {impactPillars.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </span>
                      <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-950">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-normal">
                      {card.body}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#0a5c48]">
                    <span>{card.metric}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Showcase Card with Image */}
          <div className="mt-10 rounded-3xl overflow-hidden border border-gray-200/90 bg-white shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[260px]">
              <Image
                src="/sustainability-impact.jpg"
                alt="Sustainable Impact & Waste Prevention"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:hidden" />
            </div>

            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0a5c48] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">
                Verified Industrial Redistribution
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight leading-snug">
                Directing verified surplus toward productive reuse across global supply chains.
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                Every lot cataloged on our marketplace undergoes inspection and verified specification mapping, ensuring items match buyers' active operations and prevent premature write-offs.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-2 rounded-full bg-[#107b5f] hover:bg-[#0c664e] text-white text-xs sm:text-sm font-bold px-6 py-3 transition-colors cursor-pointer"
                >
                  <span>Browse Sustainable Lots</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 hover:border-gray-400 text-gray-800 text-xs sm:text-sm font-bold px-6 py-3 transition-colors cursor-pointer"
                >
                  <span>Turn Your Surplus to Capital</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Our Model: Sustainability in Every Transaction */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Model Narrative & 3 Points */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-[#0a5c48] border border-emerald-100 mb-4">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Zero-Warehouse Operational Model</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950 leading-tight">
                  Our Model: Sustainability Built into Every Transaction
                </h2>
                <p className="mt-4 text-base text-gray-600 leading-relaxed font-normal">
                  Unlike traditional distributors that move goods through multiple regional warehouses, Surplus Market connects enterprise counterparties directly through an agile peer-to-peer structure.
                </p>
              </div>

              <div className="space-y-4">
                {modelPoints.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-5 sm:p-6 rounded-2xl border border-gray-200/80 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex gap-4 sm:gap-5"
                    >
                      <span className="w-11 h-11 rounded-xl bg-emerald-50 text-[#0a5c48] flex items-center justify-center shrink-0 ring-1 ring-emerald-600/15">
                        <Icon className="w-5 h-5" />
                      </span>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold text-gray-950">
                            {item.title}
                          </h4>
                          <span className="text-[11px] font-mono font-medium text-emerald-800 bg-emerald-50/90 px-2 py-0.5 rounded-md">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed font-normal">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Visual Container */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative h-[340px] sm:h-[420px] rounded-3xl overflow-hidden border border-gray-200 shadow-md">
                <Image
                  src="/sustainability-model.jpg"
                  alt="Sustainable Supply Chain & Zero-Warehouse Model"
                  fill
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                    <Truck className="h-4 w-4" />
                    <span>Point-to-Point Freight Distribution</span>
                  </span>
                  <h4 className="text-lg font-bold leading-snug">
                    Zero unnecessary freight legs. Full transparency.
                  </h4>
                  <p className="text-xs text-emerald-100/80 leading-relaxed">
                    By bypassing middleman holding depots, products travel fewer transit kilometers and experience virtually zero handling damage.
                  </p>
                </div>
              </div>

              {/* Callout box */}
              <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 text-emerald-950 space-y-1.5">
                <div className="text-xs font-bold text-[#0a5c48] uppercase tracking-wider flex items-center gap-1.5">
                  <Leaf className="h-3.5 w-3.5" />
                  <span>Why Sustainability Matters to Us</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Waste from excess inventory causes unnecessary carbon emissions, natural resource depletion, and landfill saturation. By championing a circular economy, we shift commerce from disposable to sustainable.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Global & National Goals: UN SDGs & Qatar National Vision 2030 */}
      <section className="w-full py-16 sm:py-24 bg-[#051711] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/80 px-4 py-1.5 text-xs font-semibold text-emerald-300 shadow-xs">
              <Globe className="h-3.5 w-3.5" />
              <span>International &amp; National Frameworks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Aligned with Global SDGs &amp; <br />
              <span className="text-emerald-400">Qatar National Vision 2030</span>
            </h2>
            <p className="text-base text-emerald-100/80 leading-relaxed font-normal">
              Surplus Market aligns our B2B liquidation operations with international climate action commitments and national economic sustainability strategies.
            </p>
          </div>

          {/* Qatar National Vision 2030 Feature Banner */}
          <div className="rounded-3xl border border-emerald-600/30 bg-gradient-to-r from-emerald-950/90 via-[#072d21]/90 to-emerald-950/90 p-6 sm:p-10 backdrop-blur-md shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <span className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-300">
                <Globe className="w-7 h-7" />
              </span>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                  <span>National Commitment</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Qatar National Vision 2030 (QNV 2030)
                </h3>
                <p className="text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
                  Rooted in the region, Surplus Market proudly aligns with Qatar's Environmental Development Pillar. We actively foster regional green industrialization, encourage responsible resource utilization, and eliminate unneeded material disposal.
                </p>
              </div>
            </div>

            <div className="shrink-0 self-stretch md:self-auto flex items-center">
              <Link
                href="/about-us"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#0a5c48] hover:bg-emerald-50 px-6 py-3 text-xs sm:text-sm font-bold shadow-md transition-colors cursor-pointer"
              >
                <span>About Our Vision</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* UN SDGs Grid */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">
                Supporting the UN Sustainable Development Goals (SDGs)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sdgs.map((sdg, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-emerald-800/40 bg-emerald-950/40 backdrop-blur-md p-6 hover:border-emerald-600/60 hover:bg-emerald-950/60 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${sdg.color}`}>
                      {sdg.code}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-300/80">
                      United Nations
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white leading-snug">
                    {sdg.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
                    {sdg.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 6. Inventory Depreciation & Calculator Teaser */}
      <section className="w-full py-16 sm:py-20 bg-slate-50/80 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="rounded-3xl border border-emerald-200/90 bg-white p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-[#0a5c48] border border-emerald-100">
                <Calculator className="h-3.5 w-3.5" />
                <span>Interactive Enterprise Tool</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
                Calculate the True Cost of Your Aging Inventory
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
                Holding obsolete inventory costs up to 32% of its value every year in warehouse rent, insurance, and rapid depreciation. Use our interactive calculator to see how much capital you can liberate while eliminating landfill waste.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                href="/inventory-calculator"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#107b5f] hover:bg-[#0c664e] text-white text-sm font-bold px-7 py-3.5 shadow-md transition-all cursor-pointer hover:shadow-lg"
              >
                <Calculator className="h-4 w-4" />
                <span>Open Aging Calculator</span>
              </Link>
              <Link
                href="/browse"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 hover:border-gray-400 bg-white text-gray-800 text-sm font-bold px-7 py-3.5 transition-colors cursor-pointer"
              >
                <span>Browse Discounted Lots</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Bottom CTA */}
      <section className="w-full py-16 sm:py-24 bg-[#0a5c48] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="rounded-3xl border border-emerald-400/30 bg-gradient-to-b from-[#0e745b] to-[#0a5c48] p-8 sm:p-14 text-center shadow-xl space-y-6">
            
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-emerald-200 border border-white/20">
              <Leaf className="h-3.5 w-3.5" />
              <span>Join the Sustainable Commerce Movement</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Ready to Turn Surplus into Success?
            </h2>

            <p className="mx-auto max-w-2xl text-emerald-100 text-sm sm:text-base leading-relaxed font-normal">
              Every business has the power to make an immediate environmental and economic impact. By joining Surplus Market, you support responsible commerce, divert usable assets from landfills, and unlock trapped cash.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[#0a5c48] hover:bg-emerald-50 shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>List Surplus Inventory Today</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-colors cursor-pointer"
              >
                <span>Explore Sourced Inventory</span>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
