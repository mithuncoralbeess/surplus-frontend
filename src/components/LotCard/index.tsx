"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Package, 
  MapPin, 
  Tag, 
  FileSpreadsheet, 
  TrendingUp, 
  Boxes, 
  Eye, 
  ArrowRight 
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
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
  originalPrice?: number;
  offer?: string;
  currency?: string;
  location?: string;
  category?: string;
  manifest_items?: any[];
  isLoading?: boolean;
  onViewManifest?: () => void;
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
  originalPrice,
  offer,
  currency,
  location = "Warehouse",
  category = "Surplus Lot",
  isLoading = false,
  onViewManifest,
}) => {
  const { formatPrice } = useCurrency();

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs animate-pulse h-full flex flex-col">
        <div className="aspect-[16/10] bg-slate-200 w-full" />
        <div className="p-5 sm:p-6 space-y-3 flex flex-col flex-1">
          <div className="flex justify-between">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-200 rounded w-1/4" />
          </div>
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="h-28 bg-slate-100 rounded-2xl" />
          <div className="mt-auto pt-3 flex justify-between items-center">
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="h-10 bg-slate-200 rounded-xl w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  const effectiveMsrp = msrp || originalPrice || 0;
  const effectivePrice = price || 0;
  const discountPercent = effectiveMsrp > effectivePrice && effectiveMsrp > 0
    ? Math.round(((effectiveMsrp - effectivePrice) / effectiveMsrp) * 100)
    : 0;

  const grossMarginPotential = Math.max(0, effectiveMsrp - effectivePrice);
  const unitCost = units > 0 ? (effectivePrice / units).toFixed(2) : "0.00";

  const conditionText = typeof condition === 'object' && condition !== null
    ? (condition as any).name || (condition as any).title || 'Surplus Inventory'
    : String(condition || 'Surplus Inventory');

  const locationText = typeof location === 'object' && location !== null
    ? (location as any).name || (location as any).country || 'Warehouse'
    : String(location || 'Warehouse');

  const categoryText = typeof category === 'object' && category !== null
    ? (category as any).name || (category as any).title || 'Surplus Lot'
    : String(category || 'Surplus Lot');

  const lotIdText = String(id || 'LOT');
  const lotLink = createLotUrl(title || lotIdText);

  const displayOffer = offer 
    ? (offer.endsWith('%') || offer.includes('OFF') ? offer : `${offer}% OFF`)
    : (discountPercent > 0 ? `-${discountPercent}% MSRP` : null);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Link href={lotLink} className="block w-full h-full relative cursor-pointer">
          <Image
            src={image || 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&w=800&q=80'}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          {/* Top-Left: Condition Pill */}
          <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-900 border border-white/60 shadow-xs pointer-events-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate max-w-[170px]">{conditionText}</span>
          </div>

          {/* Top-Right: Discount Pill */}
          {displayOffer && (
            <div className="inline-flex items-center gap-1 bg-rose-600 text-white px-2.5 py-1 rounded-full text-xs font-extrabold shadow-sm pointer-events-auto">
              <Tag className="w-3 h-3" />
              <span>{displayOffer}</span>
            </div>
          )}
        </div>

        {/* Bottom Image Overlay: Location & Manifest Button */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white z-10">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[140px] font-medium">{locationText}</span>
          </div>

          {onViewManifest ? (
            <button
              type="button"
              onClick={onViewManifest}
              className="flex items-center gap-1.5 bg-[#0a5c48] hover:bg-[#074737] text-white px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Manifest View</span>
            </button>
          ) : (
            <Link
              href={lotLink}
              className="flex items-center gap-1.5 bg-[#0a5c48] hover:bg-[#074737] text-white px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Manifest View</span>
            </Link>
          )}
        </div>
      </div>

      {/* Lot Content Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Category & ID Row */}
        <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase mb-2.5">
          <span className="bg-emerald-50 text-[#0a5c48] px-2.5 py-0.5 rounded-md border border-emerald-200/60 font-extrabold">
            {categoryText}
          </span>
          <span className="text-slate-400 font-mono font-semibold text-xs">
            ID: {lotIdText}
          </span>
        </div>

        {/* Title */}
        <Link href={lotLink}>
          <h3 className="text-base sm:text-[17px] font-bold text-slate-900 leading-snug mb-4 line-clamp-2 group-hover:text-[#0a5c48] transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>

        {/* Liquidation Specs Breakdown */}
        <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 mb-5 space-y-2 mt-auto">
          {/* Volume & Units */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              Volume & Units
            </span>
            <span suppressHydrationWarning className="font-extrabold text-slate-900">
              {units.toLocaleString()} Units • {pallets} {pallets === 1 ? 'Pallet' : 'Pallets'}
            </span>
          </div>

          {/* Average Unit Cost */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
              <Boxes className="w-3.5 h-3.5 text-slate-400" />
              Average Unit Cost
            </span>
            <span suppressHydrationWarning className="font-bold text-slate-800 font-mono">
              ${unitCost} / unit
            </span>
          </div>

          <div className="h-px bg-slate-200/80 my-1" />

          {/* Retail Value (MSRP) */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Retail Value (MSRP)</span>
            <span suppressHydrationWarning className="font-semibold text-slate-500 line-through">
              {formatPrice(effectiveMsrp, currency)}
            </span>
          </div>

          {/* Estimated Resale Profit */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Estimated Resale Profit
            </span>
            <span suppressHydrationWarning className="font-extrabold text-emerald-700">
              +{formatPrice(grossMarginPotential, currency)}
            </span>
          </div>
        </div>

        {/* Price and CTA Row */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between gap-3">
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Wholesale Lot Price
            </div>
            <div suppressHydrationWarning className="text-2xl sm:text-[26px] font-black text-[#0a5c48] tracking-tight leading-none mt-0.5">
              {formatPrice(effectivePrice, currency)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onViewManifest && (
              <button
                type="button"
                onClick={onViewManifest}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                title="Preview Manifest Breakdown"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}

            <Link
              href={lotLink}
              className="bg-[#0a5c48] hover:bg-[#074737] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              <span>Buy Lot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LotCard;
