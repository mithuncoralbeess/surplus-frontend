"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, X, Trash2, ArrowRight, Package } from 'lucide-react';
import Image from 'next/image';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

const HeaderCartDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeFromCart, totalPrice, totalCount, openCartDrawer } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Shopping Bag Button with Badge */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-600 hover:text-gray-900 transition-colors p-1.5 focus:outline-none cursor-pointer flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full hover:bg-gray-100"
        title={t('cartDropdown.rfqBasket', 'View RFQ Basket')}
        aria-label={`RFQ Basket with ${totalCount} items`}
      >
        <ShoppingBag className="w-[18px] h-[18px] lg:w-5 lg:h-5" />
        {totalCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-[#0f7a61] text-white text-[9px] lg:text-[10px] font-bold min-w-[15px] lg:min-w-[17px] h-[15px] lg:h-[17px] px-0.5 rounded-full flex items-center justify-center animate-pulse shadow-xs">
            {totalCount > 99 ? '99+' : totalCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          data-lenis-prevent
          className="absolute top-full right-0 rtl:right-auto rtl:left-0 mt-3 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.14)] border border-gray-100 z-50 overflow-hidden"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Package className="w-4 h-4 text-[#0f7a61]" />
              <h3 className="font-semibold text-gray-900 text-[15px]">{t('cartDropdown.rfqBasket', 'RFQ Basket')}</h3>
              <span className="bg-[#e6f7ef] text-[#0f7a61] text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? t('cartDropdown.item', 'item') : t('cartDropdown.items', 'items')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  openCartDrawer();
                }}
                className="text-[11px] text-[#0f7a61] hover:underline font-semibold px-2 py-0.5 cursor-pointer"
              >
                Expand Drawer
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Close cart dropdown"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          {items.length > 0 ? (
            <>
              <div 
                data-lenis-prevent 
                className="max-h-72 overflow-y-auto divide-y divide-gray-100"
                onWheel={(e) => e.stopPropagation()}
              >
                {items.map((item) => {
                  const itemTotal = item.unitPrice * item.quantity;
                  return (
                    <div key={item.id} className="p-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors group">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-semibold text-gray-900 truncate mb-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 font-medium">Qty: {item.quantity} units</span>
                          <span className="font-bold text-[#0f7a61]">
                            {formatPrice(itemTotal)}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 p-1.5 transition-colors cursor-pointer rounded"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer Summary & Actions */}
              <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3 text-sm">
                  <span className="text-gray-500 font-medium">{t('cartDropdown.subtotal', 'Estimated Subtotal')}:</span>
                  <span className="font-extrabold text-gray-900 text-base">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-secondary !py-2.5 !text-xs text-center rounded-full"
                  >
                    {t('cartDropdown.viewBasket', 'View Basket')}
                  </Link>
                  <Link 
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-primary !py-2.5 !text-xs text-center rounded-full flex items-center justify-center gap-1"
                  >
                    <span>{t('cartDropdown.proceedRFQ', 'Proceed to RFQ')}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{t('cartDropdown.emptyTitle', 'Your RFQ basket is empty')}</p>
              <p className="text-xs text-gray-500 mb-4">{t('cartDropdown.emptySubtitle', 'Explore surplus inventory and add deals to your request list.')}</p>
              <Link 
                href="/browse"
                onClick={() => setIsOpen(false)}
                className="btn btn-primary !py-2 !px-4 !text-xs rounded-full inline-flex items-center gap-1"
              >
                {t('cartDropdown.browseLots', 'Browse Lots')}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderCartDropdown;
