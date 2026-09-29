"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import CommonBanner from '../CommonBanner';
import { 
  Search, 
  Plus, 
  Minus, 
  HelpCircle, 
  ShoppingBag, 
  Boxes, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  Mail, 
  Phone, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from '../../lib/motion';

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_CATEGORIES = [
  "All",
  "General & Registration",
  "Buying & Bidding",
  "Selling & Listing",
  "Shipping & Freight",
  "Payments & Escrow",
  "Verification & Compliance"
];

const FULL_FAQ_ITEMS: FAQItem[] = [
  // General & Registration
  {
    id: "g1",
    category: "General & Registration",
    question: "What is Surplus Market and how does it work?",
    answer: "Surplus Market is a B2B marketplace for trading excess, overstock, and liquidation inventory across the GCC and India. Sellers list bulk lots with verified manifests, and buyers place direct offers or bids with full escrow protection."
  },
  {
    id: "g2",
    category: "General & Registration",
    question: "Who can register on Surplus Market?",
    answer: "Registration is open to pre-verified businesses including manufacturers, wholesalers, retail chains, distributors, inventory liquidators, and registered traders."
  },
  {
    id: "g3",
    category: "General & Registration",
    question: "Which regions does Surplus Market support?",
    answer: "We support regional hubs across UAE, Qatar, Saudi Arabia, Oman, Kuwait, Bahrain, India, and international cross-border trade corridors."
  },

  // Buying & Bidding
  {
    id: "b1",
    category: "Buying & Bidding",
    question: "Can I inspect wholesale lots in person before bidding?",
    answer: "Yes. For verified high-value lots, buyers can request physical warehouse inspection appointments or digital live video verification prior to submitting binding offers."
  },
  {
    id: "b2",
    category: "Buying & Bidding",
    question: "How are landed freight costs computed during purchase?",
    answer: "Our portal automatically calculates real-time LTL/FTL freight rates based on delivery location, pallet count, weight, and border customs duties."
  },
  {
    id: "b3",
    category: "Buying & Bidding",
    question: "What protection is provided if received items do not match the manifest?",
    answer: "Every order is protected by Surplus Buyer Protection. If discrepancies in condition or quantity are reported within 48 hours of receipt, funds remain secured in escrow pending resolution."
  },

  // Selling & Listing
  {
    id: "s1",
    category: "Selling & Listing",
    question: "How does the automated AI manifest enrichment process work?",
    answer: "When you upload an Excel/CSV manifest or photo batch, our AI automatically standardizes category codes, generates optimized titles, estimates MSRP ranges, and grades product condition."
  },
  {
    id: "s2",
    category: "Selling & Listing",
    question: "Can sellers restrict where their surplus inventory is resold?",
    answer: "Yes. Sellers can set regional channel restrictions, request brand unlabeling, or host private closed-bid seller auctions to protect primary retail channels."
  },
  {
    id: "s3",
    category: "Selling & Listing",
    question: "How long does it take for a lot listing to go live?",
    answer: "Once submitted, listings undergo automated validation and compliance check within 24 hours before being broadcasted to active buyer networks."
  },

  // Shipping & Freight
  {
    id: "l1",
    category: "Shipping & Freight",
    question: "How is cross-border freight handled between GCC countries?",
    answer: "Sellers can handle shipping independently or select integrated Surplus Logistics partners who handle customs documentation, border clearances, and door-to-door freight dispatch."
  },
  {
    id: "l2",
    category: "Shipping & Freight",
    question: "What pallet dimensions are standard for warehouse shipment?",
    answer: "We recommend standard Euro-pallets (120x100 cm or 120x80 cm) with shrink-wrap sealing for expedited cross-border checkpost clearances."
  },
  {
    id: "l3",
    category: "Shipping & Freight",
    question: "Are transit insurance policies included with freight booking?",
    answer: "Yes. All shipments dispatched via integrated Surplus Logistics partners include full invoice value transit insurance automatically."
  },

  // Payments & Escrow
  {
    id: "p1",
    category: "Payments & Escrow",
    question: "How does the Escrow Payment system protect transactions?",
    answer: "Buyer payment is safely held in escrow until delivery is confirmed. Once the buyer inspects and approves the order, funds are released to the seller within 24-48 hours."
  },
  {
    id: "p2",
    category: "Payments & Escrow",
    question: "What payment methods are supported for bulk orders?",
    answer: "We support corporate wire transfers (SWIFT/IBAN), verified credit cards, letter of credit (LC) for container-load deals, and local bank transfers."
  },

  // Verification & Compliance
  {
    id: "v1",
    category: "Verification & Compliance",
    question: "How are buyers and sellers verified on the platform?",
    answer: "Users submit trade licenses, tax registration numbers (VAT/GST), corporate credentials, and bank account verifications prior to full trade clearance."
  },
  {
    id: "v2",
    category: "Verification & Compliance",
    question: "Can companies download certified ESG carbon offset certificates?",
    answer: "Yes. Every completed surplus transaction logs carbon offset and landfill diversion metrics, generating downloadable audit-ready ESG Certificates for corporate sustainability disclosures."
  }
];

export default function FAQPageWidget() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>("g1");

  const filteredFaqs = useMemo(() => {
    return FULL_FAQ_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full flex flex-col items-center bg-gray-50/50">
      
      {/* Banner Header */}
      <CommonBanner 
        title="Frequently Asked Questions"
        subtitle="Find clear, instant answers about buying, selling, logistics, verification, and payment on Surplus Market."
        align="center"
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'FAQ' }
        ]}
      />

      <section className="w-full py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl space-y-12">

          {/* Search & Category Filter Controls */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Search questions by keyword (e.g. escrow, shipping, RMA, verification)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-13 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#0a5c48] focus:bg-white transition-all shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-200 px-2.5 py-1 rounded-full"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {FAQ_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                      isActive 
                        ? 'bg-[#0a5c48] text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 border border-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div 
                    key={faq.id}
                    className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                      isOpen 
                        ? 'border-[#0a5c48] shadow-md ring-1 ring-[#0a5c48]/20' 
                        : 'border-gray-200 hover:border-gray-300 shadow-sm'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                      <div className="pr-4 space-y-1">
                        <span className="text-[10px] font-bold text-[#0a5c48] uppercase tracking-wider block">
                          {faq.category}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                          {faq.question}
                        </h3>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-[#0a5c48] text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </button>
                    
                    {isOpen && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-100 mt-2"
                      >
                        <p className="pt-4">{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No matching questions found</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">Try adjusting your search term or selecting another category.</p>
                <button 
                  onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                  className="bg-[#0a5c48] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#084838] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Contact Support CTA Box */}
          <div className="bg-[#0a1e17] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-bold text-green-400 uppercase tracking-widest block mb-2">Still Have Questions?</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                Our Operations Team is Ready to Help
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Contact our customer support team for guidance on lot creation, buyer verification, or custom enterprise solutions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <a 
                href="mailto:support@surplusmarket.com" 
                className="w-full sm:w-auto text-center bg-green-400 text-[#0a1e17] hover:bg-green-300 px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> support@surplusmarket.com
              </a>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto text-center bg-white/10 border border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                Contact Form <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
