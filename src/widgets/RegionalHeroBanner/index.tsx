"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { inquiryService } from '../../services/inquiryService';
import { sanitizeInput } from '../../lib/security/sanitizer';
import GoogleReCaptcha, { GoogleReCaptchaRef } from '../../components/GoogleReCaptcha';

export interface RegionalHeroBannerProps {
  countryName: string;
  countrySlug: string;
  title: React.ReactNode;
  description: React.ReactNode;
}

interface QuoteFormErrors {
  lookingFor?: string;
  quantity?: string;
  targetPrice?: string;
  businessEmail?: string;
}

const scriptCheckRegex = /<[^>]*>|javascript:|on\w+\s*=/i;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

  // Anti-Spam Layer 1: Invisible Honeypot
  const [honeypot, setHoneypot] = useState('');

  // Anti-Spam Layer 2: Time-to-Submit Nonce (detects instant bots)
  const [mountedAt] = useState(() => Date.now());

  // Anti-Spam Layer 3: Google reCAPTCHA
  const recaptchaRef = useRef<GoogleReCaptchaRef>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const [recaptchaError, setRecaptchaError] = useState<string>('');

  // Progressive Reveal: Shows reCAPTCHA only when required fields are completed
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [hasRevealedCaptcha, setHasRevealedCaptcha] = useState(false);

  const areRequiredFieldsCompleted = Boolean(
    lookingFor.trim() &&
    quantity.trim() &&
    targetPrice.trim() &&
    businessEmail.trim()
  );

  useEffect(() => {
    if (areRequiredFieldsCompleted && !hasRevealedCaptcha) {
      setHasRevealedCaptcha(true);
    }
  }, [areRequiredFieldsCompleted, hasRevealedCaptcha]);

  const showCaptcha = hasRevealedCaptcha || hasAttemptedSubmit;

  const handleRecaptchaVerify = useCallback((token: string) => {
    setRecaptchaToken(token);
    setRecaptchaError('');
  }, []);

  const handleRecaptchaExpire = useCallback(() => {
    setRecaptchaToken('');
    setRecaptchaError('Verification expired. Please check the box again.');
  }, []);

  const handleRecaptchaError = useCallback(() => {
    setRecaptchaToken('');
  }, []);

  const [errors, setErrors] = useState<QuoteFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [quoteMessage, setQuoteMessage] = useState('');

  // 1. "What are you looking for?" - Prevent scripts and HTML in real-time
  const handleLookingForChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/<[^>]*>|javascript:|on\w+\s*=/gi, '');
    setLookingFor(val);
    if (errors.lookingFor) {
      setErrors((prev) => ({ ...prev, lookingFor: undefined }));
    }
  };

  // 2. "Quantity" - Strictly numeric: reject ANY characters, letters, or symbols
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    // Strip leading zeros if multi-digit (e.g. "05" -> "5")
    if (val.length > 1 && val.startsWith('0')) {
      val = val.replace(/^0+/, '');
    }
    setQuantity(val);
    if (errors.quantity) {
      setErrors((prev) => ({ ...prev, quantity: undefined }));
    }
  };

  // 3. "Target price" - Strictly numeric with optional decimal: reject ANY characters or letters
  const handleTargetPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    if (parts.length > 2) {
      val = parts[0] + '.' + parts.slice(1).join('');
    }
    setTargetPrice(val);
    if (errors.targetPrice) {
      setErrors((prev) => ({ ...prev, targetPrice: undefined }));
    }
  };

  // 4. "Business email" - Strip scripts and spaces in real-time
  const handleBusinessEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/<[^>]*>|javascript:|on\w+\s*=/gi, '').trim();
    setBusinessEmail(val);
    if (errors.businessEmail) {
      setErrors((prev) => ({ ...prev, businessEmail: undefined }));
    }
  };

  // Comprehensive Form Validation
  const validateForm = (): boolean => {
    const newErrors: QuoteFormErrors = {};

    // 1. Sourcing item validation
    const trimmedItem = lookingFor.trim();
    if (!trimmedItem) {
      newErrors.lookingFor = 'Please enter what you are looking for';
    } else if (trimmedItem.length < 2) {
      newErrors.lookingFor = 'Item must be at least 2 characters';
    } else if (trimmedItem.length > 150) {
      newErrors.lookingFor = 'Item description cannot exceed 150 characters';
    } else if (scriptCheckRegex.test(trimmedItem)) {
      newErrors.lookingFor = 'Script tags or HTML code are not allowed';
    }

    // 2. Quantity validation (strictly numbers only)
    const trimmedQty = quantity.trim();
    if (!trimmedQty) {
      newErrors.quantity = 'Quantity is required (numbers only)';
    } else if (!/^[0-9]+$/.test(trimmedQty) || parseInt(trimmedQty, 10) <= 0) {
      newErrors.quantity = 'Please enter a valid quantity greater than 0';
    }

    // 3. Target price validation (Mandatory, strictly numbers/decimals only)
    const trimmedPrice = targetPrice.trim();
    if (!trimmedPrice) {
      newErrors.targetPrice = 'Target price is required (numbers only)';
    } else if (!/^[0-9]+(\.[0-9]+)?$/.test(trimmedPrice) || parseFloat(trimmedPrice) <= 0) {
      newErrors.targetPrice = 'Please enter a valid price greater than 0 (e.g. 500)';
    } else if (scriptCheckRegex.test(trimmedPrice)) {
      newErrors.targetPrice = 'Script tags or HTML code are not allowed';
    }

    // 4. Business Email validation
    const trimmedEmail = businessEmail.trim();
    if (!trimmedEmail) {
      newErrors.businessEmail = 'Business email is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.businessEmail = 'Please enter a valid email address (e.g. name@company.com)';
    } else if (scriptCheckRegex.test(trimmedEmail)) {
      newErrors.businessEmail = 'Script tags or HTML code are not allowed';
    }

    // 5. Anti-Spam Google reCAPTCHA Verification
    let hasCaptchaError = false;
    if (!recaptchaToken) {
      setRecaptchaError('Please check the "I\'m not a robot" box');
      hasCaptchaError = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !hasCaptchaError;
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    // Rate limit check: 1 submission per 10 minutes
    try {
      const lastSubmitTime = localStorage.getItem('sm_rate_limit_quote');
      if (lastSubmitTime) {
        const elapsed = Date.now() - parseInt(lastSubmitTime, 10);
        const cooldownMs = 10 * 60 * 1000;
        if (elapsed < cooldownMs) {
          const remainingMinutes = Math.max(1, Math.ceil((cooldownMs - elapsed) / (60 * 1000)));
          setQuoteStatus('error');
          setQuoteMessage(`Submission limit reached: Only 1 submission allowed every 10 minutes. Please wait ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} before submitting again.`);
          return;
        }
      }
    } catch {}

    // Run client-side validation
    if (!validateForm()) {
      return;
    }

    // Bot trap: honeypot or instant submission (< 2.5 seconds)
    if (honeypot.trim().length > 0 || Date.now() - mountedAt < 2500) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setQuoteStatus('success');
        setLookingFor('');
        setQuantity('');
        setTargetPrice('');
        setBusinessEmail('');
        setHoneypot('');
        setRecaptchaToken('');
        setRecaptchaError('');
        recaptchaRef.current?.reset();
        setErrors({});
      }, 500);
      return;
    }

    setIsSubmitting(true);
    setQuoteStatus('idle');
    setQuoteMessage('');

    // Sanitize all inputs to prevent XSS / script injections
    const cleanItem = sanitizeInput(lookingFor);
    const cleanQty = sanitizeInput(quantity);
    const cleanPrice = sanitizeInput(targetPrice);
    const cleanEmail = sanitizeInput(businessEmail);

    try {
      const res = await inquiryService.submitRegionalEnquiry({
        fullName: cleanEmail.split('@')[0],
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        sourcingItem: cleanItem,
        lookingFor: cleanItem,
        quantity: cleanQty,
        targetPrice: cleanPrice,
        country: countryName,
        searchQuery: `${countryName} (${countrySlug})`,
        source: 'RegionalHeroBanner',
        company_website_url: honeypot,
        _formTime: mountedAt,
        recaptchaToken,
        enquiryType: `Regional Quote Request - ${countryName}`,
        subject: `[${countryName}] Quote Request: ${cleanItem} (Qty: ${cleanQty})`,
        message: `
[REGIONAL B2B QUOTE REQUEST]
Country: ${countryName} (${countrySlug})
Item / Product: ${cleanItem}
Quantity: ${cleanQty}
Target Price: ${cleanPrice || 'Not specified (Open for offers)'}
Business Email: ${cleanEmail}
        `.trim(),
        metadata: {
          country: countryName,
          countrySlug,
          lookingFor: cleanItem,
          quantity: cleanQty,
          targetPrice: cleanPrice,
          source: 'RegionalHeroBanner',
        },
      });

      if (res.success || res.status === 200 || res.status === 201) {
        try {
          localStorage.setItem('sm_rate_limit_quote', String(Date.now()));
        } catch {}
        setQuoteStatus('success');
        setLookingFor('');
        setQuantity('');
        setTargetPrice('');
        setBusinessEmail('');
        setRecaptchaToken('');
        setRecaptchaError('');
        recaptchaRef.current?.reset();
        setErrors({});
      } else {
        setQuoteStatus('error');
        setQuoteMessage(res.message || 'Unable to submit quote request. Please try again.');
        setRecaptchaToken('');
        recaptchaRef.current?.reset();
      }
    } catch (err: any) {
      setQuoteStatus('error');
      setQuoteMessage(err?.message || 'A network error occurred. Please try again.');
      setRecaptchaToken('');
      recaptchaRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (hasError: boolean) => {
    const base = "w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none transition-all";
    return hasError
      ? `${base} border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500`
      : `${base} border-gray-200 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]`;
  };

  return (
    <section className="relative w-full bg-[#f8fafc] text-slate-900 py-8 sm:py-12 md:py-16 border-b border-gray-200/60 overflow-hidden">
      <div className="container mx-auto px-3.5 sm:px-4 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Breadcrumb, H1 Title, Paragraph, Buttons */}
          <div className="lg:col-span-7 pt-1 sm:pt-2">
            
            {/* Breadcrumb: Home / Country */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-3 sm:mb-5">
              <Link href="/" className="hover:text-slate-900 transition-colors">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-slate-600 font-semibold">{countryName}</span>
            </nav>

            {/* H1 Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-black text-[#0f172a] tracking-tight leading-[1.2] sm:leading-[1.15] mb-4 sm:mb-5 break-words">
              {title}
            </h1>

            {/* Description */}
            <div className="text-slate-600 text-sm sm:text-base md:text-[17px] leading-relaxed mb-6 sm:mb-8 space-y-3 sm:space-y-4">
              {description}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 w-full sm:w-auto">
              <Link
                href="/buy"
                className="w-full sm:w-auto text-center px-6 py-3.5 bg-[#0f7a61] hover:bg-[#0c6651] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
              >
                Buy Excess Inventory
              </Link>
              <Link
                href="/sell"
                className="w-full sm:w-auto text-center px-6 py-3.5 bg-white hover:bg-gray-50 text-slate-800 border border-gray-300 font-bold text-sm sm:text-base rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer"
              >
                Sell Excess Stock
              </Link>
            </div>
          </div>

          {/* Right Column: "Request a quote" Floating Form Card */}
          <div className="lg:col-span-5 w-full">
            <div id="quote-form" className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 border border-gray-100 shadow-xl shadow-slate-200/60 relative scroll-mt-24">
              <div className="mb-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  Request a quote
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                  Tell us what you need. Matching sellers respond with pricing and availability. Your identity is never disclosed.
                </p>
              </div>

              <form onSubmit={handleQuoteSubmit} className="space-y-3.5" noValidate>
                {/* Anti-Spam Honeypot */}
                <div 
                  className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden" 
                  tabIndex={-1} 
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
                >
                  <input
                    type="text"
                    name="company_website_url"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* What are you looking for? */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    What are you looking for? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HP DesignJet printers"
                    value={lookingFor}
                    onChange={handleLookingForChange}
                    className={getInputClass(Boolean(errors.lookingFor))}
                  />
                  {errors.lookingFor && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.lookingFor}</p>
                  )}
                </div>

                {/* Quantity & Target Price Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Quantity - strictly numbers only */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="e.g. 20"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className={getInputClass(Boolean(errors.quantity))}
                    />
                    {errors.quantity && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.quantity}</p>
                    )}
                  </div>

                  {/* Target Price - strictly numeric/decimal (Mandatory) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="e.g. 500"
                      value={targetPrice}
                      onChange={handleTargetPriceChange}
                      className={getInputClass(Boolean(errors.targetPrice))}
                    />
                    {errors.targetPrice && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.targetPrice}</p>
                    )}
                  </div>
                </div>

                {/* Business Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={businessEmail}
                    onChange={handleBusinessEmailChange}
                    className={getInputClass(Boolean(errors.businessEmail))}
                  />
                  {errors.businessEmail && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.businessEmail}</p>
                  )}
                </div>

                {/* Google reCAPTCHA Verification (Progressive Reveal) */}
                {showCaptcha && (
                  <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 sm:p-3.5 transition-all duration-300 ease-out animate-fade-in">
                    <div className="flex items-center gap-1.5 mb-2">
                      <ShieldCheck className="w-4 h-4 text-[#0f7a61]" />
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Human Verification <span className="text-red-500">*</span>
                      </span>
                    </div>

                    <div className="flex justify-center sm:justify-start overflow-x-auto py-1">
                      <GoogleReCaptcha
                        ref={recaptchaRef}
                        onVerify={handleRecaptchaVerify}
                        onExpire={handleRecaptchaExpire}
                        onError={handleRecaptchaError}
                      />
                    </div>

                    {recaptchaError && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{recaptchaError}</p>
                    )}
                  </div>
                )}

                {quoteStatus === 'error' && (
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{quoteMessage || 'Failed to submit quote request. Please try again.'}</span>
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
