"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, LogOut } from 'lucide-react';
import { motion } from '../../lib/motion';
import HeaderCartDropdown from '../../components/HeaderCartDropdown';
import HeaderNotificationsDropdown from '../../components/HeaderNotificationsDropdown';
import BuyMegamenu from './BuyMegamenu';
import AuthModal from '../../components/AuthModal';
import { useSession } from 'next-auth/react';
import { performLogout } from '../../lib/authCleanup';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';

// Track if header landing animation has played in this browser JS context
let hasLandedInPageLoad = false;

const Header = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLanding] = useState(() => !hasLandedInPageLoad);

  useEffect(() => {
    hasLandedInPageLoad = true;
  }, []);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header 
      className={`sticky top-0 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md z-50 shadow-sm transition-all [transform:translateZ(0)] ${
        isLanding ? 'animate-header-landing' : ''
      }`}
    >
      <div className="container header-container">
        <div className="flex items-center justify-between h-20">
          {/* Left Group: Logo & Navigation */}
          <div className="flex items-center h-full header-left-group">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/surplus_main_logo.png" 
                  alt="Surplus Market Logo" 
                  width={180} 
                  height={40} 
                  className="object-contain header-logo"
                  priority 
                />
              </Link>
            </div>

            {/* Center Navigation */}
            <nav className="hidden lg:flex items-center h-full header-nav whitespace-nowrap">
              <BuyMegamenu />
              <Link 
                href="/sell" 
                className={`font-medium text-[16px] transition-all py-1 header-nav-link whitespace-nowrap ${
                  isActive('/sell') ? 'text-[#0f7a61] font-semibold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('nav.sell', 'Sell')}
              </Link>
              <Link 
                href="/partnership" 
                className={`font-medium text-[16px] transition-all py-1 header-nav-link whitespace-nowrap ${
                  isActive('/partnership') ? 'text-[#0f7a61] font-semibold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('nav.partner', 'Become a Partner')}
              </Link>
              <Link 
                href="/sustainability" 
                className={`font-medium text-[16px] transition-all py-1 header-nav-link whitespace-nowrap ${
                  isActive('/sustainability') ? 'text-[#0f7a61] font-semibold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('nav.sustainability', 'Sustainability')}
              </Link>
            </nav>
          </div>

        {/* Mobile Right Actions */}
        <div className="flex lg:hidden items-center gap-1.5 header-mobile-actions">
          <Link 
            href="/buy" 
            className="text-xs font-bold text-[#0f7a61] bg-[#e6f7ef] hover:bg-[#d0f0e4] px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
          >
            {t('nav.buy', 'Buy')}
          </Link>
          <HeaderCartDropdown />
          {session ? (
            <Link 
              href="/profile"
              className="flex items-center justify-center w-7 h-7 rounded-full bg-[#0f7a61] text-white font-bold text-xs ml-1"
              title={session.user?.name || 'Profile'}
            >
              {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
            </Link>
          ) : (
            <button 
              onClick={() => openAuth('login')} 
              className="text-gray-700 hover:text-[#0f7a61] text-xs font-bold px-2 py-1 ml-1"
            >
              {t('nav.signIn', 'Sign In')}
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center header-right-actions">
          <HeaderCartDropdown />
          {session ? <HeaderNotificationsDropdown /> : null}

          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : session ? (
            <div className="relative group">
              <Link 
                href="/profile"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0f7a61] text-white font-bold text-xs hover:opacity-90 transition-opacity focus:outline-none shadow-sm cursor-pointer"
                title={session.user?.name || session.user?.email || 'User Profile'}
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
            <>
              <button onClick={() => openAuth('login')} className="text-gray-600 hover:text-gray-900 font-medium text-[13px] header-auth-link">
                {t('nav.signIn', 'Sign in')}
              </button>

              <button 
                onClick={() => openAuth('register')}
                className="bg-[#0f7a61] hover:bg-[#0c6651] text-white px-3.5 py-1.5 rounded-full font-medium text-[13px] transition-colors header-auth-btn"
              >
                {t('nav.register', 'Register')}
              </button>
            </>
          )}
        </div>
        </div>
      </div>

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
