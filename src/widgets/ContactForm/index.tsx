"use client";

import React, { useState, useEffect } from 'react';
import { inquiryService } from '../../services/inquiryService';
import { motion } from '../../lib/motion';
import { z } from 'zod';
import Select from 'react-select';
import { 
  User, 
  Mail, 
  Phone, 
  HelpCircle, 
  Send, 
  Loader2, 
  CheckCircle2, 
  X,
  MapPin,
  Building2
} from 'lucide-react';

const nameRegex = /^[a-zA-Z\s'\-]{2,50}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+?[0-9\s]{6,20}$/;
const scriptCheckRegex = /<[^>]*>|javascript:|on\w+\s*=/i;

const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full Name must be at least 2 characters long")
    .regex(nameRegex, "Full Name can only contain letters, spaces, hyphens, and apostrophes (no numbers or scripts)")
    .refine((val) => !scriptCheckRegex.test(val), { message: "Script tags or HTML code are not allowed" }),
  email: z
    .string()
    .min(5, "Email is required")
    .regex(emailRegex, "Please enter a valid email address (e.g. name@domain.com)"),
  phone: z
    .string()
    .min(6, "Phone number must be at least 6 characters")
    .regex(phoneRegex, "Phone number can only contain + and digits (e.g. +97430269988)"),
  enquiryType: z
    .string()
    .min(1, "Please select what you are enquiring about"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .refine((val) => !scriptCheckRegex.test(val), { message: "Message contains disallowed script or HTML tags" })
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const enquiryOptions = [
  { value: 'General Inquiry', label: 'General Inquiry' },
  { value: 'Buying & Bidding Support', label: 'Buying & Bidding Support' },
  { value: 'Selling & Listing Inventory', label: 'Selling & Listing Inventory' },
  { value: 'Logistics & Shipping', label: 'Logistics & Shipping' },
  { value: 'Partnership & ESG', label: 'Partnership & ESG' },
  { value: 'Other', label: 'Other' },
];

const customSelectStyles = (hasError: boolean) => ({
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: '0.75rem',
    borderColor: hasError ? '#ef4444' : state.isFocused ? '#0a5c48' : '#d1d5db',
    borderWidth: state.isFocused ? '2px' : '1px',
    boxShadow: 'none',
    padding: '3px 4px',
    backgroundColor: '#ffffff',
    '&:hover': {
      borderColor: hasError ? '#ef4444' : state.isFocused ? '#0a5c48' : '#9ca3af'
    }
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#0a5c48' : state.isFocused ? '#e0f0e9' : 'white',
    color: state.isSelected ? 'white' : '#111827',
    cursor: 'pointer'
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#111827',
    fontWeight: '500'
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#9ca3af',
    fontWeight: '400'
  })
});

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    enquiryType: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isSuccess) setIsSuccess(false);
    
    let val = e.target.value;
    if (e.target.name === 'fullName') {
      // Disallow numbers, scripts, and special symbols in real-time
      val = val.replace(/[^a-zA-Z\s'\-]/g, '');
    } else if (e.target.name === 'phone') {
      // Disallow non-digits and non-plus signs in real-time
      val = val.replace(/[^0-9+\s]/g, '');
    } else if (e.target.name === 'message') {
      // Disallow HTML tags, script blocks, and inline script handlers in real-time
      val = val.replace(/<[^>]*>|javascript:|on\w+\s*=/gi, '');
    }

    setFormData({ ...formData, [e.target.name]: val });
    if (errors[e.target.name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactFormSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0] as keyof ContactFormData] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const res = await inquiryService.submitContactForm(result.data);

    if (res.success) {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', enquiryType: '', message: '' });
      setErrors({});
    } else {
      setIsSubmitting(false);
      setSubmitError(res.message || 'Failed to send your message. Please try again.');
    }
  };

  const getInputClass = (fieldName: keyof ContactFormData) => {
    const baseClass = "pl-10 w-full rounded-xl border bg-white px-4 py-3 text-sm focus:ring-2 outline-none transition-all";
    return errors[fieldName]
      ? `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500`
      : `${baseClass} border-gray-300 focus:border-[#0a5c48] focus:ring-[#0a5c48]`;
  };

  const getTextareaClass = (fieldName: keyof ContactFormData) => {
    const baseClass = "w-full rounded-xl border bg-white px-4 py-3 text-sm focus:ring-2 outline-none transition-all resize-y";
    return errors[fieldName]
      ? `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500`
      : `${baseClass} border-gray-300 focus:border-[#0a5c48] focus:ring-[#0a5c48]`;
  };

  return (
    <section className="w-full py-12 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
          {/* Left Side - Contact Info Panel */}
          <div className="lg:w-5/12 bg-[#0a1e17] text-white p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0a5c48]/20 blur-[80px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>

            <div className="relative z-10 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#0a5c48] bg-white rounded-full p-0.5" />
                  <span className="text-xs font-semibold text-white/90">Get In Touch</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-2">Contact Information</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Have questions about buying or selling surplus inventory? Connect with our teams across our regional offices.
                </p>
              </div>

              {/* Email & Phone */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-[#0a5c48]">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="block text-xs text-white/60 font-semibold uppercase tracking-wider">Email</span>
                    <a href="mailto:contact@surplusmarket.com" className="text-sm font-semibold text-white hover:text-[#0f7a61] transition-colors">
                      contact@surplusmarket.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-[#0a5c48]">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="block text-xs text-white/60 font-semibold uppercase tracking-wider">Phone</span>
                    <a href="tel:+97430269988" className="text-sm font-semibold text-white hover:text-[#0f7a61] transition-colors">
                      +974 3026 9988
                    </a>
                  </div>
                </div>
              </div>

              {/* Offices */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold text-white/80 uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0a5c48]" /> Regional Offices
                </h4>

                {/* Qatar */}
                <div className="text-xs space-y-1">
                  <strong className="block text-sm text-white font-bold">Qatar</strong>
                  <p className="text-white/70 leading-relaxed">
                    15th Floor, Trans World 1, Near National Museum of Qatar, Doha
                  </p>
                </div>

                {/* Saudi Arabia */}
                <div className="text-xs space-y-1">
                  <strong className="block text-sm text-white font-bold">Saudi Arabia</strong>
                  <p className="text-white/70 leading-relaxed">
                    Le Cygne Commercial, Center 2, 6th Floor, Al Olaya, Riyadh 12611
                  </p>
                </div>

                {/* UAE */}
                <div className="text-xs space-y-1">
                  <strong className="block text-sm text-white font-bold">UAE</strong>
                  <p className="text-white/70 leading-relaxed">
                    Building A1, Dubai Digital Park, Dubai Silicon Oasis
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Panel */}
          <div className="lg:w-7/12 p-8 sm:p-12">
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
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-bold text-gray-900 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 ${errors.fullName ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={getInputClass('fullName')}
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                    Email Address <span className="text-red-500">*</span>
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
                      placeholder="yourname@example.com"
                      className={getInputClass('email')}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className={`h-5 w-5 ${errors.phone ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+974 3026 9988"
                      className={getInputClass('phone')}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
                </div>

                {/* I'm enquiring about - React Select */}
                <div>
                  <label htmlFor="enquiryType" className="block text-sm font-bold text-gray-900 mb-2">
                    I'm enquiring about <span className="text-red-500">*</span>
                  </label>
                  <Select
                    id="enquiryType"
                    instanceId="enquiryType-select"
                    options={enquiryOptions}
                    value={enquiryOptions.find(opt => opt.value === formData.enquiryType) || null}
                    onChange={(selectedOption: any) => {
                      if (isSuccess) setIsSuccess(false);
                      const val = selectedOption ? selectedOption.value : '';
                      setFormData(prev => ({ ...prev, enquiryType: val }));
                      if (errors.enquiryType) {
                        setErrors(prev => ({ ...prev, enquiryType: undefined }));
                      }
                    }}
                    placeholder="Select inquiry topic..."
                    styles={customSelectStyles(Boolean(errors.enquiryType))}
                  />
                  {errors.enquiryType && <p className="text-red-500 text-xs mt-1.5">{errors.enquiryType}</p>}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Provide details about your inquiry..."
                  className={getTextareaClass('message')}
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1.5">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0a5c48] hover:bg-[#084838] text-white px-8 py-4 rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>

              {/* Success Notification directly under submit button */}
              {isSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-[#0a5c48] text-sm font-semibold flex items-center justify-between animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#0a5c48] shrink-0" />
                    <span>Message Sent Successfully!</span>
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
}
