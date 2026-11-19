export interface SellFaqItem {
  id: string;
  question: string;
  answer: string;
}

export const SELL_FAQS: SellFaqItem[] = [
  {
    id: 'where-buyers',
    question: "Where can I find verified buyers for my excess inventory?",
    answer: "You can connect with pre-verified B2B buyers across UAE, Saudi Arabia, Qatar, India, and global markets directly through Surplus Market. We manage the buyer screening, negotiations, and payments for you.",
  },
  {
    id: 'what-types',
    question: "What types of surplus inventory can I sell?",
    answer: "We accept manufacturing overruns, cancelled purchase orders, discontinued product lines, surplus raw materials, spare parts, idle machinery, and retail overstock across electronics, apparel, construction, and FMCG.",
  },
  {
    id: 'upfront-fees',
    question: "Are there any upfront fees to list surplus stock?",
    answer: "No. Listing on Surplus Market is completely free with zero upfront fees. We operate strictly on a performance basis when your inventory is successfully liquidated and payment is secured.",
  },
  {
    id: 'brand-protection',
    question: "Will my company identity or brand be disclosed to buyers?",
    answer: "Never. Your company identity is strictly protected under non-disclosure terms. You never speak to or deal with buyers directly, protecting your existing distributor relationships and market price integrity.",
  },
  {
    id: 'ai-verification',
    question: "How does the AI listing and manifest verification work?",
    answer: "Simply fill our brief listing form or upload your spreadsheet/manifest. Our proprietary AI categorizes items, standardizes specs, and drafts the listing. Our commercial team verifies every detail within 24 hours before it goes live.",
  },
  {
    id: 'shipping-logistics',
    question: "How is shipping, logistics, and cross-border delivery handled?",
    answer: "You can choose to manage shipping independently or utilize Surplus Market's integrated logistics network for seamless door-to-door freight, customs clearance, and pallet dispatch.",
  },
  {
    id: 'payment-terms',
    question: "How and when do I receive payment?",
    answer: "We secure full payment from the buyer into escrow prior to dispatch. Once delivery and verification are confirmed, funds are settled directly into your registered corporate bank account.",
  },
];
