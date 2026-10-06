"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, PackageSearch } from 'lucide-react';
import { motion } from '../../lib/motion';
import ProductCard from '../../components/ProductCard';
import { catalogService, ProductItem } from '../../services/catalogService';

const TABS = ['Best Sellers', 'New Arrivals', 'Featured Deals'];

const CuratedProducts = () => {
  const [activeTab, setActiveTab] = useState('Best Sellers');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    catalogService.getProducts()
      .then((data) => {
        if (isMounted) {
          // Filter out lot items (display products not lots)
          const singleProducts = data.filter((item) => item.type !== 'lot');
          setProducts(singleProducts);
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
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Curated Marketplace Selection
          </div>

          <h2 className="h2 text-gray-900 tracking-tight mb-8">
            Verified Surplus Wholesale Products Ready to Quote
          </h2>

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
            products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isLoading={false}
              />
            ))
          ) : (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
              <PackageSearch className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-500 text-sm max-w-sm">No product data was returned from the API (/api/products/). Please check back later or add new products.</p>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default CuratedProducts;

