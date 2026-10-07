import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, MapPin, Tag } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export interface LotCardProps {
  id?: string | number;
  image: string;
  title: string;
  condition: string;
  units: number;
  pallets: number;
  msrp: number;
  price: number;
  originalPrice?: number;
  offer?: string;
  currency?: string;
  location: string;
  isLoading?: boolean;
}

const LotCard: React.FC<LotCardProps> = ({
  id,
  image,
  title,
  condition,
  units,
  pallets,
  msrp,
  price,
  originalPrice,
  offer,
  currency,
  location,
  isLoading = false,
}) => {
  const { formatPrice } = useCurrency();

  const formatOfferString = (raw?: string) => {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (trimmed.endsWith('%') || trimmed.toLowerCase().includes('off')) {
      return trimmed;
    }
    const num = parseFloat(trimmed);
    if (!isNaN(num) && num > 0) {
      return `${num}% OFF`;
    }
    return trimmed;
  };

  const calculatedOffer = originalPrice && originalPrice > price
    ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`
    : msrp && msrp > price
      ? `${Math.round(((msrp - price) / msrp) * 100)}% OFF`
      : null;
  const displayOffer = formatOfferString(offer) || calculatedOffer;

  const lotLink = title ? `/browse?q=${encodeURIComponent(title)}` : '/browse';

  if (isLoading) {
    return (
      <div className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm h-full">
        {/* Image Skeleton */}
        <div className="relative aspect-[3/2] w-full bg-gray-200 animate-pulse" />

        {/* Content Skeleton */}
        <div className="p-5 flex flex-col flex-1">
          {/* Location */}
          <div className="flex items-center gap-1 mb-2">
            <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Title */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />

          {/* Specs Grid */}
          <div className="mt-auto space-y-3 mb-5 py-3 rounded-xl border border-gray-100/50">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
            <div className="h-px w-full bg-gray-200" />
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
          </div>

          {/* Price Row */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="h-2 bg-gray-200 rounded w-16 mb-2 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
          </div>

          {/* Action */}
          <div className="h-10 bg-gray-200 rounded-full w-full animate-pulse mt-auto" />
        </div>
      </div>
    );
  }

  const conditionText = typeof condition === 'object' && condition !== null
    ? (condition as any).name || (condition as any).title || 'Customer Returns'
    : String(condition || 'Customer Returns');

  const locationText = typeof location === 'object' && location !== null
    ? (location as any).name || (location as any).country || 'Warehouse'
    : String(location || 'Warehouse');

  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">

      {/* Image Container */}
      <Link href={lotLink} className="relative aspect-[3/2] w-full bg-gray-50 cursor-pointer block">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />

        {/* Condition Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100 flex items-center shadow-sm z-10">
          <span className="text-[11px] font-bold text-gray-800 tracking-wide uppercase">{conditionText}</span>
        </div>

        {/* Offer Badge */}
        {displayOffer && (
          <div className="absolute top-3 right-3 bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 z-10">
            <Tag className="w-3 h-3" />
            <span>{displayOffer}</span>
          </div>
        )}
      </Link>

      {/* Content Container */}
      <div className="py-3 px-4 flex flex-col flex-1">

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-[10px] font-medium uppercase tracking-wider">{locationText}</span>
        </div>

        {/* Title */}
        <Link href={lotLink}>
          <h3 className="font-bold text-gray-900 text-[15px] xxl:text-[16px] leading-tight mb-4 line-clamp-2 cursor-pointer hover:text-[#0f7a61] transition-colors">
            {title}
          </h3>
        </Link>

        {/* Specs Grid */}
        <div className="mt-auto space-y-3 mb-3 py-3 rounded-xl border border-gray-100/50">
          <div className="flex items-center justify-between text-[11px] xxl:text-[13px]">
            <span className="text-gray-500 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-gray-400" />
              Lot Size
            </span>
            <span className="font-bold text-gray-900">
              {units.toLocaleString()} Units <span className="text-gray-400 font-normal mx-1">•</span> {pallets} {pallets === 1 ? 'Pallet' : 'Pallets'}
            </span>
          </div>
          <div className="h-px w-full bg-gray-200"></div>
          <div className="flex items-center justify-between text-[11px] xxl:text-[13px]">
            <span className="text-gray-500">Est. MSRP</span>
            <span className="font-semibold text-gray-600 line-through">
              {formatPrice(msrp, currency)}
            </span>
          </div>
        </div>

        {/* Price Row */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-[11px] text-gray-500 font-medium mb-1 uppercase tracking-wider">Lot Price</div>
            <div className="text-[18px] xxl:text-[22px] font-extrabold text-[#0f7a61] leading-none">
              {formatPrice(price, currency)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <Link 
          href={lotLink}
          className="bg-[#0f7a61] text-white py-2.5 px-0 text-[13px] w-full rounded-full flex items-center justify-center gap-1 mt-auto cursor-pointer hover:bg-[#0c6651] transition-colors font-bold"
        >
          View Lot Manifest
        </Link>

      </div>
    </div>
  );
};

export default LotCard;

