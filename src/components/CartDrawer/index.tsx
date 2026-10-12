"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, X, Trash2, ArrowRight, Plus, Minus, Package, ShieldCheck, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';

const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    totalUnits,
  } = useCart();
  const { formatPrice } = useCurrency();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartDrawerOpen) {
        closeCartDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartDrawerOpen, closeCartDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartDrawerOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-[999] transition-opacity duration-300 ${
          isCartDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCartDrawer}
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <div
        ref={drawerRef}
        data-lenis-prevent
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[1000] flex flex-col transform transition-transform duration-300 ease-in-out ${
          isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="RFQ Enquiry Basket"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0f7a61]/10 text-[#0f7a61] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-base">RFQ Basket</h3>
                <span className="bg-[#e6f7ef] text-[#0f7a61] text-xs font-bold px-2 py-0.5 rounded-full">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">{totalUnits} total units selected</p>
            </div>
          </div>
          <button
            onClick={closeCartDrawer}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close RFQ basket"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1">Your RFQ basket is empty</h4>
            <p className="text-xs text-gray-500 max-w-xs mb-6">
              Explore wholesale lots and surplus liquidation products to add them to your quotation request.
            </p>
            <Link
              href="/browse"
              onClick={closeCartDrawer}
              className="px-6 py-2.5 bg-[#0f7a61] hover:bg-[#0c6651] text-white text-xs font-bold rounded-full transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <span>Browse Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto divide-y divide-gray-100 p-4 space-y-3"
            >
              {items.map((item) => {
                const itemTotal = item.unitPrice * item.quantity;
                const isAtMoq = item.quantity <= (item.moq || 1);
                const isAtMax = item.estQty ? item.quantity >= item.estQty : false;

                return (
                  <div
                    key={item.id}
                    className="pt-3 pb-2 flex gap-3 group transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div>
                          <span className="text-[10px] font-bold text-[#0f7a61] uppercase tracking-wider block">
                            {item.category}
                          </span>
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-[#0f7a61] transition-colors">
                            {item.title}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-300 hover:text-rose-500 p-1 transition-colors rounded cursor-pointer shrink-0"
                          title="Remove from basket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Pricing Info */}
                      <div className="flex items-baseline justify-between text-xs mb-2">
                        <span className="text-gray-500 text-[11px]">
                          Unit: <strong className="text-gray-700">{formatPrice(item.unitPrice)}</strong>
                        </span>
                        <span className="font-extrabold text-[#0f7a61] text-xs">
                          Subtotal: {formatPrice(itemTotal)}
                        </span>
                      </div>

                      {/* Stepper & MOQ Indicator */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isAtMoq}
                            className={`p-1.5 transition-colors ${
                              isAtMoq
                                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer'
                            }`}
                            title={isAtMoq ? `Minimum order is ${item.moq || 1}` : 'Decrease quantity'}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-bold text-gray-900 min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isAtMax}
                            className={`p-1.5 transition-colors ${
                              isAtMax
                                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer'
                            }`}
                            title={isAtMax ? `Max available is ${item.estQty}` : 'Increase quantity'}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {item.moq > 1 && (
                          <span className="text-[10px] text-gray-400 font-medium">
                            MOQ: {item.moq}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary & Checkout */}
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/70 space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Selected Products</span>
                  <span className="font-semibold text-gray-900">{items.length} lots/products</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Total Quantity</span>
                  <span className="font-semibold text-gray-900">{totalUnits} units</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-900 text-sm">Estimated Total Value:</span>
                  <span className="font-black text-[#0f7a61] text-lg">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0f7a61] shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-800 leading-tight">
                  Formal freight rates, volume discounts, and payment terms will be included in your official quotation.
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/cart"
                  onClick={closeCartDrawer}
                  className="w-full py-3 bg-[#0f7a61] hover:bg-[#0c6651] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <span>Review &amp; Submit Full RFQ</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] text-gray-400 hover:text-rose-500 font-semibold transition-colors cursor-pointer"
                  >
                    Clear RFQ basket
                  </button>
                  <button
                    type="button"
                    onClick={closeCartDrawer}
                    className="text-[11px] text-gray-500 hover:text-gray-900 font-semibold transition-colors cursor-pointer"
                  >
                    Continue browsing
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
