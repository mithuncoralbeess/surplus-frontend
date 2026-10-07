"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, Tag, CheckCircle2, 
  Truck, Send, AlertCircle, 
  Minus, Plus, ShoppingCart, Lock, ChevronRight, Check, Zap, Layers,
  List, MapPin, FileText, Info
} from 'lucide-react';
import { catalogService, ProductItem } from '../../services/catalogService';
import { useCurrency } from '../../context/CurrencyContext';
import ProductCard from '../../components/ProductCard';

interface ProductDetailWidgetProps {
  productId: string;
}

export default function ProductDetailWidget({ productId }: ProductDetailWidgetProps) {
  const router = useRouter();
  const { formatPrice } = useCurrency();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'shipping'>('overview');

  // Quantity & Quote Request State
  const [quantity, setQuantity] = useState<number>(1);
  const [showInlineQuoteForm, setShowInlineQuoteForm] = useState<boolean>(false);
  const [isRfqSent, setIsRfqSent] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState<string>('');

  useEffect(() => {
    if (!productId) return;
    let isMounted = true;
    setLoading(true);

    catalogService.getProductById(productId)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
          if (data?.image) {
            setActiveImage(data.image);
          }
          if (data?.moq) {
            setQuantity(data.moq);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('[ProductDetailWidget] Error loading product:', err);
        if (isMounted) {
          setProduct(null);
          setLoading(false);
        }
      });

    // Fetch related products
    catalogService.getProducts()
      .then((list) => {
        if (isMounted) {
          setRelatedProducts(list.filter(p => String(p.id) !== productId).slice(0, 4));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleDecreaseQty = () => {
    const moq = product?.moq || 1;
    if (quantity > moq) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleIncreaseQty = () => {
    const maxQty = product?.quantity || product?.estQty || 9999;
    if (quantity < maxQty) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    if (valStr === '') {
      setQuantity(0);
      return;
    }
    const val = parseInt(valStr, 10);
    if (!isNaN(val)) {
      const maxQty = product?.quantity || product?.estQty || 9999;
      if (val > maxQty) {
        setQuantity(maxQty);
      } else {
        setQuantity(val);
      }
    }
  };

  const handleQuantityInputBlur = () => {
    const minQty = product?.moq || 1;
    const maxQty = product?.quantity || product?.estQty || 9999;
    if (quantity < minQty) {
      setQuantity(minQty);
    } else if (quantity > maxQty) {
      setQuantity(maxQty);
    }
  };

  const handleAddToCart = () => {
    setIsRfqSent(true);
    setTimeout(() => setIsRfqSent(false), 3500);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setQuoteSuccessMsg(`Quote request for ${quantity} unit(s) submitted successfully! Our representative will contact ${userEmail || 'you'} shortly.`);
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
            <div className="hidden md:block h-4 bg-gray-200 rounded-lg w-32"></div>
          </div>

          {/* Product Hero Card Skeleton */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-start">
              
              {/* Left Column: Image Gallery Skeleton */}
              <div className="lg:col-span-6 space-y-4">
                <div className="aspect-[4/3] w-full bg-gray-200 rounded-2xl"></div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl shrink-0"></div>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl shrink-0"></div>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl shrink-0"></div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                  <div className="h-16 bg-gray-100 rounded-2xl"></div>
                  <div className="h-16 bg-gray-100 rounded-2xl"></div>
                  <div className="h-16 bg-gray-100 rounded-2xl"></div>
                </div>
              </div>

              {/* Right Column: Details & Actions Skeleton */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex gap-2 mb-3">
                    <div className="h-6 w-28 bg-gray-200 rounded-md"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
                  </div>
                  <div className="h-9 w-3/4 bg-gray-200 rounded-xl mb-3"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded-lg"></div>
                </div>

                {/* Price Box Skeleton */}
                <div className="bg-gray-100 p-6 rounded-2xl h-24 flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                    <div className="h-8 w-44 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded-xl"></div>
                </div>

                {/* Quantity Stepper Skeleton */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 h-24 space-y-3">
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-xl"></div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="h-14 bg-gray-200 rounded-full"></div>
                  <div className="h-14 bg-gray-200 rounded-full"></div>
                </div>

                {/* Specs List Skeleton */}
                <div className="pt-4 grid grid-cols-2 gap-3 border-t border-gray-100">
                  <div className="h-4 bg-gray-100 rounded"></div>
                  <div className="h-4 bg-gray-100 rounded"></div>
                  <div className="h-4 bg-gray-100 rounded"></div>
                  <div className="h-4 bg-gray-100 rounded"></div>
                </div>

              </div>
            </div>
          </div>

          {/* Tabbed Specs Section Skeleton */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="flex gap-3 border-b border-gray-100 pb-4 mb-6">
              <div className="h-10 w-36 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-44 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-48 bg-gray-200 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="h-28 bg-gray-100 rounded-2xl"></div>
              <div className="h-28 bg-gray-100 rounded-2xl"></div>
              <div className="h-28 bg-gray-100 rounded-2xl"></div>
              <div className="h-28 bg-gray-100 rounded-2xl"></div>
            </div>
          </div>

        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-[#fdfcf9] py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">Product Listing Not Found</h2>
            <p className="text-gray-500 text-xs sm:text-sm md:text-base max-w-md mx-auto mb-6">
              The product you requested (ID: {productId}) is unavailable or may have been removed.
            </p>
            <button
              onClick={() => router.push('/browse')}
              className="px-6 py-3 bg-[#0f7a61] hover:bg-[#0c6651] text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors cursor-pointer"
            >
              Browse All Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const imagesList = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image];

  const currentImage = activeImage || product.image;
  const currencyCode = product.currency || 'USD';
  const unitPrice = product.currentPrice || product.price;
  const totalPrice = unitPrice * quantity;
  const msrpPrice = product.originalPrice;
  const discountPercent = msrpPrice && msrpPrice > unitPrice
    ? Math.round(((msrpPrice - unitPrice) / msrpPrice) * 100)
    : 0;

  return (
    <main className="w-full min-h-screen bg-[#fcfbf7] pb-16 sm:pb-24 pt-4 sm:pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Breadcrumbs */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs sm:text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <Link href="/" className="hover:text-gray-900 transition-colors shrink-0">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
            <Link href="/browse" className="hover:text-gray-900 transition-colors shrink-0">Browse</Link>
            {product.category && product.category.toLowerCase() !== 'consumer electronics' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                <Link 
                  href={`/browse?category=${encodeURIComponent(product.category)}`}
                  className="hover:text-[#0f7a61] transition-colors shrink-0 font-medium truncate max-w-[140px] sm:max-w-[200px]"
                >
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
            <span className="text-gray-900 font-bold truncate max-w-[180px] sm:max-w-[240px] md:max-w-xs lg:max-w-md">{product.title}</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs sm:text-sm font-mono text-gray-500 shrink-0 ml-4">
            <span>SKU: <strong className="text-gray-900">{product.product_id || product.sku}</strong></span>
          </div>
        </div>

        {/* Global Quote Notification Toast */}
        {quoteSuccessMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm font-extrabold flex items-center gap-3 animate-fade-in shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{quoteSuccessMsg}</span>
          </div>
        )}

        {/* Main Product Hero Layout (E-Commerce Integrated PDP) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 lg:p-8 mb-8 sm:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">

            {/* Left Column: Image Gallery (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-[4/3] w-full bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden shadow-xs group">
                <Image
                  src={currentImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-2 z-10">
                  <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1 rounded-full border border-emerald-200 text-[10px] sm:text-xs font-extrabold text-[#0a5c48] shadow-xs flex items-center gap-1.5 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0f7a61]" /> Verified Surplus
                  </span>
                  {product.isNew && (
                    <span className="bg-[#0f7a61] text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase shadow-xs">
                      New Arrival
                    </span>
                  )}
                </div>

              </div>

              {/* Thumbnails Row */}
              {imagesList.length > 1 && (
                <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
                  {imagesList.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl transition-all cursor-pointer shrink-0 p-0.5 border-2 ${
                        currentImage === imgUrl ? 'border-[#0f7a61] ring-2 ring-[#0f7a61]/20 scale-105' : 'border-gray-200 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="relative w-full h-full rounded-[9px] overflow-hidden">
                        <Image
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 64px, 80px"
                          className="object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Features Strip */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100 text-center">
                <div className="p-2 sm:p-3 bg-gray-50/80 rounded-xl sm:rounded-2xl border border-gray-100 flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0f7a61] mb-1" />
                  <span className="text-[10px] sm:text-xs font-bold text-gray-800">Verified Inspection</span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400">Pre-screened</span>
                </div>
                <div className="p-2 sm:p-3 bg-gray-50/80 rounded-xl sm:rounded-2xl border border-gray-100 flex flex-col items-center">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0f7a61] mb-1" />
                  <span className="text-[10px] sm:text-xs font-bold text-gray-800">Freight Dispatch</span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400">48-72 hr shipping</span>
                </div>
                <div className="p-2 sm:p-3 bg-gray-50/80 rounded-xl sm:rounded-2xl border border-gray-100 flex flex-col items-center">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#0f7a61] mb-1" />
                  <span className="text-[10px] sm:text-xs font-bold text-gray-800">Escrow Security</span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400">Protected funds</span>
                </div>
              </div>
            </div>

            {/* Right Column: Integrated E-commerce Product Details & Purchase Controls (6 cols) */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              
              {/* Category & Title Header */}
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#0a5c48] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                    {product.category}
                  </span>
                  {product.subCategory && (
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                      {product.subCategory}
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight mb-2 sm:mb-3">
                  {product.title}
                </h1>

                {/* Subheader: Stock & Views Row (above), Location Row (below without Location: prefix - conditional on API data) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 flex-wrap">
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>In Stock ({product.quantity || product.estQty} Units)</span>
                    </span>
                    <span>•</span>
                    <span className="text-gray-600 font-sans font-medium">
                      {product.views_count || 0} Views
                    </span>
                  </div>

                  {Boolean(product.inventory_location || product.location) && (
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-800 font-bold">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{product.inventory_location || product.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Price Banner */}
              <div className="bg-[#f8faf9] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Wholesale Liquidation Price</div>
                  <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
                    <span suppressHydrationWarning className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f7a61]">
                      {formatPrice(unitPrice, currencyCode)}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 font-bold">/ unit</span>
                    {msrpPrice && msrpPrice > unitPrice && (
                      <span suppressHydrationWarning className="text-sm sm:text-base text-gray-500 line-through font-semibold">
                        MSRP {formatPrice(msrpPrice, currencyCode)}
                      </span>
                    )}
                  </div>
                  {product.liquidatingPrice && product.liquidatingPrice !== unitPrice && (
                    <div className="text-xs sm:text-sm font-semibold text-gray-700 mt-2 flex items-center gap-1.5 flex-wrap">
                      <span>Liquidation Floor:</span>
                      <strong suppressHydrationWarning className="font-black text-gray-900">{formatPrice(product.liquidatingPrice, currencyCode)}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Stepper & Subtotal Calculation */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 p-4 sm:p-5 lg:p-6 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Select Quantity (MOQ: {product.moq} units)
                  </label>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Max Available: <strong className="text-gray-900">{product.quantity || product.estQty} units</strong>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
                  {/* Stepper Input */}
                  <div className="inline-flex items-center bg-gray-50 border border-gray-300 rounded-full p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={handleDecreaseQty}
                      disabled={quantity <= (product.moq || 1)}
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-800 transition-colors cursor-pointer shadow-xs"
                    >
                      <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <input
                      type="number"
                      min={product.moq || 1}
                      max={product.quantity || product.estQty || 9999}
                      value={quantity === 0 ? '' : quantity}
                      onChange={handleQuantityInputChange}
                      onBlur={handleQuantityInputBlur}
                      className="w-14 sm:w-16 md:w-20 text-center font-extrabold text-gray-900 text-sm sm:text-base md:text-lg xl:text-xl bg-transparent border-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={handleIncreaseQty}
                      disabled={quantity >= (product.quantity || product.estQty || 9999)}
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-800 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Computed Price */}
                  <div className="text-right">
                    <span className="text-[10px] sm:text-xs md:text-sm text-gray-400 block font-medium">Subtotal ({quantity} units):</span>
                    <span suppressHydrationWarning className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-black text-gray-900">
                      {formatPrice(totalPrice, currencyCode)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowInlineQuoteForm(!showInlineQuoteForm)}
                    className="w-full py-2.5 sm:py-3 px-4 bg-[#0f7a61] hover:bg-[#0c6651] text-white rounded-full font-extrabold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{showInlineQuoteForm ? 'Close Quote Form' : 'Request Official Quote'}</span>
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
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>+ Add to RFQ List</span>
                      </>
                    )}
                  </button>
                </div>

                {isRfqSent && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm font-bold text-[#0a5c48] text-center animate-fade-in flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Added to your inquiry cart. Click &quot;Request Official Quote&quot; to finalize.</span>
                  </div>
                )}
              </div>

              {/* Integrated Inline RFQ Form */}
              {showInlineQuoteForm && (
                <div className="p-5 sm:p-6 bg-gray-50 border border-emerald-200 rounded-2xl sm:rounded-3xl animate-fade-in space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-[#0f7a61] text-xs sm:text-sm md:text-base uppercase tracking-wider">
                      <Zap className="w-4 h-4" />
                      <span>Submit Instant RFQ Inquiry</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono text-gray-500">SKU: {product.product_id || product.sku}</span>
                  </div>

                  <form onSubmit={handleQuoteSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Requested Quantity</label>
                        <input
                          type="number"
                          min={product.moq}
                          max={product.quantity || product.estQty}
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          required
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Target Price / Unit ({currencyCode})</label>
                        <input
                          type="text"
                          placeholder={`Current: ${formatPrice(unitPrice, currencyCode)}`}
                          value={targetPrice}
                          onChange={(e) => setTargetPrice(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900"
                        />
                      </div>
                    </div>

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
                      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Destination Port / Delivery Notes</label>
                      <textarea
                        rows={2}
                        placeholder="Specify shipping destination or escrow conditions..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 sm:py-3.5 bg-[#0f7a61] hover:bg-[#0c6651] text-white rounded-full font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? 'Sending Request...' : 'Submit Quote Request'}
                    </button>
                  </form>
                </div>
              )}

              {/* Highlights */}
              <div className="pt-2 grid grid-cols-2 gap-2.5 text-xs sm:text-sm border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Check className="w-4 h-4 text-[#0f7a61] shrink-0" />
                  <span>Verified B2B Stock</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Check className="w-4 h-4 text-[#0f7a61] shrink-0" />
                  <span>Immediate Manifest</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Check className="w-4 h-4 text-[#0f7a61] shrink-0" />
                  <span>Volume Discounts</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Check className="w-4 h-4 text-[#0f7a61] shrink-0" />
                  <span>Escrow Guarantee</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Tabbed Product Details Section (Overview / Specifications / Shipping) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 mb-10 sm:mb-12">
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 border-b border-gray-200 pb-3 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-[#0f7a61] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Product Overview
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer shrink-0 ${
                activeTab === 'specs'
                  ? 'bg-[#0f7a61] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer shrink-0 ${
                activeTab === 'shipping'
                  ? 'bg-[#0f7a61] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Shipping, Warranty & Documents
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-6 sm:pt-8">
            {/* TAB 1: PRODUCT OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Description Card */}
                <div className="bg-white border border-gray-200/90 shadow-sm rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-gray-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider mb-3">
                    <FileText className="w-4 h-4 text-[#0f7a61]" />
                    <span>DESCRIPTION</span>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {product.description || `High-quality surplus ${product.category} stock available for immediate liquidation. Pre-inspected inventory stored in climate-controlled warehouse facilities.`}
                  </p>
                </div>

                {/* Reason to Sell Card */}
                {product.reason_to_sell && (
                  <div className="bg-amber-50/70 border border-amber-200/80 shadow-xs rounded-2xl p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs sm:text-sm uppercase tracking-wider mb-3">
                      <Info className="w-4 h-4 text-amber-600" />
                      <span>REASON TO SELL</span>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">
                      {product.reason_to_sell}
                    </p>
                  </div>
                )}

                {/* Overview Summary Grid */}
                <div className="pt-4 border-t border-gray-200/80">
                  <div className="flex items-center gap-2 text-gray-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider mb-4">
                    <Layers className="w-4 h-4 text-[#0f7a61]" />
                    <span>AT A GLANCE</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Category</span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900">{product.category}</span>
                    </div>

                    {product.subCategory && (
                      <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5">
                        <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Subcategory</span>
                        <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900">{product.subCategory}</span>
                      </div>
                    )}

                    <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Brand Name</span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900">{product.brand || 'Enterprise'}</span>
                    </div>

                    <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Stock Condition</span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900">{product.condition || 'Surplus / New'}</span>
                    </div>

                    <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Total Available Quantity</span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900">{product.quantity || product.estQty} Units</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200/80">
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-gray-200/90 shadow-xs">
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider mb-1">Authenticity</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Guaranteed authentic surplus sourced directly from authorized suppliers.</p>
                  </div>
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-gray-200/90 shadow-xs">
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider mb-1">Packaging</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Original manufacturer master cartons or standardized liquidation packaging.</p>
                  </div>
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-gray-200/90 shadow-xs">
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider mb-1">Inspection Status</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Grade A pre-screened condition ready for immediate freight dispatch.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TECHNICAL SPECIFICATIONS */}
            {activeTab === 'specs' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider mb-5">
                    <List className="w-4 h-4 text-[#0f7a61]" />
                    <span>TECHNICAL HARDWARE SPECIFICATIONS</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {/* Product Name */}
                    <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        PRODUCT NAME
                      </span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900 leading-snug">{product.title}</span>
                    </div>

                    {/* Brand Name */}
                    <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        BRAND NAME
                      </span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900">{product.brand || 'N/A'}</span>
                    </div>

                    {/* Model No / Part No */}
                    <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        MODEL NO. / PART NO.
                      </span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900 font-mono">{product.model || product.product_id || product.sku || 'N/A'}</span>
                    </div>

                    {/* Manufacturing Country */}
                    <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        MANUFACTURING COUNTRY
                      </span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900">{product.manufacturing_country || 'N/A'}</span>
                    </div>

                    {/* Manufacturing Year */}
                    <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        MANUFACTURING YEAR
                      </span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900">{product.manufacturing_year || 'N/A'}</span>
                    </div>

                    {/* Dimensions */}
                    <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        DIMENSIONS
                      </span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900">{product.dimensions || 'N/A'}</span>
                    </div>

                    {/* Expiry Date */}
                    <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        EXPIRY DATE
                      </span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900">{product.expiry_date || 'N/A'}</span>
                    </div>

                    {/* Stock Condition */}
                    <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        STOCK CONDITION
                      </span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900">{product.condition || 'Surplus / New'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SHIPPING, WARRANTY & DOCUMENTS */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider mb-5">
                    <Truck className="w-4 h-4 text-[#0f7a61]" />
                    <span>INVENTORY LOCATION, WARRANTY & CERTIFICATES</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
                    {/* Inventory Location */}
                    {Boolean(product.inventory_location || product.location) && (
                      <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                        <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                          INVENTORY LOCATION
                        </span>
                        <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>{product.inventory_location || product.location}</span>
                        </span>
                      </div>
                    )}

                    {/* Warranty */}
                    <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        WARRANTY
                      </span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900">{product.warranty || 'No'}</span>
                    </div>

                    {/* 3rd Party Certificate */}
                    <div className="bg-white border border-gray-200/90 shadow-xs rounded-2xl p-4 sm:p-5 flex flex-col justify-between items-start">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        3RD PARTY CERTIFICATE
                      </span>
                      <span className={`px-3 py-1 rounded-md text-xs font-black uppercase ${
                        product.third_party_certificate ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {product.third_party_certificate ? 'Yes' : 'No'}
                      </span>
                    </div>

                    {/* Warranty Document */}
                    <div className="bg-[#f4f7f9]/80 border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        WARRANTY DOCUMENT
                      </span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900">
                        {product.warranty_document ? (
                          <a href={product.warranty_document} target="_blank" rel="noopener noreferrer" className="text-[#0f7a61] underline hover:text-[#0c6651]">View Warranty Document</a>
                        ) : 'N/A'}
                      </span>
                    </div>

                    {/* Certificate / 3rd Party Documents */}
                    <div className="bg-[#f4f7f9]/80 border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col justify-between sm:col-span-2">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        THIRD PARTY CERTIFICATE & INSPECTION DOCUMENTS
                      </span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900">
                        {product.third_party_documents ? (
                          <a href={product.third_party_documents} target="_blank" rel="noopener noreferrer" className="text-[#0f7a61] underline hover:text-[#0c6651]">View Inspection & Certificate Docs</a>
                        ) : 'Available upon quote request'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f4f7f9]/80 border border-gray-100 rounded-2xl p-5 sm:p-6 space-y-3">
                  <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm md:text-base">Freight Dispatch & Payment Protection Policy</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    All orders placed through Surplus Market include verified freight routing and buyer protection.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm list-disc pl-5 text-gray-600">
                    <li><strong>Freight Dispatch:</strong> Orders dispatch within 48 to 72 hours following buyer inspection approval.</li>
                    <li><strong>Escrow Guarantee:</strong> Buyer funds are held safely in escrow until the freight bill of lading and manifest verification are completed.</li>
                    <li><strong>International Shipping:</strong> Export customs clearance documents and certificates of origin can be requested upon quote submission.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-4 sm:pt-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                  Similar Wholesale Deals
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  More surplus inventory in {product.category}
                </p>
              </div>
              <Link 
                href={`/browse?category=${encodeURIComponent(product.category)}`}
                className="text-xs sm:text-sm font-extrabold text-[#0f7a61] hover:text-[#0c6651] flex items-center gap-1"
              >
                <span>View All In Category</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  id={relProduct.id}
                  sku={relProduct.sku}
                  image={relProduct.image}
                  category={relProduct.category}
                  title={relProduct.title}
                  moq={relProduct.moq}
                  estQty={relProduct.quantity || relProduct.estQty}
                  price={relProduct.currentPrice || relProduct.price}
                  originalPrice={relProduct.originalPrice || relProduct.previousPrice}
                  offer={relProduct.offer}
                  currency={relProduct.currency}
                  isCertified={relProduct.isCertified}
                  isNew={relProduct.isNew}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
