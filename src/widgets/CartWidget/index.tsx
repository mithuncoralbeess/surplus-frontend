"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, 
  Send, CheckCircle2, ChevronRight, Package, AlertCircle, 
  Truck, Building2, User, Mail, Phone, Globe, FileText, Check,
  RefreshCw, DollarSign, Download, Printer, Sparkles
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCart, CartItem } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { inquiryService } from '../../services/inquiryService';
import { authService } from '../../services/authService';
import AuthModal from '../../components/AuthModal';
import { scrollToTop } from '../../lib/scroll';



const matchCountry = (locationStr?: string): string | null => {
  if (!locationStr) return null;
  const s = locationStr.toLowerCase();
  
  if (s.includes('emirates') || s.includes('uae') || s.includes('dubai') || s.includes('abu dhabi') || s.includes('sharjah') || s.includes('ajman') || s.includes('al ain') || s.includes('ras al khaimah') || s.includes('fujairah')) {
    return 'United Arab Emirates';
  }
  if (s.includes('saudi') || s.includes('ksa') || s.includes('riyadh') || s.includes('jeddah') || s.includes('dammam') || s.includes('khobar') || s.includes('mecca') || s.includes('medina')) {
    return 'Saudi Arabia';
  }
  if (s.includes('qatar') || s.includes('doha')) {
    return 'Qatar';
  }
  if (s.includes('kuwait')) {
    return 'Kuwait';
  }
  if (s.includes('oman') || s.includes('muscat')) {
    return 'Oman';
  }
  if (s.includes('bahrain') || s.includes('manama')) {
    return 'Bahrain';
  }
  if (s.includes('india') || s.includes('mumbai') || s.includes('delhi') || s.includes('bengaluru') || s.includes('bangalore') || s.includes('chennai') || s.includes('kolkata') || s.includes('hyderabad') || s.includes('pune') || s.includes('ahmedabad') || s.includes('surat')) {
    return 'India';
  }
  if (s.includes('kingdom') || s.includes('uk') || s.includes('britain') || s.includes('london') || s.includes('england') || s.includes('scotland')) {
    return 'United Kingdom';
  }
  if (s.includes('united states') || s.includes('usa') || s.includes('u.s.') || s.includes('america') || s.includes('new york') || s.includes('california') || s.includes('texas')) {
    return 'United States';
  }

  const knownCountries = [
    'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman',
    'Bahrain', 'India', 'United Kingdom', 'United States',
  ];
  const found = knownCountries.find(c => c.toLowerCase() === s.trim());
  if (found) return found;

  return null;
};

const extractPortOrCity = (locationStr?: string): string => {
  if (!locationStr) return '';
  const trimmed = locationStr.trim();
  const parts = trimmed.split(',').map(p => p.trim()).filter(Boolean);
  const countryKeywords = ['united arab emirates', 'uae', 'saudi arabia', 'ksa', 'india', 'united kingdom', 'uk', 'united states', 'usa', 'qatar', 'kuwait', 'oman', 'bahrain'];

  if (parts.length > 1) {
    const firstPart = parts[0];
    if (!countryKeywords.includes(firstPart.toLowerCase())) {
      return firstPart;
    }
  }

  const knownCities = [
    'Dubai', 'Jebel Ali', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah',
    'Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Jubail',
    'Doha', 'Hamad Port',
    'Kuwait City', 'Shuwaikh', 'Shuaiba',
    'Muscat', 'Sohar', 'Salalah',
    'Manama', 'Khalifa Bin Salman',
    'Mumbai', 'Nhava Sheva', 'Delhi', 'Chennai', 'Mundra',
    'London', 'Felixstowe', 'Southampton',
    'New York', 'Los Angeles', 'Houston', 'Long Beach'
  ];
  for (const city of knownCities) {
    if (trimmed.toLowerCase().includes(city.toLowerCase())) {
      return city;
    }
  }

  if (!countryKeywords.includes(trimmed.toLowerCase()) && trimmed.length <= 40) {
    return trimmed;
  }

  return '';
};

export default function CartWidget() {
  const { data: session, status } = useSession();
  const {
    items,
    totalCount,
    totalUnits,
    totalPrice,
    isHydrated,
    updateQuantity,
    updateTargetPrice,
    updateNotes,
    removeFromCart,
    clearCart,
  } = useCart();
  const { formatPrice, currency } = useCurrency();

  // Modal State for unauthenticated users
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');
  const [destinationPort, setDestinationPort] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Track if user has manually edited any fields so we don't overwrite manual inputs
  const editedFieldsRef = useRef<Set<string>>(new Set());

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedRfq, setSubmittedRfq] = useState<{
    reference: string;
    itemsCount: number;
    totalUnits: number;
    estimatedValue: number;
  } | null>(null);

  // Auto-fill Commercial RFQ enquiry form with logged-in user details
  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;

      if (!editedFieldsRef.current.has('companyName')) {
        const comp = u.company_name || u.companyName || u.company || u.business_name || '';
        if (comp) setCompanyName(comp);
      }

      if (!editedFieldsRef.current.has('contactPerson')) {
        const person = u.full_name || u.name || (u.first_name && u.last_name ? `${u.first_name} ${u.last_name}`.trim() : u.first_name) || '';
        if (person) setContactPerson(person);
      }

      if (!editedFieldsRef.current.has('email')) {
        if (u.email) setEmail(u.email);
      }

      if (!editedFieldsRef.current.has('phone')) {
        const ph = u.phone || u.mobile || u.mobile_number || u.phone_number || '';
        if (ph) setPhone(ph);
      }

      const loc = u.business_location || u.location || u.country || u.business_address || u.address || '';
      if (loc || u.country) {
        if (!editedFieldsRef.current.has('country')) {
          const matchedCountry = u.country ? (matchCountry(u.country) || u.country) : matchCountry(loc);
          if (matchedCountry) setCountry(matchedCountry);
        }
        if (!editedFieldsRef.current.has('destinationPort')) {
          const city = u.business_location ? extractPortOrCity(u.business_location) : extractPortOrCity(loc);
          if (city) setDestinationPort(city);
        }
      }

      // Proactively synchronize with real-time backend profile to fetch full details
      if (u.email) {
        authService.getProfile(u.email).then((res) => {
          if (res?.success && res.data) {
            const vData = res.data;
            if (!editedFieldsRef.current.has('companyName')) {
              const comp = vData.company_name || vData.companyName || vData.business_name || '';
              if (comp) setCompanyName(comp);
            }
            if (!editedFieldsRef.current.has('contactPerson')) {
              const person = vData.full_name || vData.fullName || vData.name || (vData.first_name && vData.last_name ? `${vData.first_name} ${vData.last_name}`.trim() : vData.first_name);
              if (person) setContactPerson(person);
            }
            if (!editedFieldsRef.current.has('phone')) {
              const ph = vData.phone || vData.mobile_number || vData.mobile || vData.phone_number;
              if (ph) setPhone(ph);
            }
            const freshLoc = vData.business_location || vData.location || vData.country || vData.business_address || vData.address || '';
            if (freshLoc || vData.country) {
              if (!editedFieldsRef.current.has('country')) {
                const matchedCountry = vData.country ? (matchCountry(vData.country) || vData.country) : matchCountry(freshLoc);
                if (matchedCountry) setCountry(matchedCountry);
              }
              if (!editedFieldsRef.current.has('destinationPort')) {
                const city = vData.business_location ? extractPortOrCity(vData.business_location) : extractPortOrCity(freshLoc);
                if (city) setDestinationPort(city);
              }
            }
          }
        }).catch(() => {});
      }
    }
  }, [session, status]);

  const handleSubmitRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!email || !contactPerson) {
      setSubmitError('Please fill in your contact person name and email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const reference = `RFQ-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const userObj = (session?.user || {}) as any;

      const res = await inquiryService.submitRfqEnquiry({
        reference,
        vendor_id: userObj.vendor_id || userObj.id || (typeof window !== 'undefined' ? (localStorage.getItem('vendor_id') || undefined) : undefined),
        contact_person: contactPerson,
        company_name: companyName.trim(),
        email,
        phone,
        country,
        business_location: userObj.business_location || userObj.location || destinationPort || '',
        destination_port: destinationPort,
        additional_notes: additionalNotes,
        items: items.map(item => ({
          id: item.id,
          productId: item.productId,
          title: item.title,
          sku: item.sku,
          category: item.category,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          targetPrice: item.targetPrice,
          notes: item.notes,
        })),
        total_units: totalUnits,
        estimated_value: totalPrice,
        currency,
        user_id: userObj.id || userObj.vendor_id,
        user_type: userObj.user_type,
      });

      if (!res.success && res.status !== 200 && res.status !== 201) {
        setSubmitError(res.message || 'Failed to submit quote enquiry. Please review your details and try again.');
        return;
      }

      const assignedReference = res.data?.reference || reference;

      // Persist newly submitted RFQ into local history for immediate client display
      try {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('surplus_rfqs_history');
          const existing = stored ? JSON.parse(stored) : [];
          const newRecord = {
            id: res.data?.id || assignedReference,
            reference: assignedReference,
            created_at: new Date().toISOString(),
            status: 'PENDING',
            contact_person: contactPerson,
            company_name: companyName.trim(),
            email,
            phone,
            country,
            destination_port: destinationPort,
            additional_notes: additionalNotes,
            total_units: totalUnits,
            estimated_value: totalPrice,
            currency,
            items: items.map(item => ({
              id: item.id,
              productId: item.productId,
              title: item.title,
              sku: item.sku,
              category: item.category,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              targetPrice: item.targetPrice,
              notes: item.notes,
            })),
          };
          localStorage.setItem('surplus_rfqs_history', JSON.stringify([newRecord, ...existing]));
        }
      } catch (localErr) {
        console.warn('[CartWidget] Failed to save RFQ to local history:', localErr);
      }

      setSubmittedRfq({
        reference: assignedReference,
        itemsCount: items.length,
        totalUnits,
        estimatedValue: totalPrice,
      });

      // Clear the cart once submitted
      clearCart();
      scrollToTop({ behavior: 'smooth' });
    } catch (err: any) {
      console.error('[CartWidget] Submit error:', err);
      setSubmitError('Failed to submit quote enquiry. Please verify your connection or try again.');
      scrollToTop({ behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="h-8 bg-gray-200 rounded-lg w-64 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
          <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Success Confirmation Screen
  if (submittedRfq) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 text-center animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 text-[#0f7a61] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="bg-[#e6f7ef] text-[#0f7a61] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            Quotation Request Received
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Official RFQ Submitted Successfully!
          </h1>
          <p className="text-sm text-gray-600 max-w-lg mx-auto mb-6">
            Your quotation request has been distributed to our verification desk and certified vendors. A commercial proforma offer will be delivered to <strong>{email}</strong> within 12 business hours.
          </p>

          <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-100 max-w-md mx-auto mb-8 text-left space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">RFQ Reference:</span>
              <span className="font-mono font-bold text-gray-900">{submittedRfq.reference}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Total Items:</span>
              <span className="font-bold text-gray-900">{submittedRfq.itemsCount} listing(s)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Total Quantity:</span>
              <span className="font-bold text-gray-900">{submittedRfq.totalUnits.toLocaleString()} units</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-200">
              <span className="text-gray-700 font-bold">Estimated Baseline Value:</span>
              <span className="font-extrabold text-[#0f7a61] text-sm">
                {formatPrice(submittedRfq.estimatedValue)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-full transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print RFQ Summary</span>
            </button>
            <Link
              href="/browse"
              className="px-6 py-2.5 bg-[#0f7a61] hover:bg-[#0c6651] text-white text-xs font-bold rounded-full transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Explore More Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart Screen
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
        {/* Breadcrumb */}
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#0f7a61]">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-semibold">RFQ Basket</span>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-[#e6f7ef] text-[#0f7a61] flex items-center justify-center mx-auto mb-6 shadow-xs">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your RFQ Basket is Empty</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
            You haven&apos;t added any surplus items or liquidation lots yet. Browse verified inventory to request competitive wholesale quotes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/browse"
              className="px-6 py-3 bg-[#0f7a61] hover:bg-[#0c6651] text-white text-xs font-bold rounded-full transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <span>Browse All Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/buy"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-full transition-colors"
            >
              <span>Explore Wholesale Lots</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#0f7a61]">Home</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link href="/browse" className="hover:text-[#0f7a61]">Marketplace</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-900 font-bold">RFQ Basket ({items.length})</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#e6f7ef] text-[#0f7a61] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              B2B Enquiry Basket
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-semibold text-gray-600">
              {totalUnits.toLocaleString()} Total Units
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Wholesale RFQ Enquiry Basket
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Review your selected surplus lots, specify counter-offer target prices or special handling notes, and submit a single consolidated RFQ to receive official proforma bids.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-gray-400 hover:text-rose-600 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50 cursor-pointer"
          >
            Clear Entire Basket
          </button>
          <Link
            href="/browse"
            className="text-xs font-bold text-[#0f7a61] hover:text-[#0c6651] bg-[#e6f7ef] hover:bg-[#d8f2e7] py-2 px-4 rounded-full transition-colors inline-flex items-center gap-1"
          >
            <span>+ Add More Deals</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Line Items List (7 cols on lg, 8 on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-gray-700">
                Selected Products &amp; Wholesale Lots ({items.length})
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Adjust quantities, MOQ &amp; counter-offers below
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const itemTotal = item.unitPrice * item.quantity;
                const itemMoq = item.type === 'product' ? Math.max(20, Number(item.moq || 20)) : (item.moq || 1);
                const isAtMoq = item.quantity <= itemMoq;
                const isAtMax = item.estQty ? item.quantity >= item.estQty : false;

                return (
                  <div key={item.id} className="p-5 sm:p-6 transition-colors hover:bg-gray-50/30">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                      {/* Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                        {item.type === 'lot' && (
                          <span className="absolute top-1.5 left-1.5 bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase">
                            Lot
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <span className="text-[10px] font-bold text-[#0f7a61] uppercase tracking-wider block">
                              {item.category}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 hover:text-[#0f7a61] transition-colors">
                              {item.title}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-300 hover:text-rose-500 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Remove from RFQ basket"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Metadata row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                          {item.sku && (
                            <span className="font-mono text-[11px] bg-gray-100 px-2 py-0.5 rounded">
                              SKU: {item.sku}
                            </span>
                          )}
                          {item.location && (
                            <span className="text-gray-600 font-medium">
                              Location: {item.location}
                            </span>
                          )}
                          <span className="text-gray-600 font-medium">
                            MOQ: {itemMoq} units
                          </span>
                        </div>

                        {/* Controls & Subtotal Row */}
                        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                          {/* Quantity Stepper */}
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-700">Quantity:</span>
                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={isAtMoq}
                                className={`p-2 transition-colors ${
                                  isAtMoq
                                    ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                                }`}
                                title={isAtMoq ? `Minimum order is ${itemMoq}` : 'Decrease quantity'}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="number"
                                min={itemMoq}
                                max={item.estQty || 999999}
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                className="w-16 px-1 py-1 text-center font-bold text-xs sm:text-sm text-gray-900 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={isAtMax}
                                className={`p-2 transition-colors ${
                                  isAtMax
                                    ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                                }`}
                                title={isAtMax ? `Max available is ${item.estQty}` : 'Increase quantity'}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Price Breakdown */}
                          <div className="text-right">
                            <div className="text-[11px] text-gray-500">
                              Unit: <strong className="text-gray-800">{formatPrice(item.unitPrice)}</strong>
                            </div>
                            <div className="text-sm sm:text-base font-extrabold text-[#0f7a61]">
                              Subtotal: {formatPrice(itemTotal)}
                            </div>
                          </div>
                        </div>

                        {/* Optional Target Counter-Offer & Special Note */}
                        <div className="mt-3 pt-3 border-t border-dashed border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-600 mb-1">
                              Your Target Price / Unit ($ USD)
                            </label>
                            <input
                              type="number"
                              step="any"
                              placeholder={`List: $${item.unitPrice}`}
                              value={item.targetPrice || ''}
                              onChange={(e) => updateTargetPrice(item.id, e.target.value ? Number(e.target.value) : undefined)}
                              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#0f7a61]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-600 mb-1">
                              Specific Item Notes (Packaging, Inspection, etc.)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Export palletizing required"
                              value={item.notes || ''}
                              onChange={(e) => updateNotes(item.id, e.target.value)}
                              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#0f7a61]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assurance info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0f7a61] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-gray-900">Verified Vendors</h4>
                <p className="text-[11px] text-gray-500">Stock authenticated &amp; manifests checked</p>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#0f7a61] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-gray-900">Global Logistics</h4>
                <p className="text-[11px] text-gray-500">EXW, FOB, CIF, DDP delivery options</p>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-[#0f7a61] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-gray-900">Escrow Protected</h4>
                <p className="text-[11px] text-gray-500">Funds released only after inspection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quotation Summary & RFQ Form (5 cols on lg, 4 on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 pb-3 border-b border-gray-100">
              Quotation Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Selected Line Items:</span>
                <span className="font-bold text-gray-900">{items.length}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Quantity:</span>
                <span className="font-bold text-gray-900">{totalUnits.toLocaleString()} units</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Freight &amp; Port Handling:</span>
                <span className="font-semibold text-emerald-700">Calculated upon destination</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Volume Discount Applied:</span>
                <span className="font-semibold text-emerald-700">Tiered Wholesale Rate</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="font-bold text-sm text-gray-900">Est. Total Baseline:</span>
                <span className="font-black text-xl text-[#0f7a61]">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>

            {/* Submission Form */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <div className="w-7 h-7 rounded-lg bg-[#e6f7ef] text-[#0f7a61] flex items-center justify-center">
                <Send className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Commercial RFQ Enquiry</h3>
                <p className="text-[11px] text-gray-500">Submit to receive official proforma bid</p>
              </div>
            </div>

            {session?.user ? (
              <div className="flex items-center justify-between p-3 mb-4 bg-emerald-50/80 border border-emerald-200/70 rounded-2xl text-xs">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0f7a61] shrink-0" />
                  <span className="text-[11px] leading-tight font-medium">
                    Auto-filled from your profile (<strong className="font-semibold text-[#0f7a61]">{session.user.name || session.user.email}</strong>)
                  </span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-bold shrink-0">
                  Logged In
                </span>
              </div>
            ) : status !== 'loading' ? (
              <div className="flex items-center justify-between p-3 mb-4 bg-amber-50/80 border border-amber-200/60 rounded-2xl text-xs">
                <div className="flex items-center gap-2 text-amber-900">
                  <User className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-[11px] leading-tight text-amber-800 font-medium">
                    Sign in to auto-fill your company and contact details
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-[11px] font-bold text-[#0f7a61] hover:underline cursor-pointer shrink-0 ml-2"
                >
                  Sign In
                </button>
              </div>
            ) : null}

            {submitError && (
              <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitRfq} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Company / Organization Name <span className="text-gray-400 font-normal">(Optional for Buyers)</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Al-Mansoor Trading LLC (optional)"
                    value={companyName}
                    onChange={(e) => {
                      editedFieldsRef.current.add('companyName');
                      setCompanyName(e.target.value);
                    }}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#0f7a61]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Contact Person *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Al-Sayed"
                    value={contactPerson}
                    onChange={(e) => {
                      editedFieldsRef.current.add('contactPerson');
                      setContactPerson(e.target.value);
                    }}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#0f7a61]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Corporate Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="buyer@company.com"
                    value={email}
                    onChange={(e) => {
                      editedFieldsRef.current.add('email');
                      setEmail(e.target.value);
                    }}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#0f7a61]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Phone / WhatsApp (with Country Code)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="+971 50 123 4567"
                    value={phone}
                    onChange={(e) => {
                      editedFieldsRef.current.add('phone');
                      setPhone(e.target.value);
                    }}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#0f7a61]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Destination Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => {
                      editedFieldsRef.current.add('country');
                      setCountry(e.target.value);
                    }}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#0f7a61]"
                  >
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Oman">Oman</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="India">India</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Other">Other Global Port</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Port / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jebel Ali / Dammam"
                    value={destinationPort}
                    onChange={(e) => {
                      editedFieldsRef.current.add('destinationPort');
                      setDestinationPort(e.target.value);
                    }}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#0f7a61]"
                  />
                </div>
              </div>



              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  General Instructions &amp; Requirements
                </label>
                <textarea
                  rows={2}
                  placeholder="Mention target delivery timeframe, certificate needs, or specific terms..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#0f7a61]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#0f7a61] hover:bg-[#0c6651] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting RFQ...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Consolidated RFQ</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-400 text-center leading-tight">
                By submitting, your enquiry is transmitted under Surplus Marketplace B2B Buyer Terms. Quotes are binding once accepted.
              </p>
            </form>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
