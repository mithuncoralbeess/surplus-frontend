"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { triggerToast } from './NotificationContext';

export interface CartItem {
  id: string;
  productId?: string | number;
  type: 'product' | 'lot';
  title: string;
  category: string;
  quantity: number;
  unitPrice: number; // USD base price
  image: string;
  moq: number; // Minimum order quantity
  estQty?: number; // Total available quantity
  sku?: string;
  location?: string;
  targetPrice?: number;
  notes?: string;
}

export interface CartItemInput {
  id: string | number;
  productId?: string | number;
  type?: 'product' | 'lot';
  title: string;
  category?: string;
  quantity?: number;
  unitPrice: number;
  image?: string;
  moq?: number;
  estQty?: number;
  sku?: string;
  location?: string;
  targetPrice?: number;
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  totalUnits: number;
  totalPrice: number;
  isHydrated: boolean;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  addToCart: (item: CartItemInput, quantity?: number, openDrawer?: boolean) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  updateTargetPrice: (id: string | number, targetPrice?: number) => void;
  updateNotes: (id: string | number, notes: string) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  isInCart: (id: string | number) => boolean;
  getItemQuantity: (id: string | number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'surplus_market_cart_v1';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Load cart from localStorage on mount (client-only hydration safe)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.warn('[CartProvider] Failed to parse stored cart:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever items change after initial hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('[CartProvider] Failed to save cart to localStorage:', e);
    }
  }, [items, isHydrated]);

  // Sync across tabs via window storage event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        } catch (err) {
          // Ignore parse errors
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const openCartDrawer = useCallback(() => setIsCartDrawerOpen(true), []);
  const closeCartDrawer = useCallback(() => setIsCartDrawerOpen(false), []);
  const toggleCartDrawer = useCallback(() => setIsCartDrawerOpen(prev => !prev), []);

  const addToCart = useCallback((input: CartItemInput, customQuantity?: number, openDrawer: boolean = false) => {
    const itemId = String(input.id || input.productId || input.sku || input.title);
    const itemType = input.type || 'product';
    const rawMoq = Number(input.moq);
    const moq = itemType === 'product'
      ? Math.max(20, rawMoq > 0 ? rawMoq : 20)
      : (rawMoq > 0 ? rawMoq : 1);
    const estQty = input.estQty ? Number(input.estQty) : undefined;
    const initialQty = customQuantity !== undefined 
      ? customQuantity 
      : (input.quantity !== undefined && input.quantity > 0 ? input.quantity : moq);
    const clampedQty = Math.max(moq, initialQty);

    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === itemId);
      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const newQty = existing.quantity + (customQuantity !== undefined ? customQuantity : 1);
        const finalQty = estQty ? Math.min(newQty, estQty) : newQty;
        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          quantity: finalQty,
          notes: input.notes !== undefined ? input.notes : existing.notes,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: input.productId || input.id,
          type: input.type || 'product',
          title: input.title || 'Wholesale Surplus Item',
          category: input.category || 'Surplus Inventory',
          quantity: clampedQty,
          unitPrice: Number(input.unitPrice) || 0,
          image: input.image || FALLBACK_IMAGE,
          moq,
          estQty,
          sku: input.sku,
          location: input.location,
          targetPrice: input.targetPrice,
          notes: input.notes,
        };
        return [newItem, ...prev];
      }
    });

    try {
      triggerToast({
        title: 'Added to RFQ Basket',
        message: `${input.title} (${clampedQty} units) has been added to your enquiry list.`,
        type: 'success',
        link: '/cart',
        linkText: 'View Basket',
      });
    } catch (e) {
      // Toast notification is non-blocking
    }

    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  }, []);

  const updateQuantity = useCallback((id: string | number, quantity: number) => {
    const itemId = String(id);
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const defaultMin = item.type === 'product' ? 20 : 1;
        const minQty = item.moq > 0 ? Math.max(defaultMin, item.moq) : defaultMin;
        const targetQty = Math.max(minQty, quantity);
        const finalQty = item.estQty ? Math.min(targetQty, item.estQty) : targetQty;
        return { ...item, quantity: finalQty, moq: minQty };
      }
      return item;
    }));
  }, []);

  const updateTargetPrice = useCallback((id: string | number, targetPrice?: number) => {
    const itemId = String(id);
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, targetPrice };
      }
      return item;
    }));
  }, []);

  const updateNotes = useCallback((id: string | number, notes: string) => {
    const itemId = String(id);
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, notes };
      }
      return item;
    }));
  }, []);

  const removeFromCart = useCallback((id: string | number) => {
    const itemId = String(id);
    setItems(prev => {
      const itemToRemove = prev.find(item => item.id === itemId);
      if (itemToRemove) {
        setTimeout(() => {
          try {
            triggerToast({
              title: 'Item Removed',
              message: `${itemToRemove.title} was removed from your RFQ basket.`,
              type: 'info',
            });
          } catch (e) {}
        }, 0);
      }
      return prev.filter(item => item.id !== itemId);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      triggerToast({
        title: 'Basket Cleared',
        message: 'All items removed from your RFQ basket.',
        type: 'info',
      });
    } catch (e) {}
  }, []);

  const isInCart = useCallback((id: string | number) => {
    const itemId = String(id);
    return items.some(item => item.id === itemId || String(item.productId) === itemId);
  }, [items]);

  const getItemQuantity = useCallback((id: string | number) => {
    const itemId = String(id);
    const found = items.find(item => item.id === itemId || String(item.productId) === itemId);
    return found ? found.quantity : 0;
  }, [items]);

  const totalCount = items.length;
  const totalUnits = useMemo(() => items.reduce((sum, item) => sum + (item.quantity || 1), 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + (item.unitPrice * (item.quantity || 1)), 0), [items]);

  const contextValue = useMemo(() => ({
    items,
    totalCount,
    totalUnits,
    totalPrice,
    isHydrated,
    isCartDrawerOpen,
    openCartDrawer,
    closeCartDrawer,
    toggleCartDrawer,
    addToCart,
    updateQuantity,
    updateTargetPrice,
    updateNotes,
    removeFromCart,
    clearCart,
    isInCart,
    getItemQuantity,
  }), [
    items,
    totalCount,
    totalUnits,
    totalPrice,
    isHydrated,
    isCartDrawerOpen,
    openCartDrawer,
    closeCartDrawer,
    toggleCartDrawer,
    addToCart,
    updateQuantity,
    updateTargetPrice,
    updateNotes,
    removeFromCart,
    clearCart,
    isInCart,
    getItemQuantity,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
