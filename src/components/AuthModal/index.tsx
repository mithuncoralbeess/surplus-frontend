"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { authService } from '../../services/authService';
import { motion, AnimatePresence } from '../../lib/motion';
import { X, ArrowRight, Loader2, CheckCircle2, ChevronDown, Search, MapPin } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import 'react-phone-number-input/style.css';
import { searchRealLocation, RealLocationSuggestion } from '../../services/locationService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const { update } = useSession();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState<string | undefined>('');
  const [otp, setOtp] = useState('');
  
  // Onboarding State
  const [country, setCountry] = useState('United Arab Emirates');
  const [businessLocation, setBusinessLocation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [entityType, setEntityType] = useState('Individual');
  const [categories, setCategories] = useState<string[]>([]);
  const [role, setRole] = useState('Buyer');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  // Real location search autocomplete states
  const [locationSuggestions, setLocationSuggestions] = useState<RealLocationSuggestion[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationSearchRef = useRef<HTMLDivElement>(null);
  const locationDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Close location suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationSearchRef.current && !locationSearchRef.current.contains(e.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (locationDebounceTimer.current) clearTimeout(locationDebounceTimer.current);
    };
  }, []);

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBusinessLocation(val);

    if (locationDebounceTimer.current) {
      clearTimeout(locationDebounceTimer.current);
    }

    if (!val || val.trim().length < 2) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      setIsSearchingLocation(false);
      return;
    }

    setIsSearchingLocation(true);
    setShowLocationSuggestions(true);
    locationDebounceTimer.current = setTimeout(async () => {
      try {
        const countryFilter = country && country !== '-- Select Country --' ? country : undefined;
        const results = await searchRealLocation(val, countryFilter);
        setLocationSuggestions(results);
        setShowLocationSuggestions(true);
      } catch (err) {
        console.warn('Real location search error:', err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 250);
  };

  const handleSelectLocationSuggestion = (item: RealLocationSuggestion) => {
    setBusinessLocation(item.displayName);
    if ((!country || country === '-- Select Country --') && item.country) {
      setCountry(item.country);
    }
    setShowLocationSuggestions(false);
  };

  const AVAILABLE_CATEGORIES = ['Electronics', 'Machinery', 'Vehicles', 'Raw Materials', 'Textiles', 'Other', 'Agricultural', 'Medical Equipment', 'Industrial Tools', 'Computers', 'Furniture', 'Plastics', 'Metals'];
  const filteredCategories = AVAILABLE_CATEGORIES.filter(cat => cat.toLowerCase().includes(categorySearch.toLowerCase()));

  const COUNTRY_LIST = [
    'United Arab Emirates',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Oman',
    'Bahrain',
    'India',
    'United Kingdom',
    'United States',
    'Germany',
    'China',
    'Japan',
    'Singapore',
    'Australia',
    'Canada',
    'France',
    'Italy',
    'Turkey',
    'Egypt',
    'Pakistan',
    'Bangladesh',
    'South Africa',
    'Netherlands',
    'Spain',
    'Switzerland',
    'South Korea',
    'Brazil',
    'Mexico',
    'Malaysia',
    'Indonesia',
    'Other / Worldwide',
  ];

  // Shared Styles
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-all outline-none text-gray-900";
  const selectClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-all outline-none text-gray-900 appearance-none";

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent Background Scroll and Sync Mode
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setStep(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      // Reset state on close
      setTimeout(() => {
        setStep(1);
        setMode(initialMode);
        setError('');
        setOtp('');
      }, 300);
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, initialMode]);

  const toggleCategory = (cat: string) => {
    setCategories(prev => {
      if (prev.includes(cat)) return prev.filter(c => c !== cat);
      if (prev.length >= 3) return prev;
      return [...prev, cat];
    });
  };

  const handleGetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (mode === 'register') {
      const trimmedName = fullName.trim();
      if (!trimmedName) {
        setError('Full Name is mandatory.');
        setLoading(false);
        return;
      }
      if (trimmedName.length < 2) {
        setError('Full Name must be at least 2 characters.');
        setLoading(false);
        return;
      }

      const trimmedEmail = emailOrPhone.trim();
      if (!trimmedEmail) {
        setError('Email ID is mandatory.');
        setLoading(false);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      const phoneDigits = (mobileNumber || '').replace(/[^0-9]/g, '');
      if (!mobileNumber || phoneDigits.length < 7) {
        setError('Mobile Number is mandatory. Please enter a valid mobile number with country code.');
        setLoading(false);
        return;
      }

      const res = await authService.sendRegistrationOtp({
        full_name: trimmedName,
        email: trimmedEmail.toLowerCase(),
        mobile_number: mobileNumber,
      });

      if (res.success) {
        setLoading(false);
        setStep(2);
      } else {
        let errMsg = res.message || 'Failed to send OTP.';
        if ((res as any).errors) {
          const errList = Object.values((res as any).errors)
            .map(v => Array.isArray(v) ? v.join(' ') : String(v))
            .filter(Boolean);
          if (errList.length > 0) {
            errMsg = errList.join(' ');
          }
        }
        setError(errMsg);
        setLoading(false);
      }
    } else {
      const trimmedLogin = emailOrPhone.trim();
      if (!trimmedLogin) {
        setError('Please enter your Email ID or Mobile Number.');
        setLoading(false);
        return;
      }

      const res = await authService.sendLoginOtp(trimmedLogin);

      if (res.success) {
        setLoading(false);
        setStep(2);
      } else {
        setError(res.message || 'Failed to send OTP.');
        setLoading(false);
      }
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'register') {
      const res = await signIn('credentials', {
        redirect: false,
        email: emailOrPhone,
        otp: otp,
        isRegister: 'true',
        fullName: fullName,
        mobileNumber: mobileNumber,
      });

      if (res?.error) {
        setError('Invalid or expired OTP.');
        setLoading(false);
      } else {
        setLoading(false);
        setStep(3); // Go to onboarding
      }
    } else {
      const res = await signIn('credentials', {
        redirect: false,
        email: emailOrPhone,
        otp: otp,
      });

      if (res?.error) {
        setError('Invalid OTP or verification failed.');
        setLoading(false);
      } else {
        setLoading(false);
        onSuccess(); // Close modal and proceed for login
      }
    }
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Only non-buyers (Sellers / Both) strictly require company name when registering as a business
    if (role !== 'Buyer' && entityType === 'Company/Business' && !companyName) {
      setError('Company Name is required for seller accounts.');
      return;
    }
    if (!country || !country.trim()) {
      setError('Please select your Country.');
      return;
    }
    if (!businessLocation || !businessLocation.trim()) {
      setError('Business Location is required.');
      return;
    }
    if (categories.length < 1) {
      setError('Please select at least 1 category interested (up to 3).');
      return;
    }
    if (categories.length > 3) {
      setError('Please select a maximum of 3 categories.');
      return;
    }
    
    setLoading(true);

    const res = await authService.completeProfile({
      email: emailOrPhone,
      account_entity_type: entityType === 'Company/Business' ? 'COMPANY' : 'INDIVIDUAL',
      company_name: entityType === 'Company/Business' ? (companyName || undefined) : undefined,
      country: country.trim(),
      business_location: businessLocation.trim(),
      user_type: role.toUpperCase(),
      category_interested: categories.join(', ') || undefined,
    });

    if (res.success) {
      const resData = (res.data?.user || res.data?.vendor || res.data?.profile || res.data?.data || res.data || {}) as any;
      const assignedVendorId = resData.vendor_id || resData.vendorId || resData.raw_vendor_id || resData.id || res.data?.vendor_id;
      if (assignedVendorId && typeof window !== 'undefined') {
        localStorage.setItem('vendor_id', String(assignedVendorId));
      }

      await update({
        vendor_id: assignedVendorId ? String(assignedVendorId) : undefined,
        company_name: entityType === 'Company/Business' ? (companyName || '') : '',
        country: country.trim(),
        business_location: businessLocation.trim(),
        business_type: role.toUpperCase(),
        account_entity_type: entityType === 'Company/Business' ? 'COMPANY' : 'INDIVIDUAL',
        category_interested: categories.join(', '),
      });
      setLoading(false);
      onSuccess();
    } else {
      setError(res.message || 'Failed to complete profile.');
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setStep(1);
    setError('');
    setOtp('');
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div data-lenis-prevent className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${step === 3 ? 'max-w-2xl overflow-hidden' : 'max-w-md overflow-visible'} bg-white rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh]`}
      >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-20 rounded-t-3xl">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {mode === 'login' ? 'Sign In' : (step === 3 ? 'Complete Profile' : 'Create Account')}
                </h3>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className={`p-6 md:p-8 ${step === 3 ? 'overflow-y-auto' : 'overflow-visible'} flex-1`}>
              {error && (
                <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-xl mb-6 border border-red-100">
                  {error}
                </div>
              )}
                {/* LOGIN / REGISTER STEP 1 */}
                {step === 1 && (
                  <form onSubmit={handleGetCode} className="space-y-5">
                    {mode === 'register' && (
                      <div>
                        <label className={labelClass}>
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={e => {
                            setFullName(e.target.value);
                            if (error) setError('');
                          }}
                          className={inputClass}
                          placeholder="John Doe"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className={labelClass}>
                        {mode === 'login' ? (
                          'Email ID / Mobile Number'
                        ) : (
                          <>
                            Email ID <span className="text-red-500">*</span>
                          </>
                        )}
                      </label>
                      <input
                        type={mode === 'register' ? 'email' : 'text'}
                        required
                        value={emailOrPhone}
                        onChange={e => {
                          setEmailOrPhone(e.target.value);
                          if (error) setError('');
                        }}
                        className={inputClass}
                        placeholder="john@example.com"
                      />
                    </div>

                    {mode === 'register' && (
                      <div>
                        <label className={labelClass}>
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <PhoneInput
                          international
                          defaultCountry="US"
                          flags={flags}
                          value={mobileNumber}
                          onChange={val => {
                            setMobileNumber(val);
                            if (error) setError('');
                          }}
                          className="w-full auth-phone-input"
                          required
                        />
                      </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-[#0a5c48] hover:bg-[#084939] transition-all disabled:opacity-70 mt-4">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get Code'}
                    </button>

                    <div className="mt-6 text-center text-sm text-gray-500">
                      {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                      <button type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')} className="font-bold text-[#0a5c48] hover:text-[#084939]">
                        {mode === 'login' ? 'Sign up' : 'Sign in'}
                      </button>
                    </div>
                  </form>
                )}

                {/* OTP VERIFICATION STEP 2 */}
                {step === 2 && (
                  <form onSubmit={handleVerifyOTP} className="space-y-5">
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-600 mb-2">We sent a 6-digit code to your {mode === 'login' ? 'email/phone' : 'email'}.</p>
                      <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-[#0a5c48]">Change Contact Info</button>
                    </div>

                    <div>
                      <label className={labelClass}>Enter OTP</label>
                      <input type="text" maxLength={6} required value={otp} onChange={e => setOtp(e.target.value)} className={`${inputClass} text-center tracking-[1em] font-bold text-lg`} placeholder="------" />
                    </div>

                    <button type="submit" disabled={loading || otp.length < 6} className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-[#0a5c48] hover:bg-[#084939] transition-all disabled:opacity-70 mt-4 group">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          {mode === 'login' ? 'Sign In' : 'Create Account'}
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ONBOARDING STEP 3 (Register only) */}
                {step === 3 && mode === 'register' && (
                  <form onSubmit={handleCompleteOnboarding} className="space-y-5">
                    
                    <div>
                      <label className={labelClass}>Account Role *</label>
                      <div className="flex bg-gray-100 p-1 rounded-xl mt-2">
                        {['Buyer', 'Seller', 'Both'].map(r => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => {
                              setRole(r);
                              if (r === 'Buyer' && entityType === 'Company/Business' && !companyName) {
                                setEntityType('Individual');
                              }
                            }}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === r ? 'bg-white text-[#0a5c48] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Account Entity Type *</label>
                      <div className="flex bg-gray-100 p-1 rounded-xl mt-2">
                        {['Individual', 'Company/Business'].map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setEntityType(type)}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${entityType === type ? 'bg-white text-[#0a5c48] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence>
                      {entityType === 'Company/Business' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="pt-1">
                            <label className={labelClass}>
                              Company Name {role === 'Buyer' ? <span className="text-gray-400 font-normal">(Optional for Buyers)</span> : '*'}
                            </label>
                            <input 
                              type="text" 
                              required={role !== 'Buyer'} 
                              value={companyName} 
                              onChange={e => setCompanyName(e.target.value)} 
                              className={inputClass} 
                              placeholder={role === 'Buyer' ? "Acme Corp (optional)" : "Acme Corp"} 
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <label className={labelClass}>
                        Country *
                      </label>
                      <div className="relative">
                        <select 
                          required
                          value={country} 
                          onChange={e => setCountry(e.target.value)} 
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-all outline-none text-gray-900 appearance-none pr-10 cursor-pointer text-sm font-medium" 
                        >
                          <option value="">-- Select Country --</option>
                          {country && !COUNTRY_LIST.includes(country) && (
                            <option value={country}>{country}</option>
                          )}
                          {COUNTRY_LIST.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className={`relative ${showLocationSuggestions ? 'z-30' : ''}`} ref={locationSearchRef}>
                      <label className={labelClass}>
                        Business Location *
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          required
                          value={businessLocation} 
                          onChange={handleLocationInputChange}
                          onFocus={() => {
                            if (locationSuggestions.length > 0 || isSearchingLocation) setShowLocationSuggestions(true);
                          }}
                          className={`${inputClass} pl-9 pr-9`} 
                          placeholder={country && country !== '-- Select Country --' ? `Search area, town, or city in ${country}...` : "e.g. Dubai, Jebel Ali Free Zone, Riyadh, Mumbai"} 
                        />
                        <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                        {isSearchingLocation ? (
                          <div className="w-4 h-4 border-2 border-[#0a5c48] border-t-transparent rounded-full animate-spin absolute right-3 top-3.5"></div>
                        ) : businessLocation ? (
                          <button
                            type="button"
                            onClick={() => {
                              setBusinessLocation('');
                              setLocationSuggestions([]);
                              setShowLocationSuggestions(false);
                            }}
                            className="text-gray-400 hover:text-gray-600 absolute right-3 top-3 p-0.5"
                            title="Clear location"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        ) : null}
                      </div>

                      {/* Real Location Autocomplete Floating Dropdown */}
                      {showLocationSuggestions && (
                        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                          <div className="p-2.5 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#0a5c48]" />
                              Location Suggestions
                            </span>
                            {country && country !== '-- Select Country --' && (
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                                {country}
                              </span>
                            )}
                          </div>

                          {isSearchingLocation && locationSuggestions.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-[#0a5c48] border-t-transparent rounded-full animate-spin"></div>
                              <span>Searching locations for &quot;{businessLocation}&quot;...</span>
                            </div>
                          ) : locationSuggestions.length > 0 ? (
                            locationSuggestions.map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/70 border-b border-gray-100 last:border-b-0 flex items-start gap-2.5 transition-colors group cursor-pointer"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSelectLocationSuggestion(item);
                                }}
                                onClick={() => handleSelectLocationSuggestion(item)}
                              >
                                <div className="w-6 h-6 rounded-full bg-emerald-100/60 group-hover:bg-[#0a5c48] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                                  <MapPin className="w-3.5 h-3.5 text-[#0a5c48] group-hover:text-white transition-colors" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[#0a5c48] truncate">
                                    {item.shortName}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate mt-0.5">
                                    {item.displayName}
                                  </p>
                                </div>
                              </button>
                            ))
                          ) : !isSearchingLocation && businessLocation.trim().length >= 2 ? (
                            <div className="p-3.5 text-center text-xs text-gray-500">
                              No specific place found. You can keep &quot;{businessLocation}&quot; as custom location.
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Categories Interested * (Min 1, Max 3)</label>
                      
                      {/* Selected Pills */}
                      {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3 mt-2">
                          {categories.map(cat => (
                            <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0a5c48] text-white text-sm font-medium rounded-full shadow-sm">
                              {cat}
                              <button type="button" onClick={() => toggleCategory(cat)} className="hover:bg-[#084939] rounded-full p-0.5 transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Search & List */}
                      <div className={`border border-gray-200 rounded-xl bg-white overflow-hidden flex flex-col shadow-sm transition-all ${categories.length === 0 ? 'mt-2' : ''}`}>
                        <div className="p-2 border-b border-gray-100">
                             <div className="relative">
                               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                               <input 
                                 type="text" 
                                 value={categorySearch}
                                 onChange={(e) => setCategorySearch(e.target.value)}
                                 placeholder="Search categories..." 
                                 className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5c48]/20 focus:bg-white transition-all text-gray-900"
                               />
                             </div>
                        </div>
                        <div className="p-2 max-h-48 overflow-y-auto bg-gray-50/50">
                          <div className="flex flex-col gap-1">
                            {filteredCategories.length > 0 ? filteredCategories.map(cat => {
                              const isSelected = categories.includes(cat);
                              const isDisabled = !isSelected && categories.length >= 3;
                              if (isSelected) return null; // Don't show in list if already selected at top
                              
                              return (
                                <button
                                  key={cat}
                                  type="button"
                                  disabled={isDisabled}
                                  onClick={() => {
                                    toggleCategory(cat);
                                    setCategorySearch(''); // Clear search on select
                                  }}
                                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                      isDisabled
                                        ? 'text-gray-400 cursor-not-allowed opacity-60'
                                        : 'text-gray-700 hover:bg-white hover:shadow-sm hover:text-[#0a5c48]'
                                  }`}
                                >
                                  {cat}
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isDisabled ? 'border-gray-200 bg-gray-100' : 'border-gray-300'}`}>
                                  </div>
                                </button>
                              );
                            }) : (
                              <p className="text-center text-sm text-gray-500 py-6">No categories found</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-right">
                        {categories.length}/3 selected
                      </p>
                    </div>

                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-[#0a5c48] hover:bg-[#084939] transition-all disabled:opacity-70 mt-6 group">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          <CheckCircle2 className="w-5 h-5 mr-2" /> Complete Profile
                        </>
                      )}
                    </button>
                  </form>
                )}
            </div>
          </div>
        </div>,
        document.body
      );
}

