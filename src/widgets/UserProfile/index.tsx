"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { performLogout } from '../../lib/authCleanup';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/authService';
import { inquiryService } from '../../services/inquiryService';
import { catalogService } from '../../services/catalogService';
import { 
  User, 
  Building2, 
  FileText, 
  Heart, 
  ShieldCheck, 
  Bell, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Package, 
  ExternalLink, 
  Save, 
  Sparkles,
  Layers,
  Edit3,
  Plus,
  Box,
  Boxes,
  Tag,
  Hash,
  ChevronDown,
  Globe,
  Search,
  Check,
  X,
  Trash2,
  LogOut,
  Download,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Eye,
  Info,
  Calendar,
  DollarSign,
  UploadCloud,
  FileSpreadsheet
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useNotifications } from '../../context/NotificationContext';
import Link from 'next/link';
import SimpleListingModal from '../../components/SimpleListingModal';
import LotImportModal from '../../components/LotImportModal';
import AuthModal from '../../components/AuthModal';
import { isProfileComplete } from '../../lib/profileUtils';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchCategories } from '../../store/slices/categorySlice';
import { scrollToTop } from '../../lib/scroll';
import Select, { components } from 'react-select';
import { searchRealLocation, RealLocationSuggestion } from '../../services/locationService';
import { createProductUrl, createLotUrl } from '../../lib/slugs';

const COUNTRY_LIST = [
  // Primary GCC & Regional Hubs
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'Oman',
  'Bahrain',
  // Key Global Trade Partners
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
  'Algeria',
  'Argentina',
  'Austria',
  'Belgium',
  'Chile',
  'Colombia',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Finland',
  'Greece',
  'Hong Kong',
  'Hungary',
  'Iraq',
  'Ireland',
  'Jordan',
  'Kenya',
  'Lebanon',
  'Morocco',
  'New Zealand',
  'Nigeria',
  'Norway',
  'Philippines',
  'Poland',
  'Portugal',
  'Romania',
  'Sweden',
  'Taiwan',
  'Thailand',
  'Vietnam',
  'Other / Worldwide',
];

const customCountrySelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: '0.75rem',
    border: state.isFocused
      ? '1px solid #0f7a61'
      : '1px solid #e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 1px #0f7a61' : 'none',
    padding: '2px 4px',
    backgroundColor: 'white',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    minHeight: '42px',
    transition: 'all 0.15s ease',
    '&:hover': {
      borderColor: state.isFocused ? '#0f7a61' : '#d1d5db',
    },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '2px 8px',
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#111827',
    margin: 0,
    padding: 0,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#9ca3af',
    fontWeight: '400',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#111827',
    fontWeight: '500',
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    zIndex: 60,
    marginTop: '4px',
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: '4px',
    maxHeight: '260px',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    WebkitOverflowScrolling: 'touch',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    borderRadius: '0.5rem',
    margin: '2px 0',
    padding: '8px 12px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontWeight: state.isSelected ? '600' : '500',
    backgroundColor: state.isSelected
      ? '#0f7a61'
      : state.isFocused
        ? '#e6f7ef'
        : 'transparent',
    color: state.isSelected
      ? '#ffffff'
      : state.isFocused
        ? '#0a5c48'
        : '#1f2937',
    '&:active': {
      backgroundColor: '#0f7a61',
      color: '#ffffff',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    color: state.isFocused ? '#0f7a61' : '#9ca3af',
    padding: '6px',
    '&:hover': {
      color: '#0f7a61',
    },
  }),
};

// Custom Menu & MenuList components with data-lenis-prevent and onWheel stopPropagation
// to ensure mouse wheel scrolling operates natively without Lenis smooth-scroll interference.
const CountryMenu = (props: any) => {
  return (
    <div
      data-lenis-prevent
      onWheel={(e) => e.stopPropagation()}
      style={{ overscrollBehavior: 'contain' }}
    >
      <components.Menu {...props}>
        {props.children}
      </components.Menu>
    </div>
  );
};

const CountryMenuList = (props: any) => {
  return (
    <components.MenuList
      {...props}
      innerProps={{
        ...props.innerProps,
        'data-lenis-prevent': 'true',
        onWheel: (e: any) => {
          e.stopPropagation();
          props.innerProps?.onWheel?.(e);
        },
      }}
    >
      {props.children}
    </components.MenuList>
  );
};


export default function UserProfileWidget() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session, status, update } = useSession();
  const { formatPrice, convertToUsd } = useCurrency();
  const { showToast } = useNotifications();

  // Auth modal state for unauthenticated users accessing /profile
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalStep, setAuthModalStep] = useState(1);
  const [isAuthMandatory, setIsAuthMandatory] = useState(false);
  const hasPromptedAuth = useRef(false);

  // Automatically show sign-in modal when unauthenticated user accesses /profile
  useEffect(() => {
    if (status === 'unauthenticated' && !hasPromptedAuth.current) {
      hasPromptedAuth.current = true;
      setAuthModalStep(1);
      setIsAuthMandatory(false);
      setIsAuthModalOpen(true);
    }
  }, [status]);

  const [activeTab, setActiveTab] = useState<'profile' | 'rfqs' | 'submissions' | 'listings' | 'saved' | 'settings'>('profile');

  // Submissions Type Filter State
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'single' | 'lot'>('all');

  // Listing Type Filter State inside Tab 3
  const [listingFilter, setListingFilter] = useState<'all' | 'single' | 'lot'>('all');

  // Modals state
  const [isSimpleModalOpen, setIsSimpleModalOpen] = useState(false);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);

  const handleOpenSimpleModal = () => {
    if (!session?.user) {
      setAuthModalStep(1);
      setIsAuthMandatory(false);
      setIsAuthModalOpen(true);
      return;
    }
    if (!isProfileComplete(session.user)) {
      showToast({
        type: 'warning',
        title: 'Profile Incomplete',
        message: 'You must complete your profile before adding product listings.',
      });
      setAuthModalStep(3);
      setIsAuthMandatory(true);
      setIsAuthModalOpen(true);
      return;
    }
    setIsSimpleModalOpen(true);
  };

  const handleOpenLotModal = () => {
    if (!session?.user) {
      setAuthModalStep(1);
      setIsAuthMandatory(false);
      setIsAuthModalOpen(true);
      return;
    }
    if (!isProfileComplete(session.user)) {
      showToast({
        type: 'warning',
        title: 'Profile Incomplete',
        message: 'You must complete your profile before importing wholesale lot batches.',
      });
      setAuthModalStep(3);
      setIsAuthMandatory(true);
      setIsAuthModalOpen(true);
      return;
    }
    setIsLotModalOpen(true);
  };

  // Form State - Empty if not logged in, populated dynamically from session user
  const u = (session?.user || {}) as any;
  const rawInitialEntity = (u.account_entity_type || u.accountEntityType || u.account_type || u.entity_type || '').toString().toUpperCase();
  const initialEntityType = rawInitialEntity.includes('INDIVIDUAL') ? 'INDIVIDUAL' : rawInitialEntity.includes('COMPANY') ? 'COMPANY' : (u.account_entity_type || 'COMPANY');

  const [vendorId, setVendorId] = useState<string>(
    u.vendor_id || ''
  );
  const [fullName, setFullName] = useState(u.full_name || u.name || u.first_name || '');
  const [email, setEmail] = useState(u.email || '');
  const [phone, setPhone] = useState(u.phone || u.mobile || u.mobile_number || u.phone_number || '');
  const [country, setCountry] = useState<string>(
    u.country || ''
  );
  const [businessLocation, setBusinessLocation] = useState(
    u.business_location && !COUNTRY_LIST.includes(u.business_location) ? u.business_location : (u.business_location || '')
  );
  const [companyName, setCompanyName] = useState(u.company_name || u.companyName || u.company || u.business_name || '');
  const [taxId, setTaxId] = useState(u.tax_id || u.taxId || u.trn || u.trn_number || '');
  const [businessType, setBusinessType] = useState(u.business_type || u.businessType || '');
  const [accountEntityType, setAccountEntityType] = useState(initialEntityType);
  const [userType, setUserType] = useState(u.user_type || 'BUYER');
  const [categoriesInterested, setCategoriesInterested] = useState<string>(
    (u.category_interested || u.categoryInterested || u.categories_interested || '').toString()
  );
  const [address, setAddress] = useState(u.address || u.business_address || u.location || '');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Memoized country options for react-select searchable dropdown
  const countryOptions = useMemo(() => {
    const list = [...COUNTRY_LIST];
    if (country && !list.includes(country)) {
      return [{ value: country, label: country }, ...list.map(c => ({ value: c, label: c }))];
    }
    return list.map(c => ({ value: c, label: c }));
  }, [country]);

  // Redux Categories & Dropdown State
  const { categories: reduxCategories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (!reduxCategories || reduxCategories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, reduxCategories]);

  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const catDropdownRef = useRef<HTMLDivElement>(null);

  // Close category dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target as Node)) {
        setIsCatDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real location search autocomplete states for Business Location
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

  // Parse categories into array safely (handling arrays, json strings, and category names with commas)
  const selectedCategories: string[] = useMemo(() => {
    if (!categoriesInterested) return [];
    if (Array.isArray(categoriesInterested)) return categoriesInterested;
    if (typeof categoriesInterested === 'string') {
      try {
        const parsed = JSON.parse(categoriesInterested);
        if (Array.isArray(parsed)) return parsed;
      } catch {}

      // Match against known category names from Redux to preserve names with commas
      const allCategoryNames = (reduxCategories || [])
        .map((c: any) => (typeof c === 'string' ? c : (c.name || c.title)))
        .filter(Boolean);
      const matched = allCategoryNames.filter((name: string) => categoriesInterested.includes(name));
      if (matched.length > 0) return matched;

      return categoriesInterested
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
    return [];
  }, [categoriesInterested, reduxCategories]);

  // Only use categories coming from API and handled in Redux state
  const categoryOptions = useMemo(() => {
    const list: string[] = [];
    if (reduxCategories && reduxCategories.length > 0) {
      reduxCategories.forEach((c: any) => {
        const name = typeof c === 'string' ? c : (c.name || c.title);
        if (name && !list.includes(name)) list.push(name);
      });
    }
    selectedCategories.forEach((c: string) => {
      if (c && !list.includes(c)) list.push(c);
    });
    return list;
  }, [reduxCategories, selectedCategories]);

  const filteredCategoryOptions = useMemo(() => {
    if (!catSearch.trim()) return categoryOptions;
    return categoryOptions.filter((cat: string) => 
      cat.toLowerCase().includes(catSearch.toLowerCase().trim())
    );
  }, [categoryOptions, catSearch]);

  const toggleCategory = (cat: string) => {
    let updated: string[];
    if (selectedCategories.includes(cat)) {
      updated = selectedCategories.filter((c: string) => c !== cat);
    } else {
      if (selectedCategories.length >= 3) {
        return; // Max 3 categories allowed
      }
      updated = [...selectedCategories, cat];
    }
    setCategoriesInterested(JSON.stringify(updated));
  };

  const removeCategory = (cat: string) => {
    const updated = selectedCategories.filter((c: string) => c !== cat);
    setCategoriesInterested(JSON.stringify(updated));
  };

  // Sync profile fields with logged-in session user data dynamically
  useEffect(() => {
    if (session?.user) {
      const userObj = session.user as any;
      const foundId = userObj.vendor_id || '';
      if (foundId) {
        setVendorId(String(foundId));
        if (typeof window !== 'undefined') {
          localStorage.setItem('vendor_id', String(foundId));
        }
      } else if (typeof window !== 'undefined') {
        const localId = localStorage.getItem('vendor_id');
        if (localId) setVendorId(String(localId));
      }
      setFullName(userObj.full_name || userObj.name || userObj.first_name || (userObj.first_name && userObj.last_name ? `${userObj.first_name} ${userObj.last_name}` : ''));
      setEmail(userObj.email || '');
      setPhone(userObj.phone || userObj.mobile || userObj.mobile_number || userObj.phone_number || '');
      setCountry(userObj.country || '');
      if (userObj.business_location) {
        setBusinessLocation(userObj.business_location);
      }
      setCompanyName(userObj.company_name || userObj.companyName || userObj.company || userObj.business_name || '');
      setTaxId(userObj.tax_id || userObj.taxId || userObj.trn || userObj.trn_number || '');
      setBusinessType(userObj.business_type || userObj.businessType || '');
      
      const rawEntity = (userObj.account_entity_type || userObj.accountEntityType || userObj.account_type || userObj.entity_type || '').toString().toUpperCase();
      const normalizedEntity = rawEntity.includes('INDIVIDUAL') ? 'INDIVIDUAL' : 'COMPANY';
      setAccountEntityType(normalizedEntity);

      const rawUserRole = (userObj.user_type || userObj.userType || userObj.role || '').toString().toUpperCase();
      setUserType(rawUserRole || 'BUYER');

      const rawCat = userObj.category_interested || userObj.categoryInterested || userObj.categories_interested || '';
      setCategoriesInterested(Array.isArray(rawCat) ? JSON.stringify(rawCat) : String(rawCat));
      setAddress(userObj.address || userObj.business_address || userObj.location || '');

      // Proactively fetch latest profile & auto-assigned vendor_id from backend
      if (userObj.email) {
        authService.getProfile(userObj.email).then((res) => {
          if (res?.success && res.data) {
            const vData = res.data;
            const fetchedVendorId = vData.vendor_id || vData.raw_vendor_id || vData.id;
            if (fetchedVendorId) {
              setVendorId(String(fetchedVendorId));
              if (typeof window !== 'undefined') {
                localStorage.setItem('vendor_id', String(fetchedVendorId));
              }
              if (!userObj.vendor_id || userObj.vendor_id !== fetchedVendorId) {
                update({
                  vendor_id: fetchedVendorId,
                });
              }
            }
            if (vData.full_name) setFullName(vData.full_name);
            if (vData.company_name) setCompanyName(vData.company_name);
            if (vData.country) {
              setCountry(vData.country);
            }
            if (vData.business_location) setBusinessLocation(vData.business_location);
            if (vData.business_address) setAddress(vData.business_address);
            if (vData.tax_registration_number) setTaxId(vData.tax_registration_number);
            if (vData.business_type) setBusinessType(vData.business_type);
            if (vData.account_entity_type) {
              const entity = String(vData.account_entity_type).toUpperCase();
              setAccountEntityType(entity.includes('INDIVIDUAL') ? 'INDIVIDUAL' : 'COMPANY');
            }
            if (vData.user_type) setUserType(String(vData.user_type).toUpperCase());
            if (vData.category_interested) {
              const catVal = Array.isArray(vData.category_interested) ? JSON.stringify(vData.category_interested) : String(vData.category_interested);
              setCategoriesInterested(catVal);
            }
          } else if (
            res?.status === 404 ||
            res?.status === 401 ||
            res?.status === 403 ||
            (res && !res.success && (
              res.message?.toLowerCase().includes('not found') ||
              res.message?.toLowerCase().includes('deleted') ||
              res.message?.toLowerCase().includes('does not exist') ||
              res.message?.toLowerCase().includes('inactive')
            ))
          ) {
            console.warn('[UserProfile] User account was deleted or not found on backend. Logging out immediately...');
            performLogout({ redirect: true, callbackUrl: '/?account_deleted=true', reason: 'account_deleted' });
          }
        }).catch((err) => {
          console.error("Failed to auto-fetch vendor profile:", err);
          if (err?.status === 404 || err?.status === 401 || err?.status === 403) {
            performLogout({ redirect: true, callbackUrl: '/?account_deleted=true', reason: 'account_deleted' });
          }
        });
      }
    } else {
      // Clear all fields if user is not logged in
      setVendorId('');
      setFullName('');
      setEmail('');
      setPhone('');
      setCountry('');
      setBusinessLocation('');
      setCompanyName('');
      setTaxId('');
      setBusinessType('');
      setAccountEntityType('COMPANY');
      setUserType('BUYER');
      setCategoriesInterested('');
      setAddress('');
    }
  }, [session]);

  // Settings State
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [rfqUpdates, setRfqUpdates] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setIsAuthModalOpen(true);
      showToast({
        type: 'info',
        title: 'Sign In Required',
        message: 'Please sign in to save and update your business profile.'
      });
      return;
    }
    setIsSaving(true);
    setSaveError('');

    if (!country || !country.trim()) {
      setSaveError('Please select your Country.');
      setIsSaving(false);
      return;
    }

    if (!businessLocation || !businessLocation.trim()) {
      setSaveError('Business Location is required.');
      setIsSaving(false);
      return;
    }

    if (selectedCategories.length < 1) {
      setSaveError('Please select at least 1 category interested (up to 3).');
      setIsSaving(false);
      return;
    }

    if (selectedCategories.length > 3) {
      setSaveError('You can select a maximum of 3 categories.');
      setIsSaving(false);
      return;
    }

    try {
      const payload: any = {
        email: email,
        full_name: fullName,
        mobile_number: phone,
        phone: phone,
        account_entity_type: userType === 'BUYER' ? 'INDIVIDUAL' : (accountEntityType as 'COMPANY' | 'INDIVIDUAL'),
        user_type: userType || 'BUYER',
        country: country.trim(),
        business_location: businessLocation.trim(),
        category_interested: selectedCategories,
        company_name: userType !== 'BUYER' && accountEntityType === 'COMPANY' ? companyName : (companyName || ''),
        business_type: userType !== 'BUYER' && accountEntityType === 'COMPANY' ? businessType : '',
        business_address: userType !== 'BUYER' ? address : '',
        tax_registration_number: userType !== 'BUYER' && accountEntityType === 'COMPANY' ? taxId : '',
      };

      const res = await authService.completeProfile(payload);
      
      if (res.success) {
        const resData = (res.data?.user || res.data?.vendor || res.data?.profile || res.data?.data || res.data || {}) as any;
        const resolvedVendorId = resData.vendor_id || resData.vendorId || resData.raw_vendor_id || resData.id || res.data?.vendor_id || vendorId;

        if (resolvedVendorId) {
          setVendorId(String(resolvedVendorId));
          if (typeof window !== 'undefined') {
            localStorage.setItem('vendor_id', String(resolvedVendorId));
                      }
        }

        // Update NextAuth session with all saved fields
        await update({
          vendor_id: resolvedVendorId ? String(resolvedVendorId) : undefined,
          full_name: fullName || resData.full_name || resData.name,
          name: fullName || resData.full_name || resData.name,
          mobile: phone || resData.mobile_number || resData.mobile,
          phone: phone || resData.mobile_number || resData.mobile,
          country: country || resData.country,
          business_location: businessLocation || resData.business_location || resData.location,
          company_name: companyName || resData.company_name,
          tax_id: taxId || resData.tax_registration_number || resData.tax_id,
          business_type: businessType || resData.business_type,
          address: address || resData.business_address || resData.address,
          account_entity_type: accountEntityType || resData.account_entity_type,
          user_type: userType || resData.user_type,
          category_interested: selectedCategories
        });
        
        setIsSavedNotice(true);
        scrollToTop({ behavior: 'smooth' });
        setTimeout(() => setIsSavedNotice(false), 3000);
        showToast({
          type: 'success',
          title: 'Profile Saved',
          message: 'Your personal and vendor credentials were saved successfully.'
        });
      } else {
        setSaveError(res.message || 'Failed to update profile.');
        showToast({
          type: 'error',
          title: 'Save Failed',
          message: res.message || 'Failed to update profile.'
        });
      }
    } catch (err) {
      setSaveError('An unexpected error occurred while saving.');
      showToast({
        type: 'error',
        title: 'Error',
        message: 'An unexpected error occurred while saving profile.'
      });
    }
    
    setIsSaving(false);
  };

  // Real RFQ, Listing, and Saved Deal Data Types
  interface UserRfqItem {
    id: string | number;
    reference: string;
    created_at?: string;
    date: string;
    status: string;
    contact_person?: string;
    company_name?: string;
    email?: string;
    phone?: string;
    country?: string;
    destination_port?: string;
    incoterm?: string;
    payment_method?: string;
    additional_notes?: string;
    total_units: number;
    estimated_value: number;
    currency?: string;
    items?: Array<{
      id?: string | number;
      title: string;
      sku?: string;
      category?: string;
      quantity: number;
      unitPrice?: number;
      unit_price?: number;
      targetPrice?: number;
      target_price?: number;
      notes?: string;
    }>;
  }

  interface UserSubmissionItem {
    id: string | number;
    reference: string;
    title: string;
    type: 'single' | 'lot';
    category?: string;
    subCategory?: string;
    brand?: string;
    model?: string;
    units: number;
    distinctSkus?: number;
    liquidatingPrice: number;
    msrp?: number;
    currency?: string;
    condition: string;
    status: string;
    submittedAt: string;
    location?: string;
    reasonToSell?: string;
    hasWarranty?: string;
    warranty?: string;
    description?: string;
    manifestFileName?: string;
    manifestItemsCount?: number;
    vendor_id?: string;
    user_email?: string;
    rawItem?: any;
  }

  interface UserListingItem {
    id: string | number;
    displayId: string;
    title: string;
    type: 'single' | 'lot';
    condition: string;
    units: number;
    priceUsd: number;
    status: string;
    image: string;
    category?: string;
    location?: string;
    currency?: string;
    rawItem?: any;
  }

  interface UserSavedDeal {
    id: string | number;
    title: string;
    priceUsd: number;
    originalPrice?: number;
    location?: string;
    image: string;
    type?: 'lot' | 'single';
    units?: number;
    category?: string;
  }

  // RFQ State
  const [rfqsList, setRfqsList] = useState<UserRfqItem[]>([]);
  const [isLoadingRfqs, setIsLoadingRfqs] = useState(false);
  const [selectedRfqDetail, setSelectedRfqDetail] = useState<UserRfqItem | null>(null);

  // Submissions State
  const [submissionsList, setSubmissionsList] = useState<UserSubmissionItem[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [selectedSubmissionDetail, setSelectedSubmissionDetail] = useState<UserSubmissionItem | null>(null);

  // Listings State
  const [listingsList, setListingsList] = useState<UserListingItem[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(false);

  // Saved Deals State
  const [savedDeals, setSavedDeals] = useState<UserSavedDeal[]>([]);

  // Fetch real RFQs from backend and local history strictly for logged-in user
  const fetchUserRfqs = async () => {
    if (!session?.user) {
      setRfqsList([]);
      setIsLoadingRfqs(false);
      return;
    }
    setIsLoadingRfqs(true);
    try {
      let combined: UserRfqItem[] = [];
      const userEmail = email || session?.user?.email;
      const vId = vendorId || (session?.user as any)?.vendor_id;

      if (userEmail || vId) {
        const res = await inquiryService.getUserRfqs(userEmail || undefined, vId || undefined);
        if (res && res.success && res.data) {
          const raw = Array.isArray(res.data) ? res.data : (res.data.results || res.data.rfqs || []);
          if (Array.isArray(raw)) {
            combined = raw.map((r: any) => ({
              id: r.id || r.reference,
              reference: r.reference || `RFQ-${r.id}`,
              created_at: r.created_at,
              date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent',
              status: r.status || 'PENDING',
              contact_person: r.contact_person || '',
              company_name: r.company_name || '',
              email: r.email || '',
              phone: r.phone || '',
              country: r.country || '',
              destination_port: r.destination_port || '',
              incoterm: r.incoterm || 'EXW',
              payment_method: r.payment_method || 'Escrow',
              additional_notes: r.additional_notes || '',
              total_units: Number(r.total_units || 0),
              estimated_value: Number(r.estimated_value || 0),
              currency: r.currency || 'USD',
              items: Array.isArray(r.items) ? r.items : []
            }));
          }
        }
      }

      if (typeof window !== 'undefined') {
        const localHistory = localStorage.getItem('surplus_rfqs_history');
        if (localHistory) {
          try {
            const parsed = JSON.parse(localHistory);
            if (Array.isArray(parsed)) {
              const uEmail = (userEmail || '').toLowerCase().trim();
              const vIdStr = String(vId || '').trim();

              parsed.forEach((item: any) => {
                const itemEmail = (item.email || item.user_email || '').toLowerCase().trim();
                const itemVendor = String(item.vendor_id || item.vendorId || '').trim();

                // Strict isolation: only include RFQs matching the logged user's credentials
                const isOwner =
                  (uEmail && itemEmail === uEmail) ||
                  (vIdStr && itemVendor === vIdStr) ||
                  (!itemEmail && !itemVendor);

                if (!isOwner) return;

                const alreadyExists = combined.some(
                  c => (c.reference && c.reference === item.reference) || (c.id && String(c.id) === String(item.id))
                );
                if (!alreadyExists) {
                  combined.push({
                    id: item.id || item.reference,
                    reference: item.reference || `RFQ-${item.id}`,
                    created_at: item.created_at,
                    date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent',
                    status: item.status || 'PENDING',
                    contact_person: item.contact_person || '',
                    company_name: item.company_name || '',
                    email: item.email || '',
                    phone: item.phone || '',
                    country: item.country || '',
                    destination_port: item.destination_port || '',
                    incoterm: item.incoterm || 'EXW',
                    payment_method: item.payment_method || 'Escrow',
                    additional_notes: item.additional_notes || '',
                    total_units: Number(item.total_units || 0),
                    estimated_value: Number(item.estimated_value || 0),
                    currency: item.currency || 'USD',
                    items: Array.isArray(item.items) ? item.items : []
                  });
                }
              });
            }
          } catch (e) {
            console.warn('Could not parse local RFQ history', e);
          }
        }
      }

      setRfqsList(combined);
    } catch (err) {
      console.error('Error fetching RFQs:', err);
    } finally {
      setIsLoadingRfqs(false);
    }
  };

  // Fetch submitted product & wholesale lot requests (pending verification / curation)
  const fetchUserSubmissions = async () => {
    if (!session?.user) {
      setSubmissionsList([]);
      setIsLoadingSubmissions(false);
      return;
    }
    setIsLoadingSubmissions(true);
    try {
      let combined: UserSubmissionItem[] = [];
      const userEmail = (email || session?.user?.email || '').toLowerCase().trim();
      const vId = String(vendorId || (session?.user as any)?.vendor_id || '').trim();

      // 1. Backend API query (safe fallback)
      try {
        const [prodSubRes, lotSubRes] = await Promise.allSettled([
          catalogService.getUserProductSubmissions(userEmail || undefined, vId || undefined),
          catalogService.getUserLotSubmissions(userEmail || undefined, vId || undefined)
        ]);

        if (prodSubRes.status === 'fulfilled' && prodSubRes.value?.success && prodSubRes.value?.data) {
          const rawProds = Array.isArray(prodSubRes.value.data) ? prodSubRes.value.data : (prodSubRes.value.data.results || []);
          rawProds.forEach((p: any) => {
            combined.push({
              id: p.id || `PRD-SUB-${p.reference || Date.now()}`,
              reference: p.reference || `PRD-${p.id || String(Date.now()).slice(-6)}`,
              title: p.title || p.product_name || p.productName || 'Surplus Single Product',
              type: 'single',
              category: p.category || '',
              subCategory: p.subCategory || p.sub_category || '',
              brand: p.brand || p.brandName || '',
              model: p.model || p.modelNo || '',
              units: Number(p.quantity || p.units || 1),
              liquidatingPrice: Number(p.liquidatingPrice || p.price || 0),
              msrp: Number(p.msrp || p.originalPrice || 0),
              currency: p.currency || 'USD',
              condition: p.condition || 'Brand New Surplus',
              status: p.status || (p.is_verified ? 'Approved' : 'Pending Verification'),
              submittedAt: p.submittedAt || p.created_at || new Date().toISOString(),
              location: p.location || p.inventory_location || 'UAE Warehouse',
              reasonToSell: p.reasonToSell || p.reason_to_sell || '',
              hasWarranty: p.hasWarranty || p.has_warranty || '',
              warranty: p.warranty || '',
              description: p.description || '',
              vendor_id: p.vendor_id || vId,
              user_email: p.user_email || p.email || userEmail,
              rawItem: p
            });
          });
        }

        if (lotSubRes.status === 'fulfilled' && lotSubRes.value?.success && lotSubRes.value?.data) {
          const rawLots = Array.isArray(lotSubRes.value.data) ? lotSubRes.value.data : (lotSubRes.value.data.results || []);
          rawLots.forEach((l: any) => {
            combined.push({
              id: l.id || `LOT-SUB-${l.reference || Date.now()}`,
              reference: l.reference || `LOT-${l.id || String(Date.now()).slice(-6)}`,
              title: l.title || l.lot_title || 'Wholesale Liquidation Lot Batch',
              type: 'lot',
              category: l.category || 'Wholesale Liquidation',
              units: Number(l.total_units || l.total_units_quantity || l.units || 1),
              distinctSkus: Number(l.distinctSkus || l.number_of_distinct_skus || l.manifest_items?.length || 0),
              liquidatingPrice: Number(l.asking_price || l.ask_price_surplus_payout || l.price || 0),
              msrp: Number(l.msrp || l.total_retail || l.total_est_retail_value_msrp || 0),
              currency: l.currency || 'USD',
              condition: l.condition || 'Factory Sealed Wholesale',
              status: l.status || (l.is_verified ? 'Approved' : 'Under Verification'),
              submittedAt: l.submittedAt || l.created_at || new Date().toISOString(),
              location: l.location || l.inventory_location || 'Regional Liquidation Center',
              manifestFileName: l.manifestFileName || l.file_name || 'manifest.xlsx',
              manifestItemsCount: Number(l.manifestItemsCount || l.manifest_items?.length || 0),
              description: l.description || l.lot_description_and_notes || '',
              vendor_id: l.vendor_id || vId,
              user_email: l.user_email || l.email || userEmail,
              rawItem: l
            });
          });
        }
      } catch (backendErr) {
        console.warn('Backend submissions fetch fallback to localStorage', backendErr);
      }

      // 2. Local storage submissions filtered strictly for this logged-in user
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('surplus_product_submissions');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              parsed.forEach((item: any) => {
                const itemEmail = (item.user_email || item.email || '').toLowerCase().trim();
                const itemVendor = String(item.vendor_id || item.vendorId || '').trim();

                const isOwner =
                  (userEmail && itemEmail === userEmail) ||
                  (vId && itemVendor === vId) ||
                  (!itemEmail && !itemVendor);

                if (!isOwner) return;

                const alreadyExists = combined.some(
                  c => (c.reference && c.reference === item.reference) || (c.id && String(c.id) === String(item.id))
                );

                if (!alreadyExists) {
                  combined.push({
                    id: item.id || `SUB-${Date.now()}`,
                    reference: item.reference || `SUB-${String(Date.now()).slice(-6)}`,
                    title: item.title || 'Submitted Surplus Listing',
                    type: item.type === 'lot' ? 'lot' : 'single',
                    category: item.category || '',
                    subCategory: item.subCategory || '',
                    brand: item.brand || '',
                    model: item.model || '',
                    units: Number(item.units || 1),
                    distinctSkus: Number(item.distinctSkus || 0),
                    liquidatingPrice: Number(item.liquidatingPrice || 0),
                    msrp: Number(item.msrp || 0),
                    currency: item.currency || 'USD',
                    condition: item.condition || 'Verified Surplus',
                    status: item.status || 'Pending Verification',
                    submittedAt: item.submittedAt || new Date().toISOString(),
                    location: item.location || 'UAE Warehouse',
                    reasonToSell: item.reasonToSell,
                    hasWarranty: item.hasWarranty,
                    warranty: item.warranty,
                    description: item.description,
                    manifestFileName: item.manifestFileName,
                    manifestItemsCount: item.manifestItemsCount,
                    vendor_id: item.vendor_id,
                    user_email: item.user_email,
                    rawItem: item
                  });
                }
              });
            }
          } catch (e) {
            console.warn('Could not parse local submissions history', e);
          }
        }
      }

      // Sort newest submissions first
      combined.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setSubmissionsList(combined);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  // Fetch real listings (single products & lots) from backend
  const fetchUserListings = async () => {
    if (!session?.user) {
      setListingsList([]);
      setIsLoadingListings(false);
      return;
    }
    setIsLoadingListings(true);
    try {
      const vId = vendorId || (session?.user as any)?.vendor_id;
      const [productsRes, lotsRes] = await Promise.allSettled([
        catalogService.getProducts(vId ? { vendor_id: vId } : undefined),
        catalogService.getLots(vId ? { vendor_id: vId } : undefined)
      ]);

      const items: UserListingItem[] = [];

      if (productsRes.status === 'fulfilled' && Array.isArray(productsRes.value)) {
        productsRes.value.forEach((p: any) => {
          if (vId && p.vendor_id && String(p.vendor_id) !== String(vId)) return;
          // Filter only available / active listings, not removed or inactive items
          const isAvailable = p.is_active !== false && String(p.enquiry_status || 'approved').toUpperCase() === 'APPROVED';
          if (!isAvailable) return;
          items.push({
            id: p.id,
            displayId: p.product_id || p.sku || `PRD-${p.id}`,
            title: p.title,
            type: 'single',
            condition: p.condition || 'Brand New Surplus',
            units: p.quantity || p.estQty || p.moq || 1,
            priceUsd: convertToUsd(p.price || p.liquidatingPrice || 0, p.currency),
            status: p.isCertified ? 'Verified Active' : 'Active',
            image: p.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
            category: p.category,
            location: p.location || p.inventory_location || 'UAE Warehouse',
            currency: 'USD',
            rawItem: p
          });
        });
      }

      if (lotsRes.status === 'fulfilled' && Array.isArray(lotsRes.value)) {
        lotsRes.value.forEach((l: any) => {
          if (vId && l.vendor_id && String(l.vendor_id) !== String(vId)) return;
          // Filter only available / active listings, not removed or inactive items
          const isAvailable = l.is_active !== false && 
                              String(l.active_status || '').toLowerCase() !== 'inactive' && 
                              String(l.enquiry_status || 'approved').toLowerCase() === 'approved';
          if (!isAvailable) return;
          items.push({
            id: l.id,
            displayId: l.lot_number || `LOT-${l.id}`,
            title: l.title || l.listing_title || 'Wholesale Liquidation Lot Batch',
            type: 'lot',
            condition: l.condition || 'Factory Sealed Wholesale',
            units: l.total_units_quantity || l.units || 1,
            priceUsd: convertToUsd(l.ask_price_surplus_payout || l.price || l.msrp || 0, l.currency),
            status: l.active_status || (l.is_active !== false ? 'Active Lot' : 'Under Review'),
            image: l.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=300&q=80',
            category: l.category,
            location: l.location || l.inventory_location || 'Regional Liquidation Center',
            currency: 'USD',
            rawItem: l
          });
        });
      }

      setListingsList(items);
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setIsLoadingListings(false);
    }
  };

  // Load Saved Deals from local storage
  const loadSavedDeals = () => {
    if (!session?.user) {
      setSavedDeals([]);
      return;
    }
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('surplus_saved_deals');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setSavedDeals(parsed);
            return;
          }
        }
      } catch (e) {
        console.warn('Error reading saved deals', e);
      }
    }
    setSavedDeals([]);
  };

  const handleRemoveSaved = (id: string | number) => {
    const updated = savedDeals.filter(s => String(s.id) !== String(id));
    setSavedDeals(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('surplus_saved_deals', JSON.stringify(updated));
    }
    showToast({
      type: 'info',
      title: 'Removed from Saved Deals',
      message: 'Item was removed from your saved bookmarks.'
    });
  };

  // Account Settings persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSettings = localStorage.getItem('surplus_account_settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (typeof parsed.emailNotifs === 'boolean') setEmailNotifs(parsed.emailNotifs);
          if (typeof parsed.rfqUpdates === 'boolean') setRfqUpdates(parsed.rfqUpdates);
          if (typeof parsed.priceAlerts === 'boolean') setPriceAlerts(parsed.priceAlerts);
        }
      } catch (e) {
        console.warn('Error loading account settings', e);
      }
    }
  }, []);

  const handleToggleSetting = (key: 'emailNotifs' | 'rfqUpdates' | 'priceAlerts', val: boolean) => {
    if (key === 'emailNotifs') setEmailNotifs(val);
    if (key === 'rfqUpdates') setRfqUpdates(val);
    if (key === 'priceAlerts') setPriceAlerts(val);

    if (typeof window !== 'undefined') {
      const current = {
        emailNotifs: key === 'emailNotifs' ? val : emailNotifs,
        rfqUpdates: key === 'rfqUpdates' ? val : rfqUpdates,
        priceAlerts: key === 'priceAlerts' ? val : priceAlerts,
      };
      localStorage.setItem('surplus_account_settings', JSON.stringify(current));
      showToast({
        type: 'success',
        title: 'Preferences Updated',
        message: 'Your notification preferences have been saved.'
      });
    }
  };

  const handleClearCache = () => {
    if (typeof window !== 'undefined') {
      const keysToClear = ['surplus_rfqs_history', 'surplus_product_submissions', 'surplus_saved_deals', 'surplus_account_settings'];
      keysToClear.forEach(k => localStorage.removeItem(k));
      loadSavedDeals();
      fetchUserRfqs();
      fetchUserSubmissions();
      showToast({
        type: 'info',
        title: 'Local Cache Cleared',
        message: 'Your browser session cache has been refreshed.'
      });
    }
  };

  const handleExportData = () => {
    if (!session?.user) {
      setIsAuthModalOpen(true);
      showToast({
        type: 'info',
        title: 'Sign In Required',
        message: 'Please sign in to export your account data.'
      });
      return;
    }
    const dataToExport = {
      user_profile: {
        vendor_id: vendorId,
        full_name: fullName,
        email: email,
        phone: phone,
        country: country,
        business_location: businessLocation,
        company_name: companyName,
        tax_id: taxId,
        business_type: businessType,
        account_entity_type: accountEntityType,
        user_type: userType,
        categories_interested: categoriesInterested,
        address: address,
      },
      rfqs_count: rfqsList.length,
      rfqs: rfqsList,
      submissions_count: submissionsList.length,
      submissions: submissionsList,
      listings_count: listingsList.length,
      saved_deals_count: savedDeals.length,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `surplus-account-data-${vendorId || 'user'}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast({
      type: 'success',
      title: 'Data Exported',
      message: 'Account summary downloaded successfully.'
    });
  };

  const getStatusBadge = (status: string = 'PENDING') => {
    const s = (status || '').toUpperCase();
    if (s.includes('APPROV') || s.includes('ACCEPT') || s.includes('COMPLET') || s.includes('QUOTE REC')) {
      return { bg: 'bg-emerald-100 text-[#0f7a61] border border-emerald-200', label: status || 'Approved' };
    }
    if (s.includes('REJECT') || s.includes('DECLIN') || s.includes('CANCEL')) {
      return { bg: 'bg-red-100 text-red-700 border border-red-200', label: status || 'Declined' };
    }
    if (s.includes('REVIEW') || s.includes('PROCESS')) {
      return { bg: 'bg-blue-100 text-blue-700 border border-blue-200', label: status || 'Under Review' };
    }
    return { bg: 'bg-amber-100 text-amber-700 border border-amber-200', label: status || 'Pending Review' };
  };

  const getSubmissionStatusBadge = (status: string = 'Pending Verification') => {
    const s = (status || '').toUpperCase();
    if (s.includes('APPROV') || s.includes('VERIFIED') || s.includes('PUBLISH') || s.includes('ACTIVE')) {
      return { bg: 'bg-emerald-100 text-[#0f7a61] border border-emerald-200', label: status || 'Approved & Published', dot: 'bg-[#0f7a61]' };
    }
    if (s.includes('REJECT') || s.includes('DECLIN') || s.includes('CANCEL')) {
      return { bg: 'bg-red-100 text-red-700 border border-red-200', label: status || 'Declined', dot: 'bg-red-500' };
    }
    if (s.includes('REVIEW') || s.includes('PROCESS')) {
      return { bg: 'bg-blue-100 text-blue-700 border border-blue-200', label: status || 'Under Review', dot: 'bg-blue-500' };
    }
    return { bg: 'bg-amber-100 text-amber-800 border border-amber-200', label: status || 'Pending Verification', dot: 'bg-amber-500' };
  };

  // Sync and fetch on mount & profile change
  useEffect(() => {
    if (!session?.user) {
      setRfqsList([]);
      setSubmissionsList([]);
      setListingsList([]);
      setSavedDeals([]);
      return;
    }
    fetchUserRfqs();
    fetchUserSubmissions();
    fetchUserListings();
    loadSavedDeals();
  }, [session, email, vendorId]);

  const filteredSubmissions = useMemo(() => {
    return submissionsList.filter(item => {
      if (submissionFilter === 'single') return item.type === 'single';
      if (submissionFilter === 'lot') return item.type === 'lot';
      return true;
    });
  }, [submissionsList, submissionFilter]);

  const filteredListings = useMemo(() => {
    return listingsList.filter(item => {
      if (listingFilter === 'single') return item.type === 'single';
      if (listingFilter === 'lot') return item.type === 'lot';
      return true;
    });
  }, [listingsList, listingFilter]);


  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center p-8">
        <div className="flex items-center space-x-3 text-gray-500 font-medium">
          <svg className="animate-spin h-5 w-5 text-[#0f7a61]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  const getSubtitleText = () => {
    if (!session?.user) {
      return 'Guest Profile • Sign in to view and manage your account';
    }
    if (userType === 'BUYER') {
      return companyName ? `${companyName} • Registered Buyer` : 'Registered Surplus Buyer';
    }
    if (accountEntityType === 'INDIVIDUAL') {
      if (companyName) {
        return `${companyName} • Individual Account`;
      }
      return 'Individual Account';
    }
    if (companyName && businessType) {
      return `${companyName} • ${businessType}`;
    }
    if (companyName) {
      return `${companyName} • Company/Business`;
    }
    if (businessType) {
      return businessType;
    }
    return 'Company / Business Account';
  };

  return (
    <section className="py-10 bg-gray-50/60 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Profile Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Avatar & User Details */}
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#0f7a61] to-[#1bbd98] text-white flex items-center justify-center font-extrabold text-3xl shadow-md border-4 border-white">
                  {fullName ? fullName[0].toUpperCase() : <User className="w-10 h-10 text-white/90" />}
                </div>
                {session?.user && (
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-[#0f7a61]" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{fullName || (session?.user ? 'User Profile' : 'Guest Account')}</h1>
                  {session?.user ? (
                    <span className="bg-[#e6f7ef] text-[#0f7a61] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {userType === 'BUYER' ? 'Verified Buyer' : (accountEntityType === 'INDIVIDUAL' ? 'Verified Individual' : 'Verified Business')}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Not Signed In</span> • <span className="text-[#0f7a61] underline">Sign In</span>
                    </button>
                  )}
                  {vendorId && (
                    <span className="bg-emerald-50 text-[#0f7a61] border border-emerald-200/80 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 font-mono shadow-2xs" title="Vendor ID">
                      <Hash className="w-3 h-3 text-[#0f7a61]" /> Vendor ID: {vendorId.startsWith('USR') || vendorId.startsWith('#') ? vendorId : `#${vendorId}`}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {getSubtitleText()}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                  {vendorId && (
                    <span className="flex items-center gap-1 font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md font-mono">
                      <Hash className="w-3.5 h-3.5 text-gray-400" /> Vendor ID: <strong>{vendorId}</strong>
                    </span>
                  )}
                  {email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gray-400" /> {email}
                    </span>
                  )}
                  {country && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-gray-400" /> {country}
                    </span>
                  )}
                  {businessLocation && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" /> {businessLocation}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('rfqs')}
                className="p-2 rounded-xl hover:bg-white hover:shadow-2xs transition-all text-center cursor-pointer group"
              >
                <div className="text-lg font-bold text-gray-900 group-hover:text-[#0f7a61] transition-colors">{rfqsList.length}</div>
                <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Active RFQs</div>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('submissions')}
                className="p-2 rounded-xl hover:bg-white hover:shadow-2xs transition-all text-center cursor-pointer group"
              >
                <div className="text-lg font-bold text-amber-600 group-hover:text-amber-700 transition-colors">{submissionsList.length}</div>
                <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Submissions</div>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('listings')}
                className="p-2 rounded-xl hover:bg-white hover:shadow-2xs transition-all text-center cursor-pointer group"
              >
                <div className="text-lg font-bold text-[#0f7a61] group-hover:text-[#0c6651] transition-colors">{listingsList.length}</div>
                <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Live Listings</div>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className="p-2 rounded-xl hover:bg-white hover:shadow-2xs transition-all text-center cursor-pointer group"
              >
                <div className="text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{savedDeals.length}</div>
                <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Saved Deals</div>
              </button>
            </div>

          </div>
        </div>

        {/* Guest / Unauthenticated Notice Banner */}
        {!session?.user && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">You are currently viewing this page as a guest</p>
                <p className="text-xs text-amber-700 mt-0.5">Please sign in to access your business credentials, active RFQs, submissions, and inventory listings.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-[#0f7a61] hover:bg-[#0c6651] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              Sign In / Register
            </button>
          </div>
        )}

        {/* Saved Toast Notification */}
        {isSavedNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold">Profile updated successfully!</span>
            </div>
          </div>
        )}

        {/* Main Profile Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Navigation Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-3 border border-gray-100 shadow-sm space-y-1">
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#0f7a61] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile Info</span>
              </button>

              <button
                onClick={() => setActiveTab('rfqs')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'rfqs'
                    ? 'bg-[#0f7a61] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4" />
                  <span>My RFQs & Quotes</span>
                </div>
                {rfqsList.length > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === 'rfqs' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {rfqsList.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('submissions')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'submissions'
                    ? 'bg-[#0f7a61] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <UploadCloud className="w-4 h-4" />
                  <span>Product Submissions</span>
                </div>
                {submissionsList.length > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === 'submissions' ? 'bg-amber-400 text-gray-900' : 'bg-amber-100 text-amber-800'}`}>
                    {submissionsList.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('listings')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'listings'
                    ? 'bg-[#0f7a61] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Layers className="w-4 h-4" />
                  <span>Live Inventory Listings</span>
                </div>
                {listingsList.length > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === 'listings' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-[#0f7a61]'}`}>
                    {listingsList.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('saved')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'saved'
                    ? 'bg-[#0f7a61] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Heart className="w-4 h-4" />
                  <span>Saved Deals</span>
                </div>
                {savedDeals.length > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === 'saved' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
                    {savedDeals.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-[#0f7a61] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Account & Settings</span>
              </button>

              {!session?.user && (
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0f7a61] text-white hover:bg-[#0c6651] transition-all shadow-sm cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In to Account</span>
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Tab View Content */}
          <div className="lg:col-span-3">

            {/* TAB 1: Profile Info */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Personal Details</h2>
                  <p className="text-gray-500 text-xs">Manage your personal contact info and credentials.</p>
                  
                  {saveError && (
                    <div className="mt-4 bg-red-50 text-red-600 text-sm font-medium p-3 rounded-xl border border-red-100">
                      {saveError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Vendor ID</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={vendorId ? (vendorId.startsWith('USR') || vendorId.startsWith('#') ? vendorId : `#${vendorId}`) : (session?.user ? 'Assigned upon verification' : 'Not Signed In')} 
                          readOnly 
                          disabled
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm font-mono cursor-not-allowed select-all font-semibold" 
                        />
                        {vendorId ? (
                          <span className="absolute right-3 top-2.5 text-[11px] font-bold text-[#0f7a61] bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            Verified ID
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="text" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Country *
                      </label>
                      <Select
                        instanceId="user-profile-country-select"
                        isSearchable={true}
                        isClearable={false}
                        placeholder="Search or select country..."
                        options={countryOptions}
                        value={country ? { value: country, label: country } : null}
                        onChange={(selected: any) => {
                          setCountry(selected ? selected.value : '');
                        }}
                        styles={customCountrySelectStyles}
                        components={{
                          Menu: CountryMenu,
                          MenuList: CountryMenuList,
                        }}
                        noOptionsMessage={({ inputValue }) =>
                          inputValue ? `No country matching "${inputValue}"` : 'No countries available'
                        }
                      />
                    </div>

                    <div className={`relative ${showLocationSuggestions ? 'z-30' : ''}`} ref={locationSearchRef}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
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
                          placeholder={country ? `Search area, town, or city in ${country}...` : "e.g. Dubai, Jebel Ali Free Zone, Riyadh, Mumbai"}
                          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                        />
                        <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        {isSearchingLocation ? (
                          <div className="w-4 h-4 border-2 border-[#0a5c48] border-t-transparent rounded-full animate-spin absolute right-3 top-3"></div>
                        ) : businessLocation ? (
                          <button
                            type="button"
                            onClick={() => {
                              setBusinessLocation('');
                              setLocationSuggestions([]);
                              setShowLocationSuggestions(false);
                            }}
                            className="text-gray-400 hover:text-gray-600 absolute right-3 top-2.5 p-0.5"
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
                            {country && (
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
                    {userType !== 'BUYER' && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Account Entity Type</label>
                        <div className="flex bg-gray-100 p-1 rounded-xl mt-0">
                          {['COMPANY', 'INDIVIDUAL'].map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setAccountEntityType(type)}
                              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${accountEntityType === type ? 'bg-white text-[#0f7a61] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                              {type === 'COMPANY' ? 'Company/Business' : 'Individual'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Account Role</label>
                      <div className="flex bg-gray-100 p-1 rounded-xl mt-0">
                        {['BUYER', 'SELLER', 'BOTH'].map(role => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setUserType(role)}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${userType === role ? 'bg-white text-[#0f7a61] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            {role === 'BUYER' ? 'Buyer' : role === 'SELLER' ? 'Seller' : 'Both'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="sm:col-span-2 relative" ref={catDropdownRef}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-gray-700">
                          Categories Interested * <span className="text-gray-400 font-normal">(Min 1, Max 3)</span>
                        </label>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          selectedCategories.length >= 1 && selectedCategories.length <= 3
                            ? 'text-[#0f7a61] bg-emerald-50'
                            : selectedCategories.length === 0
                              ? 'text-red-500 bg-red-50'
                              : 'text-amber-600 bg-amber-50'
                        }`}>
                          {selectedCategories.length}/3 selected
                        </span>
                      </div>

                      {/* Dropdown Trigger */}
                      <div 
                        onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                        className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl border bg-white flex items-center justify-between cursor-pointer transition-all ${
                          isCatDropdownOpen 
                            ? 'border-[#0f7a61] ring-1 ring-[#0f7a61] shadow-sm' 
                            : selectedCategories.length === 0
                              ? 'border-gray-200 hover:border-gray-300'
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-wrap gap-1.5 items-center flex-1 pr-2">
                          {selectedCategories.length === 0 ? (
                            <span className="text-gray-400 text-sm">-- Select Categories Interested (Min 1, Max 3) --</span>
                          ) : (
                            selectedCategories.map((cat) => (
                              <span 
                                key={cat} 
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0f7a61] text-xs font-semibold border border-emerald-100"
                              >
                                {cat}
                                <button 
                                  type="button" 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    removeCategory(cat); 
                                  }}
                                  className="hover:bg-[#0f7a61] hover:text-white rounded-full p-0.5 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 pl-2 border-l border-gray-100 text-gray-400">
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCatDropdownOpen ? 'rotate-180 text-[#0f7a61]' : ''}`} />
                        </div>
                      </div>

                      {/* Dropdown Menu Popover */}
                      {isCatDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-3 max-h-72 flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
                          {/* Search Filter */}
                          <div className="relative mb-2.5">
                            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input 
                              type="text"
                              value={catSearch}
                              onChange={(e) => setCatSearch(e.target.value)}
                              placeholder="Search categories..."
                              className="w-full pl-8.5 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0f7a61] focus:bg-white text-gray-900 transition-all"
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                            {catSearch && (
                              <button 
                                type="button" 
                                onClick={(e) => { e.stopPropagation(); setCatSearch(''); }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* List of categories */}
                          <div className="overflow-y-auto flex-1 space-y-1 pr-1 max-h-48 divide-y divide-gray-50">
                            {filteredCategoryOptions.map((cat: string) => {
                              const isSelected = selectedCategories.includes(cat);
                              const isDisabled = !isSelected && selectedCategories.length >= 3;
                              return (
                                <button
                                  key={cat}
                                  type="button"
                                  disabled={isDisabled}
                                  onClick={() => toggleCategory(cat)}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                                    isSelected 
                                      ? 'bg-emerald-50 text-[#0f7a61] font-semibold' 
                                      : isDisabled
                                        ? 'text-gray-300 cursor-not-allowed opacity-50'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                  }`}
                                >
                                  <span>{cat}</span>
                                  {isSelected ? (
                                    <div className="w-4 h-4 rounded-md bg-[#0f7a61] flex items-center justify-center text-white">
                                      <Check className="w-3 h-3" />
                                    </div>
                                  ) : (
                                    <div className={`w-4 h-4 rounded-md border ${isDisabled ? 'border-gray-200 bg-gray-100' : 'border-gray-300 hover:border-gray-400'}`} />
                                  )}
                                </button>
                              );
                            })}
                            {filteredCategoryOptions.length === 0 && (
                              <div className="py-6 text-center text-xs text-gray-400">
                                {reduxCategories && reduxCategories.length === 0 ? 'Loading categories...' : 'No matching categories found'}
                              </div>
                            )}
                          </div>

                          {/* Footer with Clear All / Done */}
                          <div className="pt-2.5 mt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              {selectedCategories.length > 0 && (
                                <button 
                                  type="button" 
                                  onClick={(e) => { e.stopPropagation(); setCategoriesInterested(''); }}
                                  className="text-red-500 hover:text-red-700 font-semibold text-xs transition-colors"
                                >
                                  Clear All
                                </button>
                              )}
                              {selectedCategories.length >= 3 && (
                                <span className="text-[11px] text-amber-600 font-medium">Max 3 reached</span>
                              )}
                            </div>
                            <button 
                              type="button" 
                              onClick={() => setIsCatDropdownOpen(false)}
                              className="bg-[#0f7a61] hover:bg-[#0c6651] text-white px-4 py-1.5 rounded-xl font-semibold text-xs transition-colors shadow-sm"
                            >
                              Done ({selectedCategories.length}/3)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {userType !== 'BUYER' && accountEntityType === 'COMPANY' && (
                  <>
                    <div className="h-px bg-gray-100"></div>

                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">Business & Company Details</h2>
                      <p className="text-gray-500 text-xs">Verified tax & business registration details.</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name</label>
                      <input 
                        type="text" 
                        value={companyName} 
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter company name"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Tax Registration / TRN Number</label>
                      <input 
                        type="text" 
                        value={taxId} 
                        onChange={(e) => setTaxId(e.target.value)}
                        placeholder="Enter TRN / Tax ID"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Business Type</label>
                      <select 
                        value={businessType} 
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#0f7a61]"
                      >
                        <option value="">Select Business Type</option>
                        <option value="Wholesaler / Distributor">Wholesaler / Distributor</option>
                        <option value="Liquidator / Surplus Buyer">Liquidator / Surplus Buyer</option>
                        <option value="Retail Store Chain">Retail Store Chain</option>
                        <option value="Manufacturer / OEM">Manufacturer / OEM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Business Address</label>
                      <input 
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter business address"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                      />
                    </div>
                  </div>
                </div>
                </>
                )}

                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#0f7a61] hover:bg-[#0c6651] text-white font-semibold text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Saving...
                      </span>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: My RFQs */}
            {activeTab === 'rfqs' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">RFQ & Quote History</h2>
                    <p className="text-gray-500 text-xs mt-0.5">Track submitted quotation requests, line items, and seller responses.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={fetchUserRfqs}
                      disabled={isLoadingRfqs}
                      className="p-2 rounded-full border border-gray-200 text-gray-600 hover:text-[#0f7a61] hover:border-[#0f7a61] transition-colors disabled:opacity-50"
                      title="Refresh RFQs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRfqs ? 'animate-spin' : ''}`} />
                    </button>
                    <Link href="/browse" className="bg-[#0f7a61] hover:bg-[#0c6651] text-white font-semibold text-xs px-4 py-2 rounded-full transition-colors shadow-sm">
                      + New RFQ
                    </Link>
                  </div>
                </div>

                {isLoadingRfqs ? (
                  <div className="py-16 text-center">
                    <div className="animate-spin w-8 h-8 border-3 border-[#0f7a61] border-t-transparent rounded-full mx-auto mb-3" />
                    <p className="text-xs text-gray-500 font-medium">Loading your RFQ history...</p>
                  </div>
                ) : rfqsList.length === 0 ? (
                  <div className="text-center py-16 px-4 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#0f7a61] flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">No RFQs or Quotations Yet</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                      You haven't requested any quotations yet. Browse our verified wholesale lots and industrial equipment, add items to your RFQ basket, and submit a quote request to receive competitive proforma pricing from certified sellers.
                    </p>
                    <Link
                      href="/browse"
                      className="bg-[#0f7a61] hover:bg-[#0c6651] text-white text-xs font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      Browse Wholesale Marketplace <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rfqsList.map((rfq) => {
                      const badge = getStatusBadge(rfq.status);
                      const titleSnippet = rfq.items && rfq.items.length > 0
                        ? rfq.items[0].title + (rfq.items.length > 1 ? ` (+${rfq.items.length - 1} more items)` : '')
                        : (rfq.company_name ? `Quotation Order - ${rfq.company_name}` : 'Wholesale Lot Quotation Request');
                      const itemsCount = rfq.items ? rfq.items.length : 1;

                      return (
                        <div key={rfq.id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/60 hover:border-gray-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-bold text-gray-900 text-sm">{rfq.reference}</span>
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${badge.bg}`}>
                                {badge.label}
                              </span>
                              {rfq.destination_port && (
                                <span className="text-[11px] text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gray-400" /> {rfq.destination_port}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 mt-1.5 truncate">{titleSnippet}</h4>
                            <p className="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" /> {rfq.date}
                              </span>
                              <span>&bull;</span>
                              <span>{itemsCount} item{itemsCount > 1 ? 's' : ''}</span>
                              <span>&bull;</span>
                              <span>{rfq.total_units.toLocaleString()} total units</span>
                              {rfq.incoterm && (
                                <>
                                  <span>&bull;</span>
                                  <span className="font-medium text-gray-600">{rfq.incoterm}</span>
                                </>
                              )}
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-0 pt-3 sm:pt-0 border-gray-200 shrink-0">
                            <div className="text-left sm:text-right">
                              <div className="text-[11px] text-gray-400 font-medium">Estimated Value</div>
                              <div className="text-base font-extrabold text-[#0f7a61]">
                                {formatPrice(rfq.estimated_value)}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedRfqDetail(rfq)}
                              className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                            >
                              View Details <Eye className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Product & Lot Submissions */}
            {activeTab === 'submissions' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-gray-900">Product & Lot Submissions</h2>
                      <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" /> Pending Curation ({submissionsList.length})
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Track inventory submissions pending curation, technical verification, and official catalog publication.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={fetchUserSubmissions}
                      disabled={isLoadingSubmissions}
                      className="p-2 rounded-full border border-gray-200 text-gray-600 hover:text-[#0f7a61] hover:border-[#0f7a61] transition-colors disabled:opacity-50"
                      title="Refresh Submissions"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSubmissions ? 'animate-spin' : ''}`} />
                    </button>
                    <button 
                      onClick={() => setIsSimpleModalOpen(true)} 
                      className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-semibold text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Box className="w-3.5 h-3.5 text-purple-600" />
                      <span>+ Add Single Product</span>
                    </button>
                    <button 
                      onClick={() => setIsLotModalOpen(true)} 
                      className="bg-[#0f7a61] hover:bg-[#0c6651] text-white font-semibold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Boxes className="w-3.5 h-3.5" />
                      <span>+ Import Lot Batch</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Tabs Filter (All / Single Products / Lot Batches) */}
                <div className="flex items-center space-x-2 border-b border-gray-100 pb-4 overflow-x-auto">
                  <button
                    onClick={() => setSubmissionFilter('all')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      submissionFilter === 'all'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All Submissions ({submissionsList.length})
                  </button>

                  <button
                    onClick={() => setSubmissionFilter('single')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
                      submissionFilter === 'single'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    <Box className="w-3 h-3" />
                    Single Products ({submissionsList.filter(i => i.type === 'single').length})
                  </button>

                  <button
                    onClick={() => setSubmissionFilter('lot')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
                      submissionFilter === 'lot'
                        ? 'bg-[#0f7a61] text-white'
                        : 'bg-[#e6f7ef] text-[#0f7a61] hover:bg-green-100'
                    }`}
                  >
                    <Boxes className="w-3 h-3" />
                    Wholesale Lots & Batches ({submissionsList.filter(i => i.type === 'lot').length})
                  </button>
                </div>

                {/* Verification Notice Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-blue-50/50 border border-emerald-100/80 flex items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-white shadow-2xs text-[#0f7a61] flex items-center justify-center shrink-0 border border-emerald-100">
                      <ShieldCheck className="w-5 h-5 text-[#0f7a61]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">2-Tier Quality & Authenticity Verification</h4>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        Our engineering and valuation team verifies specifications, manifest lines, and compliance documents before moving items to your live catalog.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-1 text-[11px] font-bold text-[#0f7a61] bg-white/80 border border-emerald-200/60 px-3 py-1 rounded-full shrink-0">
                    <Clock className="w-3 h-3" /> Turnaround: 24-48h
                  </div>
                </div>

                {isLoadingSubmissions ? (
                  <div className="py-16 text-center">
                    <div className="animate-spin w-8 h-8 border-3 border-[#0f7a61] border-t-transparent rounded-full mx-auto mb-3" />
                    <p className="text-xs text-gray-500 font-medium">Loading your submissions...</p>
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <div className="text-center py-16 px-4 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">No Product Submissions Found</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                      You haven't submitted any surplus inventory for curation yet. Upload manifest spreadsheets or enter single product specs to list your liquidation assets across our global institutional buyer network.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button 
                        onClick={handleOpenLotModal}
                        className="bg-[#0f7a61] hover:bg-[#0c6651] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                      >
                        <Boxes className="w-3.5 h-3.5" /> + Import Wholesale Lot Batch
                      </button>
                      <button 
                        onClick={handleOpenSimpleModal}
                        className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Box className="w-3.5 h-3.5 text-purple-600" /> + Add Single Product
                      </button>
                    </div>

                    {/* How Verification Works 3-Step Flow */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8 pt-6 border-t border-gray-200/80 text-left">
                      <div className="p-3.5 rounded-xl bg-white border border-gray-100">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Step 1: Manifest Submission</div>
                        <div className="text-xs font-bold text-gray-900">Upload Inventory & Specs</div>
                        <p className="text-[11px] text-gray-500 mt-1">Submit product details, asking liquidation price, and manifest spreadsheets.</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white border border-gray-100">
                        <div className="text-[10px] font-bold text-[#0f7a61] uppercase tracking-wider mb-1">Step 2: Valuation & Review</div>
                        <div className="text-xs font-bold text-gray-900">Engineering Curation</div>
                        <p className="text-[11px] text-gray-500 mt-1">Our analysts verify pricing, certifications, and inventory authenticity within 24-48h.</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white border border-gray-100">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Step 3: Marketplace Publication</div>
                        <div className="text-xs font-bold text-gray-900">Live Global Liquidation</div>
                        <p className="text-[11px] text-gray-500 mt-1">Approved lots appear live on the catalog to receive proforma purchase bids & RFQs.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSubmissions.map((item) => {
                      const badge = getSubmissionStatusBadge(item.status);
                      const formattedDate = item.submittedAt
                        ? new Date(item.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                        : 'Recent';

                      return (
                        <div 
                          key={item.id} 
                          className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="min-w-0 flex-1">
                            {/* Badges Line */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-mono font-bold text-gray-900 text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                                {item.reference}
                              </span>
                              
                              {item.type === 'single' ? (
                                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Box className="w-3 h-3" /> Single Product
                                </span>
                              ) : (
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                  <Boxes className="w-3 h-3" /> Wholesale Lot Batch
                                </span>
                              )}

                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${badge.bg}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                {badge.label}
                              </span>

                              {item.location && (
                                <span className="text-[11px] text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gray-400" /> {item.location}
                                </span>
                              )}
                            </div>

                            {/* Title & Metadata */}
                            <h4 className="text-sm font-bold text-gray-900 truncate">{item.title}</h4>
                            
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" /> Submitted on {formattedDate}
                              </span>
                              <span>&bull;</span>
                              <span className="font-medium text-gray-700">
                                {item.units.toLocaleString()} total units
                              </span>
                              {item.distinctSkus ? (
                                <>
                                  <span>&bull;</span>
                                  <span>{item.distinctSkus} distinct SKUs</span>
                                </>
                              ) : null}
                              {item.brand ? (
                                <>
                                  <span>&bull;</span>
                                  <span>Brand: <strong>{item.brand}</strong></span>
                                </>
                              ) : null}
                              {item.category ? (
                                <>
                                  <span>&bull;</span>
                                  <span>{item.category}</span>
                                </>
                              ) : null}
                              {item.manifestFileName ? (
                                <>
                                  <span>&bull;</span>
                                  <span className="flex items-center gap-1 text-[#0f7a61] font-medium">
                                    <FileSpreadsheet className="w-3 h-3" /> {item.manifestFileName}
                                  </span>
                                </>
                              ) : null}
                            </div>

                            {/* Curation micro-status note */}
                            <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50/80 border border-amber-200/60 px-2.5 py-0.5 rounded-lg">
                              <Sparkles className="w-3 h-3 text-amber-600" />
                              <span>Curation Phase: Specification inspection & authenticity verification in queue.</span>
                            </div>
                          </div>

                          {/* Right Side: Financials & Action */}
                          <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-0 pt-3 sm:pt-0 border-gray-200 shrink-0">
                            <div className="text-left sm:text-right">
                              <div className="text-[11px] text-gray-400 font-medium">Asking Liquidation Payout</div>
                              <div className="text-base font-extrabold text-[#0f7a61]">
                                {formatPrice(item.liquidatingPrice)}
                              </div>
                              {item.msrp ? (
                                <div className="text-[10px] text-gray-400">
                                  Est. MSRP: {formatPrice(item.msrp)}
                                </div>
                              ) : null}
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedSubmissionDetail(item)}
                              className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                            >
                              <span>View Submission</span>
                              <Eye className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: My Surplus Inventory & Listings (Single Product + Lot Batch) */}
            {activeTab === 'listings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                
                {/* Pending Submissions Callout Banner */}
                {submissionsList.length > 0 && (
                  <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">
                          You have {submissionsList.length} product submission{submissionsList.length > 1 ? 's' : ''} under verification
                        </h4>
                        <p className="text-[11px] text-gray-600">
                          Items currently under curation will appear here in your live inventory catalog once verified and approved.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('submissions')}
                      className="self-start sm:self-auto text-xs font-bold text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span>View Submissions ({submissionsList.length})</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Live Surplus Inventory</h2>
                    <p className="text-gray-500 text-xs mt-0.5">Manage your active single product listings and wholesale lot batches listed on the live marketplace.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={fetchUserListings}
                      disabled={isLoadingListings}
                      className="p-2 rounded-full border border-gray-200 text-gray-600 hover:text-[#0f7a61] hover:border-[#0f7a61] transition-colors disabled:opacity-50"
                      title="Refresh Inventory"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingListings ? 'animate-spin' : ''}`} />
                    </button>
                    <button 
                      onClick={handleOpenSimpleModal} 
                      className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-semibold text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Box className="w-3.5 h-3.5 text-purple-600" />
                      <span>+ Add Product</span>
                    </button>
                    <button 
                      onClick={handleOpenLotModal} 
                      className="bg-[#0f7a61] hover:bg-[#0c6651] text-white font-semibold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      <Boxes className="w-3.5 h-3.5" />
                      <span>+ Import Lot Batch</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Tabs Filter (All / Single Products / Lot Batches) */}
                <div className="flex items-center space-x-2 border-b border-gray-100 pb-4 mb-6 overflow-x-auto">
                  <button
                    onClick={() => setListingFilter('all')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      listingFilter === 'all'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All Listings ({listingsList.length})
                  </button>

                  <button
                    onClick={() => setListingFilter('single')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
                      listingFilter === 'single'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    <Box className="w-3 h-3" />
                    Single Products ({listingsList.filter(i => i.type === 'single').length})
                  </button>

                  <button
                    onClick={() => setListingFilter('lot')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
                      listingFilter === 'lot'
                        ? 'bg-[#0f7a61] text-white'
                        : 'bg-[#e6f7ef] text-[#0f7a61] hover:bg-green-100'
                    }`}
                  >
                    <Boxes className="w-3 h-3" />
                    Wholesale Lots & Batches ({listingsList.filter(i => i.type === 'lot').length})
                  </button>
                </div>

                {isLoadingListings ? (
                  <div className="py-16 text-center">
                    <div className="animate-spin w-8 h-8 border-3 border-[#0f7a61] border-t-transparent rounded-full mx-auto mb-3" />
                    <p className="text-xs text-gray-500 font-medium">Loading inventory listings...</p>
                  </div>
                ) : filteredListings.length === 0 ? (
                  userType === 'BUYER' ? (
                    <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#0f7a61] flex items-center justify-center mx-auto mb-4">
                        <Boxes className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">Registered as Verified Buyer</h3>
                      <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                        You do not currently have any listed liquidation assets. Buyers explore wholesale lots and submit RFQ purchase orders. Have surplus inventory or equipment you want to monetize?
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <button 
                          onClick={() => setIsLotModalOpen(true)}
                          className="bg-[#0f7a61] hover:bg-[#0c6651] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Boxes className="w-3.5 h-3.5" /> Import Wholesale Lot
                        </button>
                        <button 
                          onClick={() => setIsSimpleModalOpen(true)}
                          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Box className="w-3.5 h-3.5 text-purple-600" /> Add Single Product
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        {submissionsList.length > 0 ? 'Submissions Under Verification' : 'No Live Surplus Inventory Listed Yet'}
                      </h3>
                      <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                        {submissionsList.length > 0
                          ? `You currently have ${submissionsList.length} product submission${submissionsList.length > 1 ? 's' : ''} in the verification pipeline. Once our engineers verify manifest details and condition, they will be published live to our marketplace catalog.`
                          : 'Upload manifest spreadsheets or list individual industrial surplus items to begin connecting with institutional buyers across our network.'}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        {submissionsList.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setActiveTab('submissions')}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                          >
                            <UploadCloud className="w-3.5 h-3.5" /> View {submissionsList.length} Pending Submission{submissionsList.length > 1 ? 's' : ''}
                          </button>
                        )}
                        <button 
                          onClick={() => setIsLotModalOpen(true)}
                          className="bg-[#0f7a61] hover:bg-[#0c6651] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Boxes className="w-3.5 h-3.5" /> + Import Lot Batch
                        </button>
                        <button 
                          onClick={() => setIsSimpleModalOpen(true)}
                          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Box className="w-3.5 h-3.5 text-purple-600" /> + Add Single Product
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="space-y-4">
                    {filteredListings.map((item) => (
                      <div key={item.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-white">
                            <Image 
                              src={item.image} 
                              alt={item.title} 
                              fill 
                              sizes="56px"
                              className="object-cover" 
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-mono font-bold text-gray-900 text-xs">{item.displayId}</span>
                              
                              {item.type === 'single' ? (
                                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Box className="w-3 h-3" /> Single Product
                                </span>
                              ) : (
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                  <Boxes className="w-3 h-3" /> Wholesale Lot
                                </span>
                              )}

                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                String(item.status).toLowerCase().includes('inactive')
                                  ? 'bg-gray-200 text-gray-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            
                            <h4 className="text-sm font-semibold text-gray-800 mt-1 truncate max-w-md">{item.title}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {item.condition} &bull; {item.units} {item.units === 1 ? 'Unit' : 'Units'}
                              {item.location ? ` • ${item.location}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0 border-gray-200 shrink-0">
                          <div className="text-left sm:text-right">
                            <div className="text-xs text-gray-400">Asking Price</div>
                            <div className="text-base font-extrabold text-[#0f7a61]">
                              {formatPrice(item.priceUsd)}
                            </div>
                          </div>
                          <Link
                            href={item.type === 'lot' ? createLotUrl(item.title || item.id, item.id) : createProductUrl(item.category, item.title || item.id, item.id)}
                            className="btn btn-secondary !py-2 !px-3 !text-xs rounded-full flex items-center gap-1"
                          >
                            View Item <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Saved Deals */}
            {activeTab === 'saved' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Saved Deals</h2>
                    <p className="text-gray-500 text-xs mt-0.5">Bookmarked inventory lots and products for easy reference and rapid ordering.</p>
                  </div>
                  <Link href="/browse" className="bg-[#0f7a61] hover:bg-[#0c6651] text-white font-semibold text-xs px-4 py-2 rounded-full transition-colors shadow-sm">
                    Browse Marketplace
                  </Link>
                </div>

                {savedDeals.length === 0 ? (
                  <div className="text-center py-16 px-4 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">No Saved Deals Yet</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                      You haven't bookmarked any surplus lots or equipment yet. Explore our marketplace to discover verified surplus assets and bookmark them for quick access.
                    </p>
                    <Link 
                      href="/browse" 
                      className="bg-[#0f7a61] hover:bg-[#0c6651] text-white text-xs font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2 transition-colors shadow-sm"
                    >
                      Browse Marketplace Deals <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedDeals.map((item) => (
                      <div key={item.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-all flex space-x-3 group relative">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-white">
                          <Image 
                            src={item.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80'} 
                            alt={item.title} 
                            fill 
                            sizes="64px"
                            className="object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-900 truncate mb-1">{item.title}</h4>
                          <p className="text-[11px] text-gray-400 mb-2">{item.location || 'UAE Liquidation Center'}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm text-[#0f7a61]">{formatPrice(item.priceUsd)}</span>
                            <div className="flex items-center gap-2">
                              <Link 
                                href={item.type === 'lot' ? createLotUrl(item.title || item.id, item.id) : createProductUrl(item.category, item.title || item.id, item.id)} 
                                className="text-xs font-semibold text-[#0f7a61] hover:underline"
                              >
                                View Deal
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleRemoveSaved(item.id)}
                                className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Remove saved deal"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Account & Notification Settings</h2>
                  <p className="text-gray-500 text-xs">Configure alerts, data exports, and security preferences.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Email Notifications</h4>
                      <p className="text-xs text-gray-500">Receive proforma quotes and replies directly to {email || 'your email'}.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={emailNotifs} 
                      onChange={(e) => handleToggleSetting('emailNotifs', e.target.checked)}
                      className="w-5 h-5 accent-[#0f7a61] rounded cursor-pointer" 
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">RFQ Status Alerts</h4>
                      <p className="text-xs text-gray-500">Get notified when an RFQ is reviewed, approved, or proforma quote is ready.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={rfqUpdates} 
                      onChange={(e) => handleToggleSetting('rfqUpdates', e.target.checked)}
                      className="w-5 h-5 accent-[#0f7a61] rounded cursor-pointer" 
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Price Drop Alerts</h4>
                      <p className="text-xs text-gray-500">Alert me when saved liquidation inventory lots drop in payout price.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={priceAlerts} 
                      onChange={(e) => handleToggleSetting('priceAlerts', e.target.checked)}
                      className="w-5 h-5 accent-[#0f7a61] rounded cursor-pointer" 
                    />
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Account Details & Data Management */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Account Security & Data Management</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider block mb-1">Account Role & Identifier</span>
                      <p className="text-xs text-gray-800 font-medium">Role: <span className="font-bold text-gray-900">{userType}</span> ({accountEntityType})</p>
                      <p className="text-xs text-gray-800 font-medium mt-1">Vendor ID: <span className="font-mono font-bold text-[#0f7a61]">{vendorId || 'Auto-Assigned'}</span></p>
                      <p className="text-xs text-gray-500 mt-2 truncate">Registered Email: {email}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider block mb-1">Export Data & Privacy</span>
                        <p className="text-xs text-gray-600">Download a complete copy of your profile credentials and RFQ history.</p>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          type="button"
                          onClick={handleExportData}
                          className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5 text-gray-500" /> Export JSON
                        </button>
                        <button
                          type="button"
                          onClick={handleClearCache}
                          className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-gray-500" /> Reset Local Cache
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  {session?.user ? (
                    <button
                      type="button"
                      onClick={() => performLogout({ redirect: true, callbackUrl: '/' })}
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors border border-red-200 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="bg-[#0f7a61] hover:bg-[#0c6651] text-white font-semibold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" /> Sign In
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* RFQ Detail Modal */}
      {selectedRfqDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900">{selectedRfqDetail.reference}</h3>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadge(selectedRfqDetail.status).bg}`}>
                    {selectedRfqDetail.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Submitted on {selectedRfqDetail.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRfqDetail(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Contact Person</span>
                <span className="font-semibold text-gray-900">{selectedRfqDetail.contact_person || fullName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Destination</span>
                <span className="font-semibold text-gray-900">{selectedRfqDetail.destination_port || selectedRfqDetail.country || 'EXW / Direct'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Incoterm</span>
                <span className="font-semibold text-gray-900">{selectedRfqDetail.incoterm || 'EXW'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Payment Term</span>
                <span className="font-semibold text-gray-900">{selectedRfqDetail.payment_method || 'Escrow'}</span>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Quoted Items Breakdown</h4>
              {selectedRfqDetail.items && selectedRfqDetail.items.length > 0 ? (
                <div className="space-y-2">
                  {selectedRfqDetail.items.map((it: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-gray-900">{it.title}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {it.sku ? `SKU: ${it.sku} • ` : ''}Qty: {Number(it.quantity || 1).toLocaleString()} units
                          {it.category ? ` • Category: ${it.category}` : ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#0f7a61]">{formatPrice(it.unitPrice || it.unit_price || 0)} / unit</div>
                        {it.targetPrice ? (
                          <div className="text-[10px] text-gray-400">Target: {formatPrice(it.targetPrice)}</div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 text-xs text-gray-500 text-center">
                  Detailed item manifest included in commercial proforma offer.
                </div>
              )}
            </div>

            {/* Summary Footer */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-600 block">Total Units</span>
                <span className="font-bold text-gray-900 text-sm">{selectedRfqDetail.total_units.toLocaleString()} units</span>
              </div>
              <div className="text-right">
                <span className="text-gray-600 block">Estimated Baseline Value</span>
                <span className="font-extrabold text-[#0f7a61] text-base">{formatPrice(selectedRfqDetail.estimated_value)}</span>
              </div>
            </div>

            {selectedRfqDetail.additional_notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 border border-gray-100">
                <span className="font-bold text-gray-700 block mb-1">Additional Notes:</span>
                {selectedRfqDetail.additional_notes}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRfqDetail(null)}
                className="bg-gray-900 hover:bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Submission Detail Modal */}
      {selectedSubmissionDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900">{selectedSubmissionDetail.reference}</h3>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getSubmissionStatusBadge(selectedSubmissionDetail.status).bg}`}>
                    {selectedSubmissionDetail.status}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedSubmissionDetail.type === 'single' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {selectedSubmissionDetail.type === 'single' ? 'Single Product' : 'Wholesale Lot Batch'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Submitted on {selectedSubmissionDetail.submittedAt ? new Date(selectedSubmissionDetail.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmissionDetail(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Core Specs */}
            <div className="my-5">
              <h4 className="text-base font-bold text-gray-900">{selectedSubmissionDetail.title}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 block font-medium">Quantity</span>
                  <span className="font-bold text-gray-900 text-sm">{selectedSubmissionDetail.units.toLocaleString()} units</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Condition</span>
                  <span className="font-semibold text-gray-900">{selectedSubmissionDetail.condition}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Category</span>
                  <span className="font-semibold text-gray-900">{selectedSubmissionDetail.category || 'Surplus'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Warehouse Hub</span>
                  <span className="font-semibold text-gray-900">{selectedSubmissionDetail.location || 'UAE Warehouse'}</span>
                </div>
              </div>
            </div>

            {/* Financial Overview Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/90 flex items-center justify-between text-xs mb-5">
              <div>
                <span className="text-gray-600 block">Requested Liquidation Payout</span>
                <span className="font-extrabold text-[#0f7a61] text-xl">
                  {formatPrice(selectedSubmissionDetail.liquidatingPrice)}
                </span>
              </div>
              {selectedSubmissionDetail.msrp ? (
                <div className="text-right">
                  <span className="text-gray-600 block">Original Estimated Retail / MSRP</span>
                  <span className="font-bold text-gray-700 text-base">{formatPrice(selectedSubmissionDetail.msrp)}</span>
                </div>
              ) : null}
            </div>

            {/* Product Specifications & Manifest */}
            <div className="space-y-3 text-xs mb-6">
              {selectedSubmissionDetail.brand && (
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-400">Brand / Manufacturer:</span>
                  <span className="font-semibold text-gray-900">{selectedSubmissionDetail.brand}</span>
                </div>
              )}
              {selectedSubmissionDetail.model && (
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-400">Model / Part Number:</span>
                  <span className="font-semibold text-gray-900">{selectedSubmissionDetail.model}</span>
                </div>
              )}
              {selectedSubmissionDetail.subCategory && (
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-400">Sub-Category:</span>
                  <span className="font-semibold text-gray-900">{selectedSubmissionDetail.subCategory}</span>
                </div>
              )}
              {selectedSubmissionDetail.distinctSkus ? (
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-400">Distinct Manifest SKUs:</span>
                  <span className="font-semibold text-gray-900">{selectedSubmissionDetail.distinctSkus} items</span>
                </div>
              ) : null}
              {selectedSubmissionDetail.manifestFileName && (
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-400">Attached Manifest:</span>
                  <span className="font-semibold text-[#0f7a61] flex items-center gap-1">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> {selectedSubmissionDetail.manifestFileName}
                  </span>
                </div>
              )}
              {selectedSubmissionDetail.warranty && (
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-400">Warranty Coverage:</span>
                  <span className="font-semibold text-gray-900">{selectedSubmissionDetail.warranty}</span>
                </div>
              )}
              {selectedSubmissionDetail.reasonToSell && (
                <div className="py-2 border-b border-gray-100">
                  <span className="text-gray-400 block mb-1">Reason for Liquidation:</span>
                  <p className="text-gray-800">{selectedSubmissionDetail.reasonToSell}</p>
                </div>
              )}
              {selectedSubmissionDetail.description && (
                <div className="py-2">
                  <span className="text-gray-400 block mb-1">Detailed Technical Description & Notes:</span>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-xl whitespace-pre-wrap">{selectedSubmissionDetail.description}</p>
                </div>
              )}
            </div>

            {/* Verification Stage Timeline */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs mb-6">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3">Verification Pipeline</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-emerald-100/70 text-[#0f7a61] border border-emerald-200/80">
                  <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-[#0f7a61]" />
                  <div className="font-bold text-[11px]">1. Received</div>
                  <div className="text-[10px] text-gray-500">Logged & Indexed</div>
                </div>
                <div className="p-2 rounded-xl bg-amber-100/70 text-amber-800 border border-amber-200/80">
                  <Clock className="w-4 h-4 mx-auto mb-1 text-amber-700 animate-spin" />
                  <div className="font-bold text-[11px]">2. Verification</div>
                  <div className="text-[10px] text-amber-700">Specs & Documents</div>
                </div>
                <div className="p-2 rounded-xl bg-gray-100 text-gray-400 border border-gray-200/60">
                  <ExternalLink className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                  <div className="font-bold text-[11px]">3. Catalog Go-Live</div>
                  <div className="text-[10px] text-gray-400">Live for Inquiries</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedSubmissionDetail(null)}
                className="bg-gray-900 hover:bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listing Modals */}
      <SimpleListingModal 
        isOpen={isSimpleModalOpen} 
        onClose={() => {
          setIsSimpleModalOpen(false);
          fetchUserSubmissions();
          fetchUserListings();
        }} 
      />
      <LotImportModal 
        isOpen={isLotModalOpen} 
        onClose={() => {
          setIsLotModalOpen(false);
          fetchUserSubmissions();
          fetchUserListings();
        }} 
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          if (!isAuthMandatory) {
            setIsAuthModalOpen(false);
          }
        }}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setIsAuthMandatory(false);
        }}
        initialMode="login"
        initialStep={authModalStep}
        isMandatory={isAuthMandatory}
      />
    </section>
  );
}



