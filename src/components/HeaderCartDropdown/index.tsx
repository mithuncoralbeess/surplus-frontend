"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, X, Trash2, ArrowRight, Package } from 'lucide-react';
import Image from 'next/image';
import { useCurrency } from '../../context/CurrencyContext';

interface CartItem {
  id: string;
  title: string;
  category: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

const INITIAL_ITEMS: CartItem[] = [
  {
    id: '1',
    title: 'Milwaukee M18 Fuel Cordless Tool Lot',
    category: 'Power Tools',
    quantity: 15,
    unitPrice: 185,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    title: 'Samsung 55" 4K Smart TV Wholesale Lot',
    category: 'Consumer Electronics',
    quantity: 10,
    unitPrice: 320,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&auto=format&fit=crop&q=80',
  },
];

const HeaderCartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const { formatPrice } = useCurrency();
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

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalPriceInUsd = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Shopping Bag Button with Badge */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-600 hover:text-gray-900 transition-colors p-1 focus:outline-none"
        title="View RFQ Basket"
      >
        <ShoppingBag className="w-[18px] h-[18px]" />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#0f7a61] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
            {cartItems.length}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          data-lenis-prevent
          className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.14)] border border-gray-100 z-50 overflow-hidden"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-[#0f7a61]" />
              <h3 className="font-semibold text-gray-900 text-[15px]">RFQ Basket</h3>
              <span className="bg-[#e6f7ef] text-[#0f7a61] text-xs font-bold px-2 py-0.5 rounded-full">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          {cartItems.length > 0 ? (
            <>
              <div 
                data-lenis-prevent 
                className="max-h-72 overflow-y-auto divide-y divide-gray-100"
                onWheel={(e) => e.stopPropagation()}
              >
                {cartItems.map((item) => {
                  const itemTotalInUsd = item.unitPrice * item.quantity;
                  return (
                    <div key={item.id} className="p-4 flex items-center gap-3 hover:bg-gray-50/50 transition-colors group">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0">
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
                            {formatPrice(itemTotalInUsd)}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 p-1 transition-colors"
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
                  <span className="text-gray-500 font-medium">Est. Total Value:</span>
                  <span className="font-extrabold text-gray-900 text-base">
                    {formatPrice(totalPriceInUsd)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    href="/browse"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-secondary !py-2.5 !text-xs text-center rounded-full"
                  >
                    View Deals
                  </Link>
                  <Link 
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-primary !py-2.5 !text-xs text-center rounded-full flex items-center justify-center gap-1"
                  >
                    <span>Submit RFQ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Your RFQ basket is empty</p>
              <p className="text-xs text-gray-500 mb-4">Explore surplus inventory and add deals to your request list.</p>
              <Link 
                href="/browse"
                onClick={() => setIsOpen(false)}
                className="btn btn-primary !py-2 !px-4 !text-xs rounded-full inline-flex items-center gap-1"
              >
                Browse Inventory
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderCartDropdown;
