"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  Loader2,
  Percent,
  MapPin,
  Tag
} from 'lucide-react';
import { whatsappService } from '../../services/whatsappService';

const COUNTRY_DIAL_CODES = [
  { code: '+971', label: 'UAE (+971)', flag: '🇦🇪' },
  { code: '+974', label: 'Qatar (+974)', flag: '🇶🇦' },
  { code: '+966', label: 'Saudi Arabia (+966)', flag: '🇸🇦' },
  { code: '+91', label: 'India (+91)', flag: '🇮🇳' },
  { code: '+965', label: 'Kuwait (+965)', flag: '🇰🇼' },
  { code: '+968', label: 'Oman (+968)', flag: '🇴🇲' },
  { code: '+973', label: 'Bahrain (+973)', flag: '🇧🇭' },
  { code: '+1', label: 'USA / Canada (+1)', flag: '🇺🇸' },
  { code: '+44', label: 'UK (+44)', flag: '🇬🇧' },
];

const AVAILABLE_CATEGORIES = [
  'Electronics & IT',
  'Industrial Hardware & Tools',
  'Building Materials',
  'Electricals',
  'Power Tools',
  'PPE & Safety',
  'Machinery & Equipment',
  'Overstock & Consumer Goods',
];

const LOCATIONS = ['UAE', 'Qatar', 'Saudi Arabia', 'India', 'Global / Any'];

const DISCOUNT_TIERS = [40, 50, 60, 70, 80];

interface WhatsAppSubscriptionModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultCategory?: string;
}

export default function WhatsAppSubscriptionModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  defaultCategory,
}: WhatsAppSubscriptionModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

  // Form State
  const [dialCode, setDialCode] = useState('+971');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    defaultCategory ? [defaultCategory] : ['Industrial Hardware & Tools', 'Electronics & IT']
  );
  const [preferredLocation, setPreferredLocation] = useState('UAE');
  const [minDiscount, setMinDiscount] = useState<number>(60);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Listen to global open event
  useEffect(() => {
    const handleGlobalOpen = (e: any) => {
      setInternalOpen(true);
      if (e?.detail?.category) {
        setSelectedCategories((prev) => 
          prev.includes(e.detail.category) ? prev : [...prev, e.detail.category]
        );
      }
    };

    window.addEventListener('surplus:open-whatsapp-modal', handleGlobalOpen);
    return () => {
      window.removeEventListener('surplus:open-whatsapp-modal', handleGlobalOpen);
    };
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalOpen(false);
    }
    // Reset transient success state on delay after close
    setTimeout(() => {
      setIsSuccess(false);
      setSubmitError('');
    }, 300);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const cleanDigits = phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanDigits || cleanDigits.length < 6) {
      setSubmitError('Please enter a valid WhatsApp phone number.');
      return;
    }

    if (!name.trim()) {
      setSubmitError('Please enter your name or company contact.');
      return;
    }

    if (selectedCategories.length === 0) {
      setSubmitError('Please select at least one inventory category.');
      return;
    }

    const fullPhone = `${dialCode}${cleanDigits.startsWith('0') ? cleanDigits.slice(1) : cleanDigits}`;

    setIsSubmitting(true);
    try {
      const response = await whatsappService.subscribe({
        phone: fullPhone,
        name: name.trim(),
        company_name: companyName.trim() || undefined,
        email: email.trim() || undefined,
        categories: selectedCategories,
        preferred_location: preferredLocation,
        min_discount_pct: minDiscount,
      });

      if (response.success || response.status === 200 || response.status === 201) {
        setIsSuccess(true);
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('surplus_whatsapp_subscribed', 'true');
            localStorage.setItem('surplus_whatsapp_phone', fullPhone);
          }
        } catch {
          // ignore localStorage error in private mode
        }
      } else {
        setSubmitError(
          response.message || 'Unable to register subscription. Please verify details and try again.'
        );
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDirectChat = () => {
    const defaultDeskNumber = (
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+974 3026 9988'
    ).replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hi Surplus Market, I just subscribed to VIP WhatsApp Liquidation Drops! (Categories: ${selectedCategories.join(
        ', '
      )}, Min Discount: ${minDiscount}%). Please send me active drops.`
    );
    window.open(`https://wa.me/${defaultDeskNumber}?text=${msg}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-[#0a5c48] via-[#0f7a61] to-[#074737] p-6 text-white overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              VIP Liquidation Pipeline
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Instant Drops via WhatsApp ⚡
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-md leading-relaxed">
            Get instant alerts for high-margin pallets & unlisted surplus batches at <strong>50%–80% off</strong> before they hit the open marketplace.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-[#0a5c48] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xl font-extrabold text-gray-900">
                  You're On The VIP Liquidation List!
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto">
                  We'll dispatch matched liquidation drops directly to your WhatsApp as soon as seller manifests are verified.
                </p>
              </div>

              {/* Preferences Summary */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-semibold">Categories:</span>
                  <span className="font-bold text-gray-900 truncate max-w-[220px]">
                    {selectedCategories.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-semibold">Preferred Region:</span>
                  <span className="font-bold text-gray-900">{preferredLocation}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-semibold">Minimum Discount:</span>
                  <span className="font-bold text-emerald-700">{minDiscount}%+ Off</span>
                </div>
              </div>

              {/* Direct WhatsApp Call to Action */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleOpenDirectChat}
                  className="w-full py-3 px-5 bg-[#0a5c48] hover:bg-[#074737] text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Greet Deals Desk on WhatsApp Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  Done, Return to Browsing
                </button>
              </div>
            </div>
          ) : (
            /* Subscription Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Name & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Buyer Name / Contact <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mansoor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f7a61]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-1.5">
                    <select
                      value={dialCode}
                      onChange={(e) => setDialCode(e.target.value)}
                      className="px-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f7a61]"
                    >
                      {COUNTRY_DIAL_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="50 123 4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 min-w-0 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f7a61]"
                    />
                  </div>
                </div>
              </div>

              {/* Company & Email Grid (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Company Name <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Al-Noor Trading LLC"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f7a61]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="buyer@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f7a61]"
                  />
                </div>
              </div>

              {/* Categories Multi-Select Pills */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    Categories of Interest <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">Select all that apply</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-gray-50/60 rounded-xl border border-gray-100">
                  {AVAILABLE_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-[#0a5c48] text-white shadow-xs'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-emerald-300" />}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Location & Discount Threshold */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>Preferred Sourcing Region</span>
                  </label>
                  <select
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f7a61]"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-gray-400" />
                    <span>Minimum Discount Threshold</span>
                  </label>
                  <div className="flex items-center gap-1">
                    {DISCOUNT_TIERS.map((tier) => (
                      <button
                        type="button"
                        key={tier}
                        onClick={() => setMinDiscount(tier)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          minDiscount === tier
                            ? 'bg-[#0a5c48] text-white border-[#0a5c48]'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {tier}%+
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trust Guarantee Note */}
              <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero spam. Verified inventory only. Unsubscribe anytime by texting 'STOP'.</span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-[#0a5c48] hover:bg-[#074737] disabled:bg-gray-300 text-white rounded-full font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <span>Activate WhatsApp Liquidation Alerts</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
