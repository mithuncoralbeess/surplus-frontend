"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  X,
  ChevronDown,
  User,
  LogOut,
  ShoppingBag,
  Bell,
  ArrowRight,
  Leaf,
  Handshake,
  Tag,
  Boxes,
  HelpCircle,
  Mail,
  FileQuestion,
  Hammer,
  Zap,
  Wrench,
  HardHat,
  Drill,
  Lamp,
  Disc,
  PenTool,
  Box,
  Sparkles,
  type LucideIcon
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';
import { useAppSelector } from '../../store';
import { performLogout } from '../../lib/authCleanup';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  openAuth: (mode: 'login' | 'register') => void;
}

const DEFAULT_CATEGORIES = [
  { name: 'Building Materials', count: 227, icon: Hammer, slug: 'building-materials' },
  { name: 'Electricals', count: 331, icon: Zap, slug: 'electricals' },
  { name: 'Hand tools', count: 132, icon: Wrench, slug: 'hand-tools' },
  { name: 'Chisels And Punches', count: 108, icon: PenTool, slug: 'chisels-and-punches' },
  { name: 'PPE', count: 81, icon: HardHat, slug: 'ppe' },
  { name: 'Power tools', count: 76, icon: Drill, slug: 'power-tools' },
  { name: 'Decor', count: 76, icon: Lamp, slug: 'decor' },
  { name: 'Abrasives', count: 30, icon: Disc, slug: 'abrasives' },
];

const ICON_MAP: Record<string, LucideIcon> = {
  'building materials': Hammer,
  'electricals': Zap,
  'hand tools': Wrench,
  'chisels and punches': PenTool,
  'ppe': HardHat,
  'power tools': Drill,
  'decor': Lamp,
  'abrasives': Disc,
};

const getCategoryIcon = (name: string) => {
  const normalized = name.toLowerCase().trim();
  return ICON_MAP[normalized] || Box;
};

export default function MobileNavDrawer({
  isOpen,
  onClose,
  session,
  openAuth,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const { t, tCategory, dir } = useLanguage();
  const { totalCount, openCartDrawer } = useCart();
  const { unreadCount } = useNotifications();
  const { categories } = useAppSelector((state) => state.categories);

  const [mounted, setMounted] = useState(false);
  const [isBuyExpanded, setIsBuyExpanded] = useState(false);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close drawer strictly on genuine route navigation
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Handle body scroll locking and Escape key
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalStyle;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  // Prepare display categories
  const displayCategories = categories && categories.length > 0
    ? categories.slice(0, 8).map((cat) => ({
      id: cat.id,
      name: cat.name,
      count: (cat.subcategories?.length || cat.sub_categories?.length)
        ? `${cat.subcategories?.length || cat.sub_categories?.length} ${t('megamenu.subcategories', 'subcategories')}`
        : t('megamenu.itemsAvailable', 'Items available'),
      icon: getCategoryIcon(cat.name),
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }))
    : DEFAULT_CATEGORIES.map((cat) => ({
      id: cat.slug,
      name: cat.name,
      count: `${cat.count} ${t('megamenu.items', 'items')}`,
      icon: cat.icon,
      slug: cat.slug,
    }));

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      data-lenis-prevent
      className="fixed inset-x-0 bottom-0 top-16 sm:top-18 bg-white flex flex-col z-[9999] lg:hidden overflow-hidden animate-in slide-in-from-top-4 fade-in duration-200 border-t border-gray-100 shadow-xl"
      aria-label="Mobile Navigation Menu"
    >
      {/* Full-Width Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto scrollbar-hide w-full"
      >
        <div className="container py-5 space-y-5">
          {/* User Auth Card */}
          {session ? (
            <div className="bg-gradient-to-br from-[#0f7a61]/8 to-[#14b875]/8 border border-[#0f7a61]/20 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-[#0f7a61] text-white font-extrabold text-base flex items-center justify-center shadow-xs shrink-0">
                  {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {session.user?.name || 'User Account'}
                  </p>
                  {session.user?.email && (
                    <p className="text-xs text-gray-500 truncate">
                      {session.user.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-xs font-semibold text-gray-700 hover:text-[#0f7a61] hover:bg-[#e6f7ef] transition-colors border border-gray-100 shadow-2xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t('nav.profile', 'Profile')}</span>
                </Link>
                <button
                  onClick={() => {
                    onClose();
                    performLogout({ redirect: true, callbackUrl: '/' });
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border border-gray-100 shadow-2xs cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('nav.signOut', 'Sign out')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#0f7a61]/5 to-[#14b875]/10 border border-[#0f7a61]/15 rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0f7a61] mb-1">
                B2B Liquidation Portal
              </p>
              <h4 className="text-sm font-extrabold text-gray-900 mb-3">
                {t('mobile.welcomeHeading', 'Access verified surplus lots and direct bids')}
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    onClose();
                    openAuth('login');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:text-[#0f7a61] hover:border-[#0f7a61]/40 transition-colors shadow-2xs text-center cursor-pointer"
                >
                  {t('nav.signIn', 'Sign In')}
                </button>
                <button
                  onClick={() => {
                    onClose();
                    openAuth('register');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0f7a61] hover:bg-[#0c6651] text-xs font-bold text-white transition-colors shadow-xs text-center cursor-pointer"
                >
                  {t('nav.register', 'Register')}
                </button>
              </div>
            </div>
          )}

          {/* Primary Navigation Links */}
          <nav className="space-y-1">
            {/* Buy / Categories Accordion */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 overflow-hidden">
              <button
                type="button"
                onClick={() => setIsBuyExpanded(!isBuyExpanded)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-bold transition-colors cursor-pointer ${isActive('/buy') || isActive('/shop-by-category')
                  ? 'text-[#0f7a61] bg-[#e6f7ef]/40'
                  : 'text-gray-900 hover:bg-gray-100/70'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Boxes className="w-4 h-4 text-[#0f7a61]" />
                  <span>{t('nav.buy', 'Buy Surplus')}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isBuyExpanded ? 'rotate-180 text-[#0f7a61]' : ''
                    }`}
                />
              </button>

              {isBuyExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-gray-100 space-y-1 bg-white">
                  <Link
                    href="/buy"
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-[#0f7a61] bg-[#e6f7ef]/50 hover:bg-[#e6f7ef] transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0f7a61]" />
                      {t('megamenu.allLiquidation', 'All Liquidation')}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                  <Link
                    href="/shop-by-category"
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-gray-700 hover:text-[#0f7a61] hover:bg-gray-50 transition-colors"
                  >
                    <span>{t('megamenu.allCategories', 'Browse All Categories')}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>

                  <div className="pt-2 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {displayCategories.slice(0, 6).map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.id}
                          href={`/shop-by-category/${cat.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left rtl:text-right"
                        >
                          <div className="w-6 h-6 rounded-md bg-[#e6f7ef] text-[#0f7a61] flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[11px] font-semibold text-gray-800 truncate">
                            {tCategory(cat.name)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sell Link */}
            <Link
              href="/sell"
              onClick={onClose}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-colors ${isActive('/sell')
                ? 'bg-[#e6f7ef] text-[#0f7a61]'
                : 'text-gray-800 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-[#0f7a61]" />
                <span>{t('nav.sell', 'Sell Inventory')}</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {t('mobile.sellerDesk', 'List Lots')}
              </span>
            </Link>

            {/* Partnership Link */}
            <Link
              href="/partnership"
              onClick={onClose}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-colors ${isActive('/partnership')
                ? 'bg-[#e6f7ef] text-[#0f7a61]'
                : 'text-gray-800 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <Handshake className="w-4 h-4 text-[#0f7a61]" />
                <span>{t('nav.partner', 'Become a Partner')}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 rtl:rotate-180" />
            </Link>

            {/* Sustainability Link */}
            <Link
              href="/sustainability"
              onClick={onClose}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-colors ${isActive('/sustainability')
                ? 'bg-[#e6f7ef] text-[#0f7a61]'
                : 'text-gray-800 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <Leaf className="w-4 h-4 text-[#0f7a61]" />
                <span>{t('nav.sustainability', 'Sustainability')}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 rtl:rotate-180" />
            </Link>
          </nav>

          {/* Help & Support Links */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">
              {t('nav.support', 'Assistance & Help')}
            </p>
            <div className="space-y-1">
              <Link
                href="/assistance"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <span>{t('footer.assistanceDesk', 'Assistance Desk')}</span>
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{t('footer.contactUs', 'Contact Support Desk')}</span>
              </Link>
              <Link
                href="/faq"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <FileQuestion className="w-4 h-4 text-gray-400" />
                <span>{t('footer.faq', 'Frequently Asked Questions')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="px-5 sm:px-8 py-3.5 border-t border-gray-100 bg-gray-50/80 shrink-0 text-center w-full">
        <p className="text-[11px] text-gray-500 font-medium">
          Surplus Market &bull; Circular Commerce Platform
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">
          Verified Liquidation Lots &bull; B2B Wholesale
        </p>
      </div>
    </div>,
    document.body
  );
}

