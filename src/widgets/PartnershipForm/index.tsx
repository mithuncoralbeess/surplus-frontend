"use client";

import React, { useState, useEffect, useRef } from 'react';
import { inquiryService } from '../../services/inquiryService';
import { searchRealLocation, RealLocationSuggestion } from '../../services/locationService';
import { motion } from '../../lib/motion';
import { z } from 'zod';
import { 
  CheckCircle2, 
  User, 
  Mail, 
  MapPin, 
  HelpCircle, 
  MessageSquare, 
  Send,
  Loader2,
  X
} from 'lucide-react';

import { sanitizeInput } from '../../lib/security/sanitizer';
import { scrollToTop } from '../../lib/scroll';

const nameRegex = /^[a-zA-Z\s'\-]{2,50}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const scriptCheckRegex = /<[^>]*>|javascript:|on\w+\s*=/i;

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .regex(nameRegex, "Name can only contain letters, spaces, hyphens, and apostrophes (no numbers or scripts)")
    .refine((val) => !scriptCheckRegex.test(val), { message: "Script tags or HTML code are not allowed" }),
  email: z
    .string()
    .min(5, "Email is required")
    .max(254, "Email address cannot exceed 254 characters")
    .regex(emailRegex, "Please enter a valid email address (e.g. name@domain.com)"),
  location: z
    .string()
    .min(2, "Please provide your business location")
    .max(150, "Location cannot exceed 150 characters")
    .refine((val) => !scriptCheckRegex.test(val), { message: "Location contains disallowed script or HTML tags" }),
  interest: z
    .string()
    .min(1, "Please select a partnership interest"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters long")
    .max(150, "Subject cannot exceed 150 characters")
    .refine((val) => !scriptCheckRegex.test(val), { message: "Subject contains disallowed script or HTML tags" }),
  message: z
    .string()
    .min(20, "Please provide more details (at least 20 characters)")
    .max(3000, "Message cannot exceed 3000 characters")
    .refine((val) => !scriptCheckRegex.test(val), { message: "Message contains disallowed script or HTML tags" })
});

type FormData = z.infer<typeof formSchema>;

const PartnershipForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    location: '',
    interest: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

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
    handleChange(e);
    const val = e.target.value;

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
        const results = await searchRealLocation(val);
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
    setFormData(prev => ({ ...prev, location: item.displayName }));
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: undefined }));
    }
    setShowLocationSuggestions(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (isSuccess) setIsSuccess(false);

    let val = e.target.value;
    if (e.target.name === 'name') {
      // Disallow numbers, scripts, and special symbols in real-time
      val = val.replace(/[^a-zA-Z\s'\-]/g, '');
    } else if (['location', 'subject', 'message'].includes(e.target.name)) {
      // Disallow HTML tags, script blocks, and inline script handlers in real-time
      val = val.replace(/<[^>]*>|javascript:|on\w+\s*=/gi, '');
    }

    setFormData({ ...formData, [e.target.name]: val });
    if (errors[e.target.name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = formSchema.safeParse(formData);
    
    if (!result.success) {
      const formattedErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0] as keyof FormData] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const sanitizedPayload = {
      name: sanitizeInput(result.data.name),
      email: sanitizeInput(result.data.email.trim()),
      location: sanitizeInput(result.data.location),
      interest: sanitizeInput(result.data.interest),
      subject: sanitizeInput(result.data.subject),
      message: sanitizeInput(result.data.message),
    };

    const res = await inquiryService.submitPartnershipEnquiry(sanitizedPayload);

    if (res.success) {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', location: '', interest: '', subject: '', message: '' });
      setErrors({});
      scrollToTop({ behavior: 'smooth' });
    } else {
      setIsSubmitting(false);
      setSubmitError(res.message || 'Failed to submit enquiry. Please try again.');
      scrollToTop({ behavior: 'smooth' });
    }
  };

  const getInputClass = (fieldName: keyof FormData) => {
    const baseClass = "pl-10 w-full rounded-xl border bg-white px-4 py-3 text-sm focus:ring-1 outline-none transition-all";
    return errors[fieldName] 
      ? `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500`
      : `${baseClass} border-gray-300 focus:border-[#0a5c48] focus:ring-[#0a5c48]`;
  };
  
  const getSelectClass = (fieldName: keyof FormData) => {
    const baseClass = "pl-10 w-full rounded-xl border bg-white px-4 py-3 text-sm focus:ring-1 outline-none transition-all appearance-none cursor-pointer";
    const textClass = formData[fieldName] ? "text-gray-900" : "text-gray-500";
    return errors[fieldName] 
      ? `${baseClass} ${textClass} border-red-500 focus:border-red-500 focus:ring-red-500`
      : `${baseClass} ${textClass} border-gray-300 focus:border-[#0a5c48] focus:ring-[#0a5c48]`;
  };

  const getTextareaClass = (fieldName: keyof FormData) => {
    const baseClass = "w-full rounded-xl border bg-white px-4 py-3 text-sm focus:ring-1 outline-none transition-all resize-none";
    return errors[fieldName] 
      ? `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500`
      : `${baseClass} border-gray-300 focus:border-[#0a5c48] focus:ring-[#0a5c48]`;
  };

  return (
    <section className="w-full py-16 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Side - Dark Info Panel */}
          <div className="lg:w-2/5 bg-[#0a1e17] text-white p-10 lg:p-12 relative overflow-hidden flex flex-col justify-between">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full mb-6">
                <CheckCircle2 className="w-4 h-4 text-[#0a5c48] bg-white rounded-full" />
                <span className="text-xs font-semibold tracking-wide text-white/90">Collaboration Gateway</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-4 leading-tight">
                Tell us how you work and how we can collaborate
              </h2>
              
              <p className="text-white/70 text-sm mb-8 leading-relaxed">
                Whether you're a referral agent, logistics provider, liquidation partner, or corporate enterprise, we create custom collaboration models that align incentives and accelerate growth.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0a5c48] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-1">Quick Response:</strong>
                    <p className="text-white/70 text-sm">Dedicated partnership desk reviews within 24-48 hours.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0a5c48] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-1">Tailored Commercials:</strong>
                    <p className="text-white/70 text-sm">Transparent revenue sharing, finder fees, and service contracts.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0a5c48] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-1">Regional Reach:</strong>
                    <p className="text-white/70 text-sm">Multi-country coverage across GCC, MENA, and International markets.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 mt-12 pt-6 border-t border-white/10">
              <p className="text-sm text-white/60">
                Direct Desk: <a href="mailto:partnerships@surplusmarket.com" className="text-[#0f7a61] hover:text-[#129c7c] transition-colors font-medium">partnerships@surplusmarket.com</a>
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-3/5 p-10 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center justify-between">
                  <span>{submitError}</span>
                  <button type="button" onClick={() => setSubmitError('')} className="text-red-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 ${errors.name ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={getInputClass('name')}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                </div>

                {/* Work Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                    Work Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your business email address"
                      className={getInputClass('email')}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                </div>

                {/* Business Location */}
                <div className={`relative ${showLocationSuggestions ? 'z-30' : ''}`} ref={locationSearchRef}>
                  <label htmlFor="location" className="block text-sm font-bold text-gray-900 mb-2">
                    Business Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className={`h-5 w-5 ${errors.location ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleLocationInputChange}
                      onFocus={() => {
                        if (locationSuggestions.length > 0 || isSearchingLocation) setShowLocationSuggestions(true);
                      }}
                      placeholder="e.g. Dubai, Jebel Ali, Riyadh, Mumbai"
                      className={`${getInputClass('location')} pl-10 pr-10`}
                    />
                    {isSearchingLocation ? (
                      <div className="w-4 h-4 border-2 border-[#0f7a61] border-t-transparent rounded-full animate-spin absolute right-3 top-3.5"></div>
                    ) : formData.location ? (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, location: '' }));
                          setLocationSuggestions([]);
                          setShowLocationSuggestions(false);
                        }}
                        className="text-gray-400 hover:text-gray-600 absolute right-3 top-3 p-0.5"
                        title="Clear location"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : null}
                  </div>

                  {/* Real Location Autocomplete Floating Dropdown */}
                  {showLocationSuggestions && (
                    <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                      <div className="p-2.5 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#0f7a61]" />
                          Location Suggestions
                        </span>
                      </div>

                      {isSearchingLocation && locationSuggestions.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#0f7a61] border-t-transparent rounded-full animate-spin"></div>
                          <span>Searching locations for &quot;{formData.location}&quot;...</span>
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
                            <div className="w-6 h-6 rounded-full bg-emerald-100/60 group-hover:bg-[#0f7a61] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                              <MapPin className="w-3.5 h-3.5 text-[#0f7a61] group-hover:text-white transition-colors" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-[#0f7a61] truncate">
                                {item.shortName}
                              </p>
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {item.displayName}
                              </p>
                            </div>
                          </button>
                        ))
                      ) : !isSearchingLocation && formData.location?.trim().length >= 2 ? (
                        <div className="p-3.5 text-center text-xs text-gray-500">
                          No specific place found. You can keep &quot;{formData.location}&quot; as custom location.
                        </div>
                      ) : null}
                    </div>
                  )}

                  {errors.location && <p className="text-red-500 text-xs mt-1.5">{errors.location}</p>}
                </div>

                {/* Partnership Interest */}
                <div>
                  <label htmlFor="interest" className="block text-sm font-bold text-gray-900 mb-2">
                    Partnership Interest <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HelpCircle className={`h-5 w-5 ${errors.interest ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className={getSelectClass('interest')}
                    >
                      <option value="" disabled>Select Partnership Type</option>
                      <option value="Referral">Referral Partner</option>
                      <option value="ESG">ESG / Sustainability</option>
                      <option value="Logistics">Logistics / Fulfillment</option>
                      <option value="Liquidation">Liquidation / Value Recovery</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {errors.interest && <p className="text-red-500 text-xs mt-1.5">{errors.interest}</p>}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-gray-900 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MessageSquare className={`h-5 w-5 ${errors.subject ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What would you like to discuss?"
                    className={getInputClass('subject')}
                  />
                </div>
                {errors.subject && <p className="text-red-500 text-xs mt-1.5">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                  How Can We Collaborate? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your business, your network, your capabilities, or the opportunity you'd like to explore."
                  className={getTextareaClass('message')}
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1.5">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0a5c48] hover:bg-[#084838] text-white px-8 py-4 rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting Enquiry...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Partnership Enquiry
                  </>
                )}
              </button>

              {/* Success Notification directly under submit button */}
              {isSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-[#0a5c48] text-sm font-semibold flex items-center justify-between animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#0a5c48] shrink-0" />
                    <span>Enquiry Submitted Successfully!</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setIsSuccess(false)} 
                    className="text-[#0a5c48]/60 hover:text-[#0a5c48]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipForm;
