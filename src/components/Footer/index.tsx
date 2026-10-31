"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link 
      href={href} 
      className={`inline-flex items-center transition-colors ${
        isActive 
          ? 'text-[#14b875] font-semibold' 
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#14b875] mr-2 rtl:mr-0 rtl:ml-2 shrink-0 animate-pulse"></span>}
      {children}
    </Link>
  );
};

const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="w-full bg-[#071710] text-gray-300">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* Newsletter Section */}
        <div className="py-12 border-b border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('footer.newsletterTitle', 'Never miss a deal! Subscribe to Surplus Newsletter.')}
            </h2>
            <p className="text-[15px] text-gray-300">
              {t('footer.newsletterSubtitle', 'New arrivals, wholesale lots and price drops - straight to your inbox.')}
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('footer.emailPlaceholder', 'Enter your email')} 
              aria-label={t('footer.emailPlaceholder', 'Enter your email')}
              required
              className="w-full sm:w-[300px] bg-white/5 border border-white/10 rounded-full px-6 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#185545] transition-colors"
            />
            <button 
              type="submit"
              className="w-full sm:w-auto bg-[#185545] hover:bg-[#124235] text-white px-8 py-3.5 rounded-full font-bold text-[15px] transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-md"
            >
              {subscribed ? (
                <>
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  {t('footer.subscribe', 'Subscribe')} <ArrowRight className="w-4.5 h-4.5 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Links Section */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 pr-0 lg:pr-8">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/surplus_main_logo.png" 
                alt="Surplus Market" 
                width={160} 
                height={36} 
                className="object-contain brightness-0 invert"
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <p className="text-[14px] leading-relaxed text-gray-400">
              {t('footer.tagline', 'The premier B2B marketplace for surplus inventory and industrial asset recovery.')}
            </p>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-5 gap-8">
            
            {/* Column 1 */}
            <div>
              <h4 className="text-[11px] font-bold text-white tracking-widest uppercase mb-6">
                {t('footer.categories', 'Marketplace')}
              </h4>
              <ul className="flex flex-col gap-4 text-[14px]">
                <li><FooterLink href="/browse">{t('nav.browse', 'Browse Inventory')}</FooterLink></li>
                <li><FooterLink href="/browse">{t('megamenu.wholesaleLots', 'Wholesale Lots')}</FooterLink></li>
                <li><FooterLink href="/sell">{t('nav.sell', 'Sell Inventory')}</FooterLink></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-[11px] font-bold text-white tracking-widest uppercase mb-6">
                {t('footer.quickLinks', 'Company')}
              </h4>
              <ul className="flex flex-col gap-4 text-[14px]">
                <li><FooterLink href="/about-us">About</FooterLink></li>
                <li><FooterLink href="/partnership">{t('nav.partner', 'Partner with us')}</FooterLink></li>
                <li><FooterLink href="/assistance">Assistance</FooterLink></li>
                <li><FooterLink href="/about-us">Corporate video</FooterLink></li>
                <li><FooterLink href="/contact">{t('common.contactUs', 'Contact')}</FooterLink></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-[11px] font-bold text-white tracking-widest uppercase mb-6">
                Resource
              </h4>
              <ul className="flex flex-col gap-4 text-[14px]">
                <li><FooterLink href="/blog">Blogs</FooterLink></li>
                <li><FooterLink href="/blog">Webinars</FooterLink></li>
                <li><FooterLink href="/inventory-calculator">Inventory Aging Calculator</FooterLink></li>
                <li><FooterLink href="/checklist-comparison">Checklist Comparison</FooterLink></li>
                <li><FooterLink href="/sustainability">{t('nav.sustainability', 'Sustainability')}</FooterLink></li>
                <li><FooterLink href="/faq">FAQ</FooterLink></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="text-[11px] font-bold text-white tracking-widest uppercase mb-6">
                Legal
              </h4>
              <ul className="flex flex-col gap-4 text-[14px]">
                <li><FooterLink href="/privacy">{t('footer.privacy', 'Privacy Policy')}</FooterLink></li>
                <li><FooterLink href="/terms">{t('footer.terms', 'Terms & Conditions')}</FooterLink></li>
                <li><FooterLink href="/returns">Return Policy</FooterLink></li>
                <li><FooterLink href="/warranty">Service & Warranty</FooterLink></li>
              </ul>
            </div>

            {/* Column 5 */}
            <div>
              <h4 className="text-[11px] font-bold text-white tracking-widest uppercase mb-6">
                {t('common.region', 'Regions')}
              </h4>
              <ul className="flex flex-col gap-4 text-[14px]">
                <li><FooterLink href="/uae">UAE</FooterLink></li>
                <li><FooterLink href="/qatar">Qatar</FooterLink></li>
                <li><FooterLink href="/saudi-arabia">Saudi Arabia</FooterLink></li>
                <li><FooterLink href="/india">India</FooterLink></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Sub Footer */}
        <div className="py-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Surplus Market. {t('footer.rights', 'All rights reserved.')}
          </p>
          <p>
            Buyer and seller identities are never disclosed on the platform.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
