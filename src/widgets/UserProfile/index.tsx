"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
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
  DollarSign
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useNotifications } from '../../context/NotificationContext';
import Link from 'next/link';
import SimpleListingModal from '../../components/SimpleListingModal';
import LotImportModal from '../../components/LotImportModal';
import { useAppSelector } from '../../store';

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

const DEFAULT_CATEGORIES = [
  'Electronics',
  'Industrial Machinery & Pumps',
  'Automation & Controls',
  'Electrical Parts & Equipment',
  'Mechanical Parts',
  'Power Tools & Equipment',
  'Hand Tools & Hardware',
  'PPE & Safety Gear',
  'Building Materials & Construction',
  'Vehicles & Automotive Parts',
  'Logistics & Material Handling',
  'Raw Materials & Metals',
  'Medical & Laboratory Equipment',
  'Computers & IT Equipment',
  'Furniture & Office Interiors',
  'Textiles & Apparel',
  'Agricultural Equipment',
  'Plastics & Polymers',
  'Consumer Goods & General Surplus',
  'Other'
];

export default function UserProfileWidget() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const { formatPrice } = useCurrency();
  const { showToast } = useNotifications();

  // Redirect unauthenticated users immediately to homepage
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);
  const [activeTab, setActiveTab] = useState<'profile' | 'rfqs' | 'listings' | 'saved' | 'settings'>('profile');

  // Listing Type Filter State inside Tab 3
  const [listingFilter, setListingFilter] = useState<'all' | 'single' | 'lot'>('all');

  // Modals state
  const [isSimpleModalOpen, setIsSimpleModalOpen] = useState(false);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);

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
    u.country || (COUNTRY_LIST.includes(u.business_location) ? u.business_location : 'United Arab Emirates')
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

  // Redux Categories & Dropdown State
  const { categories: reduxCategories } = useAppSelector((state) => state.categories);
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

  // Parse comma-separated categories into array
  const selectedCategories: string[] = useMemo(() => {
    if (!categoriesInterested || typeof categoriesInterested !== 'string') return [];
    return categoriesInterested
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
  }, [categoriesInterested]);

  // Aggregate categories from Redux, defaults, and existing user selections
  const categoryOptions = useMemo(() => {
    const list: string[] = [];
    if (reduxCategories && reduxCategories.length > 0) {
      reduxCategories.forEach((c: any) => {
        const name = typeof c === 'string' ? c : (c.name || c.title);
        if (name && !list.includes(name)) list.push(name);
      });
    }
    DEFAULT_CATEGORIES.forEach((c: string) => {
      if (!list.includes(c)) list.push(c);
    });
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
    setCategoriesInterested(updated.join(', '));
  };

  const removeCategory = (cat: string) => {
    const updated = selectedCategories.filter((c: string) => c !== cat);
    setCategoriesInterested(updated.join(', '));
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
      if (userObj.country) {
        setCountry(userObj.country);
      } else if (userObj.business_location && COUNTRY_LIST.includes(userObj.business_location)) {
        setCountry(userObj.business_location);
      }
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
      setCategoriesInterested(Array.isArray(rawCat) ? rawCat.join(', ') : String(rawCat));
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
            } else if (vData.business_location && COUNTRY_LIST.includes(vData.business_location)) {
              setCountry(vData.business_location);
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
              const catVal = Array.isArray(vData.category_interested) ? vData.category_interested.join(', ') : String(vData.category_interested);
              setCategoriesInterested(catVal);
            }
          }
        }).catch((err) => {
          console.error("Failed to auto-fetch vendor profile:", err);
        });
      }
    } else {
      // Clear all fields if user is not logged in
      if (typeof window !== 'undefined') {
        const localId = localStorage.getItem('vendor_id');
        setVendorId(localId ? String(localId) : '');
      } else {
        setVendorId('');
      }
      setFullName('');
      setEmail('');
      setPhone('');
      setCountry('United Arab Emirates');
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
        category_interested: categoriesInterested,
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
          category_interested: categoriesInterested || resData.category_interested
        });
        
        setIsSavedNotice(true);
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

  // Listings State
  const [listingsList, setListingsList] = useState<UserListingItem[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(false);

  // Saved Deals State
  const [savedDeals, setSavedDeals] = useState<UserSavedDeal[]>([]);

  // Fetch real RFQs from backend and local history
  const fetchUserRfqs = async () => {
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
              parsed.forEach((item: any) => {
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

  // Fetch real listings (single products & lots) from backend
  const fetchUserListings = async () => {
    setIsLoadingListings(true);
    try {
      const vId = vendorId || (session?.user as any)?.vendor_id;
      const [productsRes, lotsRes] = await Promise.allSettled([
        catalogService.getProducts(vId ? { vendor_id: vId } : undefined),
        catalogService.getLots(vId ? { vendor_id: vId } : undefined)
      ]);

      const items: UserListingItem[] = [];

      if (productsRes.status === 'fulfilled' && Array.isArray(productsRes.value)) {
        productsRes.value.forEach((p) => {
          items.push({
            id: p.id,
            displayId: p.product_id || p.sku || `PRD-${p.id}`,
            title: p.title,
            type: 'single',
            condition: p.condition || 'Brand New Surplus',
            units: p.quantity || p.estQty || p.moq || 1,
            priceUsd: p.price || p.liquidatingPrice || 0,
            status: p.isCertified ? 'Verified Active' : 'Active',
            image: p.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
            category: p.category,
            location: p.location || p.inventory_location || 'UAE Warehouse',
            currency: p.currency || 'USD',
            rawItem: p
          });
        });
      }

      if (lotsRes.status === 'fulfilled' && Array.isArray(lotsRes.value)) {
        lotsRes.value.forEach((l) => {
          items.push({
            id: l.id,
            displayId: l.lot_number || `LOT-${l.id}`,
            title: l.title || l.listing_title || 'Wholesale Liquidation Lot Batch',
            type: 'lot',
            condition: l.condition || 'Factory Sealed Wholesale',
            units: l.total_units_quantity || l.units || 1,
            priceUsd: l.ask_price_surplus_payout || l.price || l.msrp || 0,
            status: l.active_status || (l.is_active !== false ? 'Active Lot' : 'Under Review'),
            image: l.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=300&q=80',
            category: l.category,
            location: l.location || l.inventory_location || 'Regional Liquidation Center',
            currency: l.currency || 'USD',
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
      const keysToClear = ['surplus_rfqs_history', 'surplus_saved_deals', 'surplus_account_settings'];
      keysToClear.forEach(k => localStorage.removeItem(k));
      loadSavedDeals();
      fetchUserRfqs();
      showToast({
        type: 'info',
        title: 'Local Cache Cleared',
        message: 'Your browser session cache has been refreshed.'
      });
    }
  };

  const handleExportData = () => {
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

  // Sync and fetch on mount & profile change
  useEffect(() => {
    fetchUserRfqs();
    fetchUserListings();
    loadSavedDeals();
  }, [email, vendorId]);

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

  if (status === 'unauthenticated' || !session) {
    return null;
  }

  const getSubtitleText = () => {
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
                  {fullName ? fullName[0].toUpperCase() : 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-[#0f7a61]" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{fullName || 'User Profile'}</h1>
                  <span className="bg-[#e6f7ef] text-[#0f7a61] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {userType === 'BUYER' ? 'Verified Buyer' : (accountEntityType === 'INDIVIDUAL' ? 'Verified Individual' : 'Verified Business')}
                  </span>
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
            <div className="grid grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('rfqs')}
                className="hover:opacity-80 transition-opacity text-center cursor-pointer group"
              >
                <div className="text-lg font-bold text-gray-900 group-hover:text-[#0f7a61] transition-colors">{rfqsList.length}</div>
                <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Active RFQs</div>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('listings')}
                className="border-x border-gray-200 hover:opacity-80 transition-opacity text-center cursor-pointer group"
              >
                <div className="text-lg font-bold text-[#0f7a61]">{listingsList.length}</div>
                <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Listings</div>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className="hover:opacity-80 transition-opacity text-center cursor-pointer group"
              >
                <div className="text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{savedDeals.length}</div>
                <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Saved</div>
              </button>
            </div>

          </div>
        </div>

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
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'rfqs'
                    ? 'bg-[#0f7a61] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>My RFQs & Quotes</span>
              </button>

              <button
                onClick={() => setActiveTab('listings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'listings'
                    ? 'bg-[#0f7a61] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>My Surplus Inventory</span>
              </button>

              <button
                onClick={() => setActiveTab('saved')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'saved'
                    ? 'bg-[#0f7a61] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Saved Deals</span>
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
                          value={vendorId ? (vendorId.startsWith('USR') || vendorId.startsWith('#') ? vendorId : `#${vendorId}`) : 'Assigned upon verification'} 
                          readOnly 
                          disabled
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm font-mono cursor-not-allowed select-all font-semibold" 
                        />
                        <span className="absolute right-3 top-2.5 text-[11px] font-bold text-[#0f7a61] bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Verified ID
                        </span>
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
                      <div className="relative">
                        <select 
                          required
                          value={country} 
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] appearance-none pr-10 cursor-pointer text-gray-900 font-medium" 
                        >
                          <option value="">-- Select Country --</option>
                          {country && !COUNTRY_LIST.includes(country) && (
                            <option value={country}>{country}</option>
                          )}
                          {COUNTRY_LIST.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Business Location *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={businessLocation} 
                        onChange={(e) => setBusinessLocation(e.target.value)}
                        placeholder="e.g. Dubai, Jebel Ali Free Zone, Riyadh, Mumbai"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                      />
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
                                No matching categories found
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

            {/* TAB 3: My Surplus Inventory & Listings (Single Product + Lot Batch) */}
            {activeTab === 'listings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">My Surplus Inventory</h2>
                    <p className="text-gray-500 text-xs mt-0.5">Manage your single product listings and wholesale lot batches listed for liquidation.</p>
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
                      onClick={() => setIsSimpleModalOpen(true)} 
                      className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-semibold text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Box className="w-3.5 h-3.5 text-purple-600" />
                      <span>+ Add Product</span>
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
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#0f7a61] flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">No Surplus Inventory Listed Yet</h3>
                      <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                        Upload manifest spreadsheets or list individual industrial surplus items to begin connecting with institutional buyers across our network.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3">
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

                              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
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
                            href={item.type === 'lot' ? `/lot/${item.id}` : `/product/${item.id}`}
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
                                href={item.type === 'lot' ? `/lot/${item.id}` : `/product/${item.id}`} 
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
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors border border-red-200"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
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

      {/* Listing Modals */}
      <SimpleListingModal 
        isOpen={isSimpleModalOpen} 
        onClose={() => {
          setIsSimpleModalOpen(false);
          fetchUserListings();
        }} 
      />
      <LotImportModal 
        isOpen={isLotModalOpen} 
        onClose={() => {
          setIsLotModalOpen(false);
          fetchUserListings();
        }} 
      />
    </section>
  );
}



