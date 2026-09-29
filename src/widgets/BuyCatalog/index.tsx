"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronRight, SearchX, 
  Hammer, Zap, Wrench, PenTool, HardHat, Drill, Lamp, Disc, Laptop, Paintbrush, Truck 
} from 'lucide-react';
import { motion } from '../../lib/motion';
import ProductCard from '../../components/ProductCard';

const CATEGORIES = [
  { name: 'All', icon: Search },
  { name: 'Building Materials', icon: Hammer },
  { name: 'Electricals', icon: Zap },
  { name: 'Hand tools', icon: Wrench },
  { name: 'Chisels And Drill bits', icon: PenTool },
  { name: 'PPE', icon: HardHat },
  { name: 'Power tools', icon: Drill },
  { name: 'Decor', icon: Lamp },
  { name: 'Abrasives', icon: Disc },
  { name: 'Lifting accessories', icon: Truck },
  { name: 'ICT', icon: Laptop },
  { name: 'Paints & accessories', icon: Paintbrush }
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80',
    category: 'CONSUMER ELECTRONICS',
    title: 'InnAIO AI Translator (Wearable/Clip-on AI Voice)',
    moq: 20,
    estQty: 500,
    price: 89.86,
    isCertified: true,
    isNew: true,
  },
  {
    id: 2,
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
    id: 3,
    image: 'https://images.unsplash.com/photo-1602874801007-bd458cb6c975?auto=format&fit=crop&w=600&q=80',
    category: 'DECOR',
    title: 'Soywax candle',
    moq: 20,
    estQty: 25000,
    price: 154224,
    isCertified: true,
    isNew: true,
  },
  {
    id: 4,
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
    id: 5,
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
    id: 6,
    image: 'https://images.unsplash.com/photo-1602874801007-bd458cb6c975?auto=format&fit=crop&w=600&q=80',
    category: 'DECOR',
    title: 'Please Do Not Disturb Sign',
    moq: 20,
    estQty: 25000,
    price: 2.10,
    isCertified: true,
    isNew: false,
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1618213837799-25d5552820d3?auto=format&fit=crop&w=600&q=80',
    category: 'DECOR',
    title: 'Tissue Box Cover',
    moq: 20,
    estQty: 450,
    price: 8.50,
    isCertified: true,
    isNew: false,
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1616422285623-13824f114674?auto=format&fit=crop&w=600&q=80',
    category: 'DECOR',
    title: 'Wooden Block Decor',
    moq: 20,
    estQty: 4000,
    price: 3.20,
    isCertified: true,
    isNew: false,
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80',
    category: 'CONSUMER ELECTRONICS',
    title: 'Smart LED Bulb',
    moq: 50,
    estQty: 2000,
    price: 12.50,
    isCertified: true,
    isNew: false,
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1602874801007-bd458cb6c975?auto=format&fit=crop&w=600&q=80',
    category: 'DECOR',
    title: 'Ceramic Vase Set',
    moq: 10,
    estQty: 300,
    price: 45.00,
    isCertified: true,
    isNew: false,
  },
];

const BuyCatalog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate data fetching delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-[#fdfcf9] min-h-screen pt-8 pb-20">
      
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-40 bg-[#fdfcf9]/95 backdrop-blur-md border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all">
        <div className="container mx-auto px-4 lg:px-8 max-w-[1600px] py-4">
          
          {/* Title & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 whitespace-nowrap">
              All Products
            </h1>
            
            <div className="relative flex-1 max-w-3xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search all products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-full text-gray-900 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_15px_-4px_rgba(0,0,0,0.08)]"
              />
            </div>
          </div>

          {/* Category Circles (Horizontal Scroll) */}
          <div className="flex items-start gap-4 overflow-x-auto pb-4 pt-1 -mx-4 px-4 md:mx-0 md:px-0">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category.name;
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className="flex flex-col items-center gap-2 group flex-shrink-0 w-20 cursor-pointer"
                >
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs border
                    ${isActive 
                      ? 'bg-[#0f3b2f] text-white border-[#0f3b2f] scale-105 shadow-md' 
                      : 'bg-white text-gray-600 border-gray-200 group-hover:border-[#0f3b2f]/30 group-hover:text-[#0f3b2f] group-hover:bg-gray-50'
                    }
                  `}>
                    <Icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <span className={`text-[12px] font-bold text-center leading-tight transition-colors ${isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 lg:px-8 max-w-[1600px] mt-8">
        
        {/* Results Count */}
        <div className="mb-6 text-[15px]">
          <span className="font-extrabold text-gray-900 text-lg">1,283</span> <span className="text-gray-500">products</span>
        </div>

        {/* Product Grid (5 columns on XXL) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xxl:grid-cols-5 gap-5"
        >
          {loading ? (
            Array.from({ length: 15 }).map((_, idx) => (
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
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
              <SearchX className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 text-sm max-w-sm">Try adjusting your search or category filters to find what you're looking for.</p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default BuyCatalog;
