"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from '../../lib/motion';
import { ChevronDown, ChevronRight, Check, X, UploadCloud, Trash2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Select from 'react-select';
import { z } from 'zod';
import { validateImageUpload } from '../../lib/security/fileUploadValidator';

const step1Schema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(1, "Mobile Number is required"),
  location: z.string().min(1, "Inventory Location is required"),
});

const step2Schema = z.object({
  productName: z.string().min(1, "Product Name is required"),
  category: z.string().min(1, "Product Category is required").refine(val => val !== '-- Select Category --' && val !== '', "Please select a category"),
  brandName: z.string().optional(),
  modelNo: z.string().optional(),
});

const step3Schema = z.object({
  country: z.string().min(1, "Manufacturing Country is required").refine(val => val !== '-- Select Country --' && val !== '', "Please select a country"),
  year: z.string().optional(),
  dimensions: z.string().optional(),
  expiry: z.string().optional(),
});

const step4Schema = z.object({
  quantity: z.string().min(1, "Quantity is required"),
  currency: z.string().min(1, "Currency is required"),
  liquidatingPrice: z.string().min(1, "Liquidating Price is required"),
  previousPrice: z.string().min(1, "Previous Price is required"),
  excludedCountries: z.array(z.string()).optional(),
});

const step5Schema = z.object({
  description: z.string().min(1, "Description is required"),
  reasonToSell: z.string().min(1, "Reason to Sell is required"),
  warranty: z.string().optional(),
  certificate: z.boolean().optional(),
  imagesUploaded: z.boolean().refine(val => val === true, "Product Images are required")
});

interface SimpleListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryOptions = [
  { value: 'Automation & Control', label: 'Automation & Control' },
  { value: 'Electrical Parts', label: 'Electrical Parts' },
  { value: 'Mechanical Parts', label: 'Mechanical Parts' },
];

const countryOptions = [
  { value: 'Germany', label: 'Germany' },
  { value: 'USA', label: 'USA' },
  { value: 'China', label: 'China' },
  { value: 'Japan', label: 'Japan' },
];

const currencyOptions = [
  { value: 'USD - US Dollar', label: 'USD - US Dollar' },
  { value: 'EUR - Euro', label: 'EUR - Euro' },
  { value: 'AED - UAE Dirham', label: 'AED - UAE Dirham' },
];

const excludedCountriesOptions = [
  { value: 'None (Worldwide)', label: 'None (Worldwide)' },
  { value: 'Russia', label: 'Russia' },
  { value: 'Iran', label: 'Iran' },
  { value: 'North Korea', label: 'North Korea' },
  { value: 'Syria', label: 'Syria' },
  { value: 'Cuba', label: 'Cuba' },
  { value: 'Venezuela', label: 'Venezuela' },
];

const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: '0.75rem',
    border: state.isFocused ? '2px solid #0a5c48' : '1px solid #d1d5db',
    boxShadow: 'none',
    padding: '4px',
    '&:hover': {
      border: state.isFocused ? '2px solid #0a5c48' : '1px solid #9ca3af'
    }
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#0a5c48' : state.isFocused ? '#e0f0e9' : 'white',
    color: state.isSelected ? 'white' : '#111827',
  })
};

export default function SimpleListingModal({ isOpen, onClose }: SimpleListingModalProps) {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [productsCount, setProductsCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    fullName: session?.user?.name || '', 
    email: session?.user?.email || '', 
    mobile: (session?.user as any)?.mobile || '', 
    location: (session?.user as any)?.location || '',
    productName: '', category: '-- Select Category --', brandName: '', modelNo: '',
    country: '-- Select Country --', year: '', dimensions: '', expiry: '',
    quantity: '', currency: 'USD - US Dollar', liquidatingPrice: '', previousPrice: '', excludedCountries: [] as string[],
    description: '', reasonToSell: 'Surplus Inventory', warranty: '', certificate: false, imagesUploaded: false,
    images: [] as File[]
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setProductsCount(1);
      setIsSuccess(false);
      setFormData(prev => ({
        ...prev,
        productName: '', category: '-- Select Category --', brandName: '', modelNo: '',
        country: '-- Select Country --', year: '', dimensions: '', expiry: '',
        quantity: '', currency: 'USD - US Dollar', liquidatingPrice: '', previousPrice: '', excludedCountries: [],
        description: '', reasonToSell: 'Surplus Inventory', warranty: '', certificate: false, imagesUploaded: false,
        images: [] as File[]
      }));
      setFormErrors({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || session.user?.name || '', 
        email: prev.email || session.user?.email || '', 
        mobile: prev.mobile || (session.user as any)?.mobile || '', 
        location: prev.location || (session.user as any)?.location || ''
      }));
    }
  }, [session]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (currentStep: number) => {
    let result: any;
    if (currentStep === 1) result = step1Schema.safeParse(formData);
    else if (currentStep === 2) result = step2Schema.safeParse(formData);
    else if (currentStep === 3) result = step3Schema.safeParse(formData);
    else if (currentStep === 4) result = step4Schema.safeParse(formData);
    else if (currentStep === 5) result = step5Schema.safeParse(formData);

    if (result && !result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(newErrors);
      return false;
    }
    
    setFormErrors({});
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const submitListing = async () => {
    if (validateStep(step)) {
      setIsSubmitting(true);
      setSubmitError('');
      try {
        const data = new FormData();
        
        // Add user info
        data.append('full_name', formData.fullName);
        data.append('email', formData.email);
        data.append('mobile', formData.mobile);
        data.append('location', formData.location);
        
        if (session?.user && (session.user as any).vendor_id) {
          data.append('vendor_id', String((session.user as any).vendor_id));
        }

        // Add product info
        data.append('product_name', formData.productName);
        data.append('category', formData.category);
        data.append('brand_name', formData.brandName || '');
        data.append('model_no', formData.modelNo || '');
        
        data.append('country', formData.country);
        if (formData.year) {
          data.append('manufacturing_year', formData.year);
        }
        data.append('dimensions', formData.dimensions || '');
        if (formData.expiry) {
          data.append('expiry', formData.expiry);
        }
        
        data.append('quantity', formData.quantity);
        data.append('currency', formData.currency.substring(0, 3)); // Backend expects < 10 chars (e.g. "USD")
        data.append('liquidating_price', formData.liquidatingPrice);
        data.append('previous_price', formData.previousPrice);
        data.append('excluded_countries', JSON.stringify(formData.excludedCountries));
        
        // Create a copy of formData without the files for the raw_data JSON payload
        const { images, ...rawDataPayload } = formData;
        data.append('raw_data', JSON.stringify(rawDataPayload));
        
        data.append('description', formData.description);
        data.append('reason_to_sell', formData.reasonToSell);
        data.append('warranty', formData.warranty || '');
        data.append('certificate', formData.certificate ? 'true' : 'false');
        
        if (formData.images && formData.images.length > 0) {
          formData.images.forEach(image => {
            data.append('images', image);
          });
        }

        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const endpoint = apiBase ? `${apiBase}/submit-product-request/` : '/submit-product-request/';
        const response = await fetch(endpoint, {
          method: 'POST',
          body: data,
        });

        if (response.ok) {
          setIsSubmitting(false);
          setIsSuccess(true);
        } else {
          let errorMessage = 'Failed to submit listing. Please try again.';
          try {
            const errData = await response.json();
            errorMessage = errData.message || JSON.stringify(errData) || errorMessage;
          } catch (e) {
            errorMessage = `Server Error (${response.status}): ${response.statusText}`;
          }
          console.error('Submit failed:', errorMessage);
          setSubmitError(errorMessage);
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error('Error submitting listing:', error);
        setSubmitError('Network error. Make sure the backend is running.');
        setIsSubmitting(false);
      }
    }
  };

  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
  const inputClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-all outline-none text-gray-900 shadow-sm";
  const selectClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-all outline-none text-gray-900 appearance-none shadow-sm";
  const errorClass = "text-red-500 text-xs font-medium mt-1";

  const renderError = (field: string) => {
    return formErrors[field] ? <p className={errorClass}>{formErrors[field]}</p> : null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto z-10 flex flex-col max-h-full"
          >
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center p-12 text-center h-[500px]">
                <div className="w-24 h-24 bg-[#e0f0e9] rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-12 h-12 text-[#0a5c48]" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Listing Submitted Successfully!</h3>
                <p className="text-gray-500 text-lg mb-8 max-w-md">
                  Your simple inventory request has been received. Our team will review the details and publish it shortly.
                </p>
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-[#0a5c48] text-white rounded-full font-semibold hover:bg-[#084838] transition-colors shadow-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-20">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Simple Inventory Listing {productsCount > 1 ? `(Product ${productsCount})` : ''}</h3>
                <p className="text-sm text-gray-500 mt-1">Step {step} of {totalSteps} {productsCount > 1 ? `• Product ${productsCount} of 10` : ''}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-1 bg-gray-100">
              <div 
                className="h-full bg-[#0a5c48] transition-all duration-500 ease-out"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>

            <div className="p-6 md:p-8 overflow-y-auto bg-gray-50/30 flex-1">
              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                  Error: {submitError}
                </div>
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${productsCount}-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {step === 1 && (
                    <div className="space-y-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">User Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={labelClass}>Full Name *</label>
                          <input type="text" className={inputClass} placeholder="John Doe" value={formData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} />
                          {renderError('fullName')}
                        </div>
                        <div>
                          <label className={labelClass}>Email Address *</label>
                          <input type="email" className={inputClass} placeholder="john@example.com" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} />
                          {renderError('email')}
                        </div>
                        <div>
                          <label className={labelClass}>Mobile Number *</label>
                          <input type="tel" className={inputClass} placeholder="+1 (555) 000-0000" value={formData.mobile} onChange={e => handleInputChange('mobile', e.target.value)} />
                          {renderError('mobile')}
                        </div>
                        <div>
                          <label className={labelClass}>Inventory Location *</label>
                          <input type="text" className={inputClass} placeholder="City, Country" value={formData.location} onChange={e => handleInputChange('location', e.target.value)} />
                          {renderError('location')}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">1. Basic Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className={labelClass}>Product Name *</label>
                          <input type="text" className={inputClass} placeholder="e.g. Siemens S7-1200 CPU Module" value={formData.productName} onChange={e => handleInputChange('productName', e.target.value)} />
                          {renderError('productName')}
                        </div>
                        <div>
                          <label className={labelClass}>Product Category *</label>
                          <Select
                            options={categoryOptions}
                            styles={customSelectStyles}
                            value={categoryOptions.find(c => c.value === formData.category) || null}
                            onChange={(option: any) => handleInputChange('category', option?.value || '')}
                            placeholder="-- Select Category --"
                          />
                          {renderError('category')}
                        </div>
                        <div>
                          <label className={labelClass}>Brand Name</label>
                          <input type="text" className={inputClass} placeholder="e.g. Siemens" value={formData.brandName} onChange={e => handleInputChange('brandName', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelClass}>Model No. / Part Number</label>
                          <input type="text" className={inputClass} placeholder="e.g. 6ES7214-1AG40-0XB0" value={formData.modelNo} onChange={e => handleInputChange('modelNo', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">2. Manufacturing & Specs</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={labelClass}>Manufacturing Country *</label>
                          <Select
                            options={countryOptions}
                            styles={customSelectStyles}
                            value={countryOptions.find(c => c.value === formData.country) || null}
                            onChange={(option: any) => handleInputChange('country', option?.value || '')}
                            placeholder="-- Select Country --"
                          />
                          {renderError('country')}
                        </div>
                        <div>
                          <label className={labelClass}>Manufacturing Year</label>
                          <input type="text" className={inputClass} placeholder="e.g. 2023" value={formData.year} onChange={e => handleInputChange('year', e.target.value)} />
                        </div>
                        <div>
                          <label className={labelClass}>Dimensions (Optional)</label>
                          <input type="text" className={inputClass} placeholder="e.g. 400x300x150 mm" value={formData.dimensions} onChange={e => handleInputChange('dimensions', e.target.value)} />
                        </div>
                        <div>
                          <label className={labelClass}>Expiry Date</label>
                          <input type="date" className={inputClass} value={formData.expiry} onChange={e => handleInputChange('expiry', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">3. Pricing & Quantity</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={labelClass}>Quantity *</label>
                          <input type="number" className={inputClass} placeholder="10" value={formData.quantity} onChange={e => handleInputChange('quantity', e.target.value)} />
                          {renderError('quantity')}
                        </div>
                        <div>
                          <label className={labelClass}>Currency *</label>
                          <Select
                            options={currencyOptions}
                            styles={customSelectStyles}
                            value={currencyOptions.find(c => c.value === formData.currency) || null}
                            onChange={(option: any) => handleInputChange('currency', option?.value || '')}
                            placeholder="-- Select Currency --"
                          />
                          {renderError('currency')}
                        </div>
                        <div>
                          <label className={labelClass}>Liquidating Price *</label>
                          <input type="number" className={inputClass} placeholder="150" value={formData.liquidatingPrice} onChange={e => handleInputChange('liquidatingPrice', e.target.value)} />
                          {renderError('liquidatingPrice')}
                        </div>
                        <div>
                          <label className={labelClass}>Previous Price *</label>
                          <input type="number" className={inputClass} placeholder="220" value={formData.previousPrice} onChange={e => handleInputChange('previousPrice', e.target.value)} />
                          {renderError('previousPrice')}
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelClass}>Excluded Countries (Optional)</label>
                          <Select
                            isMulti
                            options={excludedCountriesOptions}
                            styles={customSelectStyles}
                            value={excludedCountriesOptions.filter(c => formData.excludedCountries.includes(c.value))}
                            onChange={(options: any) => handleInputChange('excludedCountries', options ? options.map((o: any) => o.value) : [])}
                            placeholder="Select countries..."
                          />
                          <p className="text-xs text-gray-500 mt-2">Hold Ctrl (or Cmd) to select multiple</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">4. Details & Media</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className={labelClass}>Description *</label>
                          <textarea rows={4} className={inputClass} placeholder="Describe the product: condition, technical specifications, packaging, etc." value={formData.description} onChange={e => handleInputChange('description', e.target.value)}></textarea>
                          {renderError('description')}
                        </div>
                        <div>
                          <label className={labelClass}>Reason to Sell *</label>
                          <div className="relative">
                            <select className={selectClass} value={formData.reasonToSell} onChange={e => handleInputChange('reasonToSell', e.target.value)}>
                              <option>Surplus Inventory</option>
                              <option>Business Closure</option>
                              <option>Asset Liquidation</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                          {renderError('reasonToSell')}
                        </div>
                        <div>
                          <label className={labelClass}>Warranty</label>
                          <input type="text" className={inputClass} placeholder="6 Months Surplus Warranty" value={formData.warranty} onChange={e => handleInputChange('warranty', e.target.value)} />
                        </div>
                        <div className="md:col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div>
                            <span className="block font-semibold text-gray-900">3rd Party Certificate</span>
                            <span className="text-sm text-gray-500">Include a certificate of authenticity if available</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={formData.certificate} onChange={e => handleInputChange('certificate', e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0a5c48]"></div>
                          </label>
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelClass}>Product Images *</label>
                          <label 
                            className={`border-2 border-dashed ${formErrors.imagesUploaded ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer group block mb-4`}
                          >
                            <input 
                              type="file" 
                              multiple 
                              accept="image/png, image/jpeg, image/webp, image/gif" 
                              className="hidden" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  const filesArray = Array.from(e.target.files);
                                  const validFiles: File[] = [];
                                  let errMessage = '';

                                  for (const file of filesArray) {
                                    const validation = validateImageUpload(file);
                                    if (!validation.valid) {
                                      errMessage = validation.error || 'Invalid file format.';
                                      break;
                                    }
                                    validFiles.push(file);
                                  }

                                  if (errMessage) {
                                    setFormErrors(prev => ({ ...prev, imagesUploaded: errMessage }));
                                  } else {
                                    setFormErrors(prev => {
                                      const copy = { ...prev };
                                      delete copy.imagesUploaded;
                                      return copy;
                                    });
                                    setFormData(prev => ({
                                      ...prev,
                                      images: [...(prev.images || []), ...validFiles],
                                      imagesUploaded: true
                                    }));
                                  }
                                }
                              }}
                            />
                            <UploadCloud className={`w-10 h-10 ${formData.imagesUploaded ? 'text-[#0a5c48]' : 'text-gray-400'} group-hover:text-[#0a5c48] transition-colors mb-3`} />
                            <p className="text-sm font-medium text-gray-700">Click to upload images</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP, or GIF (max. 5MB per file)</p>
                          </label>
                          {formData.images && formData.images.length > 0 && (
                            <div className="flex flex-wrap gap-4 mt-4">
                              {formData.images.map((file, idx) => (
                                <div key={idx} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                  <img 
                                    src={URL.createObjectURL(file)} 
                                    alt={`Preview ${idx}`} 
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setFormData(prev => {
                                        const newImages = [...(prev.images || [])];
                                        newImages.splice(idx, 1);
                                        return {
                                          ...prev,
                                          images: newImages,
                                          imagesUploaded: newImages.length > 0
                                        };
                                      });
                                    }}
                                    className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          {renderError('imagesUploaded')}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 bg-white flex items-center justify-between sticky bottom-0 z-20">
              <button
                onClick={step === 1 ? onClose : prevStep}
                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                {step === 1 ? 'Cancel' : <><ArrowLeft className="w-4 h-4" /> Back</>}
              </button>
              
              <div className="flex gap-3">
                {step < totalSteps ? (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2.5 bg-[#0a5c48] text-white font-medium rounded-lg hover:bg-[#084939] transition-colors shadow-sm shadow-[#0a5c48]/20 flex items-center gap-2"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    {productsCount < 10 && (
                      <button
                        onClick={() => {
                          if (validateStep(step)) {
                            setProductsCount(prev => prev + 1);
                            setFormData(prev => ({
                              ...prev,
                              productName: '', category: '-- Select Category --', brandName: '', modelNo: '',
                              country: '-- Select Country --', year: '', dimensions: '', expiry: '',
                              quantity: '', currency: 'USD - US Dollar', liquidatingPrice: '', previousPrice: '', excludedCountries: [],
                              description: '', reasonToSell: 'Surplus Inventory', warranty: '', certificate: false, imagesUploaded: false
                            }));
                            setStep(2);
                          }
                        }}
                        className="px-6 py-2.5 bg-white border border-[#0a5c48] text-[#0a5c48] font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        Add Another Product
                      </button>
                    )}
                    <button
                      onClick={submitListing}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-[#0a5c48] text-white font-medium rounded-lg hover:bg-[#084939] transition-colors shadow-sm shadow-[#0a5c48]/20 flex items-center gap-2 disabled:opacity-70"
                    >
                      <CheckCircle2 className="w-4 h-4" /> 
                      {isSubmitting ? 'Submitting...' : (productsCount > 1 ? `Submit ${productsCount} Listings` : 'Submit Listing')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
