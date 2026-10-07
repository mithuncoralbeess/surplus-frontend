'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  ArrowRight,
  Hammer, 
  Zap, 
  Wrench, 
  PenTool, 
  HardHat, 
  Drill, 
  Lamp, 
  Disc,
  Sparkles,
  Tag,
  Package,
  PlayCircle,
  Box
} from 'lucide-react';
import { useAppSelector } from '../../store';
import { useLanguage } from '../../context/LanguageContext';

const DEFAULT_CATEGORIES = [
  { name: 'Building Materials', count: 227, icon: Hammer },
  { name: 'Electricals', count: 331, icon: Zap },
  { name: 'Hand tools', count: 132, icon: Wrench },
  { name: 'Chisels And Punches', count: 108, icon: PenTool },
  { name: 'PPE', count: 81, icon: HardHat },
  { name: 'Power tools', count: 76, icon: Drill },
  { name: 'Decor', count: 76, icon: Lamp },
  { name: 'Abrasives', count: 30, icon: Disc },
];

const ICON_MAP: Record<string, any> = {
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

const FORMATS = [
  {
    title: 'Latest Arrivals',
    badge: 'Fresh',
    desc: 'Fresh verified inventory added this...',
    icon: Sparkles,
  },
  {
    title: 'Verified Deals',
    badge: 'Hot Deals',
    desc: 'Discounted liquidation inventory rea...',
    icon: Tag,
  },
  {
    title: 'Wholesale Lots & Pallets',
    badge: '> 10 SKUs',
    desc: 'Full container & pallet batch manifests',
    icon: Package,
  },
];

const BuyMegamenu = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { categories, loading } = useAppSelector((state) => state.categories);

  // Close the megamenu whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isBuyActive = pathname === '/buy' || pathname.startsWith('/buy') || pathname === '/browse' || pathname.startsWith('/browse') || pathname === '/shop-by-category' || pathname.startsWith('/category');

  // Prepare display categories from Redux store or default fallback
  const displayCategories = categories && categories.length > 0
    ? categories.slice(0, 8).map((cat) => ({
        id: cat.id,
        name: cat.name,
        count: cat.subcategories?.length ? `${cat.subcategories.length} subcategories` : 'Items available',
        icon: getCategoryIcon(cat.name),
        slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }))
    : DEFAULT_CATEGORIES.map((cat) => ({
        id: cat.name,
        name: cat.name,
        count: `${cat.count} items`,
        icon: cat.icon,
        slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }));

  return (
    <div 
      className="cursor-pointer h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger */}
      <div className={`flex items-center font-medium text-[14px] transition-all py-1 header-nav-link whitespace-nowrap ${
        isBuyActive || isOpen 
          ? 'text-[#0f7a61] font-semibold' 
          : 'text-gray-600 hover:text-gray-900'
      }`}>
        {t('nav.buy', 'Buy')} <ChevronDown className={`ml-1 w-4 h-4 transition-colors ${isBuyActive || isOpen ? 'text-[#0f7a61]' : 'text-gray-400'}`} />
      </div>

      {/* Dropdown Container */}
      <div className={`absolute top-full left-0 w-full transition-all duration-300 ease-out z-50 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
        <div className="w-full bg-white shadow-2xl border-t border-gray-100">
          <div className="container mx-auto flex">
          
          {/* Left Panel: Categories */}
          <div className="flex-1 py-6 pr-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[11px] font-bold text-primary tracking-widest uppercase mb-1">
                  Browse Marketplace
                </p>
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Shop by Category
                </h3>
              </div>
              <Link href="/shop-by-category" className="text-sm font-bold text-primary hover:text-primary-dark flex items-center transition-colors pb-1">
                All Categories <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {displayCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link href={`/shop-by-category/${cat.slug}`} key={cat.id} className="flex flex-col items-center justify-center py-4 px-2 border border-gray-200 rounded-2xl hover:border-primary/40 hover:bg-primary-light/20 hover:-translate-y-0.5 hover:shadow-md transition-all group/card">
                    <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-2 text-primary group-hover/card:scale-110 group-hover/card:bg-primary group-hover/card:text-white transition-all duration-300">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-bold text-gray-900 text-center w-full truncate px-1">
                      {cat.name}
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
          <div className="w-[440px] bg-[#f4fbf9] py-6 px-10 relative overflow-hidden flex flex-col border-l border-gray-100 megamenu-right-panel">
            {/* Background Icon Decoration */}
            <PlayCircle className="absolute -top-10 -right-10 w-48 h-48 text-white/40 pointer-events-none" strokeWidth={1} />
            
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-primary tracking-widest uppercase mb-1">
                Special Formats
              </p>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-6">
                How You Want to Buy
              </h3>

              <div className="space-y-4">
                {FORMATS.map((format, idx) => {
                  const Icon = format.icon;
                  return (
                    <Link href="/browse" key={idx} className="flex items-start gap-5 group/format p-3 -ml-3 rounded-2xl hover:bg-white/60 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-primary shadow-sm border border-gray-50 group-hover/format:scale-110 group-hover/format:shadow-md transition-all duration-300">
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold text-gray-900 group-hover/format:text-primary transition-colors">
                            {format.title}
                          </span>
                          <span className="text-[10px] font-bold text-primary bg-primary-light-hover px-2 py-0.5 rounded-full">
                            {format.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {format.desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer Area */}
            <div className="mt-auto pt-6 border-t border-primary/10 flex justify-between items-center relative z-10">
              <Link href="/buy" className="text-xs font-bold text-primary hover:text-primary-dark flex items-center transition-colors">
                Liquidation Buy Hub <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
              <Link href="/browse" className="text-xs font-semibold text-gray-500 hover:text-primary flex items-center transition-colors">
                Browse catalog <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
            
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default BuyMegamenu;
