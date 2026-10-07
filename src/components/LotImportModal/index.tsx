"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
import { X, UploadCloud, FileSpreadsheet, ChevronRight, Check, ArrowLeft, Download, Tag, Plus, Percent, Trash2, Edit2, User, CheckCircle2, Image as ImageIcon, Film, DollarSign, Info, ShieldCheck } from 'lucide-react';
import { z } from 'zod';
import { validateManifestUpload } from '../../lib/security/fileUploadValidator';
import { sanitizeInput } from '../../lib/security/sanitizer';
import * as XLSX from 'xlsx';

/**
 * Comprehensive Cyber Attack Protection Filter for Zod Schemas
 * Prevents: XSS, Script Injections, SQL Injection, Path Traversal, Command Execution & Data Payload Overflow
 */
const cyberAttackFilter = (val: string) => {
  if (!val || typeof val !== 'string') return true;
  
  // 1. XSS / HTML Tag Injection
  const hasXSS = /<[^>]*>/g.test(val) || 
                 /javascript\s*:/gi.test(val) || 
                 /on\w+\s*=/gi.test(val) || 
                 /data\s*:\s*text\/html/gi.test(val) ||
                 /<script[^>]*>[\s\S]*?<\/script>/gi.test(val) ||
                 /<iframe[^>]*>/gi.test(val);
  if (hasXSS) return false;

  // 2. SQL Injection Patterns
  const hasSQLi = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|UNION|EXEC|TRUNCATE|GRANT|REVOKE)\b|\-\-|;|\/\*)/gi.test(val);
  if (hasSQLi) return false;

  // 3. Path Traversal & System Files
  const hasPathTraversal = /(\.\.[\/\\]|\/etc\/passwd|c:\\windows|system32)/gi.test(val);
  if (hasPathTraversal) return false;

  // 4. Command Injection & Malicious Payloads
  const hasCmdInjection = /(\b(cmd\.exe|powershell|\/bin\/sh|\/bin\/bash|eval\(|exec\()\b)/gi.test(val);
  if (hasCmdInjection) return false;

  return true;
};

const step1Schema = z.object({
  manifestFile: z.any()
    .refine(val => val !== null && val !== undefined, "Please upload a manifest file to continue")
    .refine(file => {
      if (!file) return false;
      const res = validateManifestUpload(file);
      return res.valid;
    }, { message: "Security Violation: Invalid or unsafe file format. Only safe .XLSX and .CSV under 10MB are permitted." })
});

const step2Schema = z.object({
  fullName: z.string()
    .min(1, "Full Name is required")
    .max(100, "Full Name cannot exceed 100 characters")
    .refine(cyberAttackFilter, "Security Violation: HTML tags, scripts, SQL injection, or malicious payloads detected"),
  email: z.string()
    .min(1, "Valid email is required")
    .email("Valid email address is required")
    .max(254, "Email address cannot exceed 254 characters")
    .refine(cyberAttackFilter, "Security Violation: Invalid or malicious email string detected"),
  mobile: z.string()
    .min(1, "Mobile Number is required")
    .max(25, "Mobile Number cannot exceed 25 characters")
    .refine(cyberAttackFilter, "Security Violation: Invalid characters in mobile number"),
  location: z.string()
    .min(1, "Inventory Location is required")
    .max(150, "Inventory Location cannot exceed 150 characters")
    .refine(cyberAttackFilter, "Security Violation: HTML, script tags or SQL injection detected"),
});

const step3Schema = z.object({
  title: z.string()
    .min(1, "Listing Title is required")
    .max(200, "Listing Title cannot exceed 200 characters")
    .refine(cyberAttackFilter, "Security Violation: HTML, scripts, or SQL injection payload detected in title"),
  description: z.string()
    .min(1, "Lot Description & Notes are required")
    .max(3000, "Lot Description cannot exceed 3000 characters")
    .refine(val => !/<script[^>]*>[\s\S]*?<\/script>/gi.test(val) && !/on\w+\s*=/gi.test(val) && !/javascript\s*:/gi.test(val) && !/<iframe[^>]*>/gi.test(val), "Security Violation: Script execution payloads, inline handlers, and iframe tags are strictly prohibited"),
  location: z.string()
    .min(1, "Inventory Location is required")
    .max(150, "Inventory Location cannot exceed 150 characters")
    .refine(cyberAttackFilter, "Security Violation: Malicious payload or HTML tags detected in location"),
  category: z.string().optional(),
  condition: z.string()
    .min(1, "Condition is required")
    .refine(cyberAttackFilter, "Security Violation: Invalid condition parameter"),
  sourceType: z.string()
    .min(1, "Source Type is required")
    .refine(cyberAttackFilter, "Security Violation: Invalid source type parameter"),
  loadType: z.string()
    .min(1, "Load Type is required")
    .refine(cyberAttackFilter, "Security Violation: Invalid load type parameter"),
  shippingSize: z.string()
    .min(1, "Shipping Size is required")
    .refine(cyberAttackFilter, "Security Violation: Invalid shipping size parameter"),
  lotSize: z.string()
    .min(1, "Lot Size is required")
    .max(100, "Lot Size cannot exceed 100 characters")
    .refine(cyberAttackFilter, "Security Violation: Malicious string detected in Lot Size"),
  palletCount: z.coerce.number()
    .min(1, "Pallet Count must be at least 1")
    .max(10000, "Security Violation: Pallet Count exceeds maximum limit"),
  unitType: z.string()
    .min(1, "Primary Unit Type is required")
    .refine(cyberAttackFilter, "Security Violation: Invalid unit type parameter"),
  distinctSkus: z.string()
    .min(1, "Number of Distinct SKUs is required")
    .refine(val => {
      const num = Number(val.replace(/,/g, ''));
      return !isNaN(num) && num > 0 && num <= 1000000;
    }, "Distinct SKUs must be a positive number up to 1,000,000"),
  manualUnits: z.string()
    .min(1, "Total Units / Quantity is required")
    .refine(val => {
      const num = Number(val.replace(/,/g, ''));
      return !isNaN(num) && num > 0 && num <= 100000000;
    }, "Total Units must be a positive number up to 100,000,000"),
  keyBrands: z.string()
    .min(1, "Key Brands Included is required")
    .max(300, "Key Brands cannot exceed 300 characters")
    .refine(cyberAttackFilter, "Security Violation: HTML, scripts, or SQL injection payload detected in Key Brands"),
  askPrice: z.string()
    .min(1, "Ask Price (Surplus Payout) is required")
    .refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 && num <= 1000000000;
    }, "Ask Price must be a valid positive amount below 1,000,000,000"),
  mediaFiles: z.array(z.any())
    .min(1, "At least 1 product or warehouse image/video is required")
    .max(20, "Maximum 20 media files allowed per listing")
    .refine(files => {
      return files.every(file => {
        if (!file || typeof file.size !== 'number') return false;
        if (file.size > 50 * 1024 * 1024) return false;
        const isImage = file.type ? file.type.startsWith('image/') : false;
        const isVideo = file.type ? file.type.startsWith('video/') : false;
        return isImage || isVideo;
      });
    }, "Security Violation: Media files must be valid images or videos under 50MB per file"),
  msrp: z.string()
    .min(1, "Total Est. Retail Value (MSRP) is required")
    .refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 && num <= 1000000000;
    }, "Total Est. Retail Value must be a valid positive amount below 1,000,000,000"),
  totalRetail: z.number().optional(),
}).refine(data => {
  const ask = parseFloat(data.askPrice);
  const retail = parseFloat(data.msrp || String(data.totalRetail || 0));
  if (isNaN(ask) || isNaN(retail) || retail <= 0) return true;
  return ask < retail;
}, {
  message: "Ask Price must be strictly below the Total Est. Retail Value (MSRP)",
  path: ["askPrice"]
}).refine(data => {
  const ask = parseFloat(data.askPrice);
  const retail = parseFloat(data.msrp || String(data.totalRetail || 0));
  if (isNaN(ask) || isNaN(retail) || retail <= 0) return true;
  const discountPercent = ((retail - ask) / retail) * 100;
  return discountPercent >= 39.999;
}, {
  message: "Ask Price must have at least a 40% discount off Total Est. Retail Value (MSRP)",
  path: ["askPrice"]
});

import Select from 'react-select';

const CATEGORY_OPTIONS = [
  'Electricals',
  'Electronics',
  'Apparel',
  'Industrial Hardware',
  'Automotive & Spare Parts',
  'Home & Living',
  'Tools & Machinery',
  'Medical & Health',
  'General Surplus',
  'Other'
];

const categorySelectOptions = CATEGORY_OPTIONS.map(c => ({ value: c, label: c }));

const conditionOptions = [
  { value: 'New', label: 'New' },
  { value: 'Like New', label: 'Like New' },
  { value: 'Returns', label: 'Returns' },
  { value: 'Used', label: 'Used' },
  { value: 'Salvage', label: 'Salvage' },
  { value: 'Mixed', label: 'Mixed' }
];

const sourceTypeOptions = [
  { value: 'Overstock', label: 'Overstock' },
  { value: 'Customer Returns', label: 'Customer Returns' },
  { value: 'Liquidation', label: 'Liquidation' },
  { value: 'Closeout', label: 'Closeout' },
  { value: 'Surplus', label: 'Surplus' },
  { value: 'Other', label: 'Other' }
];

const stockAgeOptions = [
  { value: 'Current / < 6 Months', label: 'Current / < 6 Months' },
  { value: '6 - 12 Months', label: '6 - 12 Months' },
  { value: '1 - 2 Years', label: '1 - 2 Years' },
  { value: 'Over 2 Years', label: 'Over 2 Years' },
  { value: 'Mixed Ages', label: 'Mixed Ages' }
];

const unitTypeOptions = [
  { value: 'Pieces / Units', label: 'Pieces / Units' },
  { value: 'Pairs', label: 'Pairs' },
  { value: 'Kilograms (kg)', label: 'Kilograms (kg)' },
  { value: 'Pounds (lbs)', label: 'Pounds (lbs)' },
  { value: 'Mixed Types', label: 'Mixed Types' }
];

const loadTypeOptions = [
  { value: 'Pallet', label: 'Pallet' },
  { value: 'LTL', label: 'LTL' },
  { value: 'Truckload', label: 'Truckload' },
  { value: 'Container', label: 'Container' },
  { value: 'Other', label: 'Other' }
];

const shippingSizeOptions = [
  { value: 'Small Parcel / Box', label: 'Small Parcel / Box' },
  { value: 'Single Pallet', label: 'Single Pallet' },
  { value: 'Multi-Pallet / LTL', label: 'Multi-Pallet / LTL' },
  { value: 'Full Truckload (FTL)', label: 'Full Truckload (FTL)' },
  { value: '20ft / 40ft Container', label: '20ft / 40ft Container' }
];

const shippingTermsOptions = [
  { value: 'Buyer Arranges Freight', label: 'Buyer Arranges Freight' },
  { value: 'Seller Arranges Freight', label: 'Seller Arranges Freight' },
  { value: 'Free Shipping', label: 'Free Shipping' }
];

const saleMethodOptions = [
  { value: 'offer', label: 'Accept Offers' },
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'auction', label: 'Auction' }
];

const currencyOptions = [
  { value: 'USD - US Dollar', label: 'USD - US Dollar' },
  { value: 'AED - UAE Dirham', label: 'AED - UAE Dirham' },
  { value: 'SAR - Saudi Riyal', label: 'SAR - Saudi Riyal' },
  { value: 'EUR - Euro', label: 'EUR - Euro' },
  { value: 'GBP - British Pound', label: 'GBP - British Pound' }
];

const excludedCountriesOptions = [
  { value: 'None (Worldwide)', label: 'None (Worldwide)' },
  { value: 'Russia', label: 'Russia' },
  { value: 'Iran', label: 'Iran' },
  { value: 'North Korea', label: 'North Korea' },
  { value: 'Syria', label: 'Syria' },
  { value: 'Cuba', label: 'Cuba' }
];

const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: '0.5rem',
    borderColor: state.isFocused ? '#0a5c48' : '#d1d5db',
    borderWidth: state.isFocused ? '2px' : '1px',
    boxShadow: 'none',
    padding: '2px',
    backgroundColor: '#ffffff',
    '&:hover': {
      borderColor: state.isFocused ? '#0a5c48' : '#9ca3af'
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
    fontWeight: '500',
    fontSize: '0.875rem'
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#9ca3af',
    fontWeight: '400',
    fontSize: '0.875rem'
  })
};

interface FastInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string | number;
  onValueChange: (val: string) => void;
  debounceMs?: number;
}

const FastInput = React.memo(React.forwardRef<HTMLInputElement, FastInputProps>(({ 
  value, 
  onValueChange, 
  onBlur, 
  onFocus, 
  debounceMs = 250,
  ...props 
}, ref) => {
  const [localVal, setLocalVal] = useState<string>(String(value ?? ''));
  const isFocusedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync value from parent ONLY when input is not actively focused by the user
  useEffect(() => {
    if (!isFocusedRef.current) {
      setLocalVal(String(value ?? ''));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocalVal(v); // 0ms Instant Native Typing

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onValueChange(v);
    }, debounceMs);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onValueChange(localVal); // Guarantee 100% sync on focus leave
    if (onBlur) onBlur(e);
  };

  return (
    <input
      {...props}
      ref={ref}
      value={localVal}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}));
FastInput.displayName = 'FastInput';

interface FastTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onValueChange: (val: string) => void;
  debounceMs?: number;
}

const FastTextarea = React.memo(React.forwardRef<HTMLTextAreaElement, FastTextareaProps>(({ 
  value, 
  onValueChange, 
  onBlur, 
  onFocus, 
  debounceMs = 250,
  ...props 
}, ref) => {
  const [localVal, setLocalVal] = useState<string>(value ?? '');
  const isFocusedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync value from parent ONLY when textarea is not actively focused by the user
  useEffect(() => {
    if (!isFocusedRef.current) {
      setLocalVal(value ?? '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setLocalVal(v); // 0ms Instant Native Typing

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onValueChange(v);
    }, debounceMs);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    isFocusedRef.current = true;
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    isFocusedRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onValueChange(localVal); // Guarantee 100% sync on focus leave
    if (onBlur) onBlur(e);
  };

  return (
    <textarea
      {...props}
      ref={ref}
      value={localVal}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}));
FastTextarea.displayName = 'FastTextarea';

interface CategoryAllocation {
  id: string;
  category: string;
  allocation: number;
}

interface LotImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 1, title: 'Upload Manifest' },
  { id: 2, title: 'Lot & Seller Details' },
  { id: 3, title: 'Review & Submit' },
];

const LotImportModal: React.FC<LotImportModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [manifestData, setManifestData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [categoryAllocations, setCategoryAllocations] = useState<CategoryAllocation[]>([
    { id: '1', category: 'Electricals', allocation: 100 }
  ]);

  const addCategoryAllocation = () => {
    setCategoryAllocations(prev => {
      const unusedCat = CATEGORY_OPTIONS.find(opt => !prev.some(p => p.category === opt)) || 'Electronics';
      return [...prev, { id: String(Date.now()), category: unusedCat, allocation: 0 }];
    });
  };

  const updateCategoryAllocation = (id: string, field: 'category' | 'allocation', value: any) => {
    setCategoryAllocations(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeCategoryAllocation = (id: string) => {
    setCategoryAllocations(prev => prev.length > 1 ? prev.filter(item => item.id !== id) : prev);
  };

  const totalAllocationPercentage = useMemo(() => {
    return categoryAllocations.reduce((acc, row) => acc + (Number(row.allocation) || 0), 0);
  }, [categoryAllocations]);

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
    keyBrands: '',
    category: 'Electricals',
    allocation: 100,
    condition: '',
    sourceType: '',
    stockAge: 'Current / < 6 Months',
    loadType: '',
    shippingSize: 'Multi-Pallet / LTL',
    lotSize: '',
    palletCount: 1,
    distinctSkus: '',
    manualUnits: '',
    weight: '',
    unitType: 'Pieces / Units',
    shippingTerms: 'Buyer Arranges Freight',
    currency: 'USD - US Dollar',
    msrp: '',
    askPrice: '',
    excludedCountries: [] as string[],
    saleMethod: 'offer',
    allowCounterOffers: true,
    certificate: false,
    certificateDocument: null as File | null
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const totalUnits = useMemo(() => {
    return manifestData.reduce((acc, row) => acc + (Number(row.qty) || 0), 0);
  }, [manifestData]);

  const totalRetail = useMemo(() => {
    return manifestData.reduce((acc, row) => acc + ((Number(row.qty) || 0) * (Number(row.msrp) || 0)), 0);
  }, [manifestData]);

  // Real-time pricing validation and discount calculation (matching SimpleListingModal)
  const pricingAnalysis = useMemo(() => {
    const ask = parseFloat(formData.askPrice);
    const retail = parseFloat(formData.msrp || String(totalRetail || 0));
    const currSymbol = formData.currency?.split(' ')[0] || 'USD';
    const publicPrice = !isNaN(ask) && ask > 0 ? (ask * 1.10).toFixed(2) : '';
    const publicMarkup = !isNaN(ask) && ask > 0 ? (ask * 0.10).toFixed(2) : '';

    if (isNaN(retail) || retail <= 0) {
      return {
        hasMsrp: false,
        hasAsk: !isNaN(ask) && ask > 0,
        discountPercent: 0,
        maxAllowedPrice: '0.00',
        publicPrice,
        publicMarkup,
        currSymbol,
        isBelowRetail: true,
        meetsMinDiscount: true,
        error: '',
      };
    }

    const maxAllowedPrice = (retail * 0.6).toFixed(2);

    if (isNaN(ask) || ask <= 0) {
      return {
        hasMsrp: true,
        hasAsk: false,
        discountPercent: 0,
        maxAllowedPrice,
        publicPrice: '',
        publicMarkup: '',
        currSymbol,
        isBelowRetail: true,
        meetsMinDiscount: true,
        error: '',
      };
    }

    const discountPercent = Number((((retail - ask) / retail) * 100).toFixed(1));
    const isBelowRetail = ask < retail;
    const meetsMinDiscount = isBelowRetail && discountPercent >= 39.99;

    let error = '';
    if (!isBelowRetail) {
      error = 'Ask price must be strictly below the Total Est. Retail Value (MSRP).';
    } else if (!meetsMinDiscount) {
      error = `Ask price must have at least a 40% discount off MSRP (Max allowed: ${currSymbol} ${maxAllowedPrice}). Current discount: ${discountPercent}%.`;
    }

    return {
      hasMsrp: true,
      hasAsk: true,
      discountPercent,
      maxAllowedPrice,
      publicPrice,
      publicMarkup,
      currSymbol,
      isBelowRetail,
      meetsMinDiscount,
      error,
    };
  }, [formData.askPrice, formData.msrp, formData.currency, totalRetail]);

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

  const mediaPreviews = useMemo(() => {
    return mediaFiles.map((file) => ({
      file,
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
    }));
  }, [mediaFiles]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => {
      if (!prev[field]) return prev;
      const newErrs = { ...prev };
      delete newErrs[field];
      return newErrs;
    });
  };

  const downloadStandardTemplate = () => {
    try {
      const link = document.createElement('a');
      link.href = encodeURI('/Surplus Market XLSX Format.xlsx');
      link.download = 'Surplus Market XLSX Format.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(encodeURI('/Surplus Market XLSX Format.xlsx'), '_blank');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const validation = validateManifestUpload(selectedFile);

      if (!validation.valid) {
        setFormErrors(prev => ({
          ...prev,
          manifestFile: validation.error || 'Invalid manifest file format.'
        }));
        setManifestFile(null);
        setManifestData([]);
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const buffer = evt.target?.result;
          if (!buffer) return;

          const workbook = XLSX.read(buffer, { type: 'array' });

          // 1. Target specifically the 'Inventory' tab (case-insensitive check)
          const inventorySheetName = workbook.SheetNames.find(
            name => name.trim().toLowerCase() === 'inventory'
          );

          if (!inventorySheetName) {
            setFormErrors(prev => ({
              ...prev,
              manifestFile: `Sheet Validation Failed: The uploaded Excel file must contain an 'Inventory' tab. Found tabs: [${workbook.SheetNames.join(', ')}]. Please use the standard template.`
            }));
            setManifestFile(null);
            setManifestData([]);
            return;
          }

          const worksheet = workbook.Sheets[inventorySheetName];
          const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

          // Filter out completely empty rows
          const validRows = rawRows.filter(row => Array.isArray(row) && row.some(cell => String(cell || '').trim() !== ''));

          if (validRows.length < 2) {
            setFormErrors(prev => ({
              ...prev,
              manifestFile: "The 'Inventory' sheet must contain a header row and at least 1 item data row."
            }));
            setManifestFile(null);
            setManifestData([]);
            return;
          }

          // 2. Header Validation Check
          const rawHeaderRow = validRows[0].map(cell => String(cell || '').trim());
          const normalizedHeaderRow = rawHeaderRow.map(h => h.replace(/\*+$/g, '').replace(/^\*+/g, '').trim().toLowerCase());

          const REQUIRED_MANDATORY_HEADERS = [
            { key: 'sno', label: 'S.No*', matches: ['s.no', 'sno', 'serial no', 's.no.'] },
            { key: 'productName', label: 'Product Name*', matches: ['product name', 'title', 'item name'] },
            { key: 'productDescription', label: 'Product Description*', matches: ['product description', 'description', 'notes'] },
            { key: 'productCategory', label: 'Product Category*', matches: ['product category', 'category'] },
            { key: 'subcategory', label: 'Subcategory*', matches: ['subcategory', 'sub category'] },
            { key: 'quantity', label: 'Available Quantity*', matches: ['available quantity', 'quantity', 'qty'] },
          ];

          const missingMandatoryHeaders: string[] = [];
          const colIndexMap: Record<string, number> = {};

          REQUIRED_MANDATORY_HEADERS.forEach(mand => {
            let foundIndex = -1;
            for (let i = 0; i < normalizedHeaderRow.length; i++) {
              const h = normalizedHeaderRow[i];
              if (mand.matches.some(m => m === h) || h === mand.key.toLowerCase()) {
                foundIndex = i;
                break;
              }
            }
            if (foundIndex === -1) {
              missingMandatoryHeaders.push(mand.label);
            } else {
              colIndexMap[mand.key] = foundIndex;
            }
          });

          if (missingMandatoryHeaders.length > 0) {
            setFormErrors(prev => ({
              ...prev,
              manifestFile: `Header Validation Failed: Missing mandatory column header(s) in 'Inventory' sheet: [${missingMandatoryHeaders.join(', ')}]. Required mandatory headers: S.No*, Product Name*, Product Description*, Product Category*, Subcategory*, Available Quantity*.`
            }));
            setManifestFile(null);
            setManifestData([]);
            return;
          }

          // Map optional columns
          for (let i = 0; i < normalizedHeaderRow.length; i++) {
            const h = normalizedHeaderRow[i];
            if (h.includes('brand') || h.includes('manufacturer')) colIndexMap['brand'] = i;
            if (h.includes('model') || h.includes('part number')) colIndexMap['model'] = i;
            if (h.includes('original price') || h.includes('msrp')) colIndexMap['msrp'] = i;
            if (h.includes('asking price') || h.includes('surplus price')) colIndexMap['askPrice'] = i;
            if (h.includes('country')) colIndexMap['country'] = i;
            if (h.includes('year')) colIndexMap['year'] = i;
            if (h.includes('weight')) colIndexMap['weight'] = i;
          }

          // 3. Row-level Mandatory Data Validation Check
          const rowErrorMessages: string[] = [];
          const parsedItems: any[] = [];
          const brandSet = new Set<string>();
          const categoryCountMap: Record<string, number> = {};
          let totalQtySum = 0;
          let totalRetailSum = 0;
          let totalAskSum = 0;

          for (let r = 1; r < validRows.length; r++) {
            const row = validRows[r];
            const rowNum = r + 1; // 1-indexed row number in Excel sheet

            const snoVal = String(row[colIndexMap['sno']] || '').trim();
            const nameVal = String(row[colIndexMap['productName']] || '').trim();
            const descVal = String(row[colIndexMap['productDescription']] || '').trim();
            const catVal = String(row[colIndexMap['productCategory']] || '').trim();
            const subcatVal = String(row[colIndexMap['subcategory']] || '').trim();
            const qtyRaw = String(row[colIndexMap['quantity']] || '').trim();
            const qtyVal = Number(qtyRaw);

            const missingInThisRow: string[] = [];
            if (!snoVal) missingInThisRow.push('S.No*');
            if (!nameVal) missingInThisRow.push('Product Name*');
            if (!descVal) missingInThisRow.push('Product Description*');
            if (!catVal) missingInThisRow.push('Product Category*');
            if (!subcatVal) missingInThisRow.push('Subcategory*');
            if (!qtyRaw || isNaN(qtyVal) || qtyVal <= 0) missingInThisRow.push('Available Quantity* (must be > 0)');

            if (missingInThisRow.length > 0) {
              rowErrorMessages.push(`Row ${rowNum}: Missing [${missingInThisRow.join(', ')}]`);
            } else {
              const brandVal = colIndexMap['brand'] !== undefined ? String(row[colIndexMap['brand']] || '').trim() : '';
              if (brandVal) brandSet.add(brandVal);

              categoryCountMap[catVal] = (categoryCountMap[catVal] || 0) + qtyVal;
              totalQtySum += qtyVal;

              const msrpVal = colIndexMap['msrp'] !== undefined ? (Number(row[colIndexMap['msrp']]) || 0) : 0;
              const askVal = colIndexMap['askPrice'] !== undefined ? (Number(row[colIndexMap['askPrice']]) || 0) : 0;

              totalRetailSum += qtyVal * msrpVal;
              totalAskSum += qtyVal * askVal;

              parsedItems.push({
                id: r,
                sku: snoVal,
                title: nameVal,
                description: descVal,
                category: catVal,
                subcategory: subcatVal,
                brand: brandVal,
                model: colIndexMap['model'] !== undefined ? String(row[colIndexMap['model']] || '').trim() : '',
                qty: qtyVal,
                msrp: msrpVal,
                askPrice: askVal,
                condition: 'New'
              });
            }
          }

          if (rowErrorMessages.length > 0) {
            const summaryText = rowErrorMessages.length > 5
              ? `${rowErrorMessages.slice(0, 5).join('; ')} ...and ${rowErrorMessages.length - 5} more row(s) with missing data.`
              : rowErrorMessages.join('; ');
            setFormErrors(prev => ({
              ...prev,
              manifestFile: `Mandatory Data Validation Failed in 'Inventory' sheet: ${summaryText} All mandatory fields (S.No*, Product Name*, Product Description*, Product Category*, Subcategory*, Available Quantity*) must be filled in for every item.`
            }));
            setManifestFile(null);
            setManifestData([]);
            return;
          }

          // Validation Passed cleanly!
          setManifestFile(selectedFile);
          setManifestData(parsedItems);

          // Set primary Category Allocation from manifest top category
          const categoriesList = Object.keys(categoryCountMap);
          if (categoriesList.length > 0 && totalQtySum > 0) {
            // Find category with highest unit count in Excel file
            const topCategory = categoriesList.reduce((maxCat, cat) => 
              categoryCountMap[cat] > (categoryCountMap[maxCat] || 0) ? cat : maxCat, categoriesList[0]);
            
            // Match with available category options or use topCategory name
            const matchedCategory = CATEGORY_OPTIONS.find(c => c.toLowerCase() === topCategory.toLowerCase()) 
              || CATEGORY_OPTIONS.find(c => c.toLowerCase().includes(topCategory.toLowerCase()))
              || topCategory;

            setFormData(prev => ({ ...prev, category: matchedCategory }));
            setCategoryAllocations([{ id: '1', category: matchedCategory, allocation: 100 }]);
          }

          // Auto-fill Lot Form fields
          setFormData(prev => ({
            ...prev,
            distinctSkus: String(parsedItems.length),
            manualUnits: String(totalQtySum),
            msrp: totalRetailSum > 0 ? String(totalRetailSum.toFixed(2)) : prev.msrp,
            askPrice: totalAskSum > 0 ? String(totalAskSum.toFixed(2)) : prev.askPrice,
            keyBrands: Array.from(brandSet).join(', ') || prev.keyBrands
          }));

          setFormErrors(prev => {
            const copy = { ...prev };
            delete copy['manifestFile'];
            return copy;
          });

        } catch (err: any) {
          setFormErrors(prev => ({
            ...prev,
            manifestFile: `Failed to process Excel file: ${err?.message || 'Invalid or corrupted file format.'}`
          }));
          setManifestFile(null);
          setManifestData([]);
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles: File[] = [];
      let errMessage = '';

      for (const file of selectedFiles) {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        if (!isImage && !isVideo) {
          errMessage = 'Only image and video files are supported.';
          continue;
        }
        if (file.size > 50 * 1024 * 1024) {
          errMessage = 'File size must be under 50MB per file.';
          continue;
        }
        validFiles.push(file);
      }

      if (errMessage && validFiles.length === 0) {
        setFormErrors(prev => ({ ...prev, mediaFiles: errMessage }));
        return;
      }

      setMediaFiles(prev => [...prev, ...validFiles]);
      if (formErrors['mediaFiles']) {
        setFormErrors(prev => {
          const newErrs = { ...prev };
          delete newErrs['mediaFiles'];
          return newErrs;
        });
      }
    }
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
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

  // Auto-fill distinct SKUs, total units, and total retail MSRP when manifest is uploaded
  useEffect(() => {
    if (manifestData.length > 0) {
      setFormData(prev => ({
        ...prev,
        distinctSkus: prev.distinctSkus || String(manifestData.length),
        manualUnits: prev.manualUnits || String(totalUnits),
        msrp: prev.msrp || (totalRetail > 0 ? String(totalRetail) : '')
      }));
    }
  }, [manifestData, totalUnits, totalRetail]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSuccess(false);
      setCurrentStep(1);
      setFormErrors({});
      setSubmitError('');
      setMediaFiles([]);
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
        step3Schema.parse({ ...formData, mediaFiles, totalRetail });
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
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const submitListing = async () => {
    if (!validateStep(1)) { setCurrentStep(1); return; }
    if (!validateStep(2)) { setCurrentStep(2); return; }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const data = new FormData();
      
      if (session?.user && (session.user as any).vendor_id) {
        data.append('vendor_id', String((session.user as any).vendor_id));
      }
      
      // --- 1-3. Basic Info ---
      data.append('title', sanitizeInput(String(formData.title || '')));
      data.append('description', sanitizeInput(String(formData.description || '')));
      data.append('key_brands_included', sanitizeInput(String(formData.keyBrands || '')));

      // --- 4. Warehouse Images ---
      // Send an array of image file names as JSON (backend expects JSON format)
      const warehouseImageNames = mediaFiles.map((file) => file.name);
      data.append('warehouse_images', JSON.stringify(warehouseImageNames));

      // --- 5. Category Allocations ---
      data.append('category_allocations', JSON.stringify(categoryAllocations.map(c => ({
        category_name: c.category,
        alocation: `${Number(c.allocation) || 0}%`
      }))));

      // --- 6-8. Condition & Age ---
      data.append('condition', sanitizeInput(String(formData.condition || '')));
      data.append('source_type', sanitizeInput(String(formData.sourceType || '')));
      data.append('inventory_stock_age', sanitizeInput(String(formData.stockAge || '')));

      // --- 9-10. Certificates ---
      data.append('third_party_certificate_available', formData.certificate ? 'true' : 'false');
      if (formData.certificate && formData.certificateDocument) {
        data.append('third_party_documents', formData.certificateDocument);
      }

      // --- 11-15. Location, Units, & Metrics ---
      data.append('inventory_location', sanitizeInput(String(formData.location || '')));
      data.append('number_of_distinct_skus', String(formData.distinctSkus || manifestData.length || 0));
      data.append('total_units_quantity', String(totalUnits || formData.manualUnits || 0));
      data.append('primary_unit_type', sanitizeInput(String(formData.unitType || '')));
      data.append('total_weight', sanitizeInput(String(formData.weight || '')));

      // --- 17-21. Shipping & Logistics ---
      data.append('load_type', sanitizeInput(String(formData.loadType || '')));
      data.append('shipping_size', sanitizeInput(String(formData.shippingSize || '')));
      data.append('lot_size', sanitizeInput(String(formData.lotSize || '')));
      data.append('pallet_count', String(formData.palletCount || 1));
      data.append('shipping_terms', sanitizeInput(String(formData.shippingTerms || '')));

      // --- 22-26. Pricing & Sales Method ---
      const effectiveRetail = Number(formData.msrp) || totalRetail || 0;
      const discountVal = effectiveRetail > 0 && Number(formData.askPrice) > 0 
        ? Math.round(((effectiveRetail - Number(formData.askPrice)) / effectiveRetail) * 100)
        : 0;
      data.append('currency', sanitizeInput(String(formData.currency || 'USD')));
      data.append('total_est_retail_value_msrp', String(effectiveRetail));
      data.append('total_retail', String(effectiveRetail));
      data.append('msrp', String(effectiveRetail));
      data.append('ask_price_surplus_payout', String(formData.askPrice || 0));
      data.append('asking_price', String(formData.askPrice || 0));
      data.append('price', String(formData.askPrice || 0));
      data.append('offer', discountVal > 0 ? `${discountVal}% Off MSRP` : '');
      data.append('excluded_export_countries', JSON.stringify(formData.excludedCountries || []));
      data.append('sale_method', sanitizeInput(String(formData.saleMethod || 'offer')));

      // --- 27. Manifest Data ---
      if (manifestFile) {
        data.append('manifest_file', manifestFile);
      }
      data.append('manifest_items', JSON.stringify(manifestData || []));
      
      const rawApiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const apiBase = rawApiBase.replace(/\/$/, '');
      const endpoint = apiBase
        ? (apiBase.endsWith('/api') ? `${apiBase}/submit-lot-request/` : `${apiBase}/api/submit-lot-request/`)
        : '/api/submit-lot-request/';

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
    <div data-lenis-prevent className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60">
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
                <h3 className="text-xl font-bold text-gray-900">Lot Inventory Listing</h3>
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
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Upload your inventory manifest</h3>
              <p className="text-gray-500 text-center mb-6 max-w-xl">
                Upload your .xlsx or .csv file. Our system will automatically detect the <strong>Inventory</strong> sheet tab and validate mandatory columns.
              </p>

              <label className="w-full max-w-2xl border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center text-gray-500 hover:bg-[#0a5c48]/5 hover:border-[#0a5c48]/30 transition-colors cursor-pointer bg-white shadow-sm mb-2">
                <input 
                  type="file" 
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <UploadCloud className={`w-12 h-12 mb-3 ${manifestFile ? 'text-[#0a5c48]' : 'text-[#0a5c48]/60'}`} />
                <span className="font-semibold text-gray-700 text-lg text-center">
                  {manifestFile ? manifestFile.name : 'Click to browse or drag & drop'}
                </span>
                <span className="text-sm mt-1 text-gray-500">
                  {manifestFile ? 'File verified and ready' : 'Supports .XLSX and .CSV up to 10MB'}
                </span>
              </label>
              {renderError('manifestFile')}

              <a 
                href={encodeURI('/Surplus Market XLSX Format.xlsx')}
                download="Surplus Market XLSX Format.xlsx"
                onClick={(e) => {
                  e.preventDefault();
                  downloadStandardTemplate();
                }}
                className="flex items-center text-sm font-semibold text-[#0a5c48] hover:underline mt-3 cursor-pointer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download our standard template
              </a>

              {/* Parsed Excel Inventory Sheet Data Preview Table */}
              {manifestData.length > 0 && (
                <div className="w-full mt-8">
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3">
                      <div>
                        <h4 className="text-base font-bold text-gray-900">Parsed Excel Data Preview ('Inventory' Sheet)</h4>
                        <p className="text-xs text-gray-500">{manifestData.length} valid item(s) parsed and validated</p>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                          <span className="text-gray-500 font-medium">Total Units: </span>
                          <span className="font-bold text-gray-900">{totalUnits.toLocaleString()}</span>
                        </div>
                        <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                          <span className="text-gray-500 font-medium">Est. Retail Value: </span>
                          <span className="font-bold text-[#0a5c48]">${totalRetail.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-gray-100/90 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[11px] sticky top-0 bg-gray-100 z-10">
                          <tr>
                            <th className="px-4 py-3">S.No*</th>
                            <th className="px-4 py-3">Product Name*</th>
                            <th className="px-4 py-3">Category*</th>
                            <th className="px-4 py-3">Subcategory*</th>
                            <th className="px-4 py-3">Brand</th>
                            <th className="px-4 py-3">Model</th>
                            <th className="px-4 py-3 text-right">Available Qty*</th>
                            <th className="px-4 py-3 text-right">Original MSRP</th>
                            <th className="px-4 py-3 text-right">Asking Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {manifestData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                              <td className="px-4 py-2.5 font-mono text-gray-600">{item.sku}</td>
                              <td className="px-4 py-2.5 font-bold text-gray-900 max-w-[220px] truncate" title={item.title}>{item.title}</td>
                              <td className="px-4 py-2.5 text-gray-700">{item.category}</td>
                              <td className="px-4 py-2.5 text-gray-600">{item.subcategory || '-'}</td>
                              <td className="px-4 py-2.5 text-gray-700 font-medium">{item.brand || '-'}</td>
                              <td className="px-4 py-2.5 text-gray-600 font-mono text-[11px]">{item.model || '-'}</td>
                              <td className="px-4 py-2.5 text-right font-bold text-gray-900">{Number(item.qty).toLocaleString()}</td>
                              <td className="px-4 py-2.5 text-right text-gray-600">
                                {item.msrp ? `$${Number(item.msrp).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '-'}
                              </td>
                              <td className="px-4 py-2.5 text-right font-semibold text-[#0a5c48]">
                                {item.askPrice ? `$${Number(item.askPrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: All Lot Details */}
          {currentStep === 2 && (
            <div className="w-full max-w-5xl mx-auto space-y-10 pb-6 pt-4">
              
              {/* Core Listing Details */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">Listing Details</h4>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Listing Title <span className="text-red-500">*</span></label>
                    <FastInput 
                      type="text" 
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" 
                      placeholder="e.g. 1 Pallet - 50 Pcs - Electronics - Returns - Target" 
                      value={formData.title}
                      onValueChange={val => handleInputChange('title', val)}
                    />
                    {renderError('title')}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lot Description & Notes <span className="text-red-500">*</span></label>
                    <FastTextarea 
                      rows={4} 
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400 resize-y" 
                      placeholder="Describe the lot context, packaging condition, and any 'sold as-is' terms..."
                      value={formData.description}
                      onValueChange={val => handleInputChange('description', val)}
                    ></FastTextarea>
                    {renderError('description')}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Key Brands Included <span className="text-red-500">*</span></label>
                    <FastInput 
                      type="text" 
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" 
                      placeholder="e.g. DeWalt, Milwaukee, Bosch, Schneider, Siemens" 
                      value={formData.keyBrands}
                      onValueChange={val => handleInputChange('keyBrands', val)}
                    />
                    {renderError('keyBrands')}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Product & Warehouse Images / Videos <span className="text-red-500">*</span>
                    </label>
                    <label className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-[#0a5c48]/5 hover:border-[#0a5c48]/40 transition-colors cursor-pointer bg-white shadow-xs">
                      <input 
                        type="file" 
                        accept="image/*,video/*" 
                        multiple 
                        className="hidden" 
                        onChange={handleMediaUpload}
                      />
                      <div className="flex items-center gap-2 mb-2 text-[#0a5c48]">
                        <ImageIcon className="w-6 h-6" />
                        <Film className="w-6 h-6" />
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">
                        Click to upload product photos or warehouse lot videos
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        Upload multiple files • PNG, JPG, WEBP, MP4, MOV (Max 50MB per file)
                      </span>
                    </label>
                    {renderError('mediaFiles')}

                    {/* Media Previews */}
                    {mediaPreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {mediaPreviews.map(({ file, url }, idx) => (
                          <div key={idx} className="relative group rounded-xl border border-gray-200 overflow-hidden bg-gray-50 p-2 flex flex-col items-center justify-center text-center">
                            {file.type.startsWith('video/') ? (
                              <div className="w-full h-20 bg-gray-900 rounded-lg flex flex-col items-center justify-center text-white">
                                <Film className="w-6 h-6 text-emerald-400 mb-1" />
                                <span className="text-[10px] truncate max-w-[90%] px-1">{file.name}</span>
                              </div>
                            ) : (
                              <div className="w-full h-20 rounded-lg overflow-hidden relative bg-gray-200">
                                <img 
                                  src={url} 
                                  alt={file.name} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                            )}
                            <span className="text-[11px] font-medium text-gray-700 truncate w-full mt-1.5 px-1">{file.name}</span>
                            <span className="text-[10px] text-gray-400">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                            <button 
                              type="button"
                              onClick={() => removeMediaFile(idx)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-sm"
                              title="Remove media"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Category & Percentage Breakdown */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#0a5c48]" /> Category & Percentage Breakdown
                </h4>
                <p className="text-[15px] text-gray-500 mb-4">Select categories with their inventory percentage allocations</p>

                {/* Column Headers (Shown Once) */}
                <div className="grid grid-cols-12 gap-3 mb-2 px-1 text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="col-span-7">Category <span className="text-red-500">*</span></div>
                  <div className="col-span-4">Allocation <span className="text-red-500">*</span></div>
                  <div className="col-span-1"></div>
                </div>

                <div className="space-y-3 mb-5">
                  {categoryAllocations.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-7">
                        <Select
                          options={categorySelectOptions}
                          styles={customSelectStyles}
                          value={categorySelectOptions.find(opt => opt.value === item.category) || (item.category ? { value: item.category, label: item.category } : null)}
                          onChange={(option: any) => {
                            const val = option ? option.value : '';
                            updateCategoryAllocation(item.id, 'category', val);
                            if (item.id === categoryAllocations[0].id) {
                              setFormData(prev => ({ ...prev, category: val }));
                            }
                          }}
                          placeholder="Select Category"
                        />
                      </div>

                      <div className="col-span-4 relative">
                        <FastInput 
                          type="number" 
                          min="0"
                          max="100"
                          className="w-full bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-xs text-sm" 
                          value={item.allocation}
                          onValueChange={val => updateCategoryAllocation(item.id, 'allocation', Math.max(0, Math.min(100, Number(val) || 0)))}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">%</span>
                      </div>

                      <div className="col-span-1 flex items-center justify-center">
                        {categoryAllocations.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => removeCategoryAllocation(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center flex-wrap gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={addCategoryAllocation}
                    className="flex items-center text-[13px] font-bold text-[#0a5c48] bg-[#0a5c48]/10 px-5 py-2.5 rounded-full hover:bg-[#0a5c48]/20 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> Add Another Category
                  </button>
                  
                  <div className={`flex items-center text-[13px] font-bold px-5 py-2.5 rounded-full transition-colors ${
                    totalAllocationPercentage === 100 
                      ? 'text-[#0a5c48] bg-[#e0f0e9]' 
                      : 'text-amber-800 bg-amber-100'
                  }`}>
                    <Percent className="w-4 h-4 mr-1.5" /> Total Allocation: {totalAllocationPercentage}%
                    {totalAllocationPercentage === 100 ? (
                      <Check className="w-4 h-4 ml-1.5 text-[#0a5c48]" />
                    ) : (
                      <span className="ml-2 font-normal text-xs text-amber-700">(Target: 100%)</span>
                    )}
                  </div>
                </div>
              </section>

              {/* Source & Condition */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#0a5c48]" /> Condition & Source
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Condition <span className="text-red-500">*</span></label>
                    <Select
                      options={conditionOptions}
                      styles={customSelectStyles}
                      value={conditionOptions.find(opt => opt.value === formData.condition) || null}
                      onChange={(option: any) => handleInputChange('condition', option ? option.value : '')}
                      placeholder="Select Condition"
                    />
                    {renderError('condition')}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Source Type <span className="text-red-500">*</span></label>
                    <Select
                      options={sourceTypeOptions}
                      styles={customSelectStyles}
                      value={sourceTypeOptions.find(opt => opt.value === formData.sourceType) || null}
                      onChange={(option: any) => handleInputChange('sourceType', option ? option.value : '')}
                      placeholder="Select Source Type"
                    />
                    {renderError('sourceType')}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Inventory / Stock Age</label>
                    <Select
                      options={stockAgeOptions}
                      styles={customSelectStyles}
                      value={stockAgeOptions.find(opt => opt.value === formData.stockAge) || null}
                      onChange={(option: any) => handleInputChange('stockAge', option ? option.value : '')}
                      placeholder="Select Stock Age"
                    />
                  </div>
                </div>

                {/* 3rd Party Certificate Option */}
                <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#0a5c48]" />
                      <div>
                        <span className="block font-semibold text-gray-900 text-sm">3rd Party Certificate Available</span>
                        <span className="text-xs text-gray-500">Enable if material test reports or manufacturer calibration certs are available</span>
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
                            }
                          }}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0a5c48]"></div>
                      </label>
                    </div>
                  </div>

                  {formData.certificate && (
                    <div className="pt-3 mt-3 border-t border-gray-200/70 space-y-2">
                      <label className="text-xs font-bold text-gray-700 block flex items-center justify-between">
                        <span>Upload Certificate / Test Report Document</span>
                        <span className="text-[11px] font-normal text-gray-400">PDF, JPG, PNG (Max 10MB)</span>
                      </label>

                      {!formData.certificateDocument ? (
                        <label className="border-2 border-dashed border-gray-300 hover:border-[#0a5c48] bg-white hover:bg-emerald-50/30 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors group">
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
                                handleInputChange('certificateDocument', file);
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
                    </div>
                  )}
                </div>
              </section>

              {/* Logistics & Metrics */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#0a5c48]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Metrics & Logistics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Inventory Location <span className="text-red-500">*</span></label>
                    <FastInput 
                      type="text" 
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" 
                      placeholder="e.g. Austin, TX, USA or Dubai Industrial City, UAE" 
                      value={formData.location}
                      onValueChange={val => handleInputChange('location', val)}
                    />
                    {renderError('location')}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Number of Distinct SKUs <span className="text-red-500">*</span></label>
                    <FastInput 
                      type="number" 
                      min="1"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" 
                      placeholder={manifestData.length ? `${manifestData.length} (from manifest)` : "e.g. 25"} 
                      value={formData.distinctSkus}
                      onValueChange={val => handleInputChange('distinctSkus', val)}
                    />
                    {renderError('distinctSkus')}
                  </div>

                  <div className="col-span-1 sm:col-span-3 border-t border-gray-100 my-1"></div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Units / Quantity <span className="text-red-500">*</span></label>
                    <FastInput 
                      type="text" 
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" 
                      placeholder={totalUnits ? `${totalUnits.toLocaleString()} (from manifest)` : "e.g. 1500"} 
                      value={formData.manualUnits}
                      onValueChange={val => handleInputChange('manualUnits', val)}
                    />
                    {renderError('manualUnits')}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Unit Type <span className="text-red-500">*</span></label>
                    <Select
                      options={unitTypeOptions}
                      styles={customSelectStyles}
                      value={unitTypeOptions.find(opt => opt.value === formData.unitType) || null}
                      onChange={(option: any) => handleInputChange('unitType', option ? option.value : '')}
                      placeholder="Select Unit Type"
                    />
                    {renderError('unitType')}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Weight</label>
                    <FastInput 
                      type="text" 
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" 
                      placeholder="e.g. 500 lbs" 
                      value={formData.weight}
                      onValueChange={val => handleInputChange('weight', val)}
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-3 border-t border-gray-100 my-1"></div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Load Type <span className="text-red-500">*</span></label>
                    <Select
                      options={loadTypeOptions}
                      styles={customSelectStyles}
                      value={loadTypeOptions.find(opt => opt.value === formData.loadType) || null}
                      onChange={(option: any) => handleInputChange('loadType', option ? option.value : '')}
                      placeholder="Select Load Type"
                    />
                    {renderError('loadType')}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shipping Size <span className="text-red-500">*</span></label>
                    <Select
                      options={shippingSizeOptions}
                      styles={customSelectStyles}
                      value={shippingSizeOptions.find(opt => opt.value === formData.shippingSize) || null}
                      onChange={(option: any) => handleInputChange('shippingSize', option ? option.value : '')}
                      placeholder="Select Shipping Size"
                    />
                    {renderError('shippingSize')}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lot Size <span className="text-red-500">*</span></label>
                    <FastInput 
                      type="text" 
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm placeholder-gray-400" 
                      placeholder="e.g. 1 Pallet" 
                      value={formData.lotSize}
                      onValueChange={val => handleInputChange('lotSize', val)}
                    />
                    {renderError('lotSize')}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pallet Count <span className="text-red-500">*</span></label>
                    <FastInput 
                      type="number" 
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm" 
                      value={formData.palletCount}
                      onValueChange={val => handleInputChange('palletCount', Number(val))}
                    />
                    {renderError('palletCount')}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shipping Terms</label>
                    <Select
                      options={shippingTermsOptions}
                      styles={customSelectStyles}
                      value={shippingTermsOptions.find(opt => opt.value === formData.shippingTerms) || null}
                      onChange={(option: any) => handleInputChange('shippingTerms', option ? option.value : '')}
                      placeholder="Select Shipping Terms"
                    />
                  </div>
                </div>
              </section>

              {/* Pricing & Terms */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#0a5c48]" /> Pricing & Terms
                </h4>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Currency <span className="text-red-500">*</span></label>
                      <Select
                        options={currencyOptions}
                        styles={customSelectStyles}
                        value={currencyOptions.find(opt => opt.value === formData.currency) || currencyOptions[0]}
                        onChange={(option: any) => handleInputChange('currency', option ? option.value : 'USD - US Dollar')}
                        placeholder="Select Currency"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Est. Retail Value (MSRP) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                          {pricingAnalysis.currSymbol === 'AED' ? 'AED' : pricingAnalysis.currSymbol === 'SAR' ? 'SAR' : '$'}
                        </span>
                        <FastInput
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm font-medium placeholder-gray-400"
                          placeholder={totalRetail ? `${totalRetail.toFixed(2)} (from manifest)` : "e.g. 50000.00"}
                          value={formData.msrp}
                          onValueChange={val => handleInputChange('msrp', val)}
                        />
                      </div>
                      {renderError('msrp')}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ask Price (Surplus Payout) <span className="text-red-500">*</span></label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                          {pricingAnalysis.currSymbol === 'AED' ? 'AED' : pricingAnalysis.currSymbol === 'SAR' ? 'SAR' : '$'}
                        </span>
                        <FastInput 
                          type="number" 
                          step="0.01"
                          min="0.01"
                          className={`w-full bg-white border border-gray-300 rounded-lg pl-10 ${pricingAnalysis.hasMsrp ? 'pr-32' : 'pr-4'} py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-shadow shadow-sm font-medium placeholder-gray-400`}
                          placeholder="0.00" 
                          value={formData.askPrice}
                          onValueChange={val => handleInputChange('askPrice', val)}
                        />
                        {pricingAnalysis.hasMsrp && (
                          <button
                            type="button"
                            onClick={() => handleInputChange('askPrice', pricingAnalysis.maxAllowedPrice)}
                            className="absolute right-2 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                            title="Click to apply suggested max price (40% discount)"
                          >
                            <span>Max: {pricingAnalysis.currSymbol} {pricingAnalysis.maxAllowedPrice}</span>
                          </button>
                        )}
                      </div>
                      {renderError('askPrice')}
                    </div>
                  </div>

                  {/* Real-time Discount & Liquidation Verification Pill */}
                  {pricingAnalysis.hasMsrp && pricingAnalysis.hasAsk && (
                    <div>
                      {pricingAnalysis.meetsMinDiscount ? (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            Valid Liquidation Price: <strong>{pricingAnalysis.discountPercent}% discount</strong> off MSRP (meets minimum 40% requirement).
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs sm:text-sm font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                          <span>
                            {pricingAnalysis.error}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Public Listing Charge (+10%) Notice */}
                  <div className="flex items-start gap-2.5 p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-blue-900 text-xs sm:text-sm">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-blue-950 block">
                        +10% charge added when listing to public
                      </span>
                      <span className="text-blue-700 text-xs leading-relaxed block">
                        {pricingAnalysis.hasAsk ? (
                          <>
                            Your surplus payout price is <strong>{pricingAnalysis.currSymbol} {parseFloat(formData.askPrice).toFixed(2)}</strong>.
                            When published to public buyers, it will be listed at <strong>{pricingAnalysis.currSymbol} {pricingAnalysis.publicPrice}</strong> (+10% charge added to public buyers).
                          </>
                        ) : (
                          <>A +10% charge is automatically added to your surplus price when the listing is published to public buyers.</>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Excluded Export Countries */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Excluded Export Countries (Optional)</label>
                    <Select
                      isMulti
                      options={excludedCountriesOptions}
                      styles={customSelectStyles}
                      value={excludedCountriesOptions.filter(c => formData.excludedCountries.includes(c.value))}
                      onChange={(options: any) => handleInputChange('excludedCountries', options ? options.map((o: any) => o.value) : [])}
                      placeholder="Select countries to exclude from sale..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sale Method</label>
                    <Select
                      options={saleMethodOptions}
                      styles={customSelectStyles}
                      value={saleMethodOptions.find(opt => opt.value === formData.saleMethod) || null}
                      onChange={(option: any) => handleInputChange('saleMethod', option ? option.value : '')}
                      placeholder="Select Sale Method"
                    />
                  </div>
                </div>
              </section>

            </div>
          )}

          {/* STEP 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="w-full max-w-5xl mx-auto space-y-6 pb-6 pt-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-emerald-950 text-sm font-medium shadow-xs">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-[#0a5c48] shrink-0" />
                  <span>Please review all details carefully before submitting your lot listing for review and publication.</span>
                </div>
              </div>

              {/* Section 1: Manifest File Overview */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                  <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-[#0a5c48]" /> Inventory Manifest File
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#0a5c48] hover:underline bg-[#0a5c48]/10 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Manifest
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl text-xs border border-gray-200/70">
                  <div>
                    <span className="text-gray-500 block font-medium">Uploaded File:</span>
                    <span className="font-bold text-gray-900 truncate block mt-0.5">{manifestFile?.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block font-medium">Total Manifest SKUs:</span>
                    <span className="font-bold text-gray-900 block mt-0.5">{manifestData.length} items parsed</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block font-medium">Total Units & Est. Retail Value:</span>
                    <span className="font-bold text-[#0a5c48] block mt-0.5">{totalUnits.toLocaleString()} units • ${totalRetail.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                </div>
              </section>

              {/* Section 2: Listing Information & Media */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                  <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#0a5c48]" /> Listing Details & Media
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#0a5c48] hover:underline bg-[#0a5c48]/10 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Details
                  </button>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500 font-medium block text-xs">Listing Title:</span>
                    <span className="font-bold text-gray-900 block text-base mt-0.5">{formData.title || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 font-medium block text-xs">Description & Notes:</span>
                    <p className="text-gray-700 bg-gray-50 p-3.5 rounded-xl whitespace-pre-wrap text-xs font-mono border border-gray-200/80 mt-1">
                      {formData.description || 'N/A'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="text-gray-500 font-medium block text-xs">Key Brands Included:</span>
                      <span className="font-semibold text-gray-900 block mt-0.5">{formData.keyBrands || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium block text-xs">Product / Warehouse Media:</span>
                      <span className="font-semibold text-gray-900 block mt-0.5">{mediaFiles.length} file(s) attached</span>
                    </div>
                  </div>

                  {mediaFiles.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pt-2">
                      {mediaFiles.map((f, i) => (
                        <div key={i} className="w-20 h-20 rounded-xl border border-gray-200 overflow-hidden bg-gray-100 shrink-0 relative flex items-center justify-center shadow-xs">
                          {f.type.startsWith('video/') ? (
                            <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-white p-1 text-center">
                              <Film className="w-6 h-6 text-emerald-400 mb-1" />
                              <span className="text-[9px] truncate w-full">{f.name}</span>
                            </div>
                          ) : (
                            <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Section 3: Breakdown, Condition, Logistics & Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Breakdown & Condition */}
                <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                      <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#0a5c48]" /> Categories & Condition
                      </h4>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs font-bold text-[#0a5c48] hover:underline"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <span className="text-gray-500 block font-medium mb-1.5">Category Breakdown:</span>
                        <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-200/70">
                          {categoryAllocations.map(cat => (
                            <div key={cat.id} className="flex justify-between font-medium text-gray-800">
                              <span>{cat.category}</span>
                              <span className="font-bold text-[#0a5c48]">{cat.allocation}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-gray-500 block">Condition:</span>
                          <span className="font-bold text-gray-900">{formData.condition || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Source Type:</span>
                          <span className="font-bold text-gray-900">{formData.sourceType || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Stock Age:</span>
                          <span className="font-bold text-gray-900">{formData.stockAge || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">3rd Party Certificate:</span>
                          <span className="font-bold text-gray-900">{formData.certificate ? 'Available' : 'No'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Logistics & Pricing Summary */}
                <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                      <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#0a5c48]" /> Pricing & Logistics Summary
                      </h4>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs font-bold text-[#0a5c48] hover:underline"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-gray-500 block">Location:</span>
                          <span className="font-bold text-gray-900">{formData.location || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Distinct SKUs / Units:</span>
                          <span className="font-bold text-gray-900">{formData.distinctSkus} SKUs • {formData.manualUnits} Units</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Shipping Size / Pallets:</span>
                          <span className="font-bold text-gray-900">{formData.shippingSize} ({formData.palletCount} pallets)</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Shipping Terms:</span>
                          <span className="font-bold text-gray-900">{formData.shippingTerms || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 bg-emerald-50/70 p-3.5 rounded-xl space-y-1.5 border border-emerald-100">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Currency:</span>
                          <span className="font-bold text-gray-900">{formData.currency}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Total Est. Retail Value (MSRP):</span>
                          <span className="font-bold text-gray-900">{pricingAnalysis.currSymbol} {parseFloat(formData.msrp || '0').toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Surplus Payout (Ask Price):</span>
                          <span className="font-bold text-[#0a5c48] text-sm">{pricingAnalysis.currSymbol} {parseFloat(formData.askPrice || '0').toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                        {pricingAnalysis.hasAsk && (
                          <div className="flex justify-between items-center text-[11px] text-emerald-800 pt-1.5 border-t border-emerald-200/80 font-semibold">
                            <span>Liquidation Discount: {pricingAnalysis.discountPercent}% OFF MSRP</span>
                            <span>Public List Price: {pricingAnalysis.currSymbol} {pricingAnalysis.publicPrice}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-gray-100 p-6 flex justify-between items-center z-10 shrink-0">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : prevStep}
            className="flex items-center px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
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
            onClick={currentStep === 3 ? submitListing : nextStep}
            disabled={isSubmitting}
            className="flex items-center px-8 py-2.5 bg-[#0a5c48] text-white rounded-full font-semibold hover:bg-[#084838] transition-colors shadow-sm disabled:opacity-70 cursor-pointer"
          >
            {currentStep === 3 ? (
              isSubmitting ? 'Submitting...' : 'Submit Listing'
            ) : currentStep === 2 ? (
              <>
                Review & Submit
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue to Details
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
