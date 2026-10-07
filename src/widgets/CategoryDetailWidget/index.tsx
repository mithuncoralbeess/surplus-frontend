"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, SearchX, ShieldCheck, Layers, ArrowLeft, Filter, Sparkles } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { useAppSelector } from '../../store';
import { catalogService, ProductItem } from '../../services/catalogService';

interface CategoryDetailWidgetProps {
  categorySlug: string;
}


export default function CategoryDetailWidget({ categorySlug }: CategoryDetailWidgetProps) {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [apiProducts, setApiProducts] = useState<ProductItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  // Read categories from Redux store
  const { categories } = useAppSelector((state) => state.categories);

  // Normalize slug for matching
  const normalizedSlug = (categorySlug || '').toLowerCase().trim();

  // Find active category from store or matching name/slug
  const currentCategory = useMemo(() => {
    if (!categories || categories.length === 0) return null;

    return categories.find((cat) => {
      const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return slug === normalizedSlug || cat.name.toLowerCase() === normalizedSlug.replace(/-/g, ' ');
    }) || categories[0];
  }, [categories, normalizedSlug]);

  const categoryTitle = currentCategory ? currentCategory.name : categorySlug.replace(/-/g, ' ').toUpperCase();

  // Fetch products from /api/products/
  useEffect(() => {
    let isMounted = true;
    setLoadingProducts(true);

    catalogService.getProducts({ category: categoryTitle, search: searchQuery })
      .then((data) => {
        if (isMounted) {
          const productsOnly = data.filter((item) => item.type !== 'lot');
          setApiProducts(productsOnly);
          setLoadingProducts(false);
        }
      })
      .catch((err) => {
        console.warn('[CategoryDetailWidget] API fetch error:', err);
        if (isMounted) {
          setApiProducts([]);
          setLoadingProducts(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [categoryTitle, searchQuery]);

  // Extract subcategories array
  const subCategoriesList = useMemo(() => {
    if (!currentCategory) return [];
    const subs = currentCategory.subcategories || currentCategory.sub_categories || [];
    return subs.map((s: any) => typeof s === 'string' ? s : s.name);
  }, [currentCategory]);

  // Filter products for this subcategory
  const filteredProducts = useMemo(() => {
    return apiProducts.filter((prod) => {
      if (selectedSubCategory !== 'all' && prod.category?.toLowerCase() !== selectedSubCategory.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [apiProducts, selectedSubCategory]);

  return (
    <div className="w-full bg-[#f8faf9] min-h-screen py-10 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* Navigation Breadcrumb & Title */}
        <div className="mb-8">
          <Link
            href="/shop-by-category"
            className="inline-flex items-center text-xs font-bold text-[#0f7a61] hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to All Categories
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-[#e6f7ef] text-[#0f7a61] text-xs font-bold px-3 py-1 rounded-full mb-2 border border-[#0f7a61]/20">
                <Sparkles className="w-3.5 h-3.5" /> Certified Inventory
              </span>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight capitalize">
                {categoryTitle}
              </h1>
            </div>

            {/* Search Bar Input */}
            <div className="relative w-full md:w-[360px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4 text-[#0f7a61]" />
              </div>
              <input
                type="text"
                placeholder={`Search in ${categoryTitle}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f7a61]/20 focus:border-[#0f7a61] transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Subcategories Pills Row */}
        {subCategoriesList.length > 0 && (
          <div className="mb-10 bg-white p-4 rounded-3xl border border-gray-200/80 shadow-2xs">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 px-1">
              <Filter className="w-3.5 h-3.5 text-[#0f7a61]" /> Filter by Subcategory:
            </div>
            
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-200">
              <button
                onClick={() => setSelectedSubCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedSubCategory === 'all'
                    ? 'bg-[#0f7a61] text-white border-[#0f7a61] shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#0f7a61]/40 hover:bg-[#e6f7ef]/50 hover:text-[#0f7a61]'
                }`}
              >
                All Subcategories ({subCategoriesList.length})
              </button>

              {subCategoriesList.map((subName: string, idx: number) => {
                const isActive = selectedSubCategory.toLowerCase() === subName.toLowerCase();
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedSubCategory(isActive ? 'all' : subName)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-[#0f7a61] text-white border-[#0f7a61] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#0f7a61]/40 hover:bg-[#e6f7ef]/50 hover:text-[#0f7a61]'
                    }`}
                  >
                    {subName}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Products Grid Below Subcategories Pills Row */}
        <div className="space-y-6">
          <div className="flex justify-between items-center text-sm">
            <span className="font-extrabold text-gray-900 text-lg">
              {filteredProducts.length} <span className="text-gray-500 font-normal text-base">products found</span>
            </span>
            {selectedSubCategory !== 'all' && (
              <button
                onClick={() => setSelectedSubCategory('all')}
                className="text-xs font-bold text-[#0f7a61] hover:underline"
              >
                Clear Subcategory Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingProducts ? (
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
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  isLoading={false}
                />
              ))
            ) : (
              <div className="col-span-full py-20 bg-white rounded-3xl border border-gray-200 text-center p-8 shadow-xs">
                <SearchX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No products available</h3>
                <p className="text-gray-500 text-sm mb-4">
                  No product data was returned from the API (/api/products/) for this section.
                </p>
                <button
                  onClick={() => {
                    setSelectedSubCategory('all');
                    setSearchQuery('');
                  }}
                  className="bg-[#0f7a61] text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-[#0c6651]"
                >
                  Clear Search Filters
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

