"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, Tag, CheckCircle2, 
  Truck, Send, AlertCircle, 
  ShoppingCart, ChevronRight, Check, Zap, Layers,
  List, MapPin, FileSpreadsheet, Download, Info, Package,
  Search, SlidersHorizontal, Building2, Calendar, Scale,
  Box, ExternalLink, Globe, Clock, X
} from 'lucide-react';
import { catalogService, LotItem } from '../../services/catalogService';
import { useCurrency } from '../../context/CurrencyContext';

interface LotDetailWidgetProps {
  lotId: string;
}

export default function LotDetailWidget({ lotId }: LotDetailWidgetProps) {
  const router = useRouter();
  const { formatPrice } = useCurrency();

  const [lot, setLot] = useState<LotItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Table search & filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Quote Request State
  const [showInlineQuoteForm, setShowInlineQuoteForm] = useState<boolean>(false);
  const [isRfqSent, setIsRfqSent] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState<string>('');

  useEffect(() => {
    if (!lotId) return;
    let isMounted = true;
    setLoading(true);

    catalogService.getLotById(lotId)
      .then((data) => {
        if (isMounted) {
          setLot(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('[LotDetailWidget] Error loading lot:', err);
        if (isMounted) {
          setLot(null);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [lotId]);

  const handleAddToCart = () => {
    setIsRfqSent(true);
    setTimeout(() => setIsRfqSent(false), 3500);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setQuoteSuccessMsg(`Quote request submitted successfully! Our representative will contact ${userEmail || 'you'} shortly.`);
      setShowInlineQuoteForm(false);
      setTimeout(() => setQuoteSuccessMsg(''), 6000);
    }, 1000);
  };

  // Products array extraction
  const productsList: any[] = useMemo(() => {
    if (!lot) return [];
    if (Array.isArray(lot.products) && lot.products.length > 0) return lot.products;
    if (Array.isArray(lot.manifest_data) && lot.manifest_data.length > 0) return lot.manifest_data;
    if (Array.isArray(lot.manifest_items) && lot.manifest_items.length > 0) return lot.manifest_items;
    return [];
  }, [lot]);

  // Extract distinct categories from products
  const productCategories: string[] = useMemo(() => {
    const set = new Set<string>();
    productsList.forEach((p) => {
      const cat = p.product_category || p.category;
      if (cat && typeof cat === 'string' && cat.trim() !== '') {
        set.add(cat.trim());
      }
    });
    return Array.from(set);
  }, [productsList]);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const cat = p.product_category || p.category || '';
      if (selectedCategory !== 'All' && cat.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (!searchTerm.trim()) return true;

      const q = searchTerm.toLowerCase().trim();
      const name = String(p.product_name || p.title || p.name || '').toLowerCase();
      const brand = String(p.brand || '').toLowerCase();
      const model = String(p.model_part_number || p.sku || '').toLowerCase();
      const desc = String(p.product_description || p.description || '').toLowerCase();
      const bay = String(p.seller_custom_field_1 || '').toLowerCase();
      const sub = String(p.subcategory || '').toLowerCase();

      return name.includes(q) || brand.includes(q) || model.includes(q) || desc.includes(q) || bay.includes(q) || sub.includes(q);
    });
  }, [productsList, searchTerm, selectedCategory]);

  const currencyCode = lot?.currency || 'USD';

  const formatProductPrice = (val: any) => {
    if (val === undefined || val === null || val === '-' || val === '' || val === 'NIL') return '—';
    const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return '—';
    return formatPrice(num, currencyCode);
  };

  const getExtPrice = (qty: any, price: any) => {
    const q = Number(qty || 0);
    const p = parseFloat(String(price || 0).replace(/[^0-9.]/g, ''));
    if (isNaN(p) || p <= 0 || q <= 0) return '—';
    return formatPrice(q * p, currencyCode);
  };

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-[#fcfbf7] pb-24 pt-6 animate-pulse">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1600px]">
          {/* Breadcrumbs Skeleton */}
          <div className="mb-6 flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded-lg w-64"></div>
          </div>
          {/* Lot Hero Card Skeleton */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-6 space-y-4">
                <div className="aspect-[4/3] w-full bg-gray-200 rounded-2xl"></div>
              </div>
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="h-9 w-3/4 bg-gray-200 rounded-xl mb-3"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="bg-gray-100 p-6 rounded-2xl h-24 flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                    <div className="h-8 w-44 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="h-14 bg-gray-200 rounded-full"></div>
                  <div className="h-14 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!lot) {
    return (
      <div className="w-full min-h-screen bg-[#fdfcf9] py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">Lot Listing Not Found</h2>
            <p className="text-gray-500 text-xs sm:text-sm md:text-base max-w-md mx-auto mb-6">
              The lot you requested (ID: {lotId}) is unavailable or may have been removed.
            </p>
            <button
              onClick={() => router.push('/buy')}
              className="px-6 py-3 bg-[#0f7a61] hover:bg-[#0c6651] text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors cursor-pointer"
            >
              Browse All Inventory
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { title, image, price, msrp, units, pallets, condition, location, category, offer } = lot;
  const buyerSavings = msrp > price ? msrp - price : 0;
  const unitCost = units > 0 ? price / units : 0;
  const brandsList = lot.key_brands_included 
    ? lot.key_brands_included.split(',').map(b => b.trim()).filter(Boolean)
    : [];

  return (
    <main className="w-full min-h-screen bg-[#fcfbf7] pb-16 sm:pb-24 pt-4 sm:pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1550px]">

        {/* Breadcrumbs */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <Link href="/" className="hover:text-gray-900 transition-colors shrink-0">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
            <Link href="/buy" className="hover:text-gray-900 transition-colors shrink-0">Wholesale Lots</Link>
            {category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                <span className="font-medium shrink-0 text-gray-700">{category}</span>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
            <span className="text-gray-900 font-bold truncate max-w-[180px] sm:max-w-[240px] md:max-w-xs lg:max-w-md">{title}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs sm:text-sm font-mono text-gray-500 shrink-0 ml-4">
            <span>Lot #: <strong className="text-gray-900">{lot.lot_number || `LOT-${lot.id}`}</strong></span>
            {lot.vendor_id && (
              <span>Vendor: <strong className="text-gray-700">{lot.vendor_id}</strong></span>
            )}
          </div>
        </div>

        {/* Quote Success Alert */}
        {quoteSuccessMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm font-extrabold flex items-center gap-3 animate-fade-in shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{quoteSuccessMsg}</span>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 lg:p-8 xl:p-10 mb-8 sm:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">

            {/* Left Image Showcase */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-[4/3] w-full bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden shadow-xs group">
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-2 z-10">
                  <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1 rounded-full border border-emerald-200 text-[10px] sm:text-xs font-extrabold text-[#0a5c48] shadow-xs flex items-center gap-1.5 uppercase tracking-wider">
                    <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0f7a61]" /> Wholesale Lot
                  </span>
                  {offer && (
                    <span className="bg-rose-500 text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase shadow-xs flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {offer}
                    </span>
                  )}
                  <span className="bg-emerald-950/80 backdrop-blur-md text-emerald-300 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Itemized Manifest
                  </span>
                </div>
              </div>

              {/* Warehouse Images thumbnail row if available */}
              {Array.isArray(lot.warehouse_images) && lot.warehouse_images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-1">
                  {lot.warehouse_images.map((img, i) => (
                    img.startsWith('http') ? (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        <Image src={img} alt={`Warehouse view ${i + 1}`} fill className="object-cover" />
                      </div>
                    ) : null
                  ))}
                </div>
              )}
            </div>

            {/* Right Details */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="bg-emerald-50 text-[#0f7a61] border border-emerald-200 text-[10px] sm:text-xs font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide">
                    {category || 'General Surplus'}
                  </span>
                  {lot.lot_number && (
                    <span className="bg-gray-100 text-gray-700 text-[10px] sm:text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                      {lot.lot_number}
                    </span>
                  )}
                  {lot.condition && (
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md">
                      Condition: {lot.condition}
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight mb-2 sm:mb-3">
                  {title}
                </h1>
                
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 flex-wrap">
                  <div className="flex items-center gap-1.5 font-bold text-gray-800">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{location}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Box className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{pallets} {pallets === 1 ? 'Pallet' : 'Pallets'}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{lot.number_of_distinct_skus || productsList.length} Distinct SKUs</span>
                  </div>
                </div>
              </div>

              {/* Price Box */}
              <div className="bg-[#f8faf9] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-emerald-100 flex flex-col justify-center gap-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Lot Liquidation Price</div>
                  {buyerSavings > 0 && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                      Buyer Saves: {formatPrice(buyerSavings, currencyCode)}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
                  <span suppressHydrationWarning className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f7a61]">
                    {formatPrice(price, currencyCode)}
                  </span>
                  {msrp > price && (
                    <span suppressHydrationWarning className="text-sm sm:text-base text-gray-500 line-through font-semibold">
                      Est. MSRP {formatPrice(msrp, currencyCode)}
                    </span>
                  )}
                  {offer && (
                    <span className="bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-xs">
                      <Tag className="w-3 h-3 text-rose-600" />
                      <span>{offer}</span>
                    </span>
                  )}
                </div>
                {unitCost > 0 && (
                  <div className="text-xs text-gray-500 font-medium pt-1">
                    Effective Unit Cost: <strong className="text-gray-900 font-bold">{formatPrice(unitCost, currencyCode)}</strong> / unit ({units} total units)
                  </div>
                )}
              </div>

              {/* Quantity Info Grid */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 p-4 sm:p-5 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
                  <div className="p-2 sm:p-0">
                    <span className="block text-[10px] sm:text-xs text-gray-400 font-bold uppercase mb-1">Total Units</span>
                    <span suppressHydrationWarning className="text-base sm:text-lg font-extrabold text-gray-900">{units.toLocaleString()}</span>
                  </div>
                  <div className="p-2 sm:p-0">
                    <span className="block text-[10px] sm:text-xs text-gray-400 font-bold uppercase mb-1">Distinct SKUs</span>
                    <span className="text-base sm:text-lg font-extrabold text-gray-900">{lot.number_of_distinct_skus || productsList.length}</span>
                  </div>
                  <div className="p-2 sm:p-0">
                    <span className="block text-[10px] sm:text-xs text-gray-400 font-bold uppercase mb-1">Pallet Count</span>
                    <span className="text-base sm:text-lg font-extrabold text-gray-900">{pallets}</span>
                  </div>
                  <div className="p-2 sm:p-0">
                    <span className="block text-[10px] sm:text-xs text-gray-400 font-bold uppercase mb-1">Total Weight</span>
                    <span className="text-base sm:text-lg font-extrabold text-gray-900">{lot.total_weight || '50kg'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowInlineQuoteForm(!showInlineQuoteForm)}
                    className="w-full py-3 px-4 bg-[#0f7a61] hover:bg-[#0c6651] text-white rounded-full font-extrabold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{showInlineQuoteForm ? 'Close Inquiry Form' : 'Request Manifest / Offer'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`w-full py-3 px-4 rounded-full font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                      isRfqSent
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-[#0f7a61] border-emerald-200'
                    }`}
                  >
                    {isRfqSent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>+ Add Lot to Inquiry</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Direct Manifest Download Button */}
                {lot.file_url && (
                  <a
                    href={lot.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Download Official Verified Manifest (.XLSX)</span>
                    <Download className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                )}
              </div>

              {/* Integrated Form */}
              {showInlineQuoteForm && (
                <div className="p-5 sm:p-6 bg-gray-50 border border-emerald-200 rounded-2xl animate-fade-in space-y-4 mt-4">
                  <div className="flex items-center gap-2 font-extrabold text-[#0f7a61] text-xs sm:text-sm uppercase tracking-wider">
                    <Zap className="w-4 h-4" />
                    <span>Inquire or Submit Offer For This Lot</span>
                  </div>
                  <form onSubmit={handleQuoteSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Business Email Address</label>
                      <input
                        type="email"
                        placeholder="buyer@company.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0f7a61]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Target Offer or Questions</label>
                      <textarea
                        rows={3}
                        placeholder="Specify target offer or request manifest details..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0f7a61]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#0f7a61] hover:bg-[#0c6651] text-white rounded-full font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center cursor-pointer"
                    >
                      {isSubmitting ? 'Sending Request...' : 'Submit Inquiry'}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Lot Specifications & Logistics Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 lg:p-8 mb-8 sm:mb-10 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0f7a61]" />
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">Lot Specifications & Verification Notes</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
              <span>Status: <strong className="text-emerald-700 font-bold uppercase">{lot.enquiry_status || 'Approved'}</strong></span>
            </div>
          </div>

          {/* Description */}
          {lot.description && (
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Batch Overview & Warehouse Description</span>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {lot.description}
              </p>
            </div>
          )}

          {/* Key Brands Included */}
          {brandsList.length > 0 && (
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Brands Included ({brandsList.length})</span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {brandsList.map((brand, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-[#f3f7f5] text-[#0a5c48] border border-emerald-100"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Logistics & Provenance Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
            <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
              <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Source Type</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900">{lot.source_type || 'Overstock'}</span>
            </div>
            <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
              <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Stock Age</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900">{lot.inventory_stock_age || 'Over 2 Years'}</span>
            </div>
            <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
              <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Load Type</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900">{lot.load_type || 'Pallet'}</span>
            </div>
            <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
              <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Shipping Size</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900">{lot.shipping_size || 'Multi-Pallet / LTL'}</span>
            </div>
            <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
              <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Shipping Terms</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900">{lot.shipping_terms || 'Buyer Arranges Freight'}</span>
            </div>
            <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
              <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Sale Method</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 uppercase">{lot.sale_method || 'Offer'}</span>
            </div>
          </div>

          {/* Excluded Countries & Allocations */}
          {(lot.excluded_export_countries?.length || lot.category_allocations?.length) ? (
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-gray-600">
              {lot.category_allocations && lot.category_allocations.length > 0 && (
                <div>
                  <span className="font-bold text-gray-900">Category Allocation:</span>{' '}
                  {lot.category_allocations.map(a => `${a.alocation || a.allocation || ''} ${a.category_name}`).join(', ')}
                </div>
              )}
              {lot.excluded_export_countries && lot.excluded_export_countries.length > 0 && (
                <div>
                  <span className="font-bold text-rose-600">Excluded Export Regions:</span>{' '}
                  {lot.excluded_export_countries.join(', ')}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Manifest Products Table Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 lg:p-8 mb-8 sm:mb-10 overflow-hidden space-y-5">
          
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <List className="w-5 h-5 text-[#0f7a61]" />
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  Itemized Manifest Inventory
                </h2>
                <span className="bg-[#0f7a61]/10 text-[#0f7a61] px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {productsList.length} SKUs Listed
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                Verified item-level breakdown including unit counts, asking prices, serial/part numbers, and warehouse bay tags.
              </p>
            </div>

            {/* Quick Actions: Download + Search */}
            <div className="flex items-center gap-3 flex-wrap">
              {lot.file_url && (
                <a
                  href={lot.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0f7a61] border border-emerald-200 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Download XLSX</span>
                </a>
              )}

              {/* Search Bar */}
              <div className="relative min-w-[260px] sm:min-w-[320px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by product, brand, part #..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0f7a61]"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          {productCategories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-[#0f7a61] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Categories ({productsList.length})
              </button>
              {productCategories.map((cat, i) => {
                const count = productsList.filter(p => (p.product_category || p.category) === cat).length;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#0f7a61] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Table Container */}
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
              <table className="w-full text-left border-collapse min-w-[3400px]">
                <thead className="bg-[#f8faf9] border-b border-gray-200 text-gray-600">
                  <tr>
                    <th className="py-3.5 px-3 text-xs font-bold uppercase tracking-wider sticky left-0 bg-[#f8faf9] z-20 shadow-[1px_0_0_#e5e7eb] w-[50px] text-center">#</th>
                    <th className="py-3.5 px-3 text-xs font-bold uppercase tracking-wider sticky left-[50px] bg-[#f8faf9] z-20 shadow-[1px_0_0_#e5e7eb] w-[65px] text-center">Image</th>
                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider sticky left-[115px] bg-[#f8faf9] z-20 shadow-[1px_0_0_#e5e7eb] min-w-[280px]">Product Name & Model</th>
                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider min-w-[140px]">Brand</th>
                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider min-w-[180px]">Category / Subcategory</th>
                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-center min-w-[100px]">Available Qty</th>
                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-right min-w-[130px]">Asking Price</th>
                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-right min-w-[130px]">Original MSRP</th>
                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-right min-w-[140px]">Ext. Asking Value</th>
                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider min-w-[150px]">Verification & Status</th>
                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider min-w-[160px]">Origin & Mfg Year</th>
                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider min-w-[180px]">Dimensions & Weight</th>
                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider min-w-[200px]">Safety & Certificate</th>
                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider min-w-[220px]">Warehouse Bay / Shelf</th>
                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider min-w-[280px]">Description</th>
                    <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider min-w-[130px]">Datasheet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800 text-xs sm:text-sm">
                  {filteredProducts.map((prod: any, idx: number) => {
                    const sNo = prod.s_no || idx + 1;
                    const name = prod.product_name || prod.name || prod.title || 'Product Item';
                    const brand = prod.brand || '—';
                    const model = prod.model_part_number || prod.sku || '';
                    const cat = prod.product_category || prod.category || 'General';
                    const subcat = prod.subcategory || '';
                    const qty = prod.available_quantity || prod.quantity || 0;
                    const asking = prod.asking_price || prod.price;
                    const orig = prod.original_price || prod.msrp;
                    const extVal = getExtPrice(qty, asking);
                    const tested = prod.tested_and_verified === 'Yes' || prod.functional_status === 'Yes';
                    const origin = prod.country_of_origin && prod.country_of_origin !== '-' ? prod.country_of_origin : '—';
                    const year = prod.year_of_manufacture && prod.year_of_manufacture !== '-' ? prod.year_of_manufacture : '—';
                    const weight = prod.gross_weight_per_unit && prod.gross_weight_per_unit !== '-' ? `${prod.gross_weight_per_unit} kg` : '—';
                    const dimensions = (prod.length && prod.length !== '-') 
                      ? `${prod.length} × ${prod.width} × ${prod.height} ${prod.measurement_unit || 'cm'}`
                      : '—';
                    const certType = prod.certificate_type && prod.certificate_type !== '-' ? prod.certificate_type : '';
                    const bay = prod.seller_custom_field_1 && prod.seller_custom_field_1 !== '-' ? prod.seller_custom_field_1 : '';
                    const note2 = prod.seller_custom_field_2 && prod.seller_custom_field_2 !== '-' ? prod.seller_custom_field_2 : '';
                    const link = prod.datasheet_certificate_link && prod.datasheet_certificate_link !== '-' && !prod.datasheet_certificate_link.includes('link removed') ? prod.datasheet_certificate_link : null;

                    return (
                      <tr key={idx} className="hover:bg-emerald-50/30 transition-colors group">
                        {/* Sticky S.No */}
                        <td className="py-3 px-3 text-xs font-mono text-gray-500 text-center sticky left-0 bg-white group-hover:bg-[#f6faf8] z-10 shadow-[1px_0_0_#e5e7eb]">
                          {sNo}
                        </td>

                        {/* Sticky Row Image */}
                        <td className="py-2 px-2.5 sticky left-[50px] bg-white group-hover:bg-[#f6faf8] z-10 shadow-[1px_0_0_#e5e7eb] w-[65px]">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                            <Image
                              src={prod.image || prod.image_url || prod.photo || lot.image}
                              alt={name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        </td>

                        {/* Sticky Product Name & Model */}
                        <td className="py-3 px-4 sticky left-[115px] bg-white group-hover:bg-[#f6faf8] z-10 shadow-[1px_0_0_#e5e7eb]">
                          <div className="font-bold text-gray-900 leading-snug line-clamp-2" title={name}>
                            {name}
                          </div>
                          {model && (
                            <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                              Part #: <span className="text-gray-700 font-semibold">{model}</span>
                            </div>
                          )}
                        </td>

                        {/* Brand */}
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">
                            {brand}
                          </span>
                        </td>

                        {/* Category / Subcategory */}
                        <td className="py-3 px-4 text-gray-700">
                          <div className="font-medium text-gray-900">{cat}</div>
                          {subcat && <div className="text-[11px] text-gray-500">{subcat}</div>}
                        </td>

                        {/* Quantity */}
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block bg-emerald-50 border border-emerald-200 text-[#0f7a61] px-2.5 py-1 rounded-full text-xs font-black">
                            {qty} units
                          </span>
                        </td>

                        {/* Asking Price */}
                        <td className="py-3 px-4 text-right font-black text-[#0f7a61]">
                          {formatProductPrice(asking)}
                        </td>

                        {/* Original MSRP */}
                        <td className="py-3 px-4 text-right text-gray-500">
                          {formatProductPrice(orig)}
                        </td>

                        {/* Ext. Asking Value */}
                        <td className="py-3 px-4 text-right font-black text-gray-900">
                          {extVal}
                        </td>

                        {/* Verification & Status */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1 text-[11px]">
                            {tested ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                <Check className="w-3 h-3 text-emerald-600" /> Tested & Verified
                              </span>
                            ) : (
                              <span className="text-gray-500">Visual Inspection</span>
                            )}
                            {prod.stock_age && prod.stock_age !== '-' && (
                              <span className="text-gray-500">Age: {prod.stock_age}</span>
                            )}
                          </div>
                        </td>

                        {/* Origin & Mfg Year */}
                        <td className="py-3 px-4 text-gray-700">
                          <div>Origin: <strong className="text-gray-900">{origin}</strong></div>
                          <div>Year: <strong className="text-gray-900">{year}</strong></div>
                        </td>

                        {/* Dimensions & Weight */}
                        <td className="py-3 px-4 text-gray-700">
                          <div>Wt: <span className="font-semibold">{weight}</span></div>
                          <div className="text-[11px] text-gray-500">{dimensions}</div>
                        </td>

                        {/* Safety & Certificate */}
                        <td className="py-3 px-4 text-gray-700">
                          {certType ? (
                            <span className="inline-block bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded text-[11px] font-bold">
                              {certType}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Warehouse Bay / Notes */}
                        <td className="py-3 px-4">
                          {bay && (
                            <div className="font-mono text-[11px] font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded inline-block">
                              {bay}
                            </div>
                          )}
                          {note2 && (
                            <div className="text-[11px] text-gray-600 mt-0.5">
                              {note2}
                            </div>
                          )}
                          {!bay && !note2 && <span className="text-gray-400">—</span>}
                        </td>

                        {/* Description */}
                        <td className="py-3 px-4 text-gray-600 max-w-[280px]">
                          <p className="line-clamp-2 text-xs" title={prod.product_description}>
                            {prod.product_description || '—'}
                          </p>
                        </td>

                        {/* Datasheet Link */}
                        <td className="py-3 px-4">
                          {link ? (
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#0f7a61] hover:underline font-bold text-xs"
                            >
                              <span>Doc</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-700">No products match your search criteria</h4>
              <p className="text-xs text-gray-500 mt-1">Try resetting the filter or search keyword.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className="mt-3 px-4 py-1.5 bg-[#0f7a61] text-white rounded-full text-xs font-bold cursor-pointer"
              >
                Clear Search & Filters
              </button>
            </div>
          )}

          {/* Table Footer Summary Bar */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 flex-wrap gap-2">
              <span>
                Showing <strong>{filteredProducts.length}</strong> of <strong>{productsList.length}</strong> manifested products
              </span>
              <div className="flex items-center gap-4">
                <span>
                  Total Units: <strong className="text-gray-900">{filteredProducts.reduce((acc, p) => acc + Number(p.available_quantity || p.quantity || 0), 0)}</strong>
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </main>
  );
}
