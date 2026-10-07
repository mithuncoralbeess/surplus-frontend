"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, Tag, CheckCircle2, 
  Truck, Send, AlertCircle, 
  Minus, Plus, ShoppingCart, Lock, ChevronRight, Check, Zap, Layers,
  List, MapPin, FileText, Info, Package
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

  // Quote Request State
  const [showInlineQuoteForm, setShowInlineQuoteForm] = useState<boolean>(false);
  const [isRfqSent, setIsRfqSent] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [targetPrice, setTargetPrice] = useState<string>('');
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
              onClick={() => router.push('/browse')}
              className="px-6 py-3 bg-[#0f7a61] hover:bg-[#0c6651] text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors cursor-pointer"
            >
              Browse All Inventory
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currencyCode = 'USD'; // Assuming USD for now since LotItem doesn't carry currency directly
  const { title, image, price, msrp, units, pallets, condition, location, category, offer } = lot;

  return (
    <main className="w-full min-h-screen bg-[#fcfbf7] pb-16 sm:pb-24 pt-4 sm:pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Breadcrumbs */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <Link href="/" className="hover:text-gray-900 transition-colors shrink-0">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
            <Link href="/browse" className="hover:text-gray-900 transition-colors shrink-0">Browse</Link>
            {category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                <span className="font-medium shrink-0">{category}</span>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
            <span className="text-gray-900 font-bold truncate max-w-[180px] sm:max-w-[240px] md:max-w-xs lg:max-w-md">{title}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs sm:text-sm font-mono text-gray-500 shrink-0 ml-4">
            <span>Lot ID: <strong className="text-gray-900">{lot.id}</strong></span>
          </div>
        </div>

        {quoteSuccessMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm font-extrabold flex items-center gap-3 animate-fade-in shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{quoteSuccessMsg}</span>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 lg:p-8 mb-8 sm:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">

            {/* Left Image */}
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
                </div>
              </div>
            </div>

            {/* Right Details */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight mb-2 sm:mb-3">
                  {title}
                </h1>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-800 font-bold mb-1">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 font-medium">
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Condition: <strong>{condition}</strong></span>
                </div>
              </div>

              {/* Price Box */}
              <div className="bg-[#f8faf9] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-emerald-100 flex flex-col justify-center gap-2">
                <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Lot Price</div>
                <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
                  <span suppressHydrationWarning className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f7a61]">
                    {formatPrice(price, currencyCode)}
                  </span>
                  {msrp > price && (
                    <span suppressHydrationWarning className="text-sm sm:text-base text-gray-500 line-through font-semibold">
                      Est. MSRP {formatPrice(msrp, currencyCode)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Info */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 p-4 sm:p-5 lg:p-6 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Total Units</span>
                    <span suppressHydrationWarning className="text-lg font-extrabold text-gray-900">{units.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Pallets</span>
                    <span className="text-lg font-extrabold text-gray-900">{pallets}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowInlineQuoteForm(!showInlineQuoteForm)}
                  className="w-full py-2.5 sm:py-3 px-4 bg-[#0f7a61] hover:bg-[#0c6651] text-white rounded-full font-extrabold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{showInlineQuoteForm ? 'Close Request' : 'Request Manifest'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full py-2.5 sm:py-3 px-4 rounded-full font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                    isRfqSent
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-[#0f7a61] border-emerald-200'
                  }`}
                >
                  {isRfqSent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>+ Add to Inquiry</span>
                    </>
                  )}
                </button>
              </div>

              {/* Integrated Form */}
              {showInlineQuoteForm && (
                <div className="p-5 sm:p-6 bg-gray-50 border border-emerald-200 rounded-2xl sm:rounded-3xl animate-fade-in space-y-4 mt-4">
                  <div className="flex items-center gap-2 font-extrabold text-[#0f7a61] text-xs sm:text-sm md:text-base uppercase tracking-wider">
                    <Zap className="w-4 h-4" />
                    <span>Inquire About This Lot</span>
                  </div>
                  <form onSubmit={handleQuoteSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Business Email Address</label>
                      <input
                        type="email"
                        placeholder="buyer@company.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Target Offer or Questions</label>
                      <textarea
                        rows={3}
                        placeholder="Specify target offer or request manifest details..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900"
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

        {/* Products Table Section */}
        {lot.products && lot.products.length > 0 && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 lg:p-8 mb-8 sm:mb-10 overflow-hidden">
            <div className="flex items-center gap-2 text-gray-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider mb-5">
              <List className="w-4 h-4 text-[#0f7a61]" />
              <span>Lot Products Breakdown</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left border-collapse min-w-[3500px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 shadow-[1px_0_0_#e5e7eb]">S.No</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-[60px] bg-gray-50 z-10 shadow-[1px_0_0_#e5e7eb]">Product Name</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product Description</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product Category</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Subcategory</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Brand / Manufacturer</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Model / Part Number</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Available Quantity</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Original Price</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Asking Price</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Country of Origin</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Year of Manufacture</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Datasheet / Certificate Link</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Gross Weight per Unit</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Length</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Width</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Height</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Measurement Unit</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Age</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tested and verified</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Functional Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Visible Damage?</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Missing Parts?</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Warranty Available?</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Safety Certificate Available?</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Certificate Type</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Regulatory Approval</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Hazardous Material?</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Recyclable?</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estimated Product Life Remaining</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Seller Custom Field 1</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Seller Custom Field 2</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lot.products.map((prod: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 text-xs font-mono text-gray-500 sticky left-0 bg-white z-10 shadow-[1px_0_0_#e5e7eb] group-hover:bg-gray-50/50">{prod.s_no || idx + 1}</td>
                      <td className="py-3 px-4 text-sm font-bold text-gray-900 sticky left-[60px] bg-white z-10 shadow-[1px_0_0_#e5e7eb] group-hover:bg-gray-50/50 max-w-[250px] truncate" title={prod.name || prod.product_name || prod.title}>{prod.name || prod.product_name || prod.title}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 max-w-[250px] truncate" title={prod.product_description}>{prod.product_description || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.category || prod.product_category || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.subcategory || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.brand || '-'}</td>
                      <td className="py-3 px-4 text-xs font-mono text-gray-500">{prod.model_part_number || prod.sku || '-'}</td>
                      <td className="py-3 px-4 text-sm font-extrabold text-gray-900 text-center">{prod.available_quantity || prod.quantity || 0}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right whitespace-nowrap">{prod.original_price || prod.msrp ? formatPrice(prod.original_price || prod.msrp, currencyCode) : '-'}</td>
                      <td className="py-3 px-4 text-sm font-bold text-[#0f7a61] text-right whitespace-nowrap">{prod.asking_price || prod.price ? formatPrice(prod.asking_price || prod.price, currencyCode) : '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.country_of_origin || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.year_of_manufacture || '-'}</td>
                      <td className="py-3 px-4 text-sm text-blue-500 hover:underline">{prod.datasheet_certificate_link && prod.datasheet_certificate_link !== 'NIL' ? <a href={prod.datasheet_certificate_link} target="_blank" rel="noreferrer">View Link</a> : '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.gross_weight_per_unit || prod.total_weight || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.length || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.width || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.height || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.measurement_unit || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">{prod.stock_age || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.tested_and_verified || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.functional_status || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.visible_damage || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.missing_parts || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.warranty_available || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.safety_certificate_available || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-[150px]" title={prod.certificate_type || ''}>{prod.certificate_type || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.regulatory_approval || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.hazardous_material || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.recyclable || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">{prod.estimated_product_life_remaining || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.seller_custom_field_1 || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{prod.seller_custom_field_2 || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
