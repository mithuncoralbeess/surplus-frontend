"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { User, LogOut, Menu, X } from 'lucide-react';
import HeaderCartDropdown from '../../components/HeaderCartDropdown';
import HeaderNotificationsDropdown from '../../components/HeaderNotificationsDropdown';
import BuyMegamenu from './BuyMegamenu';
import MobileNavDrawer from './MobileNavDrawer';
import { useSession } from 'next-auth/react';
import { performLogout } from '../../lib/authCleanup';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';

const AuthModal = dynamic(() => import('../../components/AuthModal'), { ssr: false });

const Header = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header 
      className="sticky top-0 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md z-50 shadow-xs transition-all [transform:translateZ(0)]"
    >
      <div className="container header-container">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Left Group: Logo & Desktop Navigation */}
          <div className="flex items-center h-full header-left-group">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center" aria-label="Surplus Market Home">
                <Image 
                  src="/surplus_main_logo.png" 
                  alt="Surplus Market Logo" 
                  width={180} 
                  height={40} 
                  className="object-contain header-logo w-[120px] sm:w-[135px] md:w-[145px] lg:w-[140px] xl:w-[160px] 2xl:w-[180px]"
                  style={{ height: "auto" }}
                  priority 
                />
              </Link>
            </div>

            {/* Center Navigation (Desktop >= 1024px) */}
            <nav className="hidden lg:flex items-center h-full header-nav whitespace-nowrap lg:gap-1.5 xl:gap-3 2xl:gap-5">
              <BuyMegamenu />
              <Link 
                href="/sell" 
                className={`font-medium lg:text-[14px] xl:text-[15.5px] 2xl:text-[16px] transition-all py-1 px-2 xl:px-3 header-nav-link whitespace-nowrap rounded-lg ${
                  isActive('/sell') ? 'text-[#0f7a61] font-semibold bg-[#e6f7ef]/60' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t('nav.sell', 'Sell')}
              </Link>
              <Link 
                href="/partnership" 
                className={`font-medium lg:text-[14px] xl:text-[15.5px] 2xl:text-[16px] transition-all py-1 px-2 xl:px-3 header-nav-link whitespace-nowrap rounded-lg ${
                  isActive('/partnership') ? 'text-[#0f7a61] font-semibold bg-[#e6f7ef]/60' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t('nav.partner', 'Become a Partner')}
              </Link>
              <Link 
                href="/sustainability" 
                className={`font-medium lg:text-[14px] xl:text-[15.5px] 2xl:text-[16px] transition-all py-1 px-2 xl:px-3 header-nav-link whitespace-nowrap rounded-lg ${
                  isActive('/sustainability') ? 'text-[#0f7a61] font-semibold bg-[#e6f7ef]/60' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t('nav.sustainability', 'Sustainability')}
              </Link>
            </nav>
          </div>

          {/* Mobile & Tablet Right Actions (< 1024px) */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 header-mobile-actions">
            {/* Quick Buy Pill (Visible on sm+: >= 576px) */}
            <Link 
              href="/buy" 
              className="hidden sm:inline-flex text-xs font-bold text-[#0f7a61] bg-[#e6f7ef] hover:bg-[#d0f0e4] px-2.5 py-1.5 rounded-full transition-colors items-center gap-1 shadow-2xs"
            >
              {t('nav.buy', 'Buy')}
            </Link>

            {/* Quick Sell Pill (Visible on md+: >= 768px) */}
            <Link 
              href="/sell" 
              className="hidden md:inline-flex text-xs font-bold text-gray-700 hover:text-[#0f7a61] bg-gray-100 hover:bg-[#e6f7ef] px-2.5 py-1.5 rounded-full transition-colors items-center gap-1 shadow-2xs"
            >
              {t('nav.sell', 'Sell')}
            </Link>

            {/* Cart Dropdown (Visible on all screens) */}
            <HeaderCartDropdown />

            {/* Notifications Dropdown (when authenticated) */}
            {session ? (
              <HeaderNotificationsDropdown />
            ) : null}

            {/* User Avatar / Sign In */}
            {session ? (
              <Link 
                href="/profile"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0f7a61] text-white font-bold text-xs shadow-2xs shrink-0"
                title={session.user?.name || 'Profile'}
                aria-label="User Profile"
              >
                {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
              </Link>
            ) : (
              <button 
                onClick={() => openAuth('login')} 
                className="text-gray-700 hover:text-[#0f7a61] text-xs font-bold px-2 py-1 ml-0.5 cursor-pointer shrink-0"
              >
                {t('nav.signIn', 'Sign In')}
              </button>
            )}

            {/* Hamburger / Close Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl transition-all cursor-pointer active:scale-95 shadow-2xs shrink-0 ${
                isMobileMenuOpen 
                  ? 'bg-[#e6f7ef] text-[#0f7a61] border border-[#0f7a61]/40' 
                  : 'bg-gray-50 hover:bg-[#e6f7ef] text-gray-700 hover:text-[#0f7a61] border border-gray-200/80'
              }`}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" />
              )}
            </button>
          </div>

          {/* Desktop Right Actions (>= 1024px) */}
          <div className="hidden lg:flex items-center header-right-actions lg:gap-2 xl:gap-3 2xl:gap-4">
            <HeaderCartDropdown />
            {session ? <HeaderNotificationsDropdown /> : null}

            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : session ? (
              <div className="relative group">
                <Link 
                  href="/profile"
                  className="flex items-center justify-center w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-[#0f7a61] text-white font-bold text-xs hover:opacity-90 transition-opacity focus:outline-none shadow-sm cursor-pointer"
                  title={session.user?.name || session.user?.email || 'User Profile'}
                  aria-label="User Profile Menu"
                >
                  {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
                </Link>

                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50 overflow-hidden">
                  {/* User Info Header */}
                  <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {session.user?.name || 'User'}
                    </p>
                    {session.user?.email && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {session.user.email}
                      </p>
                    )}
                  </div>

                  {/* Profile Link */}
                  <div className="py-1">
                    <Link 
                      href="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-[#e6f7ef] hover:text-[#0f7a61] transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400 group-hover:text-[#0f7a61]" />
                      <span>{t('nav.profile', 'Profile')}</span>
                    </Link>
                  </div>

                  <div className="h-px bg-gray-100 my-1"></div>

                  {/* Sign Out Button */}
                  <button 
                    onClick={() => performLogout({ redirect: true, callbackUrl: '/' })}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left rtl:text-right cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>{t('nav.signOut', 'Sign out')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 xl:gap-3">
                <button 
                  onClick={() => openAuth('login')} 
                  className="text-gray-600 hover:text-gray-900 font-medium text-[13px] xl:text-[14px] header-auth-link px-2.5 py-1.5 transition-colors cursor-pointer"
                >
                  {t('nav.signIn', 'Sign in')}
                </button>

                <button 
                  onClick={() => openAuth('register')}
                  className="bg-[#0f7a61] hover:bg-[#0c6651] text-white px-3.5 xl:px-4 py-1.5 rounded-full font-medium text-[13px] xl:text-[14px] transition-colors shadow-2xs header-auth-btn cursor-pointer whitespace-nowrap"
                >
                  {t('nav.register', 'Register')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      <MobileNavDrawer 
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
        session={session}
        openAuth={openAuth}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
};

export default Header;
