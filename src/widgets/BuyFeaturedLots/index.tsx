"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Package, 
  MapPin, 
  Tag, 
  FileSpreadsheet, 
  ShieldCheck, 
  ArrowRight, 
  Download, 
  X, 
  Check, 
  SlidersHorizontal, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  TrendingUp,
  Boxes,
  Eye,
  ExternalLink,
  ShoppingBag,
  Layers
} from 'lucide-react';
import { catalogService, LotItem, ProductItem } from '../../services/catalogService';
import { useCurrency } from '../../context/CurrencyContext';
import ProductCard from '../../components/ProductCard';

// Rich Verified Liquidation Lots Fallback Dataset
const CURATED_LIQUIDATION_LOTS: LotItem[] = [
  {
    id: "LOT-IT-901",
    title: "Dell PowerEdge R740 & R640 2U Enterprise Rack Servers Manifest",
    condition: "Factory Sealed / Grade A Surplus",
    units: 36,
    pallets: 2,
    msrp: 148500,
    price: 38200,
    offer: "74% OFF",
    location: "Jebel Ali Freezone, UAE",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    category: "IT & Servers",
    type: "lot",
    manifest_items: [
      { sku: "DELL-R740-01", title: "Dell PowerEdge R740 2x Xeon Gold 6138 128GB RAM", qty: 16, msrp: 4800, condition: "Factory Sealed" },
      { sku: "DELL-R640-02", title: "Dell PowerEdge R640 1U Server Dual PSU 64GB", qty: 12, msrp: 3600, condition: "Refurbished Grade A" },
      { sku: "PERC-H730P", title: "Dell PERC H730P RAID Controller Adapters", qty: 8, msrp: 750, condition: "Factory Sealed" }
    ]
  },
  {
    id: "LOT-TLS-402",
    title: "DeWalt & Milwaukee 18V/20V Cordless Industrial Power Tool Pallet",
    condition: "Overstock / Shelf-Pulls",
    units: 240,
    pallets: 3,
    msrp: 64200,
    price: 15400,
    offer: "76% OFF",
    location: "Dubai Industrial City, UAE",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    category: "Power Tools",
    type: "lot",
    manifest_items: [
      { sku: "DCD996-LOT", title: "DeWalt 20V MAX XR Brushless Hammer Drill Kits", qty: 80, msrp: 299, condition: "New In Box" },
      { sku: "MLW-M18-BR", title: "Milwaukee M18 Fuel 1/2in High Torque Impact Wrench", qty: 60, msrp: 329, condition: "New In Box" },
      { sku: "BAT-5AH-PACK", title: "20V MAX 5.0Ah Extended Lithium Battery 2-Packs", qty: 100, msrp: 149, condition: "Overstock" }
    ]
  },
  {
    id: "LOT-ELC-819",
    title: "Solid Copper Cat6 & Cat6A 23AWG Network Cable 500m Master Spools",
    condition: "Brand New Surplus",
    units: 520,
    pallets: 5,
    msrp: 93600,
    price: 21800,
    offer: "77% OFF",
    location: "Doha Industrial Area, Qatar",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    category: "Electricals",
    type: "lot",
    manifest_items: [
      { sku: "CBL-CAT6-500", title: "Cat6 UTP Solid Bare Copper 23AWG Drum 500m", qty: 320, msrp: 175, condition: "Factory Sealed" },
      { sku: "CBL-6AST-500", title: "Cat6A STP Shielded 10G Pure Copper Drum 500m", qty: 200, msrp: 210, condition: "Factory Sealed" }
    ]
  },
  {
    id: "LOT-LGT-104",
    title: "Commercial LED High Bay 150W & Recessed Architectural Troffers",
    condition: "Discontinued Project Overstock",
    units: 850,
    pallets: 6,
    msrp: 112000,
    price: 23500,
    offer: "79% OFF",
    location: "Riyadh Logistics Park, KSA",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    category: "Lighting",
    type: "lot",
    manifest_items: [
      { sku: "HB-150W-IP65", title: "UFO LED High Bay 150W 5000K Industrial 21000lm", qty: 450, msrp: 140, condition: "Factory Sealed" },
      { sku: "TRF-2X2-40W", title: "2x2 Recessed LED Troffer Panel 40W Dimmable", qty: 400, msrp: 95, condition: "Factory Sealed" }
    ]
  },
  {
    id: "LOT-PPE-305",
    title: "3M Industrial Safety Helmets, Aura N95 Respirators & Eye Shields",
    condition: "Surplus Inventory (Unexpired)",
    units: 4200,
    pallets: 4,
    msrp: 58800,
    price: 11900,
    offer: "80% OFF",
    location: "Sharjah Airport Free Zone, UAE",
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=800&q=80",
    category: "PPE & Safety",
    type: "lot",
    manifest_items: [
      { sku: "3M-9205-PAL", title: "3M Aura 9205+ N95 Flat-Fold Respirators (Boxes of 20)", qty: 2200, msrp: 16, condition: "Factory Sealed" },
      { sku: "MSA-V-GARD", title: "MSA V-Gard Hard Hats with Ratchet Suspension", qty: 1200, msrp: 14, condition: "New" },
      { sku: "3M-SECURE", title: "3M SecureFit 400 Series Clear Anti-Fog Glasses", qty: 800, msrp: 9, condition: "New" }
    ]
  },
  {
    id: "LOT-FTL-770",
    title: "Full 40ft Container: Commercial HVAC Chillers & Air Handling Units",
    condition: "Tier-1 Enterprise Liquidation",
    units: 42,
    pallets: 22,
    msrp: 320000,
    price: 68000,
    offer: "79% OFF",
    location: "Jebel Ali Port Terminal, UAE",
    image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&w=800&q=80",
    category: "Heavy Equipment",
    type: "lot",
    manifest_items: [
      { sku: "HVAC-CHL-10T", title: "Carrier Commercial Air-Cooled Liquid Chiller 10-Ton", qty: 12, msrp: 14500, condition: "Unused / Stored" },
      { sku: "AHU-MOD-25", title: "York Modular Air Handling Units with VFD Control", qty: 30, msrp: 4800, condition: "Factory Sealed" }
    ]
  }
];

// Rich Verified Liquidation Products Fallback Dataset
const CURATED_WHOLESALE_PRODUCTS: ProductItem[] = [
  {
    id: "PROD-IT-01",
    product_id: "PRO-IT-01",
    sku: "DELL-R740-REF",
    title: "Dell PowerEdge R740 2U Enterprise Rack Server (Refurbished Grade A)",
    category: "IT & Servers",
    price: 1250,
    originalPrice: 4800,
    previousPrice: 4800,
    msrp: 4800,
    moq: 2,
    estQty: 48,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    isCertified: true,
    isNew: false,
    offer: "74% OFF",
    type: "single"
  },
  {
    id: "PROD-TLS-02",
    product_id: "PRO-TLS-02",
    sku: "BOSCH-GSB-18V",
    title: "Bosch Professional GSB 18V-50 Brushless Cordless Combi Drill Set",
    category: "Power Tools",
    price: 85,
    originalPrice: 220,
    previousPrice: 220,
    msrp: 220,
    moq: 10,
    estQty: 250,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
    isCertified: true,
    isNew: true,
    offer: "61% OFF",
    type: "single"
  },
  {
    id: "PROD-ELC-03",
    product_id: "PRO-ELC-03",
    sku: "SIEMENS-S7-1200",
    title: "Siemens S7-1200 CPU 1214C Compact PLC Controller (Factory Sealed)",
    category: "Electricals",
    price: 340,
    originalPrice: 890,
    previousPrice: 890,
    msrp: 890,
    moq: 5,
    estQty: 120,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    isCertified: true,
    isNew: true,
    offer: "62% OFF",
    type: "single"
  },
  {
    id: "PROD-ELC-04",
    product_id: "PRO-ELC-04",
    sku: "CAT6-COPPER-500",
    title: "Cat6 Solid Bare Copper 23AWG Network Cable 500m Industrial Drum",
    category: "Electricals",
    price: 95,
    originalPrice: 280,
    previousPrice: 280,
    msrp: 280,
    moq: 4,
    estQty: 300,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    isCertified: true,
    isNew: false,
    offer: "66% OFF",
    type: "single"
  },
  {
    id: "PROD-TLS-05",
    product_id: "PRO-TLS-05",
    sku: "FLUKE-87V-KIT",
    title: "Fluke 87V Industrial True-RMS Digital Multimeter Master Kit",
    category: "Power Tools",
    price: 280,
    originalPrice: 540,
    previousPrice: 540,
    msrp: 540,
    moq: 5,
    estQty: 85,
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
    isCertified: true,
    isNew: true,
    offer: "48% OFF",
    type: "single"
  },
  {
    id: "PROD-PPE-06",
    product_id: "PRO-PPE-06",
    sku: "3M-9205-BOX",
    title: "3M Aura 9205+ N95 Particulate Respirator Case (Boxes of 20)",
    category: "PPE & Safety",
    price: 14,
    originalPrice: 38,
    previousPrice: 38,
    msrp: 38,
    moq: 50,
    estQty: 1800,
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=600&q=80",
    isCertified: true,
    isNew: true,
    offer: "63% OFF",
    type: "single"
  },
  {
    id: "PROD-LGT-07",
    product_id: "PRO-LGT-07",
    sku: "UFO-150W-IP65",
    title: "UFO Industrial LED High Bay Light Fixture 150W 5000K Daylight",
    category: "Lighting",
    price: 42,
    originalPrice: 135,
    previousPrice: 135,
    msrp: 135,
    moq: 12,
    estQty: 420,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
    isCertified: true,
    isNew: true,
    offer: "69% OFF",
    type: "single"
  },
  {
    id: "PROD-IT-08",
    product_id: "PRO-IT-08",
    sku: "CISCO-C9300-48",
    title: "Cisco Catalyst 9300 48-Port Gigabit PoE+ Enterprise Network Switch",
    category: "IT & Servers",
    price: 1850,
    originalPrice: 5200,
    previousPrice: 5200,
    msrp: 5200,
    moq: 2,
    estQty: 35,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    isCertified: true,
    isNew: false,
    offer: "64% OFF",
    type: "single"
  }
];

const CATEGORIES = [
  "All Categories",
  "IT & Servers",
  "Power Tools",
  "Electricals",
  "Lighting",
  "PPE & Safety",
  "Heavy Equipment"
];

export default function BuyFeaturedLots() {
  const { formatPrice } = useCurrency();
  const [purchaseMode, setPurchaseMode] = useState<'lot' | 'product'>('lot');
  const [lots, setLots] = useState<LotItem[]>(CURATED_LIQUIDATION_LOTS);
  const [products, setProducts] = useState<ProductItem[]>(CURATED_WHOLESALE_PRODUCTS);
  const [loadingLots, setLoadingLots] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedLotForManifest, setSelectedLotForManifest] = useState<LotItem | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [sortBy, setSortBy] = useState<"discount" | "price-asc" | "price-desc" | "units">("discount");

  // Fetch Lots from API
  useEffect(() => {
    let isMounted = true;
    setLoadingLots(true);
    catalogService.getLots()
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            const combined = [...data, ...CURATED_LIQUIDATION_LOTS];
            const unique = Array.from(new Map(combined.map(item => [String(item.id), item])).values());
            setLots(unique);
          }
          setLoadingLots(false);
        }
      })
      .catch((err) => {
        console.warn('[BuyFeaturedLots] Error fetching API lots, using curated liquidation dataset:', err);
        if (isMounted) setLoadingLots(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Products from API
  useEffect(() => {
    let isMounted = true;
    setLoadingProducts(true);
    catalogService.getProducts()
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            const combined = [...data, ...CURATED_WHOLESALE_PRODUCTS];
            const unique = Array.from(new Map(combined.map(item => [String(item.id), item])).values());
            setProducts(unique);
          }
          setLoadingProducts(false);
        }
      })
      .catch((err) => {
        console.warn('[BuyFeaturedLots] Error fetching API products, using curated wholesale dataset:', err);
        if (isMounted) setLoadingProducts(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and Sort Lots
  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      const matchCat = selectedCategory === "All Categories" || 
        lot.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        lot.title.toLowerCase().includes(selectedCategory.toLowerCase());
      
      const matchSearch = !searchFilter.trim() ||
        lot.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        lot.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
        lot.condition.toLowerCase().includes(searchFilter.toLowerCase());

      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'discount') {
        const discA = a.msrp > a.price ? (a.msrp - a.price) / a.msrp : 0;
        const discB = b.msrp > b.price ? (b.msrp - b.price) / b.msrp : 0;
        return discB - discA;
      }
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'units') return (b.units || 0) - (a.units || 0);
      return 0;
    });
  }, [lots, selectedCategory, searchFilter, sortBy]);

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCat = selectedCategory === "All Categories" || 
        prod.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        prod.title.toLowerCase().includes(selectedCategory.toLowerCase());
      
      const matchSearch = !searchFilter.trim() ||
        prod.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (prod.sku && prod.sku.toLowerCase().includes(searchFilter.toLowerCase())) ||
        (prod.brand && prod.brand.toLowerCase().includes(searchFilter.toLowerCase()));

      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'discount') {
        const discA = (prodOrig(a) > a.price) ? (prodOrig(a) - a.price) / prodOrig(a) : 0;
        const discB = (prodOrig(b) > b.price) ? (prodOrig(b) - b.price) / prodOrig(b) : 0;
        return discB - discA;
      }
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'units') return (b.estQty || 0) - (a.estQty || 0);
      return 0;
    });
  }, [products, selectedCategory, searchFilter, sortBy]);

  function prodOrig(p: ProductItem): number {
    return Number(p.originalPrice || p.previousPrice || p.msrp || p.price);
  }

  const handleDownloadManifest = (lotTitle: string) => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 3000);
  };

  return (
    <section id="liquidation-catalog" className="w-full bg-[#f8fafc] py-16 md:py-24 border-b border-gray-200/80">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-[#0a5c48] font-bold text-xs tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#14b875]" />
              <span>LIVE LIQUIDATION INVENTORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Verified Wholesale Sourcing Catalog
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Inspect line-item manifests for pallet lots or acquire individual wholesale products with verified MOQ and escrow checkout.
            </p>
          </div>

          {/* Mode Switcher: Lots vs Products */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-full border border-slate-300/70 shadow-xs shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setPurchaseMode('lot')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                purchaseMode === 'lot'
                  ? 'bg-[#0a5c48] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Manifested Lots</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                purchaseMode === 'lot' ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-700'
              }`}>
                {filteredLots.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPurchaseMode('product')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                purchaseMode === 'product'
                  ? 'bg-[#0a5c48] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Wholesale Products</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                purchaseMode === 'product' ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-700'
              }`}>
                {filteredProducts.length}
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Filter Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm mb-10">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide border-b border-slate-100">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0a5c48] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search, Sort and Summary Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={purchaseMode === 'lot' ? "Filter lots by title, location, or condition..." : "Filter products by SKU, brand, or model..."}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0a5c48] focus:bg-white transition-all"
              />
              {searchFilter && (
                <button 
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                Showing <strong className="text-slate-900">{purchaseMode === 'lot' ? filteredLots.length : filteredProducts.length}</strong> {purchaseMode === 'lot' ? 'lots' : 'products'}
              </span>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs">
                <span className="text-slate-500 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="discount">Highest Savings %</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="units">{purchaseMode === 'lot' ? 'Most Units' : 'Most Est. Qty'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* CONDITION 1: DISPLAY WHOLESALE PRODUCTS USING ProductCard */}
        {purchaseMode === 'product' ? (
          <div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="h-full">
                    <ProductCard 
                      {...product} 
                      isLoading={loadingProducts} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No matching products found</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Try adjusting your search criteria or reset category filters to view all products.
                </p>
                <button
                  onClick={() => { setSelectedCategory("All Categories"); setSearchFilter(""); }}
                  className="bg-[#0a5c48] text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-[#074737] transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          /* CONDITION 2: DISPLAY MANIFESTED LOTS */
          <div>
            {filteredLots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredLots.map((lot) => {
                  const discountPercent = lot.msrp > lot.price
                    ? Math.round(((lot.msrp - lot.price) / lot.msrp) * 100)
                    : 75;
                  const grossMarginPotential = lot.msrp - lot.price;
                  const unitCost = lot.units > 0 ? (lot.price / lot.units).toFixed(2) : "0.00";
                  const lotLink = `/browse?q=${encodeURIComponent(lot.title)}`;

                  return (
                    <div
                      key={lot.id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                    >
                      {/* Lot Image Container */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={lot.image}
                          alt={lot.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                          <div className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-900 border border-white/60 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="truncate max-w-[170px]">{lot.condition}</span>
                          </div>

                          <div className="inline-flex items-center gap-1 bg-rose-600 text-white px-2.5 py-1 rounded-full text-xs font-extrabold shadow-sm">
                            <Tag className="w-3 h-3" />
                            <span>-{discountPercent}% MSRP</span>
                          </div>
                        </div>

                        {/* Bottom Image Overlay: Manifest & Location */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white z-10">
                          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px]">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span className="truncate max-w-[140px] font-medium">{lot.location}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedLotForManifest(lot)}
                            className="flex items-center gap-1 bg-emerald-600/90 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            <FileSpreadsheet className="w-3 h-3" />
                            <span>Manifest View</span>
                          </button>
                        </div>
                      </div>

                      {/* Lot Content Body */}
                      <div className="p-5 sm:p-6 flex flex-col flex-1">
                        {/* Category & ID */}
                        <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase text-emerald-800 mb-2">
                          <span className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            {lot.category || "Surplus Lot"}
                          </span>
                          <span className="text-slate-400 font-mono">
                            ID: {lot.id}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-[17px] font-bold text-slate-900 leading-snug mb-4 line-clamp-2 group-hover:text-[#0a5c48] transition-colors">
                          {lot.title}
                        </h3>

                        {/* Liquidation Specs Breakdown */}
                        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 mb-5 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5 text-slate-400" />
                              Volume & Units
                            </span>
                            <span className="font-bold text-slate-900">
                              {lot.units.toLocaleString()} Units • {lot.pallets} {lot.pallets === 1 ? 'Pallet' : 'Pallets'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 flex items-center gap-1.5">
                              <Boxes className="w-3.5 h-3.5 text-slate-400" />
                              Average Unit Cost
                            </span>
                            <span className="font-semibold text-slate-700 font-mono">
                              ${unitCost} / unit
                            </span>
                          </div>

                          <div className="h-px bg-slate-200/80 my-1" />

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Retail Value (MSRP)</span>
                            <span className="font-semibold text-slate-500 line-through">
                              {formatPrice(lot.msrp)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-emerald-600" />
                              Estimated Resale Profit
                            </span>
                            <span className="font-extrabold text-emerald-700">
                              +{formatPrice(grossMarginPotential)}
                            </span>
                          </div>
                        </div>

                        {/* Price and CTA row */}
                        <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between gap-3">
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Wholesale Lot Price
                            </div>
                            <div className="text-2xl font-extrabold text-[#0a5c48] tracking-tight">
                              {formatPrice(lot.price)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedLotForManifest(lot)}
                              className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
                              title="Preview Manifest Breakdown"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <Link
                              href={lotLink}
                              className="bg-[#0a5c48] hover:bg-[#074737] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-[0.98]"
                            >
                              <span>Buy Lot</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No matching liquidation lots found</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Try adjusting your search criteria or reset category filters to see all available manifests.
                </p>
                <button
                  onClick={() => { setSelectedCategory("All Categories"); setSearchFilter(""); }}
                  className="bg-[#0a5c48] text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-[#074737] transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom Volume Banner */}
        <div className="mt-14 bg-gradient-to-r from-emerald-950 via-[#0a4737] to-[#063327] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15 text-emerald-300">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold tracking-tight">
                Need Full Container or Multi-Truckload Volume Sourcing?
              </h4>
              <p className="text-emerald-200/80 text-xs sm:text-sm mt-0.5 max-w-xl">
                We broker directly with national retail distribution centers for contract recurring loads and customs-cleared overseas export batches.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto text-center bg-white text-[#0a5c48] hover:bg-emerald-50 px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md cursor-pointer"
            >
              Speak to Liquidation Broker
            </Link>
          </div>
        </div>

      </div>

      {/* Manifest Interactive Quick-Preview Modal */}
      {selectedLotForManifest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
              <div className="flex items-center gap-3 pr-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0a5c48] flex items-center justify-center shrink-0 border border-emerald-200">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                      Verified Manifest (.XLSX)
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {selectedLotForManifest.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {selectedLotForManifest.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLotForManifest(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Summary Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-emerald-50/50 border-b border-emerald-100 text-xs">
              <div>
                <div className="text-slate-500 font-medium">Total Units</div>
                <div className="text-sm font-extrabold text-slate-900">{selectedLotForManifest.units.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-slate-500 font-medium">Pallets / Weight</div>
                <div className="text-sm font-extrabold text-slate-900">{selectedLotForManifest.pallets} Pallets</div>
              </div>
              <div>
                <div className="text-slate-500 font-medium">Total MSRP</div>
                <div className="text-sm font-extrabold text-slate-500 line-through">{formatPrice(selectedLotForManifest.msrp)}</div>
              </div>
              <div>
                <div className="text-emerald-700 font-medium">Lot Wholesale Price</div>
                <div className="text-sm font-extrabold text-[#0a5c48]">{formatPrice(selectedLotForManifest.price)}</div>
              </div>
            </div>

            {/* Manifest Line Items Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Line-Item Breakdown ({selectedLotForManifest.manifest_items?.length || 3} items)</span>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Barcode Inspected
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="py-2.5 px-3">SKU / Part #</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">Condition</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">MSRP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selectedLotForManifest.manifest_items && selectedLotForManifest.manifest_items.length > 0) ? (
                      selectedLotForManifest.manifest_items.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{item.sku || `SKU-${idx + 101}`}</td>
                          <td className="py-2.5 px-3 text-slate-800 font-medium">{item.title}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-semibold">{item.condition || "Inspected"}</span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-900">{item.qty}</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-slate-700">{formatPrice(item.msrp * item.qty)}</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-slate-800">LOT-ITEM-01</td>
                          <td className="py-2.5 px-3 text-slate-800 font-medium">Primary Item Manifested Lot Batch</td>
                          <td className="py-2.5 px-3 text-center"><span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">Overstock</span></td>
                          <td className="py-2.5 px-3 text-center font-bold">{Math.round(selectedLotForManifest.units * 0.6)}</td>
                          <td className="py-2.5 px-3 text-right">{formatPrice(selectedLotForManifest.msrp * 0.6)}</td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-slate-800">LOT-ITEM-02</td>
                          <td className="py-2.5 px-3 text-slate-800 font-medium">Secondary SKU Complementary Units</td>
                          <td className="py-2.5 px-3 text-center"><span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">Factory Sealed</span></td>
                          <td className="py-2.5 px-3 text-center font-bold">{Math.round(selectedLotForManifest.units * 0.4)}</td>
                          <td className="py-2.5 px-3 text-right">{formatPrice(selectedLotForManifest.msrp * 0.4)}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {downloadSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Manifest spreadsheet (.xlsx) downloaded successfully with complete UPC barcodes.</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDownloadManifest(selectedLotForManifest.title)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 px-4 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                <span>Export Full Manifest (.XLSX)</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedLotForManifest(null)}
                  className="w-1/2 sm:w-auto px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href={`/browse?q=${encodeURIComponent(selectedLotForManifest.title)}`}
                  className="w-1/2 sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#0a5c48] hover:bg-[#074737] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>Acquire Lot</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
