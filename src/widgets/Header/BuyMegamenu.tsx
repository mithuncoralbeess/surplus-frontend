'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  ArrowRight,
  Sparkles,
  Package,
  PlayCircle,
  Box,
} from 'lucide-react';
import { useAppSelector } from '../../store';
import { useLanguage } from '../../context/LanguageContext';
import { getCategoryIconPath, DEFAULT_MEGAMENU_CATEGORIES } from '../../data/categoryIcons';

const BuyMegamenu = () => {
  const pathname = usePathname();
  const { t, tCategory } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const { categories } = useAppSelector((state) => state.categories);

  // Close the megamenu whenever the route changes
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  const isBuyActive = pathname === '/buy' || pathname.startsWith('/buy') || pathname === '/browse' || pathname.startsWith('/browse') || pathname === '/shop-by-category' || pathname.startsWith('/category');

  // Prepare display categories from Redux store or default fallback
  // Note: Ignore backend images and always use the custom icons from /All Icons New/
  const displayCategories = categories && categories.length > 0
    ? categories.slice(0, 8).map((cat) => ({
        id: cat.id,
        name: cat.name,
        count: (cat.subcategories?.length || cat.sub_categories?.length) ? `${cat.subcategories?.length || cat.sub_categories?.length} ${t('megamenu.subcategories', 'subcategories')}` : t('megamenu.itemsAvailable', 'Items available'),
        icon: getCategoryIconPath(cat.slug || cat.name),
        slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }))
    : DEFAULT_MEGAMENU_CATEGORIES.map((cat) => ({
        id: cat.slug,
        name: cat.name,
        count: `${cat.count} ${t('megamenu.items', 'items')}`,
        icon: cat.icon,
        slug: cat.slug,
      }));

  const dynamicFormats = [
    {
      title: t('megamenu.products', 'Surplus Products'),
      badge: t('megamenu.singleItems', 'Single Items'),
      desc: t('megamenu.productsDesc', 'Verified individual surplus products & equipment at liquidation prices'),
      icon: Box,
      href: '/buy/product',
    },
    {
      title: t('megamenu.wholesaleLots', 'Wholesale Lots & Pallets'),
      badge: t('megamenu.bulkLots', 'Bulk Lots'),
      desc: t('megamenu.wholesaleLotsDesc', 'Full container manifests, pallet batches, and wholesale lots'),
      icon: Package,
      href: '/buy/lot',
    },
    {
      title: t('megamenu.verifiedDeals', 'Deals & New Arrivals'),
      badge: t('megamenu.hotDeals', 'Hot Deals'),
      desc: t('megamenu.verifiedDealsDesc', 'Discounted liquidation inventory and freshly approved stock'),
      icon: Sparkles,
      href: '/browse',
    },
  ];

  return (
    <div 
      className="cursor-pointer h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger: Clickable Link to /buy */}
      <Link 
        href="/buy"
        onClick={() => setIsOpen(false)}
        className={`flex items-center font-medium lg:text-[14px] xl:text-[15.5px] 2xl:text-[16px] transition-all py-1 px-1.5 xl:px-2.5 header-nav-link whitespace-nowrap ${
          isBuyActive || isOpen 
            ? 'text-[#0f7a61] font-semibold' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {t('nav.buy', 'Buy')} <ChevronDown className={`ml-1 rtl:ml-0 rtl:mr-1 w-4 h-4 transition-colors ${isBuyActive || isOpen ? 'text-[#0f7a61]' : 'text-gray-400'}`} />
      </Link>

      {/* Dropdown Container */}
      <div className={`absolute top-full left-0 w-full transition-all duration-300 ease-out z-50 whitespace-normal megamenu-dropdown ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
        <div className="w-full bg-white shadow-2xl border-t border-gray-100">
          <div className="container mx-auto flex flex-col lg:flex-row">
          
          {/* Left Panel: Categories */}
          <div className="flex-1 py-6 pr-8 rtl:pr-0 rtl:pl-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[11px] font-bold text-primary tracking-widest uppercase mb-1">
                  {t('megamenu.browseMarketplace', 'Browse Marketplace')}
                </p>
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {t('megamenu.shopByCategory', 'Shop by Category')}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Link 
                  href="/buy" 
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-bold text-primary hover:text-primary-dark flex items-center transition-colors pb-1"
                >
                  {t('megamenu.allCategories', 'All Categories')} <ArrowRight className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1 rtl:rotate-180" />
                </Link>
              </div>
            </div>

            {/* Direct Quick-Access Links to Product & Lot pages */}
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/buy/product"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-bold transition-all shadow-xs"
              >
                <Box className="w-3.5 h-3.5" />
                <span>{t('megamenu.products', 'Surplus Products')}</span>
              </Link>
              <Link
                href="/buy/lot"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-100/70 hover:bg-[#0f7a61] text-[#0f7a61] hover:text-white text-xs font-bold transition-all shadow-xs"
              >
                <Package className="w-3.5 h-3.5" />
                <span>{t('megamenu.wholesaleLots', 'Wholesale Lots & Pallets')}</span>
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {displayCategories.map((cat) => {
                return (
                  <Link 
                    href={`/buy/${cat.slug}`} 
                    key={cat.id} 
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-center justify-center py-4 px-2 border border-gray-200 rounded-2xl hover:border-primary/40 hover:bg-primary-light/20 hover:-translate-y-0.5 hover:shadow-md transition-all group/card"
                  >
                    <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-2 group-hover/card:scale-110 group-hover/card:bg-primary transition-all duration-300">
                      <Image 
                        src={cat.icon} 
                        alt={cat.name} 
                        width={24} 
                        height={24} 
                        className="w-6 h-6 object-contain transition-all duration-300 group-hover/card:brightness-0 group-hover/card:invert" 
                        unoptimized
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-900 text-center w-full truncate px-1">
                      {tCategory(cat.name)}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1">
                      {cat.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Special Formats */}
          <div className="w-full lg:w-[420px] bg-[#f4fbf9] py-6 px-6 sm:px-7 relative flex flex-col border-l rtl:border-l-0 rtl:border-r border-gray-100 megamenu-right-panel shrink-0">
            {/* Background Icon Decoration with scoped overflow clipping */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <PlayCircle className="absolute -top-10 -right-10 rtl:-right-auto rtl:-left-10 w-48 h-48 text-emerald-900/5 pointer-events-none" strokeWidth={1} />
            </div>
            
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-primary tracking-widest uppercase mb-1">
                {t('megamenu.specialFormats', 'Special Formats')}
              </p>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-5">
                {t('megamenu.howYouWantToBuy', 'How You Want to Buy')}
              </h3>

              <div className="space-y-3">
                {dynamicFormats.map((format, idx) => {
                  const Icon = format.icon;
                  return (
                    <Link 
                      href={format.href || "/browse"} 
                      key={idx} 
                      onClick={() => setIsOpen(false)}
                      className="flex items-start gap-3.5 group/format p-3 rounded-2xl hover:bg-white/80 transition-all border border-transparent hover:border-emerald-100 hover:shadow-xs cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 text-primary shadow-xs border border-gray-100 group-hover/format:scale-105 group-hover/format:bg-[#0f7a61] group-hover/format:text-white transition-all duration-200">
                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900 group-hover/format:text-primary transition-colors truncate">
                            {format.title}
                          </span>
                          <span className="text-[10px] font-bold text-primary bg-primary-light-hover px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                            {format.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed whitespace-normal break-words">
                          {format.desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default BuyMegamenu;
