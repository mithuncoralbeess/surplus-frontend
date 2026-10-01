"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
import { X, UploadCloud, FileSpreadsheet, ChevronRight, Check, ArrowLeft, Download, Tag, Plus, Percent, Trash2, Edit2, User, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { validateManifestUpload } from '../../lib/security/fileUploadValidator';
import { sanitizeInput } from '../../lib/security/sanitizer';

const noScriptRegex = /<[^>]*>/g;

const step1Schema = z.object({
  manifestFile: z.any().refine(val => val !== null, "Please upload a manifest file to continue")
});

const step2Schema = z.object({
  fullName: z.string()
    .min(1, "Full Name is required")
    .max(100, "Full Name cannot exceed 100 characters")
    .refine(val => !noScriptRegex.test(val), "HTML tags and scripts are strictly prohibited"),
  email: z.string()
    .min(1, "Valid email is required")
    .email("Valid email is required")
    .max(254, "Email address cannot exceed 254 characters")
    .refine(val => !noScriptRegex.test(val), "HTML tags and scripts are strictly prohibited"),
  mobile: z.string()
    .min(1, "Mobile Number is required")
    .max(25, "Mobile Number cannot exceed 25 characters")
    .refine(val => !noScriptRegex.test(val), "HTML tags and scripts are strictly prohibited"),
  location: z.string()
    .min(1, "Inventory Location is required")
    .max(150, "Inventory Location cannot exceed 150 characters")
    .refine(val => !noScriptRegex.test(val), "HTML tags and scripts are strictly prohibited"),
});

const step3Schema = z.object({
  title: z.string()
    .min(1, "Listing Title is required")
    .max(200, "Listing Title cannot exceed 200 characters")
    .refine(val => !noScriptRegex.test(val), "HTML tags and scripts are strictly prohibited"),
  description: z.string()
    .min(1, "Lot Description & Notes are required")
    .max(3000, "Lot Description cannot exceed 3000 characters")
    .refine(val => !/<script[^>]*>[\s\S]*?<\/script>/gi.test(val) && !/on\w+\s*=/gi.test(val), "Script execution payloads are not allowed"),
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  sourceType: z.string().min(1, "Source Type is required"),
  loadType: z.string().min(1, "Load Type is required"),
  lotSize: z.string().min(1, "Lot Size is required"),
  palletCount: z.coerce.number().min(1, "Pallet Count must be at least 1"),
});

interface LotImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 1, title: 'Upload Manifest' },
  { id: 2, title: 'User Info' },
  { id: 3, title: 'Lot Details' },
  { id: 4, title: 'Review Data' },
];

const LotImportModal: React.FC<LotImportModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [manifestData, setManifestData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: session } = useSession();
  const [manifestFile, setManifestFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', 
    email: '', 
    mobile: '', 
    location: '',
    title: '',
    description: '',
    category: 'Electricals',
    allocation: 100,
    condition: '',
    sourceType: '',
    loadType: '',
    lotSize: '',
    palletCount: 1,
    weight: '',
    unitType: 'Pieces / Units',
    shippingTerms: 'Buyer Arranges Freight',
    askPrice: '',
    saleMethod: 'offer',
    allowCounterOffers: true
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const validation = validateManifestUpload(selectedFile);

      if (!validation.valid) {
        setFormErrors(prev => ({
          ...prev,
          manifestFile: validation.error || 'Invalid manifest file.'
        }));
        setManifestFile(null);
        return;
      }

      setManifestFile(selectedFile);
      if (formErrors['manifestFile']) {
        setFormErrors(prev => {
          const newErrs = { ...prev };
          delete newErrs['manifestFile'];
          return newErrs;
        });
      }
    }
  };

  const renderError = (field: string) => {
    return formErrors[field] ? <p className="text-red-500 text-xs font-medium mt-1">{formErrors[field]}</p> : null;
  };

  const updateManifestRow = (id: number, field: string, value: string | number) => {
    setManifestData(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };
  
  const removeRow = (id: number) => {
    setManifestData(prev => prev.filter(row => row.id !== id));
  };

  const totalUnits = manifestData.reduce((acc, row) => acc + (Number(row.qty) || 0), 0);
  const totalRetail = manifestData.reduce((acc, row) => acc + ((Number(row.qty) || 0) * (Number(row.msrp) || 0)), 0);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSuccess(false);
      setCurrentStep(1);
      setFormErrors({});
      setSubmitError('');
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validateStep = (step: number) => {
    try {
      if (step === 1) {
        step1Schema.parse({ manifestFile });
      } else if (step === 2) {
        step2Schema.parse(formData);
      } else if (step === 3) {
        step3Schema.parse(formData);
      }
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const submitListing = async () => {
    if (!validateStep(1)) { setCurrentStep(1); return; }
    if (!validateStep(2)) { setCurrentStep(2); return; }
    if (!validateStep(3)) { setCurrentStep(3); return; }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const data = new FormData();
      
      if (session?.user && (session.user as any).vendor_id) {
        data.append('vendor_id', String((session.user as any).vendor_id));
      }
      
      // user_information (JSON String) with input sanitization
      data.append('user_information', JSON.stringify({
        full_name: sanitizeInput(formData.fullName),
        email: sanitizeInput(formData.email.trim()),
        mobile: sanitizeInput(formData.mobile),
        location: sanitizeInput(formData.location)
      }));
      
      // lot_details (JSON String) with input sanitization
      data.append('lot_details', JSON.stringify({
        title: sanitizeInput(String(formData.title || '')),
        description: sanitizeInput(String(formData.description || '')),
        category: sanitizeInput(String(formData.category || '')),
        allocation: sanitizeInput(String(formData.allocation)),
        condition: sanitizeInput(String(formData.condition || '')),
        source_type: sanitizeInput(String(formData.sourceType || '')),
        load_type: sanitizeInput(String(formData.loadType || '')),
        lot_size: sanitizeInput(String(formData.lotSize || '')),
        pallet_count: Number(formData.palletCount) || 1,
        weight: sanitizeInput(String(formData.weight || '')),
        unit_type: sanitizeInput(String(formData.unitType || '')),
        shipping_terms: sanitizeInput(String(formData.shippingTerms || '')),
        ask_price: sanitizeInput(String(formData.askPrice || '')),
        sale_method: sanitizeInput(String(formData.saleMethod || '')),
        allow_counter_offers: Boolean(formData.allowCounterOffers),
        total_units: totalUnits,
        total_retail_value: totalRetail
      }));
      
      // manifest_items (JSON String)
      data.append('manifest_items', JSON.stringify(manifestData));
      
      // manifest_file (File Object)
      if (manifestFile) {
        data.append('manifest_file', manifestFile);
      }
      
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const endpoint = apiBase ? `${apiBase}/submit-lot-request/` : '/submit-lot-request/';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setIsSubmitting(false);
        setIsSuccess(true);
      } else {
        let errorMessage = 'Failed to submit lot. Please try again.';
        try {
          const errData = await response.json();
          errorMessage = errData.message || JSON.stringify(errData) || errorMessage;
        } catch (e) {
          errorMessage = `Server Error (${response.status}): ${response.statusText}`;
        }
        setSubmitError(errorMessage);
        setIsSubmitting(false);
      }
    } catch (error) {
      setSubmitError('Network error. Make sure the backend is running.');
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div data-lenis-prevent className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col overflow-hidden max-h-[90vh]">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-[500px]">
            <div className="w-24 h-24 bg-[#e0f0e9] rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-[#0a5c48]" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Listing Submitted Successfully!</h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md">
              Your lot import request has been received. Our team will review the details and publish it shortly.
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
            {/* Header & Stepper */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-20 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Lot Import & Editable Listing</h3>
                <p className="text-sm text-gray-500 mt-1">Step {currentStep} of {STEPS.length} • {STEPS[currentStep - 1]?.title || 'Complete'}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-1 bg-gray-100 shrink-0">
              <div 
                className="h-full bg-[#0a5c48] transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              />
            </div>

        {/* Scrollable Body */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto min-h-0 p-8 bg-gray-50/30">

          {submitError && (
            <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center justify-between">
              <span>{submitError}</span>
              <button onClick={() => setSubmitError('')} className="text-red-400 hover:text-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 1: Upload */}
          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-10">
              <div className="w-20 h-20 bg-[#e0f0e9] rounded-full flex items-center justify-center mb-6 text-[#0a5c48]">
                <FileSpreadsheet className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload your inventory manifest</h3>
              <p className="text-gray-500 text-center mb-8">
                Upload your .xlsx or .csv file. Our system will automatically detect and map your columns.
              </p>

              <label className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center text-gray-500 hover:bg-[#0a5c48]/5 hover:border-[#0a5c48]/30 transition-colors cursor-pointer bg-white shadow-sm mb-2">
                <input 
                  type="file" 
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <UploadCloud className={`w-12 h-12 mb-4 ${manifestFile ? 'text-[#0a5c48]' : 'text-[#0a5c48]/60'}`} />
                <span className="font-semibold text-gray-700 text-lg">
                  {manifestFile ? manifestFile.name : 'Click to browse or drag & drop'}
                </span>
                <span className="text-sm mt-2 text-gray-500">
                  {manifestFile ? 'File ready to upload' : 'Supports .XLSX and .CSV up to 10MB'}
                </span>
              </label>
              {renderError('manifestFile')}

              <button className="flex items-center text-sm font-semibold text-[#0a5c48] hover:underline mt-4">
                <Download className="w-4 h-4 mr-2" />
                Download our standard template (Optional)
              </button>
            </div>
          )}

          {/* STEP 2: User Information */}
          {currentStep === 2 && (
            <div className="w-full max-w-4xl mx-auto space-y-10 pb-4 pt-4">
              <section className="space-y-6">
                <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6">User Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                    <input type="text" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" placeholder="John Doe" value={formData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} />
                    {renderError('fullName')}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                    <input type="email" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" placeholder="john@example.com" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} />
                    {renderError('email')}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number *</label>
                    <input type="tel" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" placeholder="+1 (555) 000-0000" value={formData.mobile} onChange={e => handleInputChange('mobile', e.target.value)} />
                    {renderError('mobile')}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Inventory Location *</label>
                    <input type="text" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" placeholder="City, Country" value={formData.location} onChange={e => handleInputChange('location', e.target.value)} />
                    {renderError('location')}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* STEP 3: Lot Details */}
          {currentStep === 3 && (
            <div className="w-full max-w-4xl mx-auto space-y-10 pb-4 pt-4">
              <div className="space-y-10">
                {/* Core Details */}
                <section>
                  <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6">Listing Details</h4>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Listing Title <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" 
                        placeholder="e.g. 1 Pallet - 50 Pcs - Electronics - Returns - Target" 
                        value={formData.title}
                        onChange={e => handleInputChange('title', e.target.value)}
                      />
                      {renderError('title')}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lot Description & Notes <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={4} 
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400 resize-y" 
                        placeholder="Describe the lot context, packaging condition, and any 'sold as-is' terms..."
                        value={formData.description}
                        onChange={e => handleInputChange('description', e.target.value)}
                      ></textarea>
                      {renderError('description')}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Photo</label>
                      <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer bg-white">
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-3" />
                        <span className="font-medium text-gray-700">Browse or drop an image</span>
                        <span className="text-xs mt-1 text-gray-400">JPG, PNG (Max 5MB)</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Category & Percentage Breakdown */}
                <section>
                  <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#0a5c48]" /> Category & Percentage Breakdown
                  </h4>
                  <p className="text-[15px] text-gray-500 mb-4">Select category from dropdown with inventory percentage allocation</p>

                  <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-bold text-gray-900 mb-1.5">Category <span className="text-red-500">*</span></label>
                        <select 
                          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm"
                          value={formData.category}
                          onChange={e => handleInputChange('category', e.target.value)}
                        >
                          <option value="Electricals">Electricals</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Apparel">Apparel</option>
                        </select>
                        {renderError('category')}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1.5">Percentage Allocation <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input 
                            type="number" 
                            className="w-full bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm" 
                            value={formData.allocation}
                            onChange={e => handleInputChange('allocation', Number(e.target.value))}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                        </div>
                        {renderError('allocation')}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button type="button" className="flex items-center text-[13px] font-bold text-[#0a5c48] bg-[#0a5c48]/10 px-5 py-2.5 rounded-full hover:bg-[#0a5c48]/20 transition-colors">
                      <Plus className="w-4 h-4 mr-1.5" /> Add Another Category
                    </button>
                    <div className="flex items-center text-[13px] font-bold text-[#0a5c48] bg-[#e0f0e9] px-5 py-2.5 rounded-full">
                      <Percent className="w-4 h-4 mr-1.5" /> Total Allocation: 100% <Check className="w-4 h-4 ml-1.5" />
                    </div>
                  </div>
                </section>

                {/* Source & Condition */}
                <section>
                  <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6 flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#0a5c48]" /> Condition & Source
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Condition <span className="text-red-500">*</span></label>
                      <select 
                        value={formData.condition} 
                        onChange={e => handleInputChange('condition', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm"
                      >
                        <option value="" disabled>Select Condition</option>
                        <option value="New">New</option>
                        <option value="Like New">Like New</option>
                        <option value="Returns">Returns</option>
                        <option value="Used">Used</option>
                        <option value="Salvage">Salvage</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                      {renderError('condition')}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Source Type <span className="text-red-500">*</span></label>
                      <select 
                        value={formData.sourceType} 
                        onChange={e => handleInputChange('sourceType', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm"
                      >
                        <option value="" disabled>Select Source Type</option>
                        <option value="Overstock">Overstock</option>
                        <option value="Customer Returns">Customer Returns</option>
                        <option value="Liquidation">Liquidation</option>
                        <option value="Closeout">Closeout</option>
                        <option value="Surplus">Surplus</option>
                        <option value="Other">Other</option>
                      </select>
                      {renderError('sourceType')}
                    </div>
                  </div>
                </section>

                {/* Logistics & Metrics */}
                <section>
                  <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#0a5c48]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Metrics & Logistics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Units</label>
                      <input type="text" disabled className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-500 shadow-sm" value={totalUnits.toLocaleString()} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Unit Type</label>
                      <select 
                        value={formData.unitType} 
                        onChange={e => handleInputChange('unitType', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm"
                      >
                        <option value="Pieces / Units">Pieces / Units</option>
                        <option value="Pairs">Pairs</option>
                        <option value="Kilograms (kg)">Kilograms (kg)</option>
                        <option value="Pounds (lbs)">Pounds (lbs)</option>
                        <option value="Mixed Types">Mixed Types</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Weight</label>
                      <input 
                        type="text" 
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" 
                        placeholder="e.g. 500 lbs" 
                        value={formData.weight}
                        onChange={e => handleInputChange('weight', e.target.value)}
                      />
                    </div>

                    <div className="col-span-1 sm:col-span-3 border-t border-gray-100 my-2"></div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Load Type <span className="text-red-500">*</span></label>
                      <select 
                        value={formData.loadType} 
                        onChange={e => handleInputChange('loadType', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm"
                      >
                        <option value="" disabled>Select Load Type</option>
                        <option value="Pallet">Pallet</option>
                        <option value="LTL">LTL</option>
                        <option value="Truckload">Truckload</option>
                        <option value="Container">Container</option>
                        <option value="Other">Other</option>
                      </select>
                      {renderError('loadType')}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lot Size <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" 
                        placeholder="e.g. 1 Pallet" 
                        value={formData.lotSize}
                        onChange={e => handleInputChange('lotSize', e.target.value)}
                      />
                      {renderError('lotSize')}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pallet Count <span className="text-red-500">*</span></label>
                      <input 
                        type="number" 
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm" 
                        value={formData.palletCount}
                        onChange={e => handleInputChange('palletCount', Number(e.target.value))}
                      />
                      {renderError('palletCount')}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location (City, State)</label>
                      <input 
                        type="text" 
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" 
                        placeholder="e.g. Austin, TX" 
                        value={formData.location}
                        onChange={e => handleInputChange('location', e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shipping Terms</label>
                      <select 
                        value={formData.shippingTerms} 
                        onChange={e => handleInputChange('shippingTerms', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm"
                      >
                        <option value="Buyer Arranges Freight">Buyer Arranges Freight</option>
                        <option value="Seller Arranges Freight">Seller Arranges Freight</option>
                        <option value="Free Shipping">Free Shipping</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Pricing */}
                <section>
                  <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#0a5c48]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Pricing & Terms
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ask Price</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                        <input 
                          type="number" 
                          className="w-full bg-white border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm font-medium placeholder-gray-400" 
                          placeholder="0.00" 
                          value={formData.askPrice}
                          onChange={e => handleInputChange('askPrice', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Est. Retail Value</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                        <input type="text" disabled className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-500 shadow-sm font-medium" value={totalRetail.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sale Method</label>
                      <select 
                        value={formData.saleMethod} 
                        onChange={e => handleInputChange('saleMethod', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm max-w-[50%]"
                      >
                        <option value="offer">Accept Offers</option>
                        <option value="fixed">Fixed Price</option>
                        <option value="auction">Auction</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 pt-2">
                      <label className="flex items-start gap-4 p-5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100/70 transition-colors">
                        <div className="relative flex-shrink-0 mt-0.5">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={formData.allowCounterOffers} 
                            onChange={e => handleInputChange('allowCounterOffers', e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0a5c48]"></div>
                        </div>
                        <div>
                          <span className="block font-bold text-gray-900 text-[15px]">Allow Counter Offers</span>
                          <span className="block text-sm text-gray-500 mt-1 leading-relaxed">Let buyers submit offers below your Ask Price. You can accept, reject, or counter any offer.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </section>
              </div>

            </div>
          )}

          {/* STEP 4: Review Data */}
          {currentStep === 4 && (
            <div className="max-w-6xl mx-auto h-full flex flex-col py-6">
              
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Edit Manifest</h3>
                  <p className="text-gray-500 text-[15px]">Verify the imported data. You can edit any field inline before publishing.</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm min-w-[120px]">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Total Units</span>
                    <span className="text-xl font-bold text-gray-900">{totalUnits.toLocaleString()}</span>
                  </div>
                  <div className="bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm min-w-[140px]">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Total Retail</span>
                    <span className="text-xl font-bold text-[#0a5c48]">${totalRetail.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                </div>
              </div>
              
              {/* Interactive Data Grid */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="px-6 py-4">SKU / ID</th>
                        <th className="px-6 py-4 w-1/3">Product Title</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Condition</th>
                        <th className="px-6 py-4 text-right">Qty</th>
                        <th className="px-6 py-4 text-right">MSRP / Unit</th>
                        <th className="px-6 py-4 text-right">Ext. MSRP</th>
                        <th className="px-4 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {manifestData.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-3">
                            <input 
                              type="text" 
                              value={row.sku} 
                              onChange={(e) => updateManifestRow(row.id, 'sku', e.target.value)}
                              className="w-full bg-transparent border border-transparent hover:border-gray-300 focus:border-[#0a5c48] focus:ring-1 focus:ring-[#0a5c48] rounded px-2 py-1.5 transition-all text-gray-600 font-mono text-xs" 
                            />
                          </td>
                          <td className="px-6 py-3">
                            <input 
                              type="text" 
                              value={row.title} 
                              onChange={(e) => updateManifestRow(row.id, 'title', e.target.value)}
                              className="w-full bg-transparent border border-transparent hover:border-gray-300 focus:border-[#0a5c48] focus:ring-1 focus:ring-[#0a5c48] rounded px-2 py-1.5 transition-all font-semibold text-gray-900" 
                            />
                          </td>
                          <td className="px-6 py-3">
                            <input 
                              type="text" 
                              value={row.category} 
                              onChange={(e) => updateManifestRow(row.id, 'category', e.target.value)}
                              className="w-full bg-transparent border border-transparent hover:border-gray-300 focus:border-[#0a5c48] focus:ring-1 focus:ring-[#0a5c48] rounded px-2 py-1.5 transition-all text-gray-700" 
                            />
                          </td>
                          <td className="px-6 py-3">
                            <select 
                              value={row.condition} 
                              onChange={(e) => updateManifestRow(row.id, 'condition', e.target.value)}
                              className="bg-transparent border border-transparent hover:border-gray-300 focus:border-[#0a5c48] focus:ring-1 focus:ring-[#0a5c48] rounded px-2 py-1.5 transition-all text-gray-700 cursor-pointer" 
                            >
                              <option>New</option>
                              <option>Like New</option>
                              <option>Returns</option>
                              <option>Used</option>
                              <option>Salvage</option>
                            </select>
                          </td>
                          <td className="px-6 py-3">
                            <input 
                              type="number" 
                              value={row.qty} 
                              onChange={(e) => updateManifestRow(row.id, 'qty', parseInt(e.target.value) || 0)}
                              className="w-20 text-right bg-transparent border border-transparent hover:border-gray-300 focus:border-[#0a5c48] focus:ring-1 focus:ring-[#0a5c48] rounded px-2 py-1.5 transition-all font-semibold text-gray-900" 
                            />
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-end">
                              <span className="text-gray-400 mr-1">$</span>
                              <input 
                                type="number" 
                                value={row.msrp} 
                                onChange={(e) => updateManifestRow(row.id, 'msrp', parseFloat(e.target.value) || 0)}
                                className="w-24 text-right bg-transparent border border-transparent hover:border-gray-300 focus:border-[#0a5c48] focus:ring-1 focus:ring-[#0a5c48] rounded px-2 py-1.5 transition-all text-gray-700" 
                              />
                            </div>
                          </td>
                          <td className="px-6 py-3 text-right font-semibold text-[#0a5c48]">
                            ${((Number(row.qty) || 0) * (Number(row.msrp) || 0)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => removeRow(row.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer Actions */}
                <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-end mt-auto">
                  <p className="text-xs text-gray-500 font-medium">Showing {manifestData.length} items from manifest</p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-gray-100 p-6 flex justify-between items-center z-10 shrink-0">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : prevStep}
            className="flex items-center px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-full transition-colors"
          >
            {currentStep === 1 ? 'Cancel' : (
              <>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </>
            )}
          </button>

          <button
            type="button"
            onClick={currentStep === 4 ? submitListing : nextStep}
            disabled={isSubmitting}
            className="flex items-center px-8 py-2.5 bg-[#0a5c48] text-white rounded-full font-semibold hover:bg-[#084838] transition-colors shadow-sm disabled:opacity-70"
          >
            {currentStep === 4 ? (isSubmitting ? 'Submitting...' : 'Publish Listing') : (
              <>
                {currentStep === 1 ? 'Continue to User Info' : currentStep === 2 ? 'Continue to Details' : 'Review Manifest'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
          </>
        )}

      </div>
    </div>,
    document.body
  );
};

export default LotImportModal;
