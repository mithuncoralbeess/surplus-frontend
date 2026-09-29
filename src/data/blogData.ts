export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  coverImage: string;
  featured?: boolean;
  tags: string[];
  keyTakeaways: string[];
  faqs?: BlogFAQ[];
}

export const BLOG_CATEGORIES = [
  "All",
  "Market Insights",
  "Supply Chain",
  "Sustainability & ESG",
  "Wholesale Liquidations",
  "Vendor Growth"
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "unlocking-value-from-aging-surplus-inventory-in-2026",
    title: "Unlocking Capital: How Enterprises Turn Aging Excess Inventory into Liquid Assets",
    excerpt: "Discover modern liquidation strategies, AI valuation tools, and direct-to-buyer lot auctions that transform non-moving inventory into working capital.",
    category: "Market Insights",
    featured: true,
    publishedAt: "Sept 18, 2026",
    readTime: "6 min read",
    coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Tariq Al-Mansoor",
      role: "Head of Supply Chain Strategy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    tags: ["Inventory Liquidation", "Working Capital", "Enterprise Strategy", "GCC Market"],
    keyTakeaways: [
      "Aging inventory depreciation accounts for up to 18% annual loss in working capital if left unmanaged.",
      "Automated AI manifest enrichment increases buyer confidence and speeds up average lot close times by 3.5x.",
      "Multi-channel surplus liquidations preserve brand integrity while tapping into secondary global buyer pools."
    ],
    faqs: [
      {
        question: "How soon can aging inventory be liquidated on Surplus Market?",
        answer: "Listings can be published within 24 hours of manifest upload. Most lot auctions or direct purchases close within 3 to 7 business days depending on pricing strategy."
      },
      {
        question: "What happens if our surplus manifest lacks detailed descriptions?",
        answer: "Our platform utilizes AI manifest parsing to enrich SKUs, generate missing product metadata, and estimate market MSRP automatically."
      },
      {
        question: "How do you protect our enterprise brand identity during liquidation?",
        answer: "Sellers can set regional buyer restrictions, brand unlabeling requirements, or private closed-bid auctions to protect primary retail channels."
      }
    ],
    content: `
      <h2>The Hidden Cost of Non-Moving Inventory</h2>
      <p>In modern industrial and retail operations, capital tied up in slow-moving or obsolete inventory is one of the biggest drag factors on business agility. Warehouse holding costs, insurance, product degradation, and opportunity costs compound silently month over month.</p>

      <p>Traditional liquidation pathways often involved fragmented local brokers offering rock-bottom pennies on the dollar with zero transparency into final buyer distribution. Today, technology-first surplus marketplaces are rewriting this dynamic.</p>

      <blockquote class="my-6 p-6 border-l-4 border-[#0a5c48] bg-[#e0f0e9]/40 italic text-gray-800 rounded-r-xl font-medium">
        "Surplus is no longer considered operational waste — when indexed correctly with structured manifest data, it represents a high-margin secondary asset class."
      </blockquote>

      <h2>3 Key Pillars of Modern Asset Recovery</h2>
      
      <h3>1. Automated AI Manifest Structuring</h3>
      <p>One of the largest hurdles buyers face when evaluating wholesale lots is unstructured data — missing SKUs, inconsistent descriptions, and unverified quantities. Utilizing machine-learning manifest parsers automatically standardizes category codes, estimates MSRP ranges, and generates clean condition reports.</p>

      <h3>2. Global Multi-Tier Buyer Networks</h3>
      <p>Reaching verified secondary market buyers across regional hubs (such as Dubai, Riyadh, and Doha) allows sellers to achieve competitive bidding environments. Rather than liquidating to a single local buyer, open lot listings ensure fair market valuation.</p>

      <h3>3. Verifiable ESG & Carbon Impact Offset Tracking</h3>
      <p>Redirecting excess inventory into active secondary supply chains prevents landfill disposal and raw material extraction waste. Modern enterprises now directly log surplus recovery metrics into their corporate ESG disclosures.</p>

      <h2>Actionable Next Steps for Warehouse Managers</h2>
      <p>Audit your inventory aging reports every 30 days. Items exceeding 90 days in warehouse storage should be flagged for structured lot creation before market value depreciates further.</p>
    `
  },
  {
    id: "2",
    slug: "esg-reporting-circular-economy-surplus-trading",
    title: "The Circular Advantage: Integrating Surplus Inventory Liquidation into ESG Disclosures",
    excerpt: "How forward-thinking enterprises are using secondary market trading data to fulfill Scope 3 carbon reduction metrics and zero-waste targets.",
    category: "Sustainability & ESG",
    featured: false,
    publishedAt: "Sept 12, 2026",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Dr. Elena Rostova",
      role: "Sustainability & Circular Economy Lead",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
    },
    tags: ["ESG Metrics", "Circular Economy", "Scope 3 Emission", "Sustainability"],
    keyTakeaways: [
      "Secondary product redistribution saves an average of 4.2 kg of CO2 equivalent per kilogram of manufactured goods.",
      "Corporate ESG auditors now mandate verified documentation for zero-waste-to-landfill declarations.",
      "Surplus marketplaces provide automated carbon offset certificates for every successfully completed deal."
    ],
    faqs: [
      {
        question: "How is carbon offset calculated for excess stock liquidation?",
        answer: "Offset metrics are calculated using industry-standard lifecycle assessment models (LCA), measuring avoided raw materials and landfill diversion metrics."
      },
      {
        question: "Can we download certified ESG reports for corporate sustainability compliance?",
        answer: "Yes, every completed transaction automatically generates a downloadable audit-ready ESG Impact Certificate detailing CO2e avoided and tonnage diverted."
      },
      {
        question: "Is secondary market trading compliant with international Scope 3 reporting guidelines?",
        answer: "Absolutely. Surplus Market reporting aligns with GHG Protocol Scope 3 Category 1 (Purchased Goods) and Category 12 (End-of-Life Treatment) standards."
      }
    ],
    content: `
      <h2>Beyond Recycling: The True Value of Reuse</h2>
      <p>While industrial recycling has been standard practice for decades, reuse and secondary distribution retain far higher embodied energy and economic value. Extending product lifecycles through secondary wholesale trading is the cornerstone of circular supply chain models.</p>

      <h2>Measuring Scope 3 Impact</h2>
      <p>Scope 3 emissions — which cover indirect upstream and downstream value chain emissions — typically represent over 70% of an enterprise’s total carbon footprint. By reintroducing unused stock, electronics, or industrial parts into active use, companies offset the raw material extraction needed for new manufacturing.</p>
    `
  },
  {
    id: "3",
    slug: "navigating-gcc-cross-border-freight-logistics-lots",
    title: "Navigating Cross-Border Freight for Wholesale Surplus Lots Across GCC Markets",
    excerpt: "A practical breakdown of LTL/FTL shipping, customs clearances, pallet consolidation, and hassle-free cross-border logistics in UAE, KSA, & Qatar.",
    category: "Supply Chain",
    featured: false,
    publishedAt: "Sept 05, 2026",
    readTime: "7 min read",
    coverImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Faisal Al-Hassan",
      role: "VP of Logistics & Trade Facilitation",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
    },
    tags: ["Cross-Border Freight", "Logistics", "GCC Trade", "LTL Shipping"],
    keyTakeaways: [
      "Standardizing pallet dimensions (120x100 cm) reduces cross-border transit handling costs by up to 22%.",
      "Digital customs manifests accelerate border clearance between UAE and KSA by up to 36 hours.",
      "Freight partner integration eliminates hidden shipping charges during buyer checkout."
    ],
    faqs: [
      {
        question: "Who handles customs clearance for cross-border shipments between GCC states?",
        answer: "Buyers can opt for Surplus Logistics Services, where our trade team manages border clearance, customs manifests, and duty exemptions."
      },
      {
        question: "What pallet standards are recommended for fast regional shipping?",
        answer: "Standard ISO Euro-pallets (120x100 cm or 120x80 cm) with shrink-wrapping ensure seamless transfer across automated GCC customs checkposts."
      },
      {
        question: "Are transit insurance policies available for high-value liquidation lots?",
        answer: "Yes, all freight booked through integrated partners includes full invoice value transit insurance coverage automatically."
      }
    ],
    content: `
      <h2>The Logistics Backbone of Large Lot Trading</h2>
      <p>Moving multi-pallet lots across regional borders requires specialized logistics coordination. From bill of lading preparation to customs duty exemptions for surplus overstock, streamlined logistics ensure high buyer satisfaction.</p>

      <h2>LTL vs FTL Optimization</h2>
      <p>For inventory lots under 6 pallets, Less-Than-Truckload (LTL) consolidation provides cost efficiency. For full container or truckload liquidations, dedicated freight dispatch guarantees direct warehouse delivery within 48-72 hours across GCC routes.</p>
    `
  },
  {
    id: "4",
    slug: "wholesale-liquidation-buyer-guide-bidding-strategies",
    title: "The Ultimate Guide to Buying Wholesale Lots: How Buyers Maximize Resale Margins",
    excerpt: "Key formulas for evaluating manifest MSRP, calculating landed cost per unit, and identifying high-turnover consumer return categories.",
    category: "Wholesale Liquidations",
    featured: false,
    publishedAt: "August 28, 2026",
    readTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Omar Farooq",
      role: "Senior Wholesale Buyer & Valuation Expert",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
    },
    tags: ["Wholesale Buying", "Bidding Tactics", "Resale Profit", "Manifest Analysis"],
    keyTakeaways: [
      "Always factor in freight costs into your max bid to protect target gross profit margins.",
      "Target return lots with itemized manifest conditions (Overstock vs Returns vs Salvage).",
      "Use automated counter-offer thresholds to secure deals quickly before competitive auctions close."
    ],
    faqs: [
      {
        question: "Can I inspect wholesale lots in person before placing a bid?",
        answer: "Physical inspection appointments can be requested for verified high-value lots at seller warehouse facilities prior to bidding close."
      },
      {
        question: "How are landed costs computed during bidding?",
        answer: "Our checkout portal provides real-time freight estimates based on destination address, pallet count, and item weight."
      },
      {
        question: "What protection is available if received items do not match manifest conditions?",
        answer: "Every purchase is protected by Surplus Buyer Protection. Discrepancies reported within 48 hours of receipt trigger hold-escrow review."
      }
    ],
    content: `
      <h2>Evaluating Wholesale Manifests Like a Pro</h2>
      <p>Successful secondary market buyers rely on systematic evaluation models rather than guesswork. Knowing how to interpret condition codes and calculating net landed cost per unit ensures consistent resale profitability.</p>

      <h2>Margin Formulas for Secondary Sellers</h2>
      <p>Target a minimum of 3.5x markup on wholesale cost for individual item resales after factoring in refurbishing, packaging, and shipping overhead.</p>
    `
  },
  {
    id: "5",
    slug: "scaling-vendor-sales-surplus-marketplace-features",
    title: "How Verified Vendors Scale Annual Surplus Sales by 40% Using Structured Listings",
    excerpt: "Best practices for listing excess inventory, utilizing bulk manifest imports, and optimizing pricing models to attract enterprise buyers.",
    category: "Vendor Growth",
    featured: false,
    publishedAt: "August 19, 2026",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Sarah Jenkins",
      role: "Vendor Onboarding Manager",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
    },
    tags: ["Vendor Growth", "Listing Optimization", "B2B Sales", "Pricing Models"],
    keyTakeaways: [
      "High-resolution cover photos boost lot view-to-offer conversion rate by 64%.",
      "Flexible sale methods (Offer vs Fixed Price vs Auction) attract different buyer personas.",
      "Instant response to buyer counter-offers accelerates cycle completion to under 48 hours."
    ],
    faqs: [
      {
        question: "What listing formats yield the highest buyer engagement?",
        answer: "Verified vendor data shows that tiered fixed-price listings with 'Make an Offer' options convert 35% faster than standalone auctions."
      },
      {
        question: "How does the automated vendor payout process work?",
        answer: "Payouts are released directly to vendor bank accounts via escrow within 24-48 hours after buyer delivery confirmation."
      },
      {
        question: "Are there bulk API integrations for existing enterprise ERP systems?",
        answer: "Yes, Surplus Market provides REST APIs and CSV/Excel bulk upload engines for SAP, Oracle, and NetSuite inventory sync."
      }
    ],
    content: `
      <h2>The Power of Professional Surplus Presentations</h2>
      <p>Listing surplus inventory effectively requires standardizing product descriptions, clear unit breakdowns, and transparent shipping terms. Professional presentations instill immediate trust in B2B buyers looking for recurring supplier partnerships.</p>
    `
  }
];
