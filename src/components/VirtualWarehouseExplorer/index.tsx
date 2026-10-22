"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Layers,
  Boxes,
  DollarSign,
  TrendingDown,
  Sparkles,
  Search,
  X,
  FileSpreadsheet,
  Download,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Tag,
  Check,
  AlertCircle,
  Loader2,
  Filter,
  ArrowUpDown,
  ListFilter
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import {
  WarehouseExplorerResponse,
  SKUItem,
  BrandAllocation,
  getLotWarehouseExplorer,
  buildClientWarehouseExplorer,
} from '../../services/lotService';

interface VirtualWarehouseExplorerProps {
  lotId: string | number;
  initialLot?: any;
  currency?: string;
  className?: string;
}

const ITEMS_PER_PAGE = 15;

const BRAND_PALETTE = [
  '#0a5c48', // Surplus Emerald
  '#2563eb', // Blue
  '#7c3aed', // Purple
  '#d97706', // Amber
  '#0891b2', // Cyan
  '#e11d48', // Rose
  '#059669', // Emerald
  '#475569', // Slate
];

export default function VirtualWarehouseExplorer({
  lotId,
  initialLot,
  currency: propCurrency,
  className = '',
}: VirtualWarehouseExplorerProps) {
  const { formatPrice } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<WarehouseExplorerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<
    'line_value_desc' | 'msrp_desc' | 'qty_desc' | 'name_asc' | 'sheet_order'
  >('line_value_desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Load Virtual Warehouse Explorer data
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const rawFallback = initialLot?.products || initialLot?.manifest_data || initialLot?.manifest_items || [];
    const meta = {
      title: initialLot?.title,
      lot_number: initialLot?.lot_number,
      currency: propCurrency || initialLot?.currency || 'USD',
      price: Number(initialLot?.price || 0),
      msrp: Number(initialLot?.msrp || 0),
    };

    getLotWarehouseExplorer(lotId, rawFallback, meta)
      .then((res) => {
        if (!isCancelled) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.warn('[VirtualWarehouseExplorer] Fetch error, building local explorer:', err);
          if (rawFallback.length > 0) {
            setData(buildClientWarehouseExplorer(rawFallback, meta));
          } else {
            setError('Could not load inventory explorer for this lot.');
          }
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [lotId, initialLot, propCurrency]);

  const currencyCode = propCurrency || data?.currency || initialLot?.currency || 'USD';
  const allItems = useMemo(() => data?.items || [], [data]);
  const summary = data?.summary;
  const brandBreakdown = useMemo(() => data?.brand_breakdown || [], [data]);
  const profitDrivers = useMemo(() => data?.top_profit_drivers || [], [data]);

  // Extract distinct categories
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    allItems.forEach((item) => {
      if (item.product_category && item.product_category.trim()) {
        set.add(item.product_category.trim());
      }
    });
    return Array.from(set).sort();
  }, [allItems]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    let result = [...allItems];

    // Brand Filter
    if (selectedBrand !== 'All') {
      result = result.filter(
        (item) => (item.brand || 'Unspecified').toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (item) => (item.product_category || 'General Surplus').toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Text Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((item) => {
        const name = (item.product_name || '').toLowerCase();
        const part = (item.model_part_number || '').toLowerCase();
        const brand = (item.brand || '').toLowerCase();
        const cat = (item.product_category || '').toLowerCase();
        const sub = (item.subcategory || '').toLowerCase();
        const desc = (item.product_description || '').toLowerCase();
        return name.includes(q) || part.includes(q) || brand.includes(q) || cat.includes(q) || sub.includes(q) || desc.includes(q);
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'line_value_desc':
          return (b.line_msrp || 0) - (a.line_msrp || 0);
        case 'msrp_desc':
          return (b.original_price || 0) - (a.original_price || 0);
        case 'qty_desc':
          return (b.available_quantity || 0) - (a.available_quantity || 0);
        case 'name_asc':
          return (a.product_name || '').localeCompare(b.product_name || '');
        case 'sheet_order':
        default:
          return Number(a.s_no || 0) - Number(b.s_no || 0);
      }
    });

    return result;
  }, [allItems, selectedBrand, selectedCategory, searchTerm, sortBy]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBrand, selectedCategory, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  // Client-Side CSV Export
  const handleExportCsv = () => {
    if (filteredItems.length === 0) return;

    const headers = [
      'Line #',
      'Product Name',
      'Brand',
      'Model / Part Number',
      'Category',
      'Subcategory',
      'Available Qty',
      'Unit Asking Price',
      'Unit MSRP',
      'Total Line MSRP',
      'Total Line Asking',
      'Country of Origin',
      'Year of Manufacture',
      'Condition / Status',
      'Warehouse Bay / Tag',
      'Datasheet URL'
    ];

    const escapeCsv = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredItems.map((item) => [
      item.s_no,
      escapeCsv(item.product_name),
      escapeCsv(item.brand),
      escapeCsv(item.model_part_number),
      escapeCsv(item.product_category),
      escapeCsv(item.subcategory),
      item.available_quantity,
      item.asking_price || 0,
      item.original_price || 0,
      item.line_msrp || 0,
      item.line_ask || 0,
      escapeCsv(item.country_of_origin),
      escapeCsv(item.year_of_manufacture),
      escapeCsv(item.tested_and_verified || item.functional_status || 'Visual Inspection'),
      escapeCsv(item.seller_custom_field_1),
      escapeCsv(item.datasheet_certificate_link)
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanLotNumber = String(data?.lot_number || lotId).replace(/[^a-zA-Z0-9_-]/g, '_');
    link.setAttribute('download', `Lot_${cleanLotNumber}_warehouse_manifest.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-pulse ${className}`}>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="space-y-2">
            <div className="h-6 w-64 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-96 bg-gray-100 rounded"></div>
          </div>
          <div className="h-10 w-36 bg-gray-200 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-50 rounded-2xl"></div>
      </div>
    );
  }

  if (error || !summary || allItems.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 overflow-hidden ${className}`}>
      
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#0a5c48] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#14b875]" />
              Virtual Warehouse Explorer
            </span>
            <span className="bg-gray-100 text-gray-700 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full">
              60 FPS SKU Grid
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Itemized Manifest & Valuation Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
            Full item-level ledger with unit MSRP values, brand allocations, verified quantities, serial tags, and manufacturer datasheets.
          </p>
        </div>

        {/* Global Action: Export Clean CSV */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredItems.length === 0}
            className="py-2.5 px-4 bg-[#0a5c48] hover:bg-[#084838] disabled:bg-gray-200 text-white rounded-full font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
            title="Download complete filtered inventory table to Excel / CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export Filtered CSV ({filteredItems.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Executive Valuation KPI Bar (Inventory Metric Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Distinct SKUs */}
        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Distinct SKUs</span>
            <Layers className="w-4 h-4 text-[#0f7a61]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {summary.total_skus.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 font-medium mt-1">
            Across {summary.total_categories} {summary.total_categories === 1 ? 'category' : 'categories'}
          </div>
        </div>

        {/* Card 2: Total Physical Units */}
        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Physical Units</span>
            <Boxes className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {summary.total_units.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 font-medium mt-1">
            Verified manifest count
          </div>
        </div>

        {/* Card 3: Total Brands */}
        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Total Brands</span>
            <Tag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {summary.total_brands || brandBreakdown.length || 1}
          </div>
          <div className="text-[10px] text-gray-500 font-medium mt-1">
            Verified manufacturers
          </div>
        </div>

        {/* Card 4: Categories */}
        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Categories</span>
            <ListFilter className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {summary.total_categories || categoriesList.length || 1}
          </div>
          <div className="text-[10px] text-gray-500 font-medium mt-1">
            Product classifications
          </div>
        </div>
      </div>

      {/* 3. Interactive Brand Allocation Section */}
      {brandBreakdown.length > 0 && (
        <div className="space-y-3 bg-[#f8faf9] p-4 sm:p-5 rounded-2xl border border-emerald-100">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-gray-800">
                Brand Allocation & Value Share
              </span>
              <span className="text-xs text-gray-500 font-medium">
                (Click brand to filter grid instantly)
              </span>
            </div>
            {selectedBrand !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedBrand('All')}
                className="text-xs font-bold text-[#0a5c48] hover:underline cursor-pointer"
              >
                Reset to All Brands
              </button>
            )}
          </div>

          {/* Segmented Brand Value Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
            {brandBreakdown.map((brand, idx) => {
              const color = BRAND_PALETTE[idx % BRAND_PALETTE.length];
              const pct = Math.max(2, brand.pct_of_value);
              return (
                <div
                  key={brand.brand}
                  style={{ width: `${pct}%`, backgroundColor: color }}
                  className="h-full transition-all hover:opacity-80 cursor-pointer"
                  title={`${brand.brand}: ${brand.pct_of_value}% of value (${brand.units} units)`}
                  onClick={() => setSelectedBrand(brand.brand)}
                />
              );
            })}
          </div>

          {/* Brand Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedBrand('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedBrand === 'All'
                  ? 'bg-[#0a5c48] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              All Brands ({summary.total_skus})
            </button>

            {brandBreakdown.map((brand, idx) => {
              const isSelected = selectedBrand.toLowerCase() === brand.brand.toLowerCase();
              return (
                <button
                  type="button"
                  key={brand.brand}
                  onClick={() => setSelectedBrand(brand.brand)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0a5c48] text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: BRAND_PALETTE[idx % BRAND_PALETTE.length] }}
                  />
                  <span>{brand.brand}</span>
                  <span className={isSelected ? 'text-emerald-200' : 'text-gray-400'}>
                    {brand.pct_of_value}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Top Profit Drivers Spotlight */}
      {profitDrivers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900">
              Top Profit Drivers Spotlight (High-Value Anchor SKUs)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {profitDrivers.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 hover:border-[#0a5c48]/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0a5c48] bg-emerald-50 px-2 py-0.5 rounded">
                      {item.brand || 'Anchor'}
                    </span>
                    <span className="font-mono text-[10px] text-gray-500 font-bold">
                      {item.available_quantity} units
                    </span>
                  </div>

                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-[#0a5c48] transition-colors" title={item.product_name}>
                    {item.product_name}
                  </h4>

                  {item.model_part_number && (
                    <div className="font-mono text-[10px] text-gray-400 mt-1 truncate">
                      P/N: <span className="text-gray-700 font-semibold">{item.model_part_number}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[9px] text-gray-400 block font-bold uppercase">Unit MSRP</span>
                    <span className="text-xs font-semibold text-gray-600">
                      {formatPrice(item.original_price || item.asking_price || 0, currencyCode)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-emerald-700 block font-bold uppercase">Line Value</span>
                    <span className="text-sm font-black text-gray-900">
                      {formatPrice(item.line_msrp || 0, currencyCode)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Real-Time SKU Filter & Sort Toolbar */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by product name, part #, brand, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f7a61]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls: Category Dropdown + Sort Dropdown */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            
            {/* Category Dropdown */}
            {categoriesList.length > 1 && (
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f7a61]"
                >
                  <option value="All">All Categories ({categoriesList.length})</option>
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-semibold hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f7a61]"
              >
                <option value="line_value_desc">💎 Line Value (High to Low)</option>
                <option value="msrp_desc">💵 Unit MSRP (High to Low)</option>
                <option value="qty_desc">📦 Quantity (High to Low)</option>
                <option value="name_asc">🔤 Product Name (A–Z)</option>
                <option value="sheet_order">📄 Original Sheet Order (#)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {(selectedBrand !== 'All' || selectedCategory !== 'All' || searchTerm.trim()) && (
          <div className="flex items-center gap-2 text-xs text-gray-600 pt-1 flex-wrap">
            <span className="font-bold">Active Filters:</span>
            {selectedBrand !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-emerald-100/70 text-[#0a5c48] px-2.5 py-0.5 rounded-full font-bold">
                Brand: {selectedBrand}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBrand('All')} />
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-emerald-100/70 text-[#0a5c48] px-2.5 py-0.5 rounded-full font-bold">
                Category: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
              </span>
            )}
            {searchTerm.trim() && (
              <span className="inline-flex items-center gap-1 bg-emerald-100/70 text-[#0a5c48] px-2.5 py-0.5 rounded-full font-bold">
                &quot;{searchTerm.trim()}&quot;
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSelectedBrand('All');
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="text-[#0a5c48] font-bold hover:underline cursor-pointer ml-1"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* 6. High-Performance Paginated SKU Table (60 FPS) */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-[#f8faf9] border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="py-3 px-3 text-xs font-bold uppercase tracking-wider text-center w-[50px]">#</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider min-w-[280px]">Product Name</th>
                  <th className="py-3 px-3 text-xs font-bold uppercase tracking-wider min-w-[120px]">Brand</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider min-w-[140px]">Model / Part #</th>
                  <th className="py-3 px-3 text-xs font-bold uppercase tracking-wider text-center min-w-[90px]">Qty</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-right min-w-[120px]">Unit MSRP</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-right min-w-[130px]">Line MSRP</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider min-w-[140px]">Condition / Spec</th>
                  <th className="py-3 px-3 text-xs font-bold uppercase tracking-wider text-center min-w-[80px]">Doc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800 text-xs sm:text-sm">
                {paginatedItems.map((item, idx) => {
                  const lineIndex = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                  const verified = Boolean(
                    item.tested_and_verified === 'Yes' || 
                    item.functional_status === 'Yes' || 
                    item.functional_status?.toLowerCase().includes('tested')
                  );
                  const docLink = item.datasheet_certificate_link && 
                    item.datasheet_certificate_link !== '-' && 
                    !item.datasheet_certificate_link.includes('link removed') 
                    ? item.datasheet_certificate_link 
                    : null;

                  return (
                    <tr key={`${item.s_no}-${idx}`} className="hover:bg-emerald-50/30 transition-colors">
                      {/* S.No */}
                      <td className="py-3 px-3 text-xs font-mono text-gray-400 text-center">
                        {item.s_no || lineIndex}
                      </td>

                      {/* Product Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900 leading-snug line-clamp-2" title={item.product_name}>
                          {item.product_name}
                        </div>
                        {item.product_category && (
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {item.product_category} {item.subcategory ? `• ${item.subcategory}` : ''}
                          </div>
                        )}
                      </td>

                      {/* Brand */}
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-900">
                          {item.brand || '—'}
                        </span>
                      </td>

                      {/* Model / Part # */}
                      <td className="py-3 px-4 font-mono text-xs text-gray-700">
                        {item.model_part_number ? (
                          <span className="font-semibold text-gray-900 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                            {item.model_part_number}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Qty */}
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block bg-emerald-50 border border-emerald-200 text-[#0a5c48] px-2.5 py-0.5 rounded-full text-xs font-black">
                          {item.available_quantity.toLocaleString()}
                        </span>
                      </td>

                      {/* Unit MSRP */}
                      <td className="py-3 px-4 text-right font-medium text-gray-600">
                        {formatPrice(item.original_price || item.asking_price || 0, currencyCode)}
                      </td>

                      {/* Total Line MSRP */}
                      <td className="py-3 px-4 text-right font-black text-gray-900">
                        {formatPrice(item.line_msrp || 0, currencyCode)}
                      </td>

                      {/* Condition / Verification */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-0.5">
                          {verified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                              Tested & Verified
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-500 font-medium">
                              Visual Inspection
                            </span>
                          )}
                          {item.country_of_origin && (
                            <span className="text-[10px] text-gray-400">
                              Origin: {item.country_of_origin}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Datasheet Link */}
                      <td className="py-3 px-3 text-center">
                        {docLink ? (
                          <a
                            href={docLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#0a5c48] hover:text-[#084838] font-bold text-xs underline"
                            title="Open manufacturer technical datasheet"
                          >
                            <span>Doc</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
            <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-gray-700">No SKUs match the active search or filters</h4>
            <p className="text-xs text-gray-500 mt-1">Try relaxing your keyword search or selected brand.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedBrand('All');
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="mt-3 px-4 py-1.5 bg-[#0a5c48] text-white rounded-full text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination & Summary Bar */}
        {filteredItems.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-gray-500">
            <div>
              Showing{' '}
              <strong className="text-gray-900">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-gray-900">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)}
              </strong>{' '}
              of <strong className="text-gray-900">{filteredItems.length}</strong> filtered SKUs (from{' '}
              {summary.total_skus} total)
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 cursor-pointer"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, pIdx) => {
                    const pageNum = pIdx + 1;
                    // Show current, first, last, and neighboring pages
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          type="button"
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-[#0a5c48] text-white'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (
                      (pageNum === 2 && currentPage > 3) ||
                      (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={pageNum} className="px-1 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p - 1 + 2))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 cursor-pointer"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
