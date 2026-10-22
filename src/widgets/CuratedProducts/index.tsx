"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, PackageSearch, ArrowRight } from 'lucide-react';
import { motion } from '../../lib/motion';
import ProductCard from '../../components/ProductCard';
import { catalogService, ProductItem } from '../../services/catalogService';
import { useLanguage } from '../../context/LanguageContext';

const TABS = ['Best Sellers', 'New Arrivals', 'Featured Deals'];

const CuratedProducts = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('Best Sellers');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const cacheRef = useRef<Record<string, ProductItem[]>>({});

  useEffect(() => {
    let isMounted = true;
    const cacheKey = activeTab;

    // Check in-memory cache first for instant tab switching
    if (cacheRef.current[cacheKey]) {
      setProducts(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const collectionParam = 
      activeTab === 'Best Sellers' ? 'best_selling' :
      activeTab === 'New Arrivals' ? 'new_arrivals' :
      'featured';

    catalogService.getProducts({ collection: collectionParam })
      .then((data) => {
        if (isMounted) {
          // Filter out lot items (display single products only)
          let singleProducts = data.filter((item) => item.type !== 'lot');

          // Strict curation filtering based on selected tab flag
          if (activeTab === 'Best Sellers') {
            const best = singleProducts.filter(item => item.isBestSelling);
            if (best.length > 0) singleProducts = best;
          } else if (activeTab === 'New Arrivals') {
            const newArr = singleProducts.filter(item => item.isNewArrival);
            if (newArr.length > 0) singleProducts = newArr;
          } else if (activeTab === 'Featured Deals') {
            const feat = singleProducts.filter(item => item.isFeatured);
            if (feat.length > 0) singleProducts = feat;
          }

          // Limit to maximum 8 items per tab
          const curatedList = singleProducts.slice(0, 8);
          cacheRef.current[cacheKey] = curatedList;
          setProducts(curatedList);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('[CuratedProducts] API fetch error:', err);
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  return (
    <section className="w-full bg-[#fdfcf9] pt-20 pb-12 border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

        {/* Header Area */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="flex items-center text-primary-alt font-bold text-xs tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
            {t('curated.badge', 'Curated Marketplace Selection')}
          </div>

          <h2 className="h2 text-gray-900 tracking-tight mb-8">
            {t('curated.title', 'Verified Surplus Wholesale Products Ready to Quote')}
          </h2>

          {/* Tabs */}
          <div className="inline-flex items-center bg-white border border-gray-100 rounded-full p-1.5 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer
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
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <ProductCard
                key={`skeleton-${idx}`}
                image=""
                category=""
                title=""
                moq={0}
                estQty={0}
                price={0}
                isLoading={true}
              />
            ))
          ) : products.length > 0 ? (
            products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isLoading={false}
              />
            ))
          ) : (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
              <PackageSearch className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab.toLowerCase()} found</h3>
              <p className="text-gray-500 text-sm max-w-sm">No products currently match this curation filter. Please check back later or explore our full marketplace catalog.</p>
            </div>
          )}
        </motion.div>

        {/* View All Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/buy"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
          >
            <span>{t('curated.viewAll', 'View All Inventory')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default CuratedProducts;

