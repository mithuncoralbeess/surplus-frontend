"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from '../../lib/motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface CommonBannerProps {
  title: string;
  subtitle?: string;
  image?: string;
  align?: 'left' | 'center';
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}

const CommonBanner: React.FC<CommonBannerProps> = ({ 
  title, 
  subtitle, 
  image = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2000&q=80',
  align = 'left',
  breadcrumbs,
  children
}) => {
  return (
    <section className="relative w-full h-[320px] md:h-[400px] overflow-hidden bg-[#0a1e17] flex items-center pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2a1f]/95 via-[#0d2a1f]/80 to-transparent z-10"></div>
        <Image 
          src={image} 
          alt={title || "Banner background"} 
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-50 mix-blend-luminosity"
        />
      </div>

      <div className={`container mx-auto px-4 lg:px-8 max-w-[1600px] relative z-20 ${align === 'center' ? 'text-center flex flex-col items-center' : 'text-left'}`}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`flex items-center gap-2 text-[13px] text-gray-300/80 mb-6 font-medium ${align === 'center' ? 'justify-center' : 'justify-start'}`}
          >
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors flex items-center gap-1">
                    {index === 0 && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    )}
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-bold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 ${align === 'center' ? 'max-w-4xl mx-auto' : 'max-w-4xl'}`}
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className={`text-[16px] text-gray-300 max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}
          >
            {subtitle}
          </motion.p>
        )}
        
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className={`mt-8 flex flex-col sm:flex-row gap-4 ${align === 'center' ? 'justify-center mx-auto' : 'justify-start'}`}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CommonBanner;
