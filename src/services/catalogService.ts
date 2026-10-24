import { apiClient, ApiResponse } from './apiClient';
import { slugify } from '../lib/slugs';
import { convertToUsd } from '../context/CurrencyContext';

export interface ProductItem {
  id: string | number;
  product_id?: string;
  title: string;
  category: string;
  subCategory?: string;
  brand?: string;
  model?: string;
  condition?: string;
  price: number;
  liquidating_price?: number;
  liquidation_price?: number;
  liquidatingPrice?: number;
  currentPrice?: number;
  originalPrice?: number;
  previousPrice?: number;
  msrp?: number;
  moq: number;
  estQty: number;
  quantity?: number;
  currency?: string;
  image: string;
  images?: string[];
  isCertified?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSelling?: boolean;
  isNewArrival?: boolean;
  offer?: string;
  sku?: string;
  location?: string;
  inventory_location?: string;
  inventory_country?: string;
  inventory_city?: string;
  country?: string;
  manufacturing_country?: string;
  manufacturing_year?: string | number;
  dimensions?: string;
  expiry_date?: string | null;
  excluded_countries?: string[];
  reason_to_sell?: string;
  warranty?: string;
  third_party_certificate?: string | boolean;
  warranty_document?: string;
  third_party_documents?: string;
  views_count?: number;
  type?: 'single' | 'lot';
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
}

export interface LotItem {
  id: string | number;
  lot_number?: string;
  vendor_id?: string;
  title: string;
  listing_title?: string;
  description?: string;
  lot_description_and_notes?: string;
  condition: string;
  source_type?: string;
  inventory_stock_age?: string;
  units: number;
  total_units_quantity?: number;
  primary_unit_type?: string;
  pallets: number;
  pallet_count?: number;
  number_of_distinct_skus?: number;
  msrp: number;
  total_est_retail_value_msrp?: number;
  price: number;
  liquidation_price?: number;
  liquidating_price?: number;
  ask_price_surplus_payout?: number;
  offer?: string;
  location: string;
  inventory_location?: string;
  inventory_country?: string;
  inventory_city?: string;
  country?: string;
  city?: string;
  image: string;
  warehouse_images?: string[];
  category?: string;
  category_allocations?: Array<{ alocation?: string; allocation?: string; category_name: string }>;
  key_brands_included?: string;
  total_weight?: string;
  load_type?: string;
  shipping_size?: string;
  lot_size?: string;
  shipping_terms?: string;
  currency?: string;
  excluded_export_countries?: string[];
  sale_method?: string;
  file?: string;
  file_url?: string;
  manifest_items?: any[];
  products: any[];
  manifest_data: any[];
  enquiry_status?: string;
  active_status?: string;
  is_active?: boolean;
  is_featured?: boolean;
  is_best_selling?: boolean;
  is_new_arrival?: boolean;
  isFeatured?: boolean;
  isBestSelling?: boolean;
  isNewArrival?: boolean;
  third_party_certificate_available?: boolean;
  third_party_documents?: string[];
  created_at?: string;
  created_at_formatted?: string;
  type?: 'lot';
}

export interface ProductRequestPayload {
  category: string;
  title: string;
  brand: string;
  model: string;
  condition: string;
  country: string;
  year: string;
  dimensions: string;
  expiry: string;
  quantity: string;
  currency: string;
  liquidatingPrice: string;
  msrp?: string;
  previousPrice?: string;
  offer?: string | number;
  excludedCountries: string[];
  description: string;
  reasonToSell: string;
  warranty: string;
  certificate: boolean;
  imagesUploaded: boolean;
}

export interface LotRequestPayload {
  manifest_items: Array<{
    title: string;
    sku?: string;
    qty: number;
    msrp: number;
    category?: string;
    condition?: string;
  }>;
  total_units: number;
  total_retail: number;
  lot_title: string;
  asking_price: number;
  price?: number;
  msrp?: number;
  offer?: string | number;
  currency?: string;
  pallet_count?: number;
  condition?: string;
  category?: string;
  location?: string;
  inventory_location?: string;
  inventory_country?: string;
  inventory_city?: string;
  country?: string;
  city?: string;
  notes?: string;
}

export function extractStringValue(val: any, fallback: string = ''): string {
  if (!val) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val.name || val.title || val.label || val.slug || fallback;
  }
  return String(val);
}

export function sanitizeImageUrl(url: any): string {
  if (!url || typeof url !== 'string') return '';
  let cleaned = url.trim();
  const mdMatch = cleaned.match(/\[.*?\]\((https?:\/\/[^\)]+)\)/i);
  if (mdMatch && mdMatch[1]) {
    return mdMatch[1];
  }
  if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
    cleaned = cleaned.slice(1, -1);
  }
  return cleaned;
}

export function mapApiProductToProductItem(item: any, index: number): ProductItem {
  const rawCurrency = (item.currency || 'USD').toUpperCase().trim();
  const rawLiquidatingPrice = Number(item.liquidating_price || item.liquidation_price || item.liquidatingPrice || 0);
  const rawMsrpPrice = Number(item.msrp || item.originalPrice || item.previous_price || 0);
  const rawPrice = Number(item.price || item.current_price || (rawLiquidatingPrice ? Number((rawLiquidatingPrice * 1.10).toFixed(2)) : 0));
  
  // Convert from backend country currency (QAR, AED, SAR, etc.) to USD
  const price = convertToUsd(rawPrice, rawCurrency);
  const liquidatingPrice = rawLiquidatingPrice > 0 ? convertToUsd(rawLiquidatingPrice, rawCurrency) : price;
  const msrpPrice = rawMsrpPrice > 0 ? convertToUsd(rawMsrpPrice, rawCurrency) : 0;
  const previousPrice = msrpPrice;
  const currentPrice = price;

  let rawImages: string[] = [];
  if (Array.isArray(item.images) && item.images.length > 0) {
    rawImages = item.images.map((img: any) => sanitizeImageUrl(typeof img === 'string' ? img : img?.url)).filter(Boolean);
  }
  
  let primaryImage = sanitizeImageUrl(item.image || item.image_url || item.photo || item.thumbnail);
  if (!primaryImage && rawImages.length > 0) {
    primaryImage = rawImages[0];
  }
  if (!primaryImage) {
    primaryImage = '';
  }
  if (rawImages.length === 0 && primaryImage) {
    rawImages = [primaryImage];
  }

  const categoryName = extractStringValue(item.category || item.category_name, 'General Inventory');
  const subCategoryName = extractStringValue(item.subcategory || item.subCategory, '');
  const brandName = extractStringValue(item.brand_name || item.brand || item.manufacturer, '');
  const conditionName = extractStringValue(item.condition || item.stock_condition, 'Brand New Surplus');
  
  const inventoryCountry = extractStringValue(item.inventory_country || item.country, '');
  const inventoryCity = extractStringValue(item.inventory_city || item.city, '');
  const rawLocation = extractStringValue(item.inventory_location || item.location, '');
  let resolvedLocation = rawLocation;
  if (!resolvedLocation && inventoryCity && inventoryCountry) {
    resolvedLocation = `${inventoryCity}, ${inventoryCountry}`;
  } else if (!resolvedLocation && (inventoryCity || inventoryCountry)) {
    resolvedLocation = inventoryCity || inventoryCountry;
  }
  const locationName = resolvedLocation || 'Dubai, UAE';

  const rawOffer = item.offer !== undefined && item.offer !== null && String(item.offer).trim() !== '' ? String(item.offer).trim() : undefined;
  const discountTarget = liquidatingPrice > 0 ? liquidatingPrice : price;
  const discountVal = previousPrice > discountTarget ? Math.round(((previousPrice - discountTarget) / previousPrice) * 100) : (msrpPrice > discountTarget ? Math.round(((msrpPrice - discountTarget) / msrpPrice) * 100) : 0);
  
  let offerTag: string | undefined = undefined;
  if (rawOffer) {
    if (rawOffer.toLowerCase().includes('drop')) {
      offerTag = rawOffer;
    } else if (rawOffer.endsWith('%') || rawOffer.toLowerCase().includes('off') || rawOffer.toLowerCase().includes('msrp')) {
      offerTag = rawOffer.replace(/off/gi, 'DROP');
    } else {
      const numOffer = parseFloat(rawOffer);
      if (!isNaN(numOffer)) {
        if (numOffer > 0) {
          offerTag = numOffer % 1 === 0 ? `${Math.round(numOffer)}% DROP` : `${numOffer}% DROP`;
        }
      } else {
        offerTag = `${rawOffer}% DROP`;
      }
    }
  } else if (discountVal > 0) {
    offerTag = `${discountVal}% DROP`;
  }

  return {
    id: item.id || item.product_id || `PROD-${index + 1}`,
    product_id: item.product_id || item.sku || `PRO-${item.id || index + 1}`,
    sku: item.product_id || item.sku || `PRO-${item.id || index + 1}`,
    title: item.product_name || item.title || item.name || 'Surplus Wholesale Product',
    category: categoryName,
    subCategory: subCategoryName,
    brand: brandName,
    model: item.model_no || item.model || item.part_no || '',
    condition: conditionName,
    price: price,
    liquidating_price: liquidatingPrice || price,
    liquidation_price: liquidatingPrice || price,
    liquidatingPrice: liquidatingPrice || price,
    currentPrice: price,
    originalPrice: previousPrice > price ? previousPrice : (msrpPrice > price ? msrpPrice : undefined),
    previousPrice: previousPrice > 0 ? previousPrice : (msrpPrice > 0 ? msrpPrice : undefined),
    msrp: msrpPrice > 0 ? msrpPrice : undefined,
    currency: 'USD',
    moq: Math.max(20, Number(item.moq || item.minimum_order_quantity || item.min_qty || 20)),
    estQty: Number(item.quantity || item.estQty || item.available_qty || item.stock || 100),
    quantity: Number(item.quantity || item.estQty || item.available_qty || item.stock || 100),
    image: primaryImage,
    images: rawImages,
    isCertified: Boolean(item.third_party_certificate ?? item.certificate ?? item.isCertified ?? item.is_certified ?? false),
    isNew: item.is_new_arrival || item.isNew || false,
    isFeatured: Boolean(item.is_featured),
    isBestSelling: Boolean(item.is_best_selling),
    isNewArrival: Boolean(item.is_new_arrival),
    offer: offerTag,
    location: locationName,
    inventory_location: locationName,
    inventory_country: inventoryCountry,
    inventory_city: inventoryCity,
    country: inventoryCountry,
    manufacturing_country: item.manufacturing_country || '',
    manufacturing_year: item.manufacturing_year || item.mfg_year || item.year || '',
    dimensions: item.dimensions || '',
    expiry_date: item.expiry_date || item.expiry || null,
    excluded_countries: Array.isArray(item.excluded_countries) ? item.excluded_countries : [],
    reason_to_sell: item.reason_to_sell || item.reasonToSell || '',
    warranty: item.warranty || item.warranty_period || '',
    third_party_certificate: item.third_party_certificate ?? item.certificate ?? item.third_party_docs ?? undefined,
    warranty_document: item.warranty_document || item.warranty_attachment || item.warranty_doc || '',
    third_party_documents: item.third_party_documents || item.certificate_document || item.third_party_docs || '',
    views_count: typeof item.views_count === 'number' ? item.views_count : undefined,
    type: 'single',
    description: item.description || item.product_name || '',
    createdAt: item.created_at || '',
    updatedAt: item.updated_at || '',
    displayOrder: item.display_order || 0,
  };
}


export function mapApiLotToLotItem(raw: any, index: number): LotItem {
  const item = raw?.lot || raw?.data || raw || {};
  const rawCurrency = (item.currency || 'USD').toUpperCase().trim();
  
  const rawLiquidationPrice = Number(
    item.liquidation_price ||
    item.liquidating_price ||
    item.ask_price_surplus_payout ||
    item.asking_price ||
    0
  );
  
  const rawMsrp = Number(
    item.msrp ||
    item.total_est_retail_value_msrp ||
    item.total_retail ||
    item.retail_price ||
    0
  );
  
  const rawPrice = Number(
    item.price ||
    item.total_price ||
    item.priceUsd ||
    (rawLiquidationPrice ? Number((rawLiquidationPrice * 1.10).toFixed(2)) : 0)
  );

  // Convert raw lot prices to USD
  const price = convertToUsd(rawPrice, rawCurrency);
  const liquidationPrice = rawLiquidationPrice > 0 ? convertToUsd(rawLiquidationPrice, rawCurrency) : price;
  const msrp = rawMsrp > 0 ? convertToUsd(rawMsrp, rawCurrency) : 0;
  
  let image = item.image || item.image_url || item.photo || item.thumbnail || '';
  if (Array.isArray(item.images) && item.images.length > 0) {
    image = item.images[0]?.url || item.images[0] || image;
  }
  if (!image && Array.isArray(item.warehouse_images) && item.warehouse_images.length > 0) {
    const firstWh = item.warehouse_images[0];
    if (typeof firstWh === 'string') {
      if (firstWh.startsWith('http://') || firstWh.startsWith('https://')) {
        image = firstWh;
      } else if (firstWh.startsWith('/')) {
        image = firstWh;
      }
    }
  }
  if (!image || (!image.startsWith('http://') && !image.startsWith('https://') && !image.startsWith('/'))) {
    image = '';
  }

  const discountTarget = liquidationPrice > 0 ? liquidationPrice : price;
  const discount = msrp > discountTarget && msrp > 0 ? Math.round(((msrp - discountTarget) / msrp) * 100) : 0;
  
  let categoryName = 'General Inventory';
  if (Array.isArray(item.category_allocations) && item.category_allocations.length > 0) {
    categoryName = item.category_allocations[0]?.category_name || categoryName;
  } else if (item.category) {
    categoryName = extractStringValue(item.category, 'General Inventory');
  }

  const conditionName = extractStringValue(item.condition, 'New');
  
  const inventoryCountry = extractStringValue(item.inventory_country || item.country, '');
  const inventoryCity = extractStringValue(item.inventory_city || item.city, '');
  let resolvedLocation = '';
  if (inventoryCity && inventoryCountry) {
    resolvedLocation = `${inventoryCity}, ${inventoryCountry}`;
  } else if (inventoryCity || inventoryCountry) {
    resolvedLocation = inventoryCity || inventoryCountry;
  } else {
    resolvedLocation = extractStringValue(item.inventory_location || item.location, 'Dubai, UAE');
  }
  const locationName = resolvedLocation;

  const rawLotOffer = item.offer !== undefined && item.offer !== null && String(item.offer).trim() !== '' ? String(item.offer).trim() : undefined;
  let lotOfferTag: string | undefined = undefined;
  if (rawLotOffer) {
    if (rawLotOffer.toLowerCase().includes('drop')) {
      lotOfferTag = rawLotOffer;
    } else if (rawLotOffer.endsWith('%') || rawLotOffer.toLowerCase().includes('off') || rawLotOffer.toLowerCase().includes('msrp')) {
      lotOfferTag = rawLotOffer.replace(/off/gi, 'DROP');
    } else {
      const numLotOffer = parseFloat(rawLotOffer);
      if (!isNaN(numLotOffer)) {
        if (numLotOffer > 0) {
          lotOfferTag = numLotOffer % 1 === 0 ? `${Math.round(numLotOffer)}% DROP` : `${numLotOffer}% DROP`;
        }
      } else {
        lotOfferTag = `${rawLotOffer}% DROP`;
      }
    }
  } else if (discount > 0) {
    lotOfferTag = `${discount}% DROP`;
  }

  const productsList = Array.isArray(item.products) && item.products.length > 0
    ? item.products
    : (Array.isArray(item.manifest_data) && item.manifest_data.length > 0
      ? item.manifest_data
      : (Array.isArray(item.manifest_items) ? item.manifest_items : []));

  const unitsCount = Number(
    item.units ||
    item.total_units_quantity ||
    item.total_units ||
    item.quantity ||
    (productsList.length > 0 
      ? productsList.reduce((acc: number, p: any) => acc + Number(p.available_quantity || p.quantity || 1), 0)
      : 100)
  );

  const palletsCount = Number(item.pallets || item.pallet_count || 1);
  const distinctSkus = Number(item.number_of_distinct_skus || productsList.length);

  let manifestUrl = item.file_url || item.file || '';
  if (typeof manifestUrl === 'string') {
    manifestUrl = sanitizeImageUrl(manifestUrl);
  }

  return {
    id: item.id || item.lot_number || item.lot_id || `LOT-${index + 1}`,
    lot_number: item.lot_number || item.lot_id || `LOT-${item.id || index + 1}`,
    vendor_id: item.vendor_id || '',
    title: item.title || item.listing_title || item.lot_title || item.name || 'Wholesale Liquidation Lot',
    listing_title: item.listing_title || item.title || '',
    description: item.description || item.lot_description_and_notes || '',
    lot_description_and_notes: item.lot_description_and_notes || item.description || '',
    condition: conditionName,
    source_type: item.source_type || 'Overstock',
    inventory_stock_age: item.inventory_stock_age || '',
    units: unitsCount,
    total_units_quantity: unitsCount,
    primary_unit_type: item.primary_unit_type || 'Pieces / Units',
    pallets: palletsCount,
    pallet_count: palletsCount,
    number_of_distinct_skus: distinctSkus,
    msrp: msrp,
    total_est_retail_value_msrp: msrp,
    price: price || liquidationPrice,
    liquidation_price: liquidationPrice || price,
    liquidating_price: liquidationPrice || price,
    ask_price_surplus_payout: liquidationPrice || price,
    offer: lotOfferTag,
    location: locationName,
    inventory_location: locationName,
    inventory_country: inventoryCountry,
    inventory_city: inventoryCity,
    country: inventoryCountry,
    city: inventoryCity,
    image: image,
    warehouse_images: Array.isArray(item.warehouse_images)
      ? item.warehouse_images.map((wh: string) => {
          if (typeof wh === 'string' && wh.startsWith('/')) {
            return wh;
          }
          return wh;
        })
      : [],
    category: categoryName,
    category_allocations: Array.isArray(item.category_allocations) ? item.category_allocations : [],
    key_brands_included: item.key_brands_included || '',
    total_weight: item.total_weight || '',
    load_type: item.load_type || 'Pallet',
    shipping_size: item.shipping_size || 'Multi-Pallet / LTL',
    lot_size: item.lot_size || `${palletsCount} Pallets`,
    shipping_terms: item.shipping_terms || 'Buyer Arranges Freight',
    currency: 'USD',
    excluded_export_countries: Array.isArray(item.excluded_export_countries) ? item.excluded_export_countries : [],
    sale_method: item.sale_method || 'offer',
    file: manifestUrl,
    file_url: manifestUrl,
    manifest_items: productsList,
    products: productsList,
    manifest_data: productsList,
    enquiry_status: item.enquiry_status || 'approved',
    active_status: item.active_status || 'active',
    is_active: Boolean(item.is_active ?? true),
    is_featured: Boolean(item.is_featured || item.featured),
    is_best_selling: Boolean(item.is_best_selling || item.best_selling),
    is_new_arrival: Boolean(item.is_new_arrival || item.new_arrival),
    isFeatured: Boolean(item.is_featured || item.featured),
    isBestSelling: Boolean(item.is_best_selling || item.best_selling),
    isNewArrival: Boolean(item.is_new_arrival || item.new_arrival),
    third_party_certificate_available: Boolean(item.third_party_certificate_available || item.third_party_certificate),
    third_party_documents: Array.isArray(item.third_party_documents)
      ? item.third_party_documents.filter(Boolean)
      : (item.third_party_documents ? [String(item.third_party_documents)] : []),
    created_at: item.created_at || '',
    created_at_formatted: item.created_at_formatted || (item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''),
    type: 'lot',
  };
}


const productCache = new Map<string, ProductItem>();
let allProductsCache: ProductItem[] | null = null;
let lastProductsFetchTime = 0;

const lotCache = new Map<string, LotItem>();
let allLotsCache: LotItem[] | null = null;
let lastLotsFetchTime = 0;

const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes cache TTL

export const catalogService = {
  /**
   * Connect to GET /api/products/ to fetch single product items (NOT lots).
   * Uses in-memory cache to prevent redundant backend roundtrips.
   * Default limit is set to 1000 so the entire catalog is available without 20-item pagination cut-off.
   */
  async getProducts(params?: { category?: string; search?: string; vendor_id?: string; collection?: string; limit?: number; page?: number }): Promise<ProductItem[]> {
    const isDefaultQuery = (!params?.category || params.category === 'All' || params.category === 'all') && !params?.search && !params?.vendor_id && !params?.collection && !params?.limit && !params?.page;
    
    if (isDefaultQuery && allProductsCache && (Date.now() - lastProductsFetchTime < CACHE_TTL_MS)) {
      return allProductsCache;
    }

    try {
      let endpoint = '/api/products/';
      const queryParts: string[] = [];
      if (params?.category && params.category !== 'All' && params.category !== 'all') {
        queryParts.push(`category=${encodeURIComponent(params.category)}`);
      }
      if (params?.search) {
        queryParts.push(`search=${encodeURIComponent(params.search)}`);
      }
      if (params?.vendor_id) {
        queryParts.push(`vendor_id=${encodeURIComponent(params.vendor_id)}`);
      }
      if (params?.collection) {
        queryParts.push(`collection=${encodeURIComponent(params.collection)}`);
      }
      if (params?.page) {
        queryParts.push(`page=${encodeURIComponent(params.page)}`);
      }
      // CRITICAL: The backend defaults to page_size=20 unless limit is specified.
      // Default to 5000 so the full catalog is loaded and available for product detail routes.
      const limit = params?.limit ?? 5000;
      queryParts.push(`limit=${encodeURIComponent(limit)}`);

      if (queryParts.length > 0) {
        endpoint += `?${queryParts.join('&')}`;
      }

      const response = await apiClient(endpoint, { silent: true });
      if (!response.success || !response.data) {
        return isDefaultQuery ? (allProductsCache || []) : [];
      }

      let rawList: any[] = [];
      const data = response.data;
      if (Array.isArray(data)) {
        rawList = data;
      } else if (Array.isArray(data.results)) {
        rawList = data.results;
      } else if (Array.isArray(data.products)) {
        rawList = data.products;
      } else if (Array.isArray(data.data)) {
        rawList = data.data;
      }

      // Filter to include products ONLY (exclude lots)
      const productsOnly = rawList.filter((item: any) => {
        if (item.type === 'lot' || item.is_lot === true || item.isLot === true) {
          return false;
        }
        return true;
      });

      const mappedList = productsOnly.map(mapApiProductToProductItem);

      // Index every product into productCache for instant lookup
      mappedList.forEach((p) => {
        productCache.set(String(p.id), p);
        if (p.sku) {
          productCache.set(String(p.sku), p);
          productCache.set(String(p.sku).toLowerCase(), p);
          const slugSku = slugify(p.sku);
          if (slugSku) productCache.set(slugSku, p);
        }
        if (p.product_id) {
          productCache.set(String(p.product_id), p);
          productCache.set(String(p.product_id).toLowerCase(), p);
          const slugProdId = slugify(p.product_id);
          if (slugProdId) productCache.set(slugProdId, p);
        }
        if (p.model) {
          productCache.set(String(p.model).toLowerCase(), p);
          const slugModel = slugify(p.model);
          if (slugModel) productCache.set(slugModel, p);
        }
        const s = slugify(p.title);
        if (s) {
          productCache.set(s, p);
        }
        productCache.set(p.title.toLowerCase().trim(), p);
      });

      if (isDefaultQuery) {
        allProductsCache = mappedList;
        lastProductsFetchTime = Date.now();
      }

      return mappedList;
    } catch (error) {
      console.warn('[catalogService] Error fetching /api/products/:', error);
      return isDefaultQuery ? (allProductsCache || []) : [];
    }
  },

  /**
   * Connect to GET /api/lots/ to fetch wholesale lot batch items.
   * If no lot data is returned from the API, returns an empty array.
   */
  async getLots(params?: { category?: string; search?: string; vendor_id?: string; limit?: number; page?: number }): Promise<LotItem[]> {
    const isDefaultQuery = (!params?.category || params.category === 'All' || params.category === 'View All') && !params?.search && !params?.vendor_id && !params?.limit && !params?.page;

    if (isDefaultQuery && allLotsCache && (Date.now() - lastLotsFetchTime < CACHE_TTL_MS)) {
      return allLotsCache;
    }

    try {
      let endpoint = '/api/lots/';
      const queryParts: string[] = [];
      if (params?.category && params.category !== 'All' && params.category !== 'View All') {
        queryParts.push(`category=${encodeURIComponent(params.category)}`);
      }
      if (params?.search) {
        queryParts.push(`search=${encodeURIComponent(params.search)}`);
      }
      if (params?.vendor_id) {
        queryParts.push(`vendor_id=${encodeURIComponent(params.vendor_id)}`);
      }
      if (params?.page) {
        queryParts.push(`page=${encodeURIComponent(params.page)}`);
      }
      const limit = params?.limit ?? 5000;
      queryParts.push(`limit=${encodeURIComponent(limit)}`);

      if (queryParts.length > 0) {
        endpoint += `?${queryParts.join('&')}`;
      }

      const response = await apiClient(endpoint, { silent: true });
      if (!response.success || !response.data) {
        return isDefaultQuery ? (allLotsCache || []) : [];
      }

      let rawList: any[] = [];
      const data = response.data;
      if (Array.isArray(data)) {
        rawList = data;
      } else if (Array.isArray(data.results)) {
        rawList = data.results;
      } else if (Array.isArray(data.lots)) {
        rawList = data.lots;
      } else if (Array.isArray(data.data)) {
        rawList = data.data;
      }

      const mappedLots = rawList.map(mapApiLotToLotItem);

      mappedLots.forEach((l) => {
        lotCache.set(String(l.id), l);
        if (l.lot_number) {
          lotCache.set(String(l.lot_number), l);
          lotCache.set(String(l.lot_number).toLowerCase(), l);
          const slugLot = slugify(l.lot_number);
          if (slugLot) lotCache.set(slugLot, l);
        }
        const slug = slugify(l.title);
        if (slug) lotCache.set(slug, l);
        lotCache.set(l.title.toLowerCase().trim(), l);
      });

      if (isDefaultQuery) {
        allLotsCache = mappedLots;
        lastLotsFetchTime = Date.now();
      }

      return mappedLots;
    } catch (error) {
      console.warn('[catalogService] Error fetching /api/lots/:', error);
      return isDefaultQuery ? (allLotsCache || []) : [];
    }
  },

  async submitProductRequest(payload: ProductRequestPayload): Promise<ApiResponse> {
    const res = await apiClient('/api/submit-product-request/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.success) {
      this.clearProductCache();
    }
    return res;
  },

  /**
   * Fetch single product by ID, SKU, model number, or slugified title.
   * Multi-strategy parallel resolution with instant cache lookup.
   */
  async getProductById(id: string | number, categoryHint?: string): Promise<ProductItem | null> {
    if (!id) return null;
    const key = String(id).trim();
    if (!key) return null;
    const keyLower = key.toLowerCase();
    const targetSlug = slugify(key);

    const matchesProduct = (p: ProductItem): boolean => {
      if (!p) return false;
      // 1. Direct ID match
      if (String(p.id) === key) return true;
      // 2. SKU / Product ID match
      const pSku = String(p.sku || '').toLowerCase().trim();
      const pProdId = String(p.product_id || '').toLowerCase().trim();
      if (pSku && (pSku === keyLower || (targetSlug && slugify(pSku) === targetSlug))) return true;
      if (pProdId && (pProdId === keyLower || (targetSlug && slugify(pProdId) === targetSlug))) return true;
      // 3. Model number match
      const pModel = String(p.model || '').toLowerCase().trim();
      if (pModel && (pModel === keyLower || (targetSlug && slugify(pModel) === targetSlug))) return true;
      // 4. Title slug match
      const pSlug = slugify(p.title);
      if (targetSlug && pSlug && pSlug === targetSlug) return true;
      // 5. Title lowercase match
      if (p.title.toLowerCase().trim() === keyLower) return true;
      // 6. Model number suffix in slug (e.g. key ends with model number)
      if (pModel && pModel.length >= 4 && (keyLower.endsWith(pModel) || (targetSlug && targetSlug.endsWith(slugify(pModel))))) return true;
      return false;
    };

    const cacheProduct = (p: ProductItem) => {
      productCache.set(key, p);
      productCache.set(keyLower, p);
      if (targetSlug) productCache.set(targetSlug, p);
      productCache.set(String(p.id), p);
      if (p.sku) {
        productCache.set(String(p.sku), p);
        productCache.set(String(p.sku).toLowerCase(), p);
      }
      if (p.product_id) {
        productCache.set(String(p.product_id), p);
        productCache.set(String(p.product_id).toLowerCase(), p);
      }
      if (p.model) {
        productCache.set(String(p.model).toLowerCase(), p);
      }
      const s = slugify(p.title);
      if (s) productCache.set(s, p);
    };

    // 1. Instant Cache Lookup (0ms latency if already loaded)
    if (productCache.has(key)) return productCache.get(key)!;
    if (productCache.has(keyLower)) return productCache.get(keyLower)!;
    if (targetSlug && productCache.has(targetSlug)) return productCache.get(targetSlug)!;

    if (allProductsCache && allProductsCache.length > 0) {
      const match = allProductsCache.find(matchesProduct);
      if (match) {
        cacheProduct(match);
        return match;
      }
    }

    // 2. Multi-tier parallel API execution
    try {
      const searchPromises: Promise<ProductItem | null>[] = [];

      // A) Category-scoped fetch if categoryHint is present
      const cleanCat = categoryHint && categoryHint !== 'All' && categoryHint !== 'all' && categoryHint !== 'general' && categoryHint !== 'item'
        ? categoryHint.trim()
        : '';
      if (cleanCat) {
        searchPromises.push(
          this.getProducts({ category: cleanCat, limit: 1000 })
            .then(catList => catList.find(matchesProduct) || null)
            .catch(() => null)
        );
      }

      // B) Full catalog fetch (loads and caches all products with limit=1000)
      if (!allProductsCache || allProductsCache.length === 0) {
        searchPromises.push(
          this.getProducts({ limit: 1000 })
            .then(fullList => fullList.find(matchesProduct) || null)
            .catch(() => null)
        );
      }

      // C) Targeted keyword searches if key contains tokens or hyphens
      const tokens = key.split(/[-_\s]+/).filter(Boolean);
      // If slug has model/part number at the end (e.g. '40206-01gx3')
      if (tokens.length >= 2) {
        const lastPart = tokens.slice(-2).join('-');
        searchPartsLoop:
        searchPromises.push(
          apiClient(`/api/products/?search=${encodeURIComponent(lastPart)}`, { silent: true })
            .then(res => {
              if (res.success && res.data) {
                const raw = Array.isArray(res.data) ? res.data : (res.data.products || res.data.results || []);
                const mapped = raw.map(mapApiProductToProductItem);
                return mapped.find(matchesProduct) || null;
              }
              return null;
            })
            .catch(() => null)
        );
      }
      // Also try brand / first token
      if (tokens.length >= 1 && tokens[0].length >= 3) {
        searchPromises.push(
          apiClient(`/api/products/?search=${encodeURIComponent(tokens[0])}`, { silent: true })
            .then(res => {
              if (res.success && res.data) {
                const raw = Array.isArray(res.data) ? res.data : (res.data.products || res.data.results || []);
                const mapped = raw.map(mapApiProductToProductItem);
                return mapped.find(matchesProduct) || null;
              }
              return null;
            })
            .catch(() => null)
        );
      }

      const settled = await Promise.allSettled(searchPromises);
      for (const r of settled) {
        if (r.status === 'fulfilled' && r.value) {
          cacheProduct(r.value);
          return r.value;
        }
      }

      // Final check in allProductsCache (in case another parallel query finished)
      if (allProductsCache && allProductsCache.length > 0) {
        const fallbackMatch = allProductsCache.find(matchesProduct);
        if (fallbackMatch) {
          cacheProduct(fallbackMatch);
          return fallbackMatch;
        }
      }
    } catch (err) {
      console.warn(`[catalogService] Error fetching product ${id}:`, err);
    }

    return null;
  },

  /**
   * Fetch single lot by ID, lot_id, or slugified title
   * Optimized with instant in-memory cache and parallel execution.
   */
  async getLotById(id: string | number): Promise<LotItem | null> {
    if (!id) return null;
    const key = String(id);
    const keyLower = key.toLowerCase().trim();
    const targetSlug = slugify(key);

    // 1. Instant Cache Lookup (0ms latency if already loaded)
    if (lotCache.has(key)) {
      return lotCache.get(key)!;
    }
    if (targetSlug && lotCache.has(targetSlug)) {
      return lotCache.get(targetSlug)!;
    }
    if (allLotsCache) {
      const match = allLotsCache.find(
        (l) =>
          String(l.id) === key ||
          String(l.lot_number || '').toLowerCase() === keyLower ||
          (targetSlug && slugify(l.title) === targetSlug) ||
          l.title.toLowerCase().trim() === keyLower ||
          encodeURIComponent(l.title) === key
      );
      if (match) {
        lotCache.set(key, match);
        if (targetSlug) lotCache.set(targetSlug, match);
        return match;
      }
    }

    try {
      const isNumericId = /^\d+$/.test(key);
      const isLotNum = /^lot-?\d+/i.test(key);
      const [singleRes, listRes] = await Promise.allSettled([
        (isNumericId || isLotNum) ? apiClient(`/api/lots/${id}/`, { silent: true }) : Promise.resolve(null),
        allLotsCache ? Promise.resolve(null) : this.getLots()
      ]);

      if (singleRes.status === 'fulfilled' && singleRes.value && singleRes.value.success) {
        const payload = singleRes.value.data?.lot || singleRes.value.data?.data || singleRes.value.data;
        if (payload) {
          const mapped = mapApiLotToLotItem(payload, 0);
          lotCache.set(key, mapped);
          if (mapped.lot_number) lotCache.set(String(mapped.lot_number), mapped);
          if (targetSlug) lotCache.set(targetSlug, mapped);
          return mapped;
        }
      }

      const list = listRes.status === 'fulfilled' && Array.isArray(listRes.value) ? listRes.value : (allLotsCache || []);
      const match = list.find(
        (l) =>
          String(l.id).toLowerCase() === keyLower ||
          String(l.lot_number || '').toLowerCase() === keyLower ||
          (targetSlug && slugify(l.title) === targetSlug) ||
          l.title.toLowerCase().trim() === keyLower ||
          encodeURIComponent(l.title) === key
      );
      if (match) {
        lotCache.set(key, match);
        if (targetSlug) lotCache.set(targetSlug, match);
        return match;
      }
      
    } catch (err) {
      console.warn(`[catalogService] Error fetching lot ${id}:`, err);
    }

    return null;
  },

  async submitLotRequest(payload: LotRequestPayload): Promise<ApiResponse> {
    const askingPrice = Number(payload.asking_price || payload.price || 0);
    const retailMsrp = Number(payload.total_retail || payload.msrp || 0);
    const discount = retailMsrp > askingPrice && retailMsrp > 0
      ? Math.round(((retailMsrp - askingPrice) / retailMsrp) * 100)
      : 0;
    const computedOffer = payload.offer !== undefined
      ? payload.offer
      : (discount > 0 ? `${discount}% DROP` : '');

    const resolvedLoc = payload.inventory_city && payload.inventory_country
      ? `${payload.inventory_city}, ${payload.inventory_country}`
      : (payload.inventory_city || payload.inventory_country || payload.location || payload.inventory_location || '');

    const enrichedPayload = {
      ...payload,
      title: payload.lot_title,
      price: askingPrice,
      liquidation_price: askingPrice,
      liquidating_price: askingPrice,
      asking_price: askingPrice,
      ask_price_surplus_payout: askingPrice,
      msrp: retailMsrp,
      total_retail: retailMsrp,
      total_est_retail_value_msrp: retailMsrp,
      total_units: payload.total_units,
      total_units_quantity: payload.total_units,
      inventory_country: payload.inventory_country || payload.country || '',
      inventory_city: payload.inventory_city || payload.city || '',
      country: payload.inventory_country || payload.country || '',
      city: payload.inventory_city || payload.city || '',
      inventory_location: resolvedLoc,
      location: resolvedLoc,
      offer: computedOffer,
      currency: payload.currency || 'USD',
    };

    const res = await apiClient('/api/submit-lot-request/', {
      method: 'POST',
      body: JSON.stringify(enrichedPayload),
    });
    if (res.success) {
      this.clearLotCache();
    }
    return res;
  },

  async getUserProductSubmissions(email?: string, vendorId?: string): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams();
      if (email) params.append('email', email);
      if (vendorId) params.append('vendor_id', vendorId);
      const query = params.toString() ? `?${params.toString()}` : '';
      return await apiClient(`/api/submit-product-request/${query}`, { method: 'GET' });
    } catch (err: any) {
      return { success: false, data: [] };
    }
  },

  async getUserLotSubmissions(email?: string, vendorId?: string): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams();
      if (email) params.append('email', email);
      if (vendorId) params.append('vendor_id', vendorId);
      const query = params.toString() ? `?${params.toString()}` : '';
      return await apiClient(`/api/submit-lot-request/${query}`, { method: 'GET' });
    } catch (err: any) {
      return { success: false, data: [] };
    }
  },

  clearProductCache(): void {
    allProductsCache = null;
    lastProductsFetchTime = 0;
    productCache.clear();
    apiClient.invalidate(/products/i);
  },

  clearLotCache(): void {
    allLotsCache = null;
    lastLotsFetchTime = 0;
    lotCache.clear();
    apiClient.invalidate(/lots/i);
  },

  clearAllCache(): void {
    this.clearProductCache();
    this.clearLotCache();
    apiClient.clearCache();
  },
};



