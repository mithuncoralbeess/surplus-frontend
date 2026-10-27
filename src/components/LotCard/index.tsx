"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Tag,
  Boxes,
  CheckCircle2,
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { createLotUrl } from '../../lib/slugs';

export interface LotCardProps {
  id?: string | number;
  image: string;
  title: string;
  condition?: string;
  units?: number;
  pallets?: number;
  msrp?: number;
  price?: number;
  liquidation_price?: number;
  liquidationPrice?: number;
  liquidating_price?: number;
  originalPrice?: number;
  offer?: string;
  currency?: string;
  location?: string;
  category?: string;
  manifest_items?: any[];
  isLoading?: boolean;
  onViewManifest?: () => void;
  open_for_offers?: boolean | string;
  openForOffers?: boolean | string;
  is_open_for_offers?: boolean | string;
  sale_method?: string;
  saleMethod?: string;
  sales_method?: string;
  salesMethod?: string;
  [key: string]: any;
}

const LotCard: React.FC<LotCardProps> = ({
  id,
  image,
  title,
  condition = "Surplus Inventory (Unexpired)",
  units = 0,
  pallets = 1,
  msrp = 0,
  price = 0,
  liquidation_price,
  liquidationPrice,
  liquidating_price,
  originalPrice,
  offer,
  currency,
  location = "Warehouse",
  category = "Surplus Lot",
  isLoading = false,
  onViewManifest,
  open_for_offers,
  openForOffers,
  is_open_for_offers,
  sale_method,
  saleMethod,
  sales_method,
  salesMethod,
  ...rest
}) => {
  const { formatPrice, convertToUsd } = useCurrency();
  const { addToCart, isInCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const inCart = id ? isInCart(id) : false;

  const isOpenForOffers = Boolean(
    open_for_offers === true ||
    open_for_offers === 'true' ||
    openForOffers === true ||
    openForOffers === 'true' ||
    is_open_for_offers === true ||
    is_open_for_offers === 'true' ||
    (typeof offer === 'string' && /open\s*for\s*offer/i.test(offer)) ||
    (typeof rest?.raw_data === 'object' && (rest?.raw_data?.open_for_offers === true || rest?.raw_data?.open_for_offers === 'true'))
  );

  const rawSaleMethod = String(
    sale_method ||
    saleMethod ||
    sales_method ||
    salesMethod ||
    rest?.raw_data?.sale_method ||
    rest?.raw_data?.sales_method ||
    ''
  ).trim().toLowerCase();

  const isNegotiable =
    rawSaleMethod === 'negotiable' ||
    rawSaleMethod === 'offer' ||
    rawSaleMethod.includes('negotiat') ||
    rawSaleMethod.includes('offer');

  const effectiveMsrp = Number(msrp || originalPrice || 0);
  const effectivePrice = Number(price || liquidation_price || liquidationPrice || liquidating_price || 0);
  const displayOnlyPrice = effectiveMsrp > 0 ? effectiveMsrp : effectivePrice;

  const handleAddLot = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const cartPrice = isOpenForOffers ? displayOnlyPrice : effectivePrice;
    addToCart({
      id: String(id || title),
      productId: id,
      type: 'lot',
      title,
      category: category || 'Surplus Lot',
      quantity: 1,
      unitPrice: convertToUsd(cartPrice, currency),
      image,
      moq: 1,
      estQty: units || 1,
      location,
    }, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm h-full">
        <div className="relative aspect-[3/2] w-full bg-gray-200 animate-pulse" />
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-full w-10 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-28 mb-4 animate-pulse"></div>

          <div className="mt-auto space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-10 animate-pulse"></div>
            </div>
            <div className="h-px w-full bg-gray-100"></div>
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-10 animate-pulse"></div>
            </div>
            <div className="h-px w-full bg-gray-100"></div>
          </div>

          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <div className="h-9 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-9 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const conditionText = typeof condition === 'object' && condition !== null
    ? (condition as any).name || (condition as any).title || ''
    : String(condition || '');

  const isDefaultCondition = !conditionText || conditionText === 'Surplus Inventory (Unexpired)' || conditionText === 'Surplus Inventory';

  const locationText = typeof location === 'object' && location !== null
    ? (location as any).name || (location as any).country || 'Warehouse'
    : String(location || 'Warehouse');

  const categoryText = typeof category === 'object' && category !== null
    ? (category as any).name || (category as any).title || 'Surplus Lot'
    : String(category || 'Surplus Lot');

  const lotIdText = String(id || 'LOT');
  const lotLink = createLotUrl(title || lotIdText, lotIdText);

  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
      {/* Top Image Container */}
      <Link
        href={lotLink}
        className="relative aspect-[3/2] w-full bg-gray-50 overflow-hidden cursor-pointer block"
      >
        {image && !imageError ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50/60 to-gray-100/80 p-4 text-center select-none group-hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-white/90 border border-emerald-100 flex items-center justify-center shadow-xs mb-2 text-[#0f7a61]">
              <Boxes className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-gray-600 line-clamp-1 max-w-[85%] uppercase tracking-wider">
              {categoryText}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">Wholesale Lot</span>
          </div>
        )}

        {/* Wholesale Lot Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-100 flex items-center gap-1 shadow-sm z-10">
          <Boxes className="w-3.5 h-3.5 text-[#0f7a61]" />
          <span className="text-[10px] font-bold text-[#0f7a61] tracking-wide uppercase">Wholesale Lot</span>
        </div>

        {/* Status Badge: Open for Offers / Open for Negotiation / Fixed Price */}
        {isOpenForOffers ? (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 z-10">
            <Tag className="w-3 h-3" />
            <span>Open for Offers</span>
          </div>
        ) : isNegotiable ? (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 z-10">
            <Tag className="w-3 h-3" />
            <span>Open for Negotiation</span>
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-slate-700 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 z-10">
            <Tag className="w-3 h-3" />
            <span>Fixed Price</span>
          </div>
        )}
      </Link>

      {/* Lot Content Body */}
      <div className="py-3 px-4 flex flex-col flex-1">
        {/* Category & Condition Row */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] xl:text-[12px] font-semibold text-[#0f7a61] tracking-widest uppercase truncate pr-2">
            {categoryText}
          </span>
          {!isDefaultCondition && (
            <span className="bg-[#e7f5f1] text-[#0f7a61] px-2 py-0.5 rounded-full text-[10px] font-bold truncate max-w-[120px]">
              {conditionText}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={lotLink}>
          <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-2 line-clamp-2 cursor-pointer hover:text-[#0f7a61] transition-colors">
            {title}
          </h3>
        </Link>

        {/* Inventory Location - Available in (Below Title) */}
        {locationText && (
          <div className="flex items-center gap-1.5 text-[11px] xl:text-[12px] text-gray-500 mb-3 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#0f7a61] shrink-0" />
            <span className="text-gray-500">Available in</span>
            <span className="font-bold text-gray-800 truncate" title={locationText}>
              {locationText}
            </span>
          </div>
        )}

        {/* Specs Grid */}
        <div className="mt-auto space-y-2 mb-4">
          <div className="flex items-center justify-between text-[11px] xl:text-[13px]">
            <span className="text-gray-900">Total Units</span>
            <span suppressHydrationWarning className="font-bold text-black">
              {units > 0 ? units.toLocaleString('en-US') : 'Bulk Batch'}
            </span>
          </div>
          <div className="h-px w-full bg-gray-100"></div>
          <div className="flex items-center justify-between text-[11px] xl:text-[13px]">
            <span className="text-gray-900">Pallets</span>
            <span suppressHydrationWarning className="font-bold text-black">
              {pallets || 1} {pallets === 1 ? 'Pallet' : 'Pallets'}
            </span>
          </div>
          <div className="h-px w-full bg-gray-100"></div>
        </div>

        {/* Price Row */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 flex-wrap">
            {isOpenForOffers ? (
              <span suppressHydrationWarning className="text-[18px] xl:text-[22px] font-extrabold text-[#0f7a61] leading-none">
                {formatPrice(displayOnlyPrice, currency)}
              </span>
            ) : (
              <>
                <span suppressHydrationWarning className="text-[18px] xl:text-[22px] font-extrabold text-[#0f7a61] leading-none">
                  {formatPrice(effectivePrice, currency)}
                </span>
                {effectiveMsrp > effectivePrice && (
                  <span suppressHydrationWarning className="text-md text-gray-700 line-through font-medium">
                    {formatPrice(effectiveMsrp, currency)}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Actions Row */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Link
            href={lotLink}
            className="border border-gray-200 text-gray-700 font-bold py-2.5 px-0 text-xs w-full rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
          >
            View Lot
          </Link>

          <button
            type="button"
            onClick={handleAddLot}
            className={`font-bold py-2.5 px-0 text-xs w-full rounded-full flex items-center justify-center gap-1 cursor-pointer transition-all ${
              isAdded
                ? '!bg-emerald-700 text-white'
                : inCart
                ? 'bg-[#0f7a61]/90 hover:bg-[#0c6651] text-white'
                : 'bg-[#0f7a61] hover:bg-[#0c6651] text-white'
            }`}
            title={inCart ? 'In Basket (click to add again)' : 'Add Lot to RFQ Basket'}
          >
            {isAdded ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : inCart ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>In Basket</span>
              </>
            ) : (
              <>
                <span>+</span> Add to RFQ
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LotCard;
