"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Package, SearchX } from 'lucide-react';
import { motion } from '../../lib/motion';
import LotCard from '../../components/LotCard';
import { catalogService, LotItem } from '../../services/catalogService';
import { useLanguage } from '../../context/LanguageContext';

const TABS = ['All', 'New Arrivals', 'Featured Deals'] as const;

const getCachedTabLots = (tab: string): LotItem[] => {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem('surplus_pallet_deals_lots');
      const saved = sessionStorage.getItem(`surplus_pallet_deals_v2_${tab}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
  }
  return [];
};

interface PalletDealsProps {
  initialLots?: LotItem[];
}

const PalletDeals: React.FC<PalletDealsProps> = ({ initialLots = [] }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('All');
  const [lots, setLots] = useState<LotItem[]>(initialLots);
  const [loading, setLoading] = useState<boolean>(initialLots.length === 0);
  const cacheRef = useRef<Record<string, LotItem[]>>(
    initialLots.length > 0 ? { All: initialLots } : {}
  );

  useEffect(() => {
    let isMounted = true;
    const cacheKey = activeTab;

    // 1. Check in-memory cache first for instant tab switching
    if (cacheRef.current[cacheKey] && cacheRef.current[cacheKey].length > 0) {
      const cached = cacheRef.current[cacheKey];
      if (lots !== cached) {
        React.startTransition(() => {
          setLots(cached);
          setLoading(false);
        });
      } else if (loading) {
        setLoading(false);
      }
      return;
    }

    // 2. Check sessionStorage cache
    const localCached = getCachedTabLots(activeTab);
    if (localCached.length > 0) {
      cacheRef.current[cacheKey] = localCached;
      React.startTransition(() => {
        setLots(localCached);
        setLoading(false);
      });
      return;
    }

    setLoading(true);

    const collectionParam =
      activeTab === 'New Arrivals'
        ? 'new_arrivals'
        : activeTab === 'Featured Deals'
        ? 'featured'
        : 'all';

    catalogService
      .getLots({ collection: collectionParam, limit: 12 })
      .then((data) => {
        if (!isMounted) return;
        let list = Array.isArray(data) ? [...data] : [];

        if (activeTab === 'New Arrivals') {
          const explicitNew = list.filter((item) => item.isNewArrival || item.is_new_arrival);
          if (explicitNew.length > 0) {
            list = explicitNew;
          } else {
            list.sort((a, b) => {
              const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
              const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
              if (dateB !== dateA) return dateB - dateA;
              return Number(b.id || 0) - Number(a.id || 0);
            });
          }
        } else if (activeTab === 'Featured Deals') {
          const explicitFeatured = list.filter((item) => item.isFeatured || item.is_featured);
          if (explicitFeatured.length > 0) {
            list = explicitFeatured;
          } else {
            list.sort((a, b) => {
              const msrpA = Number(a.msrp || 0);
              const msrpB = Number(b.msrp || 0);
              const priceA = Number(a.price || 0);
              const priceB = Number(b.price || 0);
              const discA = msrpA > priceA && priceA > 0 ? (msrpA - priceA) / msrpA : 0;
              const discB = msrpB > priceB && priceB > 0 ? (msrpB - priceB) / msrpB : 0;
              if (discB !== discA) return discB - discA;
              return msrpB - msrpA;
            });
          }
        }

        const displayLots = list.slice(0, 6);
        if (displayLots.length > 0) {
          cacheRef.current[cacheKey] = displayLots;
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              try {
                sessionStorage.setItem(`surplus_pallet_deals_v2_${activeTab}`, JSON.stringify(displayLots));
              } catch {}
            }, 0);
          }
        }

        React.startTransition(() => {
          setLots(displayLots);
          setLoading(false);
        });
      })
      .catch((err) => {
        console.warn('[PalletDeals] API fetch error:', err);
        if (isMounted) {
          setLots([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  return (
    <section className="w-full bg-[#fdfcf9] py-20 border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

        {/* Header Area */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="flex items-center text-primary-alt font-bold text-xs tracking-widest uppercase mb-4">
            <Package className="w-3.5 h-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
            {t('palletDeals.badge', 'Wholesale Liquidation')}
          </div>

          <h2 className="h2 text-gray-900 tracking-tight mb-4">
            {t('palletDeals.title', 'Full Lots & Pallet Deals')}
          </h2>

          <p className="text-[15px] text-gray-600 max-w-2xl mb-8 leading-relaxed">
            {t('palletDeals.subtitle', 'Verified bulk pallet batches and container manifests at wholesale clearance pricing. All lots are pre-inspected and ready for fast freight dispatch.')}
          </p>

          {/* Tabs */}
          <div className="w-full flex justify-center overflow-x-auto scrollbar-hide py-1">
            <div className="inline-flex items-center bg-white border border-gray-100 rounded-full p-1 sm:p-1.5 shadow-sm whitespace-nowrap">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0
                    ${activeTab === tab
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Product Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <LotCard
                key={`skeleton-${idx}`}
                image=""
                title=""
                condition=""
                units={0}
                pallets={0}
                msrp={0}
                price={0}
                location=""
                isLoading={true}
              />
            ))
          ) : lots.length > 0 ? (
            lots.map((lot) => (
              <LotCard
                key={lot.id}
                {...lot}
                isLoading={false}
              />
            ))
          ) : (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
              <SearchX className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No lots available</h3>
              <p className="text-gray-500 text-sm max-w-sm">No wholesale lot data was returned from the API (/api/lots/). Please check back later or try another tab.</p>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default PalletDeals;

