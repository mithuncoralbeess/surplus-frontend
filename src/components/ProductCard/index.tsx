import React from 'react';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export interface ProductCardProps {
  image: string;
  category: string;
  title: string;
  moq: number;
  estQty: number;
  price: number;
  currency?: string;
  isCertified?: boolean;
  isNew?: boolean;
  isLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  category,
  title,
  moq,
  estQty,
  price,
  currency,
  isCertified = false,
  isNew = false,
  isLoading = false,
}) => {
  const { formatPrice } = useCurrency();
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
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
          
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

  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
      
      {/* Image Container */}
      <div className="relative aspect-[3/2] w-full bg-gray-50 overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Certified Badge */}
        {isCertified && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-100 flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-primary tracking-wide uppercase">SM Certified</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Category & New Badge */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-primary tracking-widest uppercase truncate pr-2">
            {category}
          </span>
          {isNew && (
            <span className="bg-primary-light text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
              New
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-3 line-clamp-2">
          {title}
        </h3>

        {/* Specs Grid */}
        <div className="mt-auto space-y-2 mb-4">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-gray-500">MOQ</span>
            <span className="font-bold text-gray-900">{moq.toLocaleString('en-US')}</span>
          </div>
          <div className="h-px w-full bg-gray-100"></div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-gray-500">Est. Qty</span>
            <span className="font-bold text-gray-900">{estQty.toLocaleString('en-US')}</span>
          </div>
          <div className="h-px w-full bg-gray-100"></div>
        </div>

        {/* Price Row */}
        <div className="mb-4">
          <div className="text-[22px] font-extrabold text-primary leading-none mb-1">
            {formatPrice(price, currency)}
          </div>
          <div className="text-[11px] text-gray-500">
            Per unit
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button className="btn btn-secondary !py-2 !px-0 !text-xs !w-full rounded-full">
            View Details
          </button>
          <button className="btn btn-primary !py-2 !px-0 !text-xs !w-full rounded-full flex items-center justify-center gap-1">
            <span>+</span> Add to RFQ
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
