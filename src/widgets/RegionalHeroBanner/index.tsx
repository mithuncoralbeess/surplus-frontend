"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { inquiryService } from '../../services/inquiryService';

export interface RegionalHeroBannerProps {
  countryName: string;
  countrySlug: string;
  title: React.ReactNode;
  description: React.ReactNode;
}

export default function RegionalHeroBanner({
  countryName,
  countrySlug,
  title,
  description,
}: RegionalHeroBannerProps) {
  // Quote form state
  const [lookingFor, setLookingFor] = useState('');
  const [quantity, setQuantity] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [quoteMessage, setQuoteMessage] = useState('');

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookingFor.trim() || !businessEmail.trim()) return;

    setIsSubmitting(true);
    setQuoteStatus('idle');
    setQuoteMessage('');

    try {
      const res = await inquiryService.submitContactForm({
        email: businessEmail.trim(),
        name: businessEmail.split('@')[0],
        enquiryType: `Regional Quote Request - ${countryName}`,
        subject: `[${countryName}] Quote Request: ${lookingFor.trim()} (Qty: ${quantity.trim() || '1'})`,
        message: `
[REGIONAL B2B QUOTE REQUEST]
Country: ${countryName} (${countrySlug})
Item / Product: ${lookingFor.trim()}
Quantity: ${quantity.trim() || '1'}
Target Price: ${targetPrice.trim() || 'Not specified (Open for offers)'}
Business Email: ${businessEmail.trim()}
        `.trim(),
        metadata: {
          country: countryName,
          countrySlug,
          lookingFor: lookingFor.trim(),
          quantity: quantity.trim(),
          targetPrice: targetPrice.trim(),
          source: 'RegionalHeroBanner',
        },
      });

      if (res.success || res.status === 200 || res.status === 201) {
        setQuoteStatus('success');
        setLookingFor('');
        setQuantity('');
        setTargetPrice('');
        setBusinessEmail('');
      } else {
        setQuoteStatus('error');
        setQuoteMessage(res.message || 'Unable to submit quote request. Please try again.');
      }
    } catch (err: any) {
      setQuoteStatus('error');
      setQuoteMessage(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full bg-[#f8fafc] text-slate-900 py-10 sm:py-14 md:py-16 border-b border-gray-200/60">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Breadcrumb, H1 Title, Paragraph, Buttons */}
          <div className="lg:col-span-7 pt-1 sm:pt-2">
            
            {/* Breadcrumb: Home / Country */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-5">
              <Link href="/" className="hover:text-slate-900 transition-colors">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-slate-600 font-semibold">{countryName}</span>
            </nav>

            {/* H1 Title */}
            <h1 className="text-3xl sm:text-4xl md:text-[44px] lg:text-[46px] font-black text-[#0f172a] tracking-tight leading-[1.15] mb-5">
              {title}
            </h1>

            {/* Description */}
            <div className="text-slate-600 text-sm sm:text-base md:text-[17px] leading-relaxed mb-8 space-y-4">
              {description}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href="/buy"
                className="px-6 py-3.5 bg-[#0f7a61] hover:bg-[#0c6651] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
              >
                Buy Excess Inventory
              </Link>
              <Link
                href="/sell"
                className="px-6 py-3.5 bg-white hover:bg-gray-50 text-slate-800 border border-gray-300 font-bold text-sm sm:text-base rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer"
              >
                Sell Excess Stock
              </Link>
            </div>
          </div>

          {/* Right Column: "Request a quote" Floating Form Card */}
          <div className="lg:col-span-5 w-full">
            <div id="quote-form" className="bg-white rounded-3xl p-6 sm:p-7 md:p-8 border border-gray-100 shadow-xl shadow-slate-200/60 relative scroll-mt-24">
              <div className="mb-4">
                <span className="inline-block bg-[#7c3aed] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full mb-2">
                  NEW
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Request a quote
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                  Tell us what you need. Matching sellers respond with pricing and availability. Your identity is never disclosed.
                </p>
              </div>

              <form onSubmit={handleQuoteSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    What are you looking for?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HP DesignJet printers"
                    value={lookingFor}
                    onChange={(e) => setLookingFor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 20 units"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target price
                    </label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] transition-all"
                  />
                </div>

                {quoteStatus === 'error' && (
                  <p className="text-xs text-rose-600 font-medium">
                    {quoteMessage || 'Failed to submit quote request. Please try again.'}
                  </p>
                )}

                {quoteStatus === 'success' ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Quote request sent! Matching sellers will respond to your email.</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#0f7a61] hover:bg-[#0c6651] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      'Get quotes'
                    )}
                  </button>
                )}

                <p className="text-[11px] text-gray-400 text-center leading-tight pt-0.5">
                  Free to register. No obligation.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

