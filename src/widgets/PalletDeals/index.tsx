"use client";

import React, { useState, useEffect } from 'react';
import { Package, SearchX } from 'lucide-react';
import { motion } from '../../lib/motion';
import LotCard from '../../components/LotCard';
import { catalogService, LotItem } from '../../services/catalogService';

const TABS = ['View All', 'Electronics', 'Apparel', 'Home Goods'];

const PalletDeals = () => {
  const [activeTab, setActiveTab] = useState('View All');
  const [lots, setLots] = useState<LotItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    catalogService.getLots({ category: activeTab })
      .then((data) => {
        if (isMounted) {
          setLots(data);
          setLoading(false);
        }
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
            <Package className="w-3.5 h-3.5 mr-1.5" />
            Wholesale Liquidation
          </div>

          <h2 className="h2 text-gray-900 tracking-tight mb-4">
            Full Lots & Pallet Deals
          </h2>

          <p className="text-[15px] text-gray-600 max-w-2xl mb-8 leading-relaxed">
            Verified bulk pallet batches and container manifests at wholesale clearance pricing. All lots are pre-inspected and ready for fast freight dispatch.
          </p>

          {/* Tabs */}
          <div className="inline-flex items-center bg-white border border-gray-100 rounded-full p-1.5 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-medium transition-all
                  ${activeTab === tab
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
                `}
              >
                {tab}
              </button>
            ))}
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

