import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Tag, CheckCircle2, Package, MapPin } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { createProductUrl } from '../../lib/slugs';

export interface ProductCardProps {
  id?: string | number;
  sku?: string;
  image: string;
  category: string;
  title: string;
  moq: number;
  estQty: number;
  price: number;
  originalPrice?: number;
  offer?: string;
  currency?: string;
  isCertified?: boolean;
  isNew?: boolean;
  isLoading?: boolean;
  onAddRfq?: () => void;
  location?: string;
  inventory_location?: string;
  inventoryLocation?: string;
  inventory_city?: string;
  inventory_country?: string;
  city?: string;
  country?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  sku,
  image,
  category,
  title,
  moq,
  estQty,
  price,
  originalPrice,
  offer,
  currency,
  isCertified = false,
  isNew = false,
  isLoading = false,
  onAddRfq,
  location,
  inventory_location,
  inventoryLocation,
  inventory_city,
  inventory_country,
  city,
  country,
}) => {
  const { formatPrice, convertToUsd } = useCurrency();
  const { addToCart, isInCart } = useCart();
  const [isRfqAdded, setIsRfqAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const inCart = id ? isInCart(id) : false;
  const effectiveMoq = Math.max(20, Number(moq || 20));

  const formatOfferString = (raw?: string) => {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (trimmed.endsWith('%') || trimmed.toLowerCase().includes('off') || trimmed.toLowerCase().includes('msrp')) {
      return trimmed;
    }
    const num = parseFloat(trimmed);
    if (!isNaN(num)) {
      return num > 0 ? `${Math.round(num)}% OFF` : null;
    }
    return trimmed;
  };

  const calculatedOffer = originalPrice && originalPrice > price
    ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`
    : null;
  const displayOffer = formatOfferString(offer) || calculatedOffer;

  const handleAddRfq = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onAddRfq) {
      onAddRfq();
    } else {
      const resolvedCategory = typeof category === 'object' && category !== null
        ? (category as any).name || (category as any).title || (category as any).slug || 'General'
        : String(category || 'General');

      addToCart({
        id: String(id || sku || title),
        productId: id,
        type: 'product',
        title: title || 'Wholesale Surplus Lot',
        category: resolvedCategory,
        quantity: effectiveMoq,
        unitPrice: convertToUsd(price, currency),
        image: image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80',
        moq: effectiveMoq,
        estQty: estQty,
        sku: sku,
      });

      setIsRfqAdded(true);
      setTimeout(() => setIsRfqAdded(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm h-full">
        <div className="relative aspect-[3/2] w-full bg-gray-200 animate-pulse" />
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-full w-10 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-28 mb-4 animate-pulse"></div>

          <div className="mt-auto space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-10 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
            </div>
            <div className="h-px w-full bg-gray-100"></div>
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-10 animate-pulse"></div>
            </div>
            <div className="h-px w-full bg-gray-100"></div>
          </div>

          <div className="mb-4">
            <div className="h-6 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-auto">
            <div className="h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const rawLocation = (
    location ||
    inventory_location ||
    inventoryLocation ||
    ''
  ).trim();

  const cityStr = (inventory_city || city || '').trim();
  const countryStr = (inventory_country || country || '').trim();

  let resolvedLocation = rawLocation;
  if (!resolvedLocation) {
    if (cityStr && countryStr) {
      if (cityStr.toLowerCase() === countryStr.toLowerCase()) {
        resolvedLocation = countryStr;
      } else if (cityStr.toLowerCase().includes(countryStr.toLowerCase())) {
        resolvedLocation = cityStr;
      } else {
        resolvedLocation = `${cityStr}, ${countryStr}`;
      }
    } else if (cityStr || countryStr) {
      resolvedLocation = cityStr || countryStr;
    }
  }

  const displayLocation = resolvedLocation || 'Dubai, UAE';

  const categoryText = typeof category === 'object' && category !== null
    ? (category as any).name || (category as any).title || (category as any).slug || 'General'
    : String(category || 'General');

  const productLink = createProductUrl(categoryText, title || sku || id, sku || id);

  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">

      {/* Image Container */}
      <Link
        href={productLink}
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
              <Package className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-gray-600 line-clamp-1 max-w-[85%] uppercase tracking-wider">
              {categoryText}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">Surplus Certified</span>
          </div>
        )}

        {/* Certified Badge */}
        {isCertified && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-100 flex items-center gap-1 shadow-sm z-10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0f7a61]" />
            <span className="text-[10px] font-bold text-[#0f7a61] tracking-wide uppercase">SM Certified</span>
          </div>
        )}

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

        {/* Category & New Badge */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] xl:text-[12px] font-semibold text-[#0f7a61] tracking-widest uppercase truncate pr-2">
            {categoryText}
          </span>
          {isNew && (
            <span className="bg-[#e7f5f1] text-[#0f7a61] px-2 py-0.5 rounded-full text-[10px] font-bold">
              New
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={productLink}>
          <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-2 line-clamp-2 cursor-pointer hover:text-[#0f7a61] transition-colors">
            {title}
          </h3>
        </Link>

        {/* Inventory Location - Available in (Below Title) */}
        {displayLocation && (
          <div className="flex items-center gap-1.5 text-[11px] xl:text-[12px] text-gray-500 mb-3 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#0f7a61] shrink-0" />
            <span className="text-gray-500">Available in</span>
            <span className="font-bold text-gray-800 truncate" title={displayLocation}>
              {displayLocation}
            </span>
          </div>
        )}

        {/* Specs Grid */}
        <div className="mt-auto space-y-2 mb-4">
          <div className="flex items-center justify-between text-[11px] xl:text-[13px]">
            <span className="text-gray-900">MOQ</span>
            <span suppressHydrationWarning className="font-bold text-black">{effectiveMoq.toLocaleString('en-US')}</span>
          </div>
          <div className="h-px w-full bg-gray-100"></div>
          <div className="flex items-center justify-between text-[11px] xl:text-[13px]">
            <span className="text-gray-900">Est. Qty</span>
            <span suppressHydrationWarning className="font-bold text-black">{estQty.toLocaleString('en-US')}</span>
          </div>
          <div className="h-px w-full bg-gray-100"></div>
        </div>

        {/* Price Row */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 flex-wrap mb-1">
            <span suppressHydrationWarning className="text-[18px] xl:text-[22px] font-extrabold text-[#0f7a61] leading-none">
              {formatPrice(price, currency)}
            </span>
            {originalPrice && originalPrice > price && (
              <span suppressHydrationWarning className="text-md text-gray-700 line-through font-medium">
                {formatPrice(originalPrice, currency)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-500">Per unit</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Link
            href={productLink}
            className="border border-gray-200 text-gray-700 font-bold py-2.5 px-0 text-xs w-full rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={handleAddRfq}
            className={`font-bold py-2.5 px-0 text-xs w-full rounded-full flex items-center justify-center gap-1 cursor-pointer transition-all ${
              isRfqAdded
                ? '!bg-emerald-700 text-white'
                : inCart
                ? 'bg-[#0f7a61]/90 hover:bg-[#0c6651] text-white'
                : 'bg-[#0f7a61] hover:bg-[#0c6651] text-white'
            }`}
            title={inCart ? `In Basket (click to add ${effectiveMoq} more)` : 'Add to RFQ Basket'}
          >
            {isRfqAdded ? (
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

export default ProductCard;

