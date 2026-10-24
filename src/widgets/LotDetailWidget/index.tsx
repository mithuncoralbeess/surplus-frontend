"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, Tag, CheckCircle2, 
  Truck, AlertCircle, 
  ShoppingCart, ChevronRight, Check, Layers,
  List, MapPin, Info, Package,
  Search, SlidersHorizontal, Building2, Calendar, Scale,
  Box, ExternalLink, Globe, Clock, X,
  FileCheck, FileText, Download
} from 'lucide-react';
import { catalogService, LotItem } from '../../services/catalogService';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import VirtualWarehouseExplorer from '../../components/VirtualWarehouseExplorer';

interface LotDetailWidgetProps {
  lotId: string;
}

export default function LotDetailWidget({ lotId }: LotDetailWidgetProps) {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { addToCart, openCartDrawer, isInCart } = useCart();

  const [lot, setLot] = useState<LotItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const inCart = Boolean(
    (lot && (
      isInCart(lot.id) ||
      (lot.lot_number && isInCart(lot.lot_number)) ||
      isInCart(String(lot.id || lot.lot_number))
    )) ||
    (lotId && isInCart(lotId))
  );


  // RFQ Basket Notification State
  const [isRfqSent, setIsRfqSent] = useState<boolean>(false);

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
    if (!lot) return;
    if (inCart) {
      openCartDrawer();
      return;
    }
    const lotPrice = Number(lot.price) || 0;
    const lotUnits = Number(lot.units) || 1;
    const lotLocation = (lot.inventory_city && lot.inventory_country)
      ? `${lot.inventory_city}, ${lot.inventory_country}`
      : (lot.location || lot.inventory_location || 'Warehouse');
    const lotImage = selectedImage || lot.image || (lot.warehouse_images && lot.warehouse_images[0]) || '';

    addToCart({
      id: String(lot.id || lot.lot_number || lotId),
      productId: lot.id,
      type: 'lot',
      title: lot.listing_title || lot.title || `Wholesale Surplus Lot #${lot.lot_number || lotId}`,
      category: lot.category || 'Surplus Lot',
      quantity: 1,
      unitPrice: lotPrice,
      image: lotImage,
      moq: 1,
      estQty: lotUnits,
      sku: lot.lot_number,
      location: lotLocation,
    }, 1);

    setIsRfqSent(true);
    setTimeout(() => setIsRfqSent(false), 3500);
  };

  // Products array extraction
  const productsList: any[] = useMemo(() => {
    if (!lot) return [];
    if (Array.isArray(lot.products) && lot.products.length > 0) return lot.products;
    if (Array.isArray(lot.manifest_data) && lot.manifest_data.length > 0) return lot.manifest_data;
    if (Array.isArray(lot.manifest_items) && lot.manifest_items.length > 0) return lot.manifest_items;
    return [];
  }, [lot]);

  const currencyCode = lot?.currency || 'USD';

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
                <div className="space-y-3 pt-2">
                  <div className="h-12 sm:h-14 bg-gray-200 rounded-full"></div>
                  <div className="h-10 sm:h-12 bg-gray-200 rounded-full"></div>
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
              Back to Buy
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { title, image, price, msrp, units, pallets, condition, category, offer } = lot;

  const loc = (lot.inventory_location || lot.location || '').trim();
  const country = (lot.inventory_country || (lot as any).country || '').trim();
  const city = (lot.inventory_city || (lot as any).city || '').trim();

  let displayLocation = '';
  if (city && country) {
    if (city.toLowerCase() === country.toLowerCase()) displayLocation = country;
    else if (city.toLowerCase().includes(country.toLowerCase())) displayLocation = city;
    else displayLocation = `${city}, ${country}`;
  } else if (loc && country) {
    if (loc.toLowerCase() === country.toLowerCase()) displayLocation = loc;
    else if (loc.toLowerCase().includes(country.toLowerCase())) displayLocation = loc;
    else displayLocation = `${loc}, ${country}`;
  } else {
    displayLocation = loc || country || city || '';
  }

  const location = displayLocation || 'Warehouse';
  const buyerSavings = msrp > price ? msrp - price : 0;
  const unitCost = units > 0 ? price / units : 0;
  const brandsList = lot.key_brands_included 
    ? lot.key_brands_included.split(',').map(b => b.trim()).filter(Boolean)
    : [];

  const unitTypeLabel = useMemo(() => {
    const raw = lot.primary_unit_type?.trim();
    if (!raw || raw.toLowerCase() === 'pieces / units' || raw.toLowerCase() === 'units' || raw.toLowerCase() === 'unit') {
      return 'Units';
    }
    return raw;
  }, [lot.primary_unit_type]);

  const unitTypeSingular = useMemo(() => {
    const lower = unitTypeLabel.toLowerCase();
    if (lower.endsWith('pieces')) return 'piece';
    if (lower.endsWith('boxes')) return 'box';
    if (lower.endsWith('cartons')) return 'carton';
    if (lower.endsWith('sets')) return 'set';
    if (lower.endsWith('pairs')) return 'pair';
    if (lower.endsWith('packs')) return 'pack';
    if (lower.endsWith('bottles')) return 'bottle';
    if (lower.endsWith('pallets')) return 'pallet';
    if (lower.endsWith('units')) return 'unit';
    if (lower.endsWith('s') && lower.length > 3) return lower.slice(0, -1);
    return lower;
  }, [unitTypeLabel]);

  const formattedListedDate = useMemo(() => {
    if (lot.created_at_formatted) return lot.created_at_formatted;
    if (lot.created_at) {
      try {
        return new Date(lot.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      } catch {
        return lot.created_at;
      }
    }
    return '';
  }, [lot.created_at_formatted, lot.created_at]);

  return (
    <main className="w-full min-h-screen bg-[#fcfbf7] pb-16 sm:pb-24 pt-4 sm:pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1550px]">

        {/* Breadcrumbs */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <Link href="/" className="hover:text-gray-900 transition-colors shrink-0">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
            <Link href="/buy" className="hover:text-gray-900 transition-colors shrink-0">Buy</Link>
            {category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                <Link 
                  href={`/buy?category=${encodeURIComponent(category)}`}
                  className="hover:text-[#0f7a61] transition-colors shrink-0 font-medium"
                >
                  {category}
                </Link>
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


        {/* Hero Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 lg:p-8 xl:p-10 mb-8 sm:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">

            {/* Left Image Showcase */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-[4/3] w-full bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden shadow-xs group">
                <Image
                  src={selectedImage || image}
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
                  {(lot.third_party_certificate_available || (Array.isArray(lot.third_party_documents) && lot.third_party_documents.length > 0)) && (
                    <span className="bg-blue-950/85 backdrop-blur-md text-blue-200 border border-blue-400/40 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold flex items-center gap-1 shadow-xs uppercase tracking-wider">
                      <FileCheck className="w-3 h-3 text-blue-400" /> 3rd-Party Inspected
                    </span>
                  )}
                </div>
              </div>

              {/* Warehouse Images thumbnail row if available */}
              {Array.isArray(lot.warehouse_images) && lot.warehouse_images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-1">
                  {lot.warehouse_images.map((img, i) => (
                    img.startsWith('http') ? (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                          (selectedImage || image) === img ? 'border-[#0a5c48] ring-2 ring-[#0a5c48]/40 scale-105' : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <Image src={img} alt={`Warehouse view ${i + 1}`} fill className="object-cover" />
                      </button>
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
                  {displayLocation && (
                    <>
                      <div className="flex items-center gap-1.5 font-bold text-gray-800">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{displayLocation}</span>
                      </div>
                      <span>•</span>
                    </>
                  )}
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
                  <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Price</div>
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
                      MSRP {formatPrice(msrp, currencyCode)}
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
                    Effective Unit Cost: <strong className="text-gray-900 font-bold">{formatPrice(unitCost, currencyCode)}</strong> / {unitTypeSingular} ({units.toLocaleString()} total {unitTypeLabel.toLowerCase()})
                  </div>
                )}
              </div>

              {/* Quantity Info Grid */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 p-4 sm:p-5 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
                  <div className="p-2 sm:p-0">
                    <span className="block text-[10px] sm:text-xs text-gray-400 font-bold uppercase mb-1">
                      {unitTypeLabel === 'Units' ? 'Total Units' : `Total ${unitTypeLabel}`}
                    </span>
                    <span suppressHydrationWarning className="text-base sm:text-lg font-extrabold text-gray-900">
                      {units.toLocaleString()} {unitTypeLabel !== 'Units' ? <span className="text-xs font-semibold text-gray-500 ml-0.5">{unitTypeLabel}</span> : null}
                    </span>
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
                <button
                  type="button"
                  onClick={inCart ? openCartDrawer : handleAddToCart}
                  className={`w-full py-3 sm:py-3.5 px-6 rounded-full font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md ${
                    isRfqSent
                      ? 'bg-emerald-700 text-white border border-emerald-700'
                      : inCart
                      ? 'bg-[#0f7a61] hover:bg-[#0c6651] text-white border border-[#0f7a61]'
                      : 'bg-[#0f7a61] hover:bg-[#0c6651] text-white border border-[#0f7a61]'
                  }`}
                  title={inCart ? 'Already added to RFQ Basket. Click to view basket.' : 'Add Lot to RFQ Basket'}
                >
                  {isRfqSent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" />
                      <span>Added wholesale lot to RFQ Basket!</span>
                    </>
                  ) : inCart ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" />
                      <span>In RFQ Basket (View Basket)</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>+ Add Lot to RFQ List</span>
                    </>
                  )}
                </button>

                {(isRfqSent || inCart) && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm font-bold text-[#0a5c48] text-center animate-fade-in flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isRfqSent ? 'Added wholesale lot to RFQ Basket!' : 'Wholesale lot is already in your RFQ Basket!'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={openCartDrawer}
                      className="px-3 py-1 bg-[#0f7a61] text-white rounded-full text-xs font-bold hover:bg-[#0c6651] transition-colors cursor-pointer shrink-0"
                    >
                      View Basket
                    </button>
                  </div>
                )}
              </div>

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
            <div className="flex items-center gap-3 text-xs text-gray-500 font-mono flex-wrap">
              {formattedListedDate && (
                <span>Listed: <strong className="text-gray-900 font-bold">{formattedListedDate}</strong></span>
              )}
              {formattedListedDate && <span>•</span>}
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
            {Boolean(lot.inventory_country || (lot as any).country) && 
             (!Boolean(lot.inventory_location || lot.location) || 
              (lot.inventory_country || (lot as any).country)?.trim().toLowerCase() !== (lot.inventory_location || lot.location)?.trim().toLowerCase()) && (
              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Inventory Country</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{lot.inventory_country || (lot as any).country}</span>
                </span>
              </div>
            )}
            {Boolean(lot.inventory_location || lot.location) && (
              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Inventory Location</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{lot.inventory_location || lot.location}</span>
                </span>
              </div>
            )}
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
            {Boolean(lot.primary_unit_type && lot.primary_unit_type.trim()) && (
              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Primary Unit Type</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{lot.primary_unit_type}</span>
                </span>
              </div>
            )}
            {Boolean(lot.lot_size || pallets) && (
              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Lot Size</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{lot.lot_size || `${pallets} ${pallets === 1 ? 'Pallet' : 'Pallets'}`}</span>
                </span>
              </div>
            )}
            {Boolean(formattedListedDate) && (
              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Listed Date</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{formattedListedDate}</span>
                </span>
              </div>
            )}
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

          {/* Third-Party Inspection & Quality Documents Section */}
          {(lot.third_party_certificate_available || (Array.isArray(lot.third_party_documents) && lot.third_party_documents.length > 0)) && (
            <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-blue-50/50 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-start sm:items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-extrabold text-gray-900">Third-Party Certificates & Inspection Documents</h3>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-700" /> Verified Audit
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      This lot has been independently audited and verified for authentic quality, count conformity, and warehouse condition.
                    </p>
                  </div>
                </div>
              </div>

              {/* Downloadable Documents */}
              {Array.isArray(lot.third_party_documents) && lot.third_party_documents.length > 0 ? (
                <div className="space-y-2 mt-3 pt-3 border-t border-emerald-200/60">
                  <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Available Certificate & Inspection Files ({lot.third_party_documents.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {lot.third_party_documents.map((docUrl, idx) => {
                      const rawFileName = docUrl.split('/').pop()?.split('?')[0] || `Inspection_Certificate_${idx + 1}.pdf`;
                      const cleanFileName = decodeURIComponent(rawFileName);
                      return (
                        <a
                          key={idx}
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={cleanFileName}
                          className="flex items-center justify-between gap-2.5 p-3 bg-white hover:bg-emerald-50 rounded-xl border border-emerald-200/90 hover:border-emerald-400 text-gray-800 hover:text-emerald-950 transition-all duration-200 shadow-2xs group"
                          title={`Download ${cleanFileName}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100/80 group-hover:bg-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 transition-colors">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold truncate text-gray-800 group-hover:text-emerald-950">
                              {cleanFileName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 text-emerald-700 bg-emerald-50 group-hover:bg-[#0f7a61] group-hover:text-white px-2.5 py-1 rounded-md text-[11px] font-extrabold border border-emerald-200 transition-colors">
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Download</span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-emerald-900 bg-white/80 rounded-xl p-3 border border-emerald-200/60 mt-2 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>3rd-party inspection certificate is verified on file with Surplus operations and available with purchase documentation upon request.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Virtual Warehouse Explorer (Interactive Lot SKU Grid & Valuation) */}
        <VirtualWarehouseExplorer
          lotId={lot.id}
          initialLot={lot}
          currency={currencyCode}
          className="mb-8 sm:mb-10"
        />

      </div>
    </main>
  );
}

