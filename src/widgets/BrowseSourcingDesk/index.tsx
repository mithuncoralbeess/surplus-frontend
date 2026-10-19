"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Send, 
  Bell, 
  CheckCircle2, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { inquiryService } from '../../services/inquiryService';
import WhatsAppSubscriptionModal from '../../components/WhatsAppSubscriptionModal';

export interface BrowseSourcingDeskProps {
  searchQuery?: string;
  className?: string;
  onCategorySelect?: (category: string) => void;
}

const POPULAR_CATEGORIES = [
  'Building Materials',
  'Electricals',
  'Hand tools',
  'Chisels And Drill bits',
  'PPE',
  'Power tools',
];

export default function BrowseSourcingDesk({
  searchQuery = '',
  className = '',
  onCategorySelect,
}: BrowseSourcingDeskProps) {
  const router = useRouter();

  // Form inputs
  const [sourcingItem, setSourcingItem] = useState(searchQuery);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Sync sourcingItem whenever the search query prop changes
  useEffect(() => {
    if (searchQuery) {
      setSourcingItem(searchQuery);
    }
  }, [searchQuery]);

  const handleCategoryClick = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    } else {
      router.push(`/browse?q=${encodeURIComponent(category)}`);
    }
  };

  const handleWhatsAppDeskClick = () => {
    const rawNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+974 3026 9988').replace(/[^0-9]/g, '');
    const itemTarget = sourcingItem.trim() || searchQuery.trim() || 'materials';
    const message = encodeURIComponent(
      `Hi Surplus Market B2B Sourcing Desk, I need fast sourcing assistance for "${itemTarget}". Could you check your distributor network?`
    );
    window.open(`https://wa.me/${rawNumber}?text=${message}`, '_blank');
  };

  const handleStockAlertClick = () => {
    setIsAlertModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const targetItem = sourcingItem.trim() || searchQuery.trim();
    if (!targetItem) {
      setSubmitError('Please specify the product or specs you need.');
      return;
    }

    if (!fullName.trim()) {
      setSubmitError('Please provide your full name.');
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setSubmitError('Please enter at least an email address or phone number so we can reply.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await inquiryService.submitContactForm({
        fullName: fullName.trim(),
        name: fullName.trim(),
        email: email.trim() || 'sourcing-request@surplusmarket.com',
        phone: phone.trim() || undefined,
        enquiryType: 'B2B Fast Sourcing Desk',
        subject: `Fast Sourcing Inquiry: ${targetItem} (Qty: ${quantity || '1'})`,
        message: `
[B2B SOURCING DESK INQUIRY]
Sourcing Item / Product Specs: ${targetItem}
Required Quantity: ${quantity || '1'}
Full Name: ${fullName.trim()}
Email Address: ${email.trim() || 'N/A'}
Phone / WhatsApp: ${phone.trim() || 'N/A'}
Additional Specifications / Notes: ${notes.trim() || 'None provided'}
Search Query Context: ${searchQuery || 'Direct Form'}
        `.trim(),
        metadata: {
          sourcingItem: targetItem,
          quantity: quantity || '1',
          source: 'BrowseSourcingDesk Widget',
        },
      });

      if (response.success || response.status === 200 || response.status === 201) {
        setIsSuccess(true);
      } else {
        setSubmitError(response.message || 'Unable to submit your sourcing request. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDisplayQuery = searchQuery.trim() || sourcingItem.trim();

  return (
    <>
      <div 
        className={`w-full bg-white rounded-3xl border border-gray-200/90 shadow-xs p-6 sm:p-8 lg:p-10 ${className}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Context, Quick Actions & Popular Categories */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Question icon */}
              <div className="w-11 h-11 rounded-full bg-amber-50/90 border border-amber-200/70 flex items-center justify-center text-amber-500 mb-5 shrink-0 shadow-2xs">
                <svg 
                  className="w-5 h-5 text-amber-500 stroke-[2.3]" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <path d="M12 17h.01"/>
                </svg>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-[26px] font-black text-gray-950 tracking-tight leading-snug mb-3">
                {currentDisplayQuery ? (
                  <>
                    No exact matches found for &quot;<span className="text-gray-900">{currentDisplayQuery}</span>&quot;
                  </>
                ) : (
                  <>Can&apos;t find what you&apos;re looking for?</>
                )}
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-7 max-w-md">
                Don&apos;t worry! Our B2B sourcing specialists match buyers with unlisted surplus stock across 500+ verified seller warehouses in the GCC.
              </p>

              {/* Quick Actions */}
              <div className="mb-7">
                <div className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-3">
                  QUICK ACTIONS
                </div>

                <div className="space-y-3">
                  {/* WhatsApp Sourcing Desk */}
                  <button
                    type="button"
                    onClick={handleWhatsAppDeskClick}
                    className="w-full bg-white border border-gray-200/90 hover:border-emerald-500 hover:bg-emerald-50/20 hover:shadow-xs rounded-2xl p-4 flex items-center gap-3.5 transition-all text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
                      <svg 
                        className="w-4 h-4 fill-emerald-600" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.16 8.16 0 01-1.25-4.38c0-4.51 3.67-8.18 8.18-8.18 2.19 0 4.24.85 5.79 2.4a8.13 8.13 0 012.4 5.79c0 4.51-3.67 8.17-8.18 8.17zm4.49-6.13c-.25-.12-1.46-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.35-.77-1.85c-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.15.16 1.58.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      WhatsApp Sourcing Desk
                    </span>
                  </button>

                  {/* Create Stock Watch Alert */}
                  <button
                    type="button"
                    onClick={handleStockAlertClick}
                    className="w-full bg-white border border-gray-200/90 hover:border-amber-400 hover:bg-amber-50/20 hover:shadow-xs rounded-2xl p-4 flex items-center gap-3.5 transition-all text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-105 transition-transform">
                      <Bell className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-900 block group-hover:text-amber-800 transition-colors">
                        Create Stock Watch Alert
                      </span>
                      <span className="text-xs text-gray-400 block mt-0.5 font-normal">
                        Get notified when added to inventory
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Browse Popular Categories */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-3">
                OR BROWSE POPULAR CATEGORIES
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                    className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-gray-200/90 rounded-full text-xs font-semibold text-gray-700 transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sourcing Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#f4fbf7] border border-[#c6e9db] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xs h-full">
              <div>
                {/* Header Badge */}
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1.5">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>B2B Sourcing Desk</span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight mb-1.5">
                  Can&apos;t Find It? Contact Us For Fast Sourcing
                </h3>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-gray-600 mb-5 leading-relaxed">
                  Fill out your requirements below. We&apos;ll search our offline distributor network and reply within 2 hours.
                </p>

                {/* Form */}
                {isSuccess ? (
                  <div className="bg-white rounded-2xl border border-emerald-200 p-6 text-center space-y-4 my-auto animate-fade-in">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-extrabold text-gray-900">
                        Sourcing Inquiry Received!
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto">
                        Our B2B sourcing team is searching offline distributor inventories for <strong>{sourcingItem || searchQuery}</strong>. We will contact you within 2 hours.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                      <button
                        type="button"
                        onClick={handleWhatsAppDeskClick}
                        className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <span>Chat on WhatsApp Directly</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSuccess(false);
                          setFullName('');
                          setEmail('');
                          setPhone('');
                          setNotes('');
                        }}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {submitError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    {/* Sourcing Item / Product Specs */}
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">
                        Sourcing Item / Product Specs
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <FileText className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          required
                          value={sourcingItem}
                          onChange={(e) => setSourcingItem(e.target.value)}
                          placeholder="e.g. PPR - BLACK SOCKET 40MM"
                          className="w-full bg-white border border-gray-200/90 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f7a61]/30 focus:border-[#0f7a61] shadow-2xs transition-all"
                        />
                      </div>
                    </div>

                    {/* Full Name & Email Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-white border border-gray-200/90 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f7a61]/30 focus:border-[#0f7a61] shadow-2xs transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Mail className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="buyer@company.com"
                            className="w-full bg-white border border-gray-200/90 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f7a61]/30 focus:border-[#0f7a61] shadow-2xs transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Phone / WhatsApp & Required Quantity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1.5">
                          Phone / WhatsApp
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Phone className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+971 50 123 4567"
                            className="w-full bg-white border border-gray-200/90 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f7a61]/30 focus:border-[#0f7a61] shadow-2xs transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1.5">
                          Required Quantity
                        </label>
                        <input
                          type="text"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          placeholder="1"
                          className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f7a61]/30 focus:border-[#0f7a61] shadow-2xs transition-all"
                        />
                      </div>
                    </div>

                    {/* Additional Specifications or Notes */}
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">
                        Additional Specifications or Notes (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Mention preferred brands, target budget, delivery location or target specs..."
                        className="w-full bg-white border border-gray-200/90 rounded-xl p-3 sm:p-3.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f7a61]/30 focus:border-[#0f7a61] shadow-2xs transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#0d6e53] hover:bg-[#0a5842] active:scale-[0.99] disabled:bg-gray-300 text-white py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting Sourcing Inquiry...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Sourcing Inquiry</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* WhatsApp Stock Watch Alert Modal */}
      <WhatsAppSubscriptionModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        defaultCategory={currentDisplayQuery || 'Industrial Hardware & Tools'}
      />
    </>
  );
}

export { BrowseSourcingDesk };
