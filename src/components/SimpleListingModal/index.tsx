"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSession, signIn } from 'next-auth/react';
import { useAppSelector } from '../../store';
import { motion, AnimatePresence } from '../../lib/motion';
import {
  ChevronDown, X, UploadCloud, CheckCircle2,
  Package, MapPin, DollarSign, FileText, Image as ImageIcon, ShieldCheck, Shield,
  Edit3, ArrowRight, Eye, Info, AlertCircle, LogIn
} from 'lucide-react';
import Select from 'react-select';
import { z } from 'zod';
import { validateImageUpload, validateFileUpload } from '../../lib/security/fileUploadValidator';
import { sanitizeInput } from '../../lib/security/sanitizer';
import { authService } from '../../services/authService';

// Security regex patterns for threat detection (XSS, SQLi, CRLF, Path Traversal, Command Injection)
const XSS_PAYLOAD_REGEX = /<[^>]*>|javascript\s*:|data\s*:\s*text\/html|vbscript\s*:|\bon\w+\s*=/i;
const SQLI_PAYLOAD_REGEX = /(\b(union(\s+all)?|select|insert|update|delete|drop|truncate|exec|execute|declare|cast)\b.*\b(from|into|table|database)\b)|(--|\/\*|\*\/|;\s*$)/i;
const PATH_TRAVERSAL_REGEX = /(\.\.[\/\\]|\0|%00)/;
const CRLF_INJECTION_REGEX = /[\r\n]/;

/**
 * Checks a string field for potential cyber attack payloads.
 * Returns an error message if an attack signature is detected, or null if safe.
 */
function detectCyberAttackPayload(val: string, allowNewlines: boolean = false): string | null {
  if (!val || typeof val !== 'string') return null;

  if (!allowNewlines && CRLF_INJECTION_REGEX.test(val)) {
    return "Line breaks and CRLF control characters are strictly prohibited in this field.";
  }

  if (PATH_TRAVERSAL_REGEX.test(val)) {
    return "Path traversal sequences and null bytes are strictly prohibited.";
  }

  if (XSS_PAYLOAD_REGEX.test(val)) {
    return "Security alert: HTML tags, script tags, and JavaScript execution payloads are strictly prohibited.";
  }

  if (SQLI_PAYLOAD_REGEX.test(val)) {
    return "Security alert: SQL injection characters and keywords are strictly prohibited.";
  }

  return null;
}

const listingFormSchema = z.object({
  fullName: z.string().max(100, "Full Name cannot exceed 100 characters").refine(val => !detectCyberAttackPayload(val), {
    message: "Invalid characters detected in Full Name"
  }).optional(),
  email: z.string().max(100, "Email cannot exceed 100 characters").refine(val => !val || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim()), {
    message: "Please enter a valid email address"
  }).optional(),
  location: z.string().max(150, "Location cannot exceed 150 characters").refine(val => !detectCyberAttackPayload(val), {
    message: "Invalid characters detected in Location"
  }).optional(),

  productName: z.string()
    .min(2, "Product Name must be at least 2 characters")
    .max(200, "Product Name cannot exceed 200 characters")
    .refine(val => !detectCyberAttackPayload(val), {
      message: "Security alert: HTML tags, scripts, or injection payloads are strictly prohibited in Product Name"
    }),

  category: z.string()
    .min(1, "Product Category is required")
    .max(100, "Category cannot exceed 100 characters")
    .refine(val => val !== '-- Select Category --' && val !== '', "Please select a category")
    .refine(val => !detectCyberAttackPayload(val), "Invalid category value"),

  subCategory: z.string()
    .min(1, "Subcategory is required")
    .max(100, "Subcategory cannot exceed 100 characters")
    .refine(val => val !== '-- Select Subcategory --' && val !== '', "Please select a subcategory")
    .refine(val => !detectCyberAttackPayload(val), "Invalid subcategory value"),

  brandName: z.string()
    .max(100, "Brand Name cannot exceed 100 characters")
    .refine(val => !detectCyberAttackPayload(val), "Invalid characters detected in Brand Name")
    .optional(),

  modelNo: z.string()
    .max(100, "Model Number cannot exceed 100 characters")
    .refine(val => !detectCyberAttackPayload(val), "Invalid characters detected in Model Number")
    .optional(),

  country: z.string()
    .min(1, "Manufacturing Country is required")
    .max(100, "Country cannot exceed 100 characters")
    .refine(val => val !== '-- Select Country --' && val !== '', "Please select a country")
    .refine(val => !detectCyberAttackPayload(val), "Invalid country selection"),

  year: z.string()
    .refine(val => {
      if (!val) return true;
      if (!/^\d{4}$/.test(val)) return false;
      const yr = parseInt(val, 10);
      return yr >= 1900 && yr <= new Date().getFullYear() + 1;
    }, "Please enter a valid 4-digit manufacturing year between 1900 and next year")
    .optional(),

  dimensions: z.string()
    .max(100, "Dimensions cannot exceed 100 characters")
    .refine(val => !detectCyberAttackPayload(val), "Invalid characters detected in Dimensions")
    .optional(),

  expiry: z.string()
    .refine(val => {
      if (!val) return true;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;
      const d = new Date(val);
      const yr = d.getFullYear();
      return !isNaN(d.getTime()) && yr >= 2000 && yr <= 2100;
    }, "Please select a valid expiry date")
    .optional(),

  quantity: z.string()
    .min(1, "Quantity is required")
    .max(9, "Quantity exceeds allowable limit")
    .refine(val => /^[1-9]\d{0,7}$/.test(val), "Quantity must be a positive whole integer")
    .refine(val => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 1 && num <= 10000000;
    }, "Quantity must be between 1 and 10,000,000"),

  currency: z.string()
    .min(1, "Currency is required")
    .max(50, "Currency value too long")
    .refine(val => !detectCyberAttackPayload(val), "Invalid currency selection"),

  msrp: z.string()
    .min(1, "Original MSRP Price is required")
    .max(12, "Price exceeds allowable digits")
    .refine(val => /^\d{1,8}(\.\d{1,2})?$/.test(val), "Price must be a valid positive number with up to 2 decimal places")
    .refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && isFinite(num) && num > 0 && num <= 100000000;
    }, "Original MSRP must be between 0.01 and 100,000,000"),

  liquidatingPrice: z.string()
    .min(1, "Liquidating Price is required")
    .max(12, "Price exceeds allowable digits")
    .refine(val => /^\d{1,8}(\.\d{1,2})?$/.test(val), "Price must be a valid positive number with up to 2 decimal places")
    .refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && isFinite(num) && num > 0 && num <= 100000000;
    }, "Liquidating price must be between 0.01 and 100,000,000"),

  excludedCountries: z.array(
    z.string().max(100).refine(c => !detectCyberAttackPayload(c), "Invalid excluded country name")
  ).max(300, "Too many excluded countries").optional(),

  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(3000, "Description cannot exceed 3000 characters")
    .refine(val => !detectCyberAttackPayload(val, true), "Security alert: Scripts, HTML tags, or SQL injection payloads are strictly prohibited in Description"),

  reasonToSell: z.string()
    .min(1, "Reason to Sell is required")
    .max(100, "Reason to Sell cannot exceed 100 characters")
    .refine(val => !detectCyberAttackPayload(val), "Invalid Reason to Sell value"),

  hasWarranty: z.boolean().optional(),
  warranty: z.string()
    .max(200, "Warranty description cannot exceed 200 characters")
    .refine(val => !detectCyberAttackPayload(val), "Invalid characters in Warranty description")
    .optional(),

  certificate: z.boolean().optional(),
  imagesUploaded: z.boolean().refine(val => val === true, "At least one product image is required")
}).refine(data => {
  const liq = parseFloat(data.liquidatingPrice);
  const msrp = parseFloat(data.msrp);
  if (isNaN(liq) || isNaN(msrp)) return true;
  return liq < msrp;
}, {
  message: "Liquidating price must be strictly below the Original / Retail MSRP Price",
  path: ["liquidatingPrice"]
}).refine(data => {
  const liq = parseFloat(data.liquidatingPrice);
  const msrp = parseFloat(data.msrp);
  if (isNaN(liq) || isNaN(msrp) || msrp <= 0) return true;
  const discountPercent = ((msrp - liq) / msrp) * 100;
  return discountPercent >= 39.999;
}, {
  message: "Liquidating price must have at least a 40% discount off Original MSRP",
  path: ["liquidatingPrice"]
});

interface SimpleListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultCategoryOptions = [
  { value: 'Automation & Control', label: 'Automation & Control' },
  { value: 'Electrical Parts', label: 'Electrical Parts' },
  { value: 'Mechanical Parts', label: 'Mechanical Parts' },
  { value: 'Building Materials', label: 'Building Materials' },
  { value: 'Power tools', label: 'Power tools' },
  { value: 'Hand tools', label: 'Hand tools' },
  { value: 'PPE', label: 'PPE & Safety' },
  { value: 'ICT', label: 'ICT & Enterprise Servers' },
  { value: 'CONSUMER ELECTRONICS', label: 'Consumer Electronics' }
];

const staticSubCategoryOptions: Record<string, { value: string; label: string }[]> = {
  'Automation & Control': [
    { value: 'PLC Modules & Controllers', label: 'PLC Modules & Controllers' },
    { value: 'Sensors & Encoders', label: 'Sensors & Encoders' },
    { value: 'Drives & VFDs', label: 'Drives & VFDs' },
    { value: 'HMI Panels & Displays', label: 'HMI Panels & Displays' },
    { value: 'Relays & Contactors', label: 'Relays & Contactors' },
  ],
  'Electrical Parts': [
    { value: 'Circuit Breakers & Fuses', label: 'Circuit Breakers & Fuses' },
    { value: 'Transformers & Power Supplies', label: 'Transformers & Power Supplies' },
    { value: 'Switches & Sockets', label: 'Switches & Sockets' },
    { value: 'Cables, Wires & Accessories', label: 'Cables, Wires & Accessories' },
    { value: 'Lighting & Fittings', label: 'Lighting & Fittings' },
  ],
  'Mechanical Parts': [
    { value: 'Bearings & Seals', label: 'Bearings & Seals' },
    { value: 'Pumps, Valves & Fittings', label: 'Pumps, Valves & Fittings' },
    { value: 'Pneumatics & Hydraulics', label: 'Pneumatics & Hydraulics' },
    { value: 'Gears, Motors & Actuators', label: 'Gears, Motors & Actuators' },
    { value: 'Fasteners & Hardware', label: 'Fasteners & Hardware' },
  ],
  'Power tools': [
    { value: 'Cordless Kits', label: 'Cordless Kits' },
    { value: 'Drills & Drivers', label: 'Drills & Drivers' },
    { value: 'Rotary Hammers', label: 'Rotary Hammers' },
    { value: 'Saws & Grinders', label: 'Saws & Grinders' },
  ],
  'ICT': [
    { value: 'Enterprise Servers', label: 'Enterprise Servers' },
    { value: 'Networking & Switches', label: 'Networking & Switches' },
    { value: 'Storage & Drives', label: 'Storage & Drives' },
  ],
};

const defaultSubCategoryOptions = [
  { value: 'General Components', label: 'General Components' },
  { value: 'Industrial Hardware', label: 'Industrial Hardware' },
  { value: 'Spare Parts & Accessories', label: 'Spare Parts & Accessories' },
];

const countryOptions = [
  { value: 'United States', label: 'United States' },
  { value: 'Germany', label: 'Germany' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'China', label: 'China' },
  { value: 'Japan', label: 'Japan' },
  { value: 'India', label: 'India' },
];

const currencyOptions = [
  { value: 'USD - US Dollar', label: 'USD - US Dollar' },
  { value: 'AED - UAE Dirham', label: 'AED - UAE Dirham' },
  { value: 'SAR - Saudi Riyal', label: 'SAR - Saudi Riyal' },
  { value: 'EUR - Euro', label: 'EUR - Euro' },
  { value: 'GBP - British Pound', label: 'GBP - British Pound' },
];

const excludedCountriesOptions = [
  { value: 'None (Worldwide)', label: 'None (Worldwide)' },
  { value: 'Russia', label: 'Russia' },
  { value: 'Iran', label: 'Iran' },
  { value: 'North Korea', label: 'North Korea' },
  { value: 'Syria', label: 'Syria' },
  { value: 'Cuba', label: 'Cuba' },
];

const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: '0.75rem',
    border: state.isDisabled
      ? '1px dashed #d1d5db'
      : state.isFocused
        ? '2px solid #0a5c48'
        : '1px solid #d1d5db',
    boxShadow: 'none',
    padding: '3px',
    backgroundColor: state.isDisabled ? '#f9fafb' : 'white',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    opacity: state.isDisabled ? 0.7 : 1,
    '&:hover': {
      border: state.isDisabled
        ? '1px dashed #d1d5db'
        : state.isFocused
          ? '2px solid #0a5c48'
          : '1px solid #9ca3af'
    }
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#0a5c48' : state.isFocused ? '#e0f0e9' : 'white',
    color: state.isSelected ? 'white' : '#111827',
  })
};

const DRAFT_STORAGE_KEY = 'simple_listing_draft_v1';

export default function SimpleListingModal({ isOpen, onClose }: SimpleListingModalProps) {
  const { data: session, status } = useSession();
  const { categories: reduxCategories } = useAppSelector((state) => state.categories);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Extract logged-in vendor ID from session
  const userObj = (session?.user || {}) as any;
  const vendorId = 
    userObj.vendor_id || 
    (typeof window !== 'undefined' ? (localStorage.getItem('vendor_id') || '') : '');
  const isAuthenticated = Boolean(session?.user && vendorId);

  // Auto-resolve vendor ID from backend if logged in but vendorId is pending in current state
  useEffect(() => {
    if (isOpen && session?.user && !vendorId) {
      const email = (session.user as any)?.email;
      if (email) {
        authService.getProfile(email).then((res: any) => {
          if (res?.success && res.data) {
            const vId = res.data.vendor_id || res.data.raw_vendor_id;
            if (vId && typeof window !== 'undefined') {
              localStorage.setItem('vendor_id', String(vId));
            }
          }
        }).catch(() => {});
      }
    }
  }, [isOpen, session, vendorId]);

  const [formData, setFormData] = useState({
    productName: '', category: '-- Select Category --', subCategory: '', brandName: '', modelNo: '',
    country: '-- Select Country --', year: '', dimensions: '', expiry: '',
    quantity: '', currency: 'USD - US Dollar', liquidatingPrice: '', msrp: '', excludedCountries: [] as string[],
    description: '', reasonToSell: 'Surplus Inventory', warranty: 'No', hasWarranty: false, warrantyDocument: null as File | null,
    certificate: false, certificateDocument: null as File | null, imagesUploaded: false,
    images: [] as File[]
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  // Derive dynamic categories from Redux store, falling back to localStorage cache or default
  const availableCategories = useMemo(() => {
    if (reduxCategories && reduxCategories.length > 0) {
      return reduxCategories;
    }
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('surplus_categories_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Ignore cache parse error
      }
    }
    return [];
  }, [reduxCategories]);

  // Dynamic category options for Select
  const categoryOptions: { value: string; label: string }[] = useMemo(() => {
    if (availableCategories.length > 0) {
      return availableCategories.map((c: any) => {
        const name = typeof c === 'string' ? c : (c.name || c.title || String(c));
        return { value: name, label: name };
      });
    }
    return defaultCategoryOptions;
  }, [availableCategories]);

  // Subcategory is only available when user has selected a category
  const isCategorySelected = Boolean(
    formData.category &&
    formData.category !== '-- Select Category --' &&
    formData.category !== ''
  );

  // Dynamic subcategory options derived based on the selected category
  const dynamicSubCategoryOptions: { value: string; label: string }[] = useMemo(() => {
    if (!isCategorySelected) {
      return [];
    }

    // 1. Check in dynamic categories from Redux / cache
    const matchedCategory = availableCategories.find(
      (c: any) => c.name?.toLowerCase().trim() === formData.category?.toLowerCase().trim()
    );

    if (matchedCategory) {
      const subs = matchedCategory.subcategories || matchedCategory.sub_categories || [];
      if (subs.length > 0) {
        return subs.map((s: any) => {
          const subName = typeof s === 'string' ? s : (s.name || s.title || String(s));
          return { value: subName, label: subName };
        });
      }
    }

    // 2. Fallback to static category subcategories map if present
    if (staticSubCategoryOptions[formData.category]) {
      return staticSubCategoryOptions[formData.category];
    }

    return defaultSubCategoryOptions;
  }, [isCategorySelected, formData.category, availableCategories]);

  // Real-time pricing validation and discount calculation
  const pricingAnalysis = useMemo(() => {
    const liq = parseFloat(formData.liquidatingPrice);
    const msrp = parseFloat(formData.msrp);
    const publicPrice = !isNaN(liq) && liq > 0 ? (liq * 1.10).toFixed(2) : '';
    const publicMarkup = !isNaN(liq) && liq > 0 ? (liq * 0.10).toFixed(2) : '';

    if (isNaN(msrp) || msrp <= 0) {
      return {
        hasMsrp: false,
        hasLiq: !isNaN(liq) && liq > 0,
        discountPercent: 0,
        maxAllowedPrice: '0.00',
        publicPrice,
        publicMarkup,
        isBelowMsrp: true,
        meetsMinDiscount: true,
        error: '',
      };
    }

    const maxAllowedPrice = (msrp * 0.6).toFixed(2);

    if (isNaN(liq) || liq <= 0) {
      return {
        hasMsrp: true,
        hasLiq: false,
        discountPercent: 0,
        maxAllowedPrice,
        publicPrice: '',
        publicMarkup: '',
        isBelowMsrp: true,
        meetsMinDiscount: true,
        error: '',
      };
    }

    const discountPercent = Number((((msrp - liq) / msrp) * 100).toFixed(1));
    const isBelowMsrp = liq < msrp;
    const meetsMinDiscount = isBelowMsrp && discountPercent >= 39.99;

    let error = '';
    if (!isBelowMsrp) {
      error = 'Liquidating price must be strictly below the Original / Retail MSRP Price.';
    } else if (!meetsMinDiscount) {
      error = `Liquidating price must have at least a 40% discount off MSRP (Max allowed: ${maxAllowedPrice}). Current discount: ${discountPercent}%.`;
    }

    return {
      hasMsrp: true,
      hasLiq: true,
      discountPercent,
      maxAllowedPrice,
      publicPrice,
      publicMarkup,
      isBelowMsrp,
      meetsMinDiscount,
      error,
    };
  }, [formData.liquidatingPrice, formData.msrp]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setFormData(prev => ({
            ...prev,
            ...parsed,
            msrp: parsed.msrp !== undefined ? parsed.msrp : (parsed.previousPrice || ''),
            hasWarranty: parsed.hasWarranty !== undefined
              ? parsed.hasWarranty
              : Boolean(parsed.warranty && parsed.warranty !== 'No' && parsed.warranty !== ''),
            images: [],
          }));
        }
      } catch {
        // Ignore cache parse error
      }
    }
  }, []);

  // Autosave draft whenever form data changes
  useEffect(() => {
    if (typeof window !== 'undefined' && mounted) {
      try {
        const { images, warrantyDocument, certificateDocument, ...serializableData } = formData;
        const hasContent = Boolean(
          serializableData.productName ||
          (serializableData.category && serializableData.category !== '-- Select Category --') ||
          serializableData.subCategory ||
          serializableData.brandName ||
          serializableData.modelNo ||
          serializableData.quantity ||
          serializableData.liquidatingPrice ||
          serializableData.msrp ||
          serializableData.description
        );

        if (hasContent) {
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(serializableData));
        }
      } catch {
        // Ignore localStorage error
      }
    }
  }, [formData, mounted]);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);

      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');

      // Stop Lenis background scrolling while modal is open
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        (window as any).__lenis.stop();
      }

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
        if (typeof window !== 'undefined' && (window as any).__lenis) {
          (window as any).__lenis.start();
        }
      };
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
    }
  }, [isOpen]);

  const handleResetForm = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
    setFormData({
      productName: '', category: '-- Select Category --', subCategory: '', brandName: '', modelNo: '',
      country: '-- Select Country --', year: '', dimensions: '', expiry: '',
      quantity: '', currency: 'USD - US Dollar', liquidatingPrice: '', msrp: '', excludedCountries: [],
      description: '', reasonToSell: 'Surplus Inventory', warranty: 'No', hasWarranty: false, warrantyDocument: null,
      certificate: false, certificateDocument: null, imagesUploaded: false,
      images: [] as File[]
    });
    setFormErrors({});
    setIsReviewMode(false);
  };

  const hasAnyData = Boolean(
    formData.productName ||
    (formData.category && formData.category !== '-- Select Category --') ||
    formData.subCategory ||
    formData.brandName ||
    formData.modelNo ||
    formData.quantity ||
    formData.liquidatingPrice ||
    formData.msrp ||
    formData.description
  );

  const handleInputChange = (field: string, value: any) => {
    // Prototype pollution guard
    if (field === '__proto__' || field === 'constructor' || field === 'prototype') {
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateAll = () => {
    const result = listingFormSchema.safeParse(formData);
    const newErrors: Record<string, string> = {};

    if (!result.success) {
      result.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
    }

    // Additional strict check for pricing constraints
    const liq = parseFloat(formData.liquidatingPrice);
    const msrp = parseFloat(formData.msrp);
    if (!isNaN(liq) && !isNaN(msrp) && msrp > 0) {
      if (liq >= msrp) {
        newErrors.liquidatingPrice = 'Liquidating price must be strictly below the Original / Retail MSRP Price';
      } else {
        const discount = ((msrp - liq) / msrp) * 100;
        if (discount < 39.99) {
          const maxAllowed = (msrp * 0.6).toFixed(2);
          newErrors.liquidatingPrice = `Liquidating price must have at least a 40% discount off Original MSRP (Max allowed: ${maxAllowed})`;
        }
      }
    }

    // Check if certificate toggle is enabled, document upload is required
    if (formData.certificate) {
      if (!formData.certificateDocument) {
        newErrors.certificateDocument = 'Please upload the 3rd party certificate / test report document';
      } else {
        const v = validateFileUpload(formData.certificateDocument, {
          maxSizeBytes: 10 * 1024 * 1024,
          allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
          preventDoubleExtension: true,
        });
        if (!v.valid) {
          newErrors.certificateDocument = v.error || 'Invalid or insecure certificate document.';
        }
      }
    }

    // Check warranty document security if provided
    if (formData.hasWarranty && formData.warrantyDocument) {
      const v = validateFileUpload(formData.warrantyDocument, {
        maxSizeBytes: 10 * 1024 * 1024,
        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
        preventDoubleExtension: true,
      });
      if (!v.valid) {
        newErrors.warrantyDocument = v.error || 'Invalid or insecure warranty document.';
      }
    }

    // Deep check uploaded product images for security
    if (!formData.images || formData.images.length === 0) {
      newErrors.imagesUploaded = 'At least one product image is required';
    } else if (formData.images.length > 10) {
      newErrors.imagesUploaded = 'Maximum 10 product images are allowed';
    } else {
      for (const img of formData.images) {
        const v = validateImageUpload(img);
        if (!v.valid) {
          newErrors.imagesUploaded = v.error || 'Invalid or insecure image file.';
          break;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      scrollToModalError(newErrors);
      return false;
    }

    setFormErrors({});
    return true;
  };

  const scrollToModalError = (errors: Record<string, string>) => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return;

    // Use a short delay so React can commit any error text to the DOM
    setTimeout(() => {
      const container = modalScrollRef.current;
      if (!container) return;

      // Find the first field container or input element with error inside modalScrollRef ONLY
      let targetEl: HTMLElement | null = null;
      for (const key of errorKeys) {
        const el = container.querySelector<HTMLElement>(`[data-field="${key}"]`) ||
          container.querySelector<HTMLElement>(`[name="${key}"]`);
        if (el) {
          targetEl = el;
          break;
        }
      }

      // Fallback to first error text element inside modalScrollRef ONLY
      if (!targetEl) {
        targetEl = container.querySelector<HTMLElement>('.modal-field-error, .text-red-500');
      }

      if (targetEl) {
        // Calculate relative position strictly inside the modal container
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const currentScroll = container.scrollTop;
        const relativeTop = targetRect.top - containerRect.top + currentScroll;

        // Scroll ONLY the modal container itself, never window or background page
        container.scrollTo({
          top: Math.max(0, relativeTop - 30),
          behavior: 'smooth',
        });

        // Focus the input if available, preventing browser window scroll
        const inputEl = targetEl.tagName === 'INPUT' || targetEl.tagName === 'SELECT' || targetEl.tagName === 'TEXTAREA'
          ? targetEl
          : targetEl.querySelector<HTMLElement>('input, select, textarea');
        if (inputEl && typeof inputEl.focus === 'function') {
          inputEl.focus({ preventScroll: true });
        }
      }
    }, 50);
  };

  const handleProceedToReview = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      setSubmitError('You must be signed in as a registered vendor to submit a listing. Please sign in to continue.');
      return;
    }
    if (!validateAll()) {
      return;
    }
    setIsReviewMode(true);
  };

  const handleBackToEdit = () => {
    setIsReviewMode(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      setSubmitError('You must be signed in as a registered vendor to submit a listing. Please sign in to continue.');
      setIsReviewMode(false);
      return;
    }
    if (!validateAll()) {
      setIsReviewMode(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const data = new FormData();

      // Vendor identification taken directly from the authenticated session
      data.append('vendor_id', String(vendorId));

      // Product info
      data.append('product_name', sanitizeInput(formData.productName));
      data.append('category', sanitizeInput(formData.category));
      data.append('sub_category', sanitizeInput(formData.subCategory || ''));
      data.append('brand_name', sanitizeInput(formData.brandName || ''));
      data.append('model_no', sanitizeInput(formData.modelNo || ''));

      // Origin & Specs
      data.append('country', sanitizeInput(formData.country));
      if (formData.year) {
        data.append('manufacturing_year', sanitizeInput(formData.year));
      }
      data.append('dimensions', sanitizeInput(formData.dimensions || ''));
      if (formData.expiry) {
        data.append('expiry', sanitizeInput(formData.expiry));
      }

      // Pricing & Quantity
      data.append('quantity', sanitizeInput(formData.quantity));
      data.append('currency', sanitizeInput(formData.currency.substring(0, 3)));
      data.append('liquidating_price', sanitizeInput(formData.liquidatingPrice));
      data.append('msrp', sanitizeInput(formData.msrp));
      data.append('offer', String(pricingAnalysis.discountPercent || 0));
      data.append('excluded_countries', JSON.stringify(formData.excludedCountries.map(c => sanitizeInput(c))));

      // Raw data JSON payload
      const { images, warrantyDocument, certificateDocument, ...cleanPayload } = formData;
      data.append('raw_data', JSON.stringify({
        vendor_id: vendorId,
        ...cleanPayload,
        offer: pricingAnalysis.discountPercent || 0,
        warranty_document_name: formData.warrantyDocument?.name || null,
        certificate_document_name: formData.certificateDocument?.name || null,
      }));

      // Details & Media
      data.append('description', sanitizeInput(formData.description));
      data.append('reason_to_sell', sanitizeInput(formData.reasonToSell));
      data.append('warranty', formData.hasWarranty ? sanitizeInput(formData.warranty || 'Yes') : 'No');
      if (formData.hasWarranty && formData.warrantyDocument) {
        data.append('warranty_document', formData.warrantyDocument);
      }
      data.append('certificate', formData.certificate ? 'true' : 'false');
      if (formData.certificate && formData.certificateDocument) {
        data.append('certificate_document', formData.certificateDocument);
      }

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach(image => {
          data.append('images', image);
        });
      }

      const rawApiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const apiBase = rawApiBase.replace(/\/$/, '');
      const endpoint = apiBase
        ? (apiBase.endsWith('/api') ? `${apiBase}/submit-product-request/` : `${apiBase}/api/submit-product-request/`)
        : '/api/submit-product-request/';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setIsSubmitting(false);
        setIsSuccess(true);
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem(DRAFT_STORAGE_KEY);
          } catch {
            // Ignore
          }
        }
      } else {
        let errorMessage = 'Failed to submit listing. Please try again.';
        try {
          const errData = await response.json();
          errorMessage = errData.message || JSON.stringify(errData) || errorMessage;
        } catch {
          errorMessage = `Server Error (${response.status}): ${response.statusText}`;
        }
        setSubmitError(errorMessage);
        setIsSubmitting(false);
      }
    } catch {
      setSubmitError('Network error. Make sure the backend server is reachable.');
      setIsSubmitting(false);
    }
  };

  const labelClass = "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5";
  const inputClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-all outline-none text-gray-900 text-sm shadow-xs";
  const selectClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-all outline-none text-gray-900 text-sm appearance-none shadow-xs";
  const errorClass = "text-red-500 text-xs font-semibold mt-1";

  const renderError = (field: string) => {
    return formErrors[field] ? (
      <p className={`${errorClass} modal-field-error`} data-error-field={field}>
        {formErrors[field]}
      </p>
    ) : null;
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/60 backdrop-blur-sm"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Modal Container */}
          <div
            data-lenis-prevent
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col h-[90vh] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center p-12 text-center my-auto min-h-[420px]">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5 text-[#0a5c48]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                  Listing Submitted Successfully!
                </h3>
                <p className="text-gray-600 text-base mb-8 max-w-md">
                  Your surplus inventory listing has been received. Our marketplace team will verify the specifications and publish it shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    onClose();
                  }}
                  className="px-8 py-3 bg-[#0a5c48] hover:bg-[#084838] text-white rounded-full font-bold text-sm transition-all shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : isReviewMode ? (
              <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
                {/* Review Header */}
                <div className="flex items-center justify-between px-6 py-4 md:py-5 border-b border-gray-100 bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0a5c48] flex items-center justify-center font-bold">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                        Review Your Listing Details
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                        Verify all specifications and pricing before publishing. You can edit any detail.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Review Scrollable Body */}
                <div
                  data-lenis-prevent
                  className="p-6 md:p-8 overflow-y-auto flex-1 min-h-0 bg-[#fafbfa] space-y-6 overscroll-contain"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">
                      {submitError}
                    </div>
                  )}

                  {/* Notice Banner with Quick Edit button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl gap-3">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-[#0a5c48] shrink-0" />
                      <div className="text-sm font-medium text-emerald-950">
                        Listing as Vendor ID <strong className="font-mono text-[#0a5c48]">#{vendorId}</strong>. Click <strong>Confirm & Submit Listing</strong> to publish.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleBackToEdit}
                      className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-[#0a5c48] border border-emerald-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Details
                    </button>
                  </div>

                  {/* Section 1: Product Specifications Summary */}
                  <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0a5c48] flex items-center justify-center">
                          <Package className="w-4 h-4" />
                        </div>
                        <h4 className="text-base font-bold text-gray-900">
                          1. Product Details
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleBackToEdit}
                        className="text-xs text-[#0a5c48] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="md:col-span-2">
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Product Title / Name</span>
                        <p className="font-bold text-gray-900 text-base">{formData.productName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Category</span>
                        <span className="inline-block px-3 py-1 bg-emerald-50 text-[#0a5c48] font-semibold rounded-lg text-xs">
                          {formData.category}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Subcategory</span>
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 font-semibold rounded-lg text-xs">
                          {formData.subCategory || 'General'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Brand Name</span>
                        <p className="font-medium text-gray-800">{formData.brandName || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Model / Part Number</span>
                        <p className="font-medium text-gray-800">{formData.modelNo || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Origin & Specifications Summary */}
                  <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <h4 className="text-base font-bold text-gray-900">
                          2. Origin & Specifications
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleBackToEdit}
                        className="text-xs text-[#0a5c48] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Manufacturing Country</span>
                        <p className="font-medium text-gray-900">{formData.country}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Manufacturing Year</span>
                        <p className="font-medium text-gray-900">{formData.year || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Dimensions</span>
                        <p className="font-medium text-gray-900">{formData.dimensions || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Expiry Date</span>
                        <p className="font-medium text-gray-900">{formData.expiry || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Pricing & Liquidation Terms Summary */}
                  <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <h4 className="text-base font-bold text-gray-900">
                          3. Pricing & Quantity
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleBackToEdit}
                        className="text-xs text-[#0a5c48] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Available Quantity</span>
                        <p className="text-xl font-extrabold text-gray-900">
                          {formData.quantity} <span className="text-sm font-normal text-gray-500">Units</span>
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Original MSRP</span>
                        <p className="text-xl font-bold text-gray-400 line-through">
                          {formData.currency.substring(0, 3)} {parseFloat(formData.msrp || '0').toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Your Surplus Price</span>
                        <p className="text-xl font-extrabold text-[#0a5c48]">
                          {formData.currency.substring(0, 3)} {parseFloat(formData.liquidatingPrice || '0').toFixed(2)}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md">
                          {pricingAnalysis.discountPercent}% OFF MSRP
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Public Listing Price</span>
                        <p className="text-xl font-extrabold text-blue-700">
                          {formData.currency.substring(0, 3)} {pricingAnalysis.publicPrice || (parseFloat(formData.liquidatingPrice || '0') * 1.10).toFixed(2)}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-semibold rounded-md">
                          +10% charge added
                        </span>
                      </div>
                    </div>

                    {/* Notice */}
                    <div className="flex items-center gap-2 p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl text-blue-900 text-xs font-medium">
                      <Info className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>
                        <strong>Public Listing Notice:</strong> A +10% charge is added when listing to the public. You will receive your agreed surplus price of <strong>{formData.currency.substring(0, 3)} {parseFloat(formData.liquidatingPrice || '0').toFixed(2)}</strong> per unit.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Total Liquidation Value</span>
                        <p className="font-bold text-gray-900 text-base">
                          {formData.currency.substring(0, 3)} {(parseFloat(formData.liquidatingPrice || '0') * parseFloat(formData.quantity || '0')).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Excluded Export Countries</span>
                        <p className="font-medium text-gray-800">
                          {formData.excludedCountries && formData.excludedCountries.length > 0
                            ? formData.excludedCountries.join(', ')
                            : 'None (Worldwide Export Allowed)'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Description & Media Summary */}
                  <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <h4 className="text-base font-bold text-gray-900">
                          4. Description & Media
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleBackToEdit}
                        className="text-xs text-[#0a5c48] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Reason for Liquidation</span>
                        <p className="font-semibold text-gray-900">{formData.reasonToSell}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Description & Technical Condition</span>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                          {formData.description}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Warranty</span>
                          <p className="font-medium text-gray-900 flex items-center gap-1.5">
                            {formData.hasWarranty ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                Yes {formData.warranty && formData.warranty !== 'Yes' && formData.warranty !== 'No' ? `(${formData.warranty})` : ''}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                No Warranty
                              </span>
                            )}
                          </p>
                          {formData.hasWarranty && formData.warrantyDocument && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#0a5c48] font-medium bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200 w-fit">
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate max-w-[200px]" title={formData.warrantyDocument.name}>
                                {formData.warrantyDocument.name}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Quality Certificate</span>
                          <p className="font-medium text-gray-900">
                            {formData.certificate ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                Certificate Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                None
                              </span>
                            )}
                          </p>
                          {formData.certificate && formData.certificateDocument && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#0a5c48] font-medium bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200 w-fit">
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate max-w-[200px]" title={formData.certificateDocument.name}>
                                {formData.certificateDocument.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Uploaded Images Preview */}
                      {formData.images && formData.images.length > 0 && (
                        <div>
                          <span className="text-gray-500 text-xs uppercase font-bold block mb-2">
                            Uploaded Product Images ({formData.images.length})
                          </span>
                          <div className="flex flex-wrap gap-3">
                            {formData.images.map((file, idx) => (
                              <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-xs">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Product preview ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Review Footer Actions */}
                <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
                  <button
                    type="button"
                    onClick={handleBackToEdit}
                    className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-bold text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Details</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      disabled={isSubmitting}
                      className="px-8 py-2.5 bg-[#0a5c48] hover:bg-[#084939] text-white font-bold text-sm rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-70 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isSubmitting ? 'Submitting Listing...' : 'Confirm & Submit Listing'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProceedToReview} className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 md:py-5 border-b border-gray-100 bg-white shrink-0">
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                      Simple Inventory Listing
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                      Submit your surplus inventory listing in one simple form.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {hasAnyData && (
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors px-2.5 py-1 rounded-lg hover:bg-red-50 cursor-pointer"
                        title="Clear all fields"
                      >
                        Clear Form
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Form Body - Single Scrollable Form with Clear Sections */}
                <div
                  ref={modalScrollRef}
                  data-lenis-prevent
                  className="p-6 md:p-8 overflow-y-auto flex-1 min-h-0 bg-[#fafbfa] space-y-6 overscroll-contain"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  {/* Vendor Authentication Guard Status Banner */}
                  {!isAuthenticated ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 text-xs sm:text-sm shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                          <span className="font-bold block text-gray-900">Sign In Required</span>
                          <span className="text-amber-700 text-xs">You must be logged in as a registered vendor to publish listings. Your vendor ID will be automatically attached.</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => signIn()}
                        className="px-4 py-2 bg-[#0a5c48] hover:bg-[#084838] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                      >
                        <LogIn className="w-3.5 h-3.5" /> Sign In as Vendor
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-xs text-[#0a5c48]">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#0a5c48] shrink-0" />
                        <span>Submitting as Verified Vendor: <strong className="font-mono text-gray-900">ID #{vendorId}</strong></span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[11px]">
                        Verified Vendor
                      </span>
                    </div>
                  )}

                  {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">
                      {submitError}
                    </div>
                  )}

                  {/* Section 1: Product Information */}
                  <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0a5c48] flex items-center justify-center">
                        <Package className="w-4 h-4" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900">
                        1. Product Details
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div data-field="productName" className="md:col-span-2">
                        <label className={labelClass}>Product Title / Name *</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="e.g. Siemens SIMATIC S7-1200 PLC CPU Module"
                          value={formData.productName}
                          onChange={e => handleInputChange('productName', e.target.value)}
                        />
                        {renderError('productName')}
                      </div>

                      <div data-field="category">
                        <label className={labelClass}>Product Category *</label>
                        <Select
                          options={categoryOptions}
                          styles={customSelectStyles}
                          value={categoryOptions.find((c: any) => c.value === formData.category) || (formData.category && formData.category !== '-- Select Category --' ? { value: formData.category, label: formData.category } : null)}
                          onChange={(option: any) => {
                            handleInputChange('category', option?.value || '');
                            handleInputChange('subCategory', '');
                          }}
                          placeholder="-- Select Category --"
                          isSearchable
                        />
                        {renderError('category')}
                      </div>

                      <div data-field="subCategory">
                        <label className={labelClass}>Subcategory *</label>
                        <Select
                          isDisabled={!isCategorySelected}
                          options={dynamicSubCategoryOptions}
                          styles={customSelectStyles}
                          value={
                            dynamicSubCategoryOptions.find((s: any) => s.value === formData.subCategory) ||
                            (formData.subCategory && isCategorySelected ? { value: formData.subCategory, label: formData.subCategory } : null)
                          }
                          onChange={(option: any) => handleInputChange('subCategory', option?.value || '')}
                          placeholder={isCategorySelected ? "-- Select Subcategory --" : "Select a category first..."}
                          noOptionsMessage={() => isCategorySelected ? "No subcategories found for this category" : "Please select a category first"}
                          isSearchable
                        />
                        {renderError('subCategory')}
                      </div>

                      <div data-field="brandName">
                        <label className={labelClass}>Brand Name</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="e.g. Siemens, Dell, Bosch"
                          value={formData.brandName}
                          onChange={e => handleInputChange('brandName', e.target.value)}
                        />
                      </div>

                      <div data-field="modelNo">
                        <label className={labelClass}>Model No. / Part Number</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="e.g. 6ES7214-1AG40-0XB0"
                          value={formData.modelNo}
                          onChange={e => handleInputChange('modelNo', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Origin & Specifications */}
                  <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900">
                        2. Origin & Specifications
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div data-field="country">
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

                      <div data-field="year">
                        <label className={labelClass}>Manufacturing Year</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="e.g. 2024"
                          value={formData.year}
                          onChange={e => handleInputChange('year', e.target.value)}
                        />
                        {renderError('year')}
                      </div>

                      <div>
                        <label className={labelClass}>Dimensions (Optional)</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="e.g. 400 x 300 x 150 mm"
                          value={formData.dimensions}
                          onChange={e => handleInputChange('dimensions', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Expiry Date (If applicable)</label>
                        <input
                          type="date"
                          className={inputClass}
                          value={formData.expiry}
                          onChange={e => handleInputChange('expiry', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Pricing & Quantity */}
                  <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900">
                        3. Pricing & Quantity
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div data-field="quantity">
                        <label className={labelClass}>Available Quantity *</label>
                        <input
                          type="number"
                          min="1"
                          className={inputClass}
                          placeholder="e.g. 50"
                          value={formData.quantity}
                          onChange={e => handleInputChange('quantity', e.target.value)}
                        />
                        {renderError('quantity')}
                      </div>

                      <div data-field="currency">
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

                      <div data-field="msrp">
                        <label className={labelClass}>Original / Retail MSRP Price (Per Unit) *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          className={inputClass}
                          placeholder="e.g. 350.00"
                          value={formData.msrp}
                          onChange={e => handleInputChange('msrp', e.target.value)}
                        />
                        {renderError('msrp')}
                      </div>

                      <div data-field="liquidatingPrice">
                        <label className={labelClass}>Liquidating / Surplus Price (Per Unit) *</label>
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            className={`${inputClass} ${pricingAnalysis.hasMsrp && pricingAnalysis.hasLiq && !pricingAnalysis.meetsMinDiscount
                                ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                                : pricingAnalysis.hasMsrp && pricingAnalysis.hasLiq && pricingAnalysis.meetsMinDiscount
                                  ? 'border-emerald-500 focus:ring-emerald-500 bg-emerald-50/20'
                                  : ''
                              } ${pricingAnalysis.hasMsrp ? 'pr-36' : ''} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                            placeholder={
                              pricingAnalysis.hasMsrp
                                ? `Max: ${formData.currency?.split(' ')[0] || 'USD'} ${pricingAnalysis.maxAllowedPrice} (min. 40% off)`
                                : "e.g. 150.00"
                            }
                            value={formData.liquidatingPrice}
                            onChange={e => handleInputChange('liquidatingPrice', e.target.value)}
                          />
                          {pricingAnalysis.hasMsrp && (
                            <button
                              type="button"
                              onClick={() => handleInputChange('liquidatingPrice', pricingAnalysis.maxAllowedPrice)}
                              className="absolute right-2 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                              title="Click to apply suggested max price (40% discount)"
                            >
                              <span>Max: {formData.currency?.split(' ')[0] || 'USD'} {pricingAnalysis.maxAllowedPrice}</span>
                            </button>
                          )}
                        </div>
                        {renderError('liquidatingPrice')}
                      </div>

                      {/* Real-time Discount & Liquidation Verification Pill */}
                      {pricingAnalysis.hasMsrp && pricingAnalysis.hasLiq && (
                        <div className="md:col-span-2">
                          {pricingAnalysis.meetsMinDiscount ? (
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs md:text-sm font-semibold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>
                                Valid Liquidation Price: <strong>{pricingAnalysis.discountPercent}% discount</strong> off MSRP (meets minimum 40% requirement).
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs md:text-sm font-medium">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                              <span>
                                {pricingAnalysis.error}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Public Listing Charge (+10%) Notice */}
                      <div className="md:col-span-2">
                        <div className="flex items-start gap-2.5 p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-blue-900 text-xs md:text-sm">
                          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-bold text-blue-950 block">
                              +10% charge added when listing to public
                            </span>
                            <span className="text-blue-700 text-xs leading-relaxed block">
                              {pricingAnalysis.hasLiq ? (
                                <>
                                  Your surplus payout price is <strong>{formData.currency?.split(' ')[0] || 'USD'} {parseFloat(formData.liquidatingPrice).toFixed(2)}</strong>.
                                  When published to public buyers, it will be listed at <strong>{formData.currency?.split(' ')[0] || 'USD'} {pricingAnalysis.publicPrice}</strong> (+10% charge added to public buyers).
                                </>
                              ) : (
                                <>A +10% charge is automatically added to your surplus price when the listing is published to public buyers.</>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className={labelClass}>Excluded Export Countries (Optional)</label>
                        <Select
                          isMulti
                          options={excludedCountriesOptions}
                          styles={customSelectStyles}
                          value={excludedCountriesOptions.filter(c => formData.excludedCountries.includes(c.value))}
                          onChange={(options: any) => handleInputChange('excludedCountries', options ? options.map((o: any) => o.value) : [])}
                          placeholder="Select countries to exclude from sale..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Details & Media */}
                  <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900">
                        4. Description & Media
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div data-field="description" className="md:col-span-2">
                        <label className={labelClass}>Description & Technical Condition *</label>
                        <textarea
                          rows={4}
                          className={inputClass}
                          placeholder="Describe the product condition, packaging (original box, pallet, sealed), technical specifications, and condition..."
                          value={formData.description}
                          onChange={e => handleInputChange('description', e.target.value)}
                        />
                        {renderError('description')}
                      </div>

                      <div data-field="reasonToSell" className="md:col-span-2">
                        <label className={labelClass}>Reason to Sell *</label>
                        <div className="relative">
                          <select
                            className={selectClass}
                            value={formData.reasonToSell}
                            onChange={e => handleInputChange('reasonToSell', e.target.value)}
                          >
                            <option>Surplus Inventory</option>
                            <option>Overstock Clearance</option>
                            <option>Business Closure</option>
                            <option>Asset Liquidation</option>
                            <option>Canceled Project</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Product Warranty Option - Next row card style matching 3rd Party Certificate */}
                      <div data-field="warranty" className="md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-[#0a5c48]" />
                            <div>
                              <span className="block font-semibold text-gray-900 text-sm">Product Warranty Included</span>
                              <span className="text-xs text-gray-500">Enable if replacement guarantee or manufacturer warranty applies</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-bold text-gray-600">{formData.hasWarranty ? 'Yes' : 'No'}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.hasWarranty}
                                onChange={e => {
                                  const checked = e.target.checked;
                                  handleInputChange('hasWarranty', checked);
                                  if (checked) {
                                    if (!formData.warranty || formData.warranty === 'No') {
                                      handleInputChange('warranty', '30 Days');
                                    }
                                  } else {
                                    handleInputChange('warranty', 'No');
                                    handleInputChange('warrantyDocument', null);
                                  }
                                }}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0a5c48]"></div>
                            </label>
                          </div>
                        </div>

                        {formData.hasWarranty && (
                          <div className="pt-3 mt-3 border-t border-gray-200/70 space-y-3">
                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1.5">Warranty Period / Guarantee *</label>
                              <input
                                type="text"
                                className={inputClass}
                                placeholder="e.g. 30 Days, 90 Days, 1 Year"
                                value={formData.warranty === 'No' ? '' : formData.warranty}
                                onChange={e => handleInputChange('warranty', e.target.value)}
                              />
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {['30 Days', '60 Days', '90 Days', '6 Months', '1 Year'].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => handleInputChange('warranty', preset)}
                                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${formData.warranty === preset
                                      ? 'bg-emerald-50 border-emerald-300 text-[#0a5c48] font-bold'
                                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>

                            {/* Warranty Document Upload Option */}
                            <div className="pt-2 border-t border-gray-200/60">
                              <label className="text-xs font-semibold text-gray-700 block mb-1.5 flex items-center justify-between">
                                <span>Upload Warranty Document (Optional)</span>
                                <span className="text-[11px] font-normal text-gray-400">PDF, JPG, PNG (Max 10MB)</span>
                              </label>

                              {!formData.warrantyDocument ? (
                                <label className="border border-dashed border-gray-300 hover:border-[#0a5c48] bg-white hover:bg-emerald-50/30 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-colors group">
                                  <UploadCloud className="w-4 h-4 text-gray-400 group-hover:text-[#0a5c48]" />
                                  <span className="text-xs font-semibold text-gray-600 group-hover:text-[#0a5c48]">Click to upload warranty document</span>
                                  <input
                                    type="file"
                                    accept=".pdf,image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const validation = validateFileUpload(file, {
                                          maxSizeBytes: 10 * 1024 * 1024,
                                          allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
                                          preventDoubleExtension: true
                                        });
                                        if (!validation.valid) {
                                          setFormErrors(prev => ({ ...prev, warrantyDocument: validation.error || 'Invalid file.' }));
                                        } else {
                                          setFormErrors(prev => {
                                            const copy = { ...prev };
                                            delete copy.warrantyDocument;
                                            return copy;
                                          });
                                          handleInputChange('warrantyDocument', file);
                                        }
                                      }
                                    }}
                                  />
                                </label>
                              ) : (
                                <div className="flex items-center justify-between p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs">
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <FileText className="w-4 h-4 text-[#0a5c48] shrink-0" />
                                    <span className="font-semibold text-gray-800 truncate" title={formData.warrantyDocument.name}>
                                      {formData.warrantyDocument.name}
                                    </span>
                                    <span className="text-gray-400 text-[11px] shrink-0">
                                      ({(formData.warrantyDocument.size / (1024 * 1024)).toFixed(2)} MB)
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleInputChange('warrantyDocument', null)}
                                    className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-white transition-colors cursor-pointer"
                                    title="Remove document"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                              {renderError('warrantyDocument')}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 3rd Party Certificate Option */}
                      <div className="md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-[#0a5c48]" />
                            <div>
                              <span className="block font-semibold text-gray-900 text-sm">3rd Party Certificate Available</span>
                              <span className="text-xs text-gray-500">Check if material test reports or manufacturer calibration certs are available</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-bold text-gray-600">{formData.certificate ? 'Yes' : 'No'}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.certificate}
                                onChange={e => {
                                  const checked = e.target.checked;
                                  handleInputChange('certificate', checked);
                                  if (!checked) {
                                    handleInputChange('certificateDocument', null);
                                    setFormErrors(prev => {
                                      const copy = { ...prev };
                                      delete copy.certificateDocument;
                                      return copy;
                                    });
                                  }
                                }}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0a5c48]"></div>
                            </label>
                          </div>
                        </div>

                        {formData.certificate && (
                          <div data-field="certificateDocument" className="pt-3 mt-3 border-t border-gray-200/70 space-y-2">
                            <label className="text-xs font-bold text-gray-700 block flex items-center justify-between">
                              <span>Upload Certificate / Test Report Document *</span>
                              <span className="text-[11px] font-normal text-gray-400">PDF, JPG, PNG (Max 10MB)</span>
                            </label>

                            {!formData.certificateDocument ? (
                              <label className={`border-2 border-dashed ${formErrors.certificateDocument ? 'border-red-400 bg-red-50/40' : 'border-gray-300 hover:border-[#0a5c48] bg-white hover:bg-emerald-50/30'} rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors group`}>
                                <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-[#0a5c48]" />
                                <span className="text-xs font-bold text-gray-700 group-hover:text-[#0a5c48]">Click to upload 3rd party certificate / test report</span>
                                <span className="text-[11px] text-gray-400">Calibration certificate, material test report, or compliance doc</span>
                                <input
                                  type="file"
                                  accept=".pdf,image/png,image/jpeg,image/webp"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const validation = validateFileUpload(file, {
                                        maxSizeBytes: 10 * 1024 * 1024,
                                        allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
                                        preventDoubleExtension: true
                                      });
                                      if (!validation.valid) {
                                        setFormErrors(prev => ({ ...prev, certificateDocument: validation.error || 'Invalid file.' }));
                                      } else {
                                        setFormErrors(prev => {
                                          const copy = { ...prev };
                                          delete copy.certificateDocument;
                                          return copy;
                                        });
                                        handleInputChange('certificateDocument', file);
                                      }
                                    }
                                  }}
                                />
                              </label>
                            ) : (
                              <div className="flex items-center justify-between p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs">
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="font-semibold text-gray-800 truncate" title={formData.certificateDocument.name}>
                                    {formData.certificateDocument.name}
                                  </span>
                                  <span className="text-gray-400 text-[11px] shrink-0">
                                    ({(formData.certificateDocument.size / (1024 * 1024)).toFixed(2)} MB)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleInputChange('certificateDocument', null)}
                                  className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-white transition-colors cursor-pointer"
                                  title="Remove certificate"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                            {renderError('certificateDocument')}
                          </div>
                        )}
                      </div>

                      {/* Product Images Upload */}
                      <div data-field="imagesUploaded" className="md:col-span-2">
                        <label className={labelClass}>Product Images *</label>
                        <label
                          className={`border-2 border-dashed ${formErrors.imagesUploaded ? 'border-red-400 bg-red-50/50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100/70'
                            } rounded-2xl p-6 flex flex-col items-center justify-center transition-colors cursor-pointer group block`}
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
                          <UploadCloud className={`w-8 h-8 ${formData.imagesUploaded ? 'text-[#0a5c48]' : 'text-gray-400'} group-hover:text-[#0a5c48] transition-colors mb-2`} />
                          <p className="text-sm font-semibold text-gray-700">Click to upload product images</p>
                          <p className="text-xs text-gray-500 mt-0.5">PNG, JPG, WEBP, or GIF (max. 5MB per file)</p>
                        </label>

                        {formData.images && formData.images.length > 0 && (
                          <div className="flex flex-wrap gap-3 mt-3">
                            {formData.images.map((file, idx) => (
                              <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-xs">
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
                                  className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs hover:bg-red-50 cursor-pointer"
                                  title="Remove image"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {renderError('imagesUploaded')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions - Single Unified Submit Bar */}
                <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-semibold text-sm hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-7 py-2.5 bg-[#0a5c48] hover:bg-[#084939] text-white font-bold text-sm rounded-full transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                    >
                      <span>Review & Submit</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
