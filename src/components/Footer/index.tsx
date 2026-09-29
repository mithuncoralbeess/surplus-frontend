"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

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
      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#14b875] mr-2 shrink-0 animate-pulse"></span>}
      {children}
    </Link>
  );
};

const Footer = () => {
  return (
    <footer className="w-full bg-[#071710] text-gray-300">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* Newsletter Section */}
        <div className="py-12 border-b border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Never miss a deal! Subscribe to Surplus Newsletter.
            </h3>
            <p className="text-[15px] text-gray-400">
              New arrivals, wholesale lots and price drops - straight to your inbox.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full sm:w-[300px] bg-white/5 border border-white/10 rounded-full px-6 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#185545] transition-colors"
            />
            <button className="w-full sm:w-auto bg-[#185545] hover:bg-[#124235] text-white px-8 py-3.5 rounded-full font-bold text-[15px] transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
              Subscribe <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>
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
              />
            </Link>
            <p className="text-[14px] leading-relaxed text-gray-400">
              The trusted intermediary for surplus inventory. Every RFQ, quote and transaction is managed by Surplus Market.
            </p>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-5 gap-8">
            
            {/* Column 1 */}
            <div>
              <h4 className="text-[11px] font-bold text-white tracking-widest uppercase mb-6">
                Marketplace
              </h4>
              <ul className="flex flex-col gap-4 text-[14px]">
                <li><FooterLink href="/browse">Browse Inventory</FooterLink></li>
                <li><FooterLink href="/lots">Wholesale Lots</FooterLink></li>
                <li><FooterLink href="/sell">Sell Inventory</FooterLink></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-[11px] font-bold text-white tracking-widest uppercase mb-6">
                Company
              </h4>
              <ul className="flex flex-col gap-4 text-[14px]">
                <li><FooterLink href="/about-us">About</FooterLink></li>
                <li><FooterLink href="/partnership">Partner with us</FooterLink></li>
                <li><FooterLink href="/assistance">Assistance</FooterLink></li>
                <li><FooterLink href="/video">Corporate video</FooterLink></li>
                <li><FooterLink href="/contact">Contact</FooterLink></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-[11px] font-bold text-white tracking-widest uppercase mb-6">
                Resource
              </h4>
              <ul className="flex flex-col gap-4 text-[14px]">
                <li><FooterLink href="/blog">Blogs</FooterLink></li>
                <li><FooterLink href="/webinars">Webinars</FooterLink></li>
                <li><FooterLink href="/inventory-calculator">Inventory Aging Calculator</FooterLink></li>
                <li><FooterLink href="/checklist-comparison">Checklist Comparison</FooterLink></li>
                <li><FooterLink href="/sustainability">Sustainability & data</FooterLink></li>
                <li><FooterLink href="/faq">FAQ</FooterLink></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="text-[11px] font-bold text-white tracking-widest uppercase mb-6">
                Legal
              </h4>
              <ul className="flex flex-col gap-4 text-[14px]">
                <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
                <li><FooterLink href="/terms">Terms & Conditions</FooterLink></li>
                <li><FooterLink href="/returns">Return Policy</FooterLink></li>
                <li><FooterLink href="/warranty">Service & Warranty</FooterLink></li>
              </ul>
            </div>

            {/* Column 5 */}
            <div>
              <h4 className="text-[11px] font-bold text-white tracking-widest uppercase mb-6">
                Regions
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
            &copy; {new Date().getFullYear()} Surplus Market. Circular commerce, verified.
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
