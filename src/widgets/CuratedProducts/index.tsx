"use client";

import React, { useState } from 'react';
import { Sparkles, PackageSearch } from 'lucide-react';
import { motion } from '../../lib/motion';
import ProductCard from '../../components/ProductCard';

const MOCK_PRODUCTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80',
    category: 'MOBILE PHONE AND ACCESSORI...',
    title: 'Wireless earbuds (tws)',
    moq: 20,
    estQty: 1000,
    price: 6.60,
    isCertified: true,
    isNew: true,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1602874801007-bd458cb6c975?auto=format&fit=crop&w=600&q=80',
    category: 'DECOR',
    title: 'Soywax candle',
    moq: 20,
    estQty: 25000,
    price: 154224, // Assuming the image shows $154,224 or maybe a lot/pallet price
    isCertified: true,
    isNew: true,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1618213837799-25d5552820d3?auto=format&fit=crop&w=600&q=80',
    category: 'DECOR',
    title: 'Ashtray',
    moq: 20,
    estQty: 450,
    price: 4.20,
    isCertified: true,
    isNew: true,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1616422285623-13824f114674?auto=format&fit=crop&w=600&q=80',
    category: 'DECOR',
    title: 'Table Number / Signage',
    moq: 20,
    estQty: 4000,
    price: 0.63,
    isCertified: true,
    isNew: true,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80',
    category: 'MOBILE PHONE AND ACCESSORI...',
    title: 'Wireless earbuds (tws)',
    moq: 20,
    estQty: 1000,
    price: 6.60,
    isCertified: true,
    isNew: false,
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1602874801007-bd458cb6c975?auto=format&fit=crop&w=600&q=80',
    category: 'DECOR',
    title: 'Soywax candle',
    moq: 20,
    estQty: 25000,
    price: 154224,
    isCertified: true,
    isNew: false,
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1618213837799-25d5552820d3?auto=format&fit=crop&w=600&q=80',
    category: 'DECOR',
    title: 'Ashtray',
    moq: 20,
    estQty: 450,
    price: 4.20,
    isCertified: true,
    isNew: false,
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1616422285623-13824f114674?auto=format&fit=crop&w=600&q=80',
    category: 'DECOR',
    title: 'Table Number / Signage',
    moq: 20,
    estQty: 4000,
    price: 0.63,
    isCertified: true,
    isNew: false,
  },
];

const TABS = ['Best Sellers', 'New Arrivals', 'Featured Deals'];

const CuratedProducts = () => {
  const [activeTab, setActiveTab] = useState('Best Sellers');
  const [loading, setLoading] = useState(true);

  // Simulate data fetching delay to show shimmer skeleton
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
          ) : MOCK_PRODUCTS.length > 0 ? (
            MOCK_PRODUCTS.map((product) => (
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
              <p className="text-gray-500 text-sm max-w-sm">We couldn't find any products in this section right now. Please check back later or try a different category.</p>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default CuratedProducts;
