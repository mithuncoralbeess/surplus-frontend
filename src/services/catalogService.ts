import { apiClient, ApiResponse } from './apiClient';
import { slugify } from '../lib/slugs';

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
  title: string;
  condition: string;
  units: number;
  pallets: number;
  msrp: number;
  price: number;
  offer?: string;
  location: string;
  image: string;
  category?: string;
  manifest_items?: any[];
  products?: any[];
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
  location: string;
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
  const liquidatingPrice = Number(item.liquidating_price || item.liquidatingPrice || 0);
  const currentPrice = Number(item.current_price || item.price || item.asking_price || item.unit_price || item.priceUsd || liquidatingPrice || 0);
  const previousPrice = Number(item.previous_price || item.originalPrice || item.msrp || item.retail_price || 0);
  const msrpPrice = Number(item.msrp || item.originalPrice || 0);
  const price = currentPrice || liquidatingPrice || previousPrice || 0;

  let rawImages: string[] = [];
  if (Array.isArray(item.images) && item.images.length > 0) {
    rawImages = item.images.map((img: any) => sanitizeImageUrl(typeof img === 'string' ? img : img?.url)).filter(Boolean);
  }
  
  let primaryImage = sanitizeImageUrl(item.image || item.image_url || item.photo || item.thumbnail);
  if (!primaryImage && rawImages.length > 0) {
    primaryImage = rawImages[0];
  }
  if (!primaryImage) {
    primaryImage = 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80';
  }
  if (rawImages.length === 0) {
    rawImages = [primaryImage];
  }

  const categoryName = extractStringValue(item.category || item.category_name, 'General Inventory');
  const subCategoryName = extractStringValue(item.subcategory || item.subCategory, '');
  const brandName = extractStringValue(item.brand_name || item.brand || item.manufacturer, '');
  const conditionName = extractStringValue(item.condition || item.stock_condition, 'Brand New Surplus');
  const locationName = extractStringValue(item.inventory_location || item.location || item.country, '');

  const rawOffer = item.offer !== undefined && item.offer !== null && String(item.offer).trim() !== '' ? String(item.offer).trim() : undefined;
  const discountVal = previousPrice > price ? Math.round(((previousPrice - price) / previousPrice) * 100) : (msrpPrice > price ? Math.round(((msrpPrice - price) / msrpPrice) * 100) : 0);
  
  let offerTag: string | undefined = undefined;
  if (rawOffer) {
    if (rawOffer.endsWith('%') || rawOffer.toLowerCase().includes('off') || rawOffer.toLowerCase().includes('msrp')) {
      offerTag = rawOffer;
    } else {
      const numOffer = parseFloat(rawOffer);
      if (!isNaN(numOffer)) {
        if (numOffer > 0) {
          offerTag = `${Math.round(numOffer)}% OFF`;
        }
      } else {
        offerTag = `${rawOffer}% OFF`;
      }
    }
  } else if (discountVal > 0) {
    offerTag = `${discountVal}% OFF`;
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
    liquidatingPrice: liquidatingPrice || price,
    currentPrice: currentPrice || price,
    originalPrice: previousPrice > price ? previousPrice : (msrpPrice > price ? msrpPrice : undefined),
    previousPrice: previousPrice > 0 ? previousPrice : (msrpPrice > 0 ? msrpPrice : undefined),
    msrp: msrpPrice > 0 ? msrpPrice : undefined,
    currency: item.currency || 'USD',
    moq: Number(item.moq || item.minimum_order_quantity || item.min_qty || 1),
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
    manufacturing_country: item.manufacturing_country || item.country || '',
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


export function mapApiLotToLotItem(item: any, index: number): LotItem {
  const price = Number(item.price || item.asking_price || item.total_price || item.priceUsd || 0);
  const msrp = Number(item.msrp || item.total_retail || item.retail_price || 0);
  
  let image = item.image || item.image_url || item.photo || item.thumbnail || '';
  if (Array.isArray(item.images) && item.images.length > 0) {
    image = item.images[0]?.url || item.images[0] || image;
  }
  if (!image) {
    image = 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&w=600&q=80';
  }

  const discount = msrp > price ? Math.round(((msrp - price) / msrp) * 100) : 0;
  const categoryName = extractStringValue(item.category, 'General');
  const conditionName = extractStringValue(item.condition, 'Customer Returns / Overstock');
  const locationName = extractStringValue(item.location || item.country, 'Dallas, TX');

  const rawLotOffer = item.offer !== undefined && item.offer !== null && String(item.offer).trim() !== '' ? String(item.offer).trim() : undefined;
  let lotOfferTag: string | undefined = undefined;
  if (rawLotOffer) {
    if (rawLotOffer.endsWith('%') || rawLotOffer.toLowerCase().includes('off') || rawLotOffer.toLowerCase().includes('msrp')) {
      lotOfferTag = rawLotOffer;
    } else {
      const numLotOffer = parseFloat(rawLotOffer);
      if (!isNaN(numLotOffer)) {
        if (numLotOffer > 0) {
          lotOfferTag = `${Math.round(numLotOffer)}% OFF`;
        }
      } else {
        lotOfferTag = `${rawLotOffer}% OFF`;
      }
    }
  } else if (discount > 0) {
    lotOfferTag = `${discount}% OFF`;
  }

  return {
    id: item.id || item.lot_id || `LOT-${index + 1}`,
    title: item.title || item.lot_title || item.name || 'Wholesale Liquidation Lot',
    condition: conditionName,
    units: Number(item.units || item.total_units || item.quantity || 100),
    pallets: Number(item.pallets || item.pallet_count || 1),
    msrp: msrp,
    price: price,
    offer: lotOfferTag,
    location: locationName,
    image: image,
    category: categoryName,
    products: item.products || [],
    type: 'lot',
  };
}


const productCache = new Map<string, ProductItem>();
let allProductsCache: ProductItem[] | null = null;
let lastProductsFetchTime = 0;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes cache TTL

export const catalogService = {
  /**
   * Connect to GET /api/products/ to fetch single product items (NOT lots).
   * Uses in-memory cache to prevent redundant backend roundtrips.
   */
  async getProducts(params?: { category?: string; search?: string }): Promise<ProductItem[]> {
    const isDefaultQuery = (!params?.category || params.category === 'All') && !params?.search;
    
    if (isDefaultQuery && allProductsCache && (Date.now() - lastProductsFetchTime < CACHE_TTL_MS)) {
      return allProductsCache;
    }

    try {
      let endpoint = '/api/products/';
      const queryParts: string[] = [];
      if (params?.category && params.category !== 'All') {
        queryParts.push(`category=${encodeURIComponent(params.category)}`);
      }
      if (params?.search) {
        queryParts.push(`search=${encodeURIComponent(params.search)}`);
      }
      if (queryParts.length > 0) {
        endpoint += `?${queryParts.join('&')}`;
      }

      const response = await apiClient(endpoint, { silent: true });
      if (!response.success || !response.data) {
        return allProductsCache || [];
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

      if (isDefaultQuery) {
        allProductsCache = mappedList;
        lastProductsFetchTime = Date.now();
        mappedList.forEach((p) => {
          productCache.set(String(p.id), p);
          if (p.sku) productCache.set(String(p.sku), p);
          if (p.product_id) productCache.set(String(p.product_id), p);
        });
      }

      return mappedList;
    } catch (error) {
      console.warn('[catalogService] Error fetching /api/products/:', error);
      return allProductsCache || [];
    }
  },

  /**
   * Connect to GET /api/lots/ to fetch wholesale lot batch items.
   * If no lot data is returned from the API, returns an empty array.
   */
  async getLots(params?: { category?: string; search?: string }): Promise<LotItem[]> {
    try {
      let endpoint = '/api/lots/';
      const queryParts: string[] = [];
      if (params?.category && params.category !== 'All' && params.category !== 'View All') {
        queryParts.push(`category=${encodeURIComponent(params.category)}`);
      }
      if (params?.search) {
        queryParts.push(`search=${encodeURIComponent(params.search)}`);
      }
      if (queryParts.length > 0) {
        endpoint += `?${queryParts.join('&')}`;
      }

      const response = await apiClient(endpoint, { silent: true });
      if (!response.success || !response.data) {
        return [];
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

      return rawList.map(mapApiLotToLotItem);
    } catch (error) {
      console.warn('[catalogService] Error fetching /api/lots/:', error);
      return [];
    }
  },

  async submitProductRequest(payload: ProductRequestPayload): Promise<ApiResponse> {
    return apiClient('/api/submit-product-request/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch single product by ID, SKU, or slugified title from /api/products/:id/
   * Optimized with instant in-memory cache and parallel execution.
   */
  async getProductById(id: string | number): Promise<ProductItem | null> {
    if (!id) return null;
    const key = String(id);
    const keyLower = key.toLowerCase().trim();
    const targetSlug = slugify(key);

    // 1. Instant Cache Lookup (0ms latency if already loaded)
    if (productCache.has(key)) {
      return productCache.get(key)!;
    }
    if (targetSlug && productCache.has(targetSlug)) {
      return productCache.get(targetSlug)!;
    }
    if (allProductsCache) {
      const match = allProductsCache.find(
        (p) =>
          String(p.id) === key ||
          String(p.sku || '').toLowerCase() === keyLower ||
          String(p.product_id || '').toLowerCase() === keyLower ||
          (targetSlug && slugify(p.title) === targetSlug) ||
          p.title.toLowerCase().trim() === keyLower
      );
      if (match) {
        productCache.set(key, match);
        if (targetSlug) productCache.set(targetSlug, match);
        return match;
      }
    }

    // 2. Parallel API Execution (prevents sequential fallback delay)
    try {
      const isNumericId = /^\d+$/.test(key);
      const [singleRes, listRes] = await Promise.allSettled([
        isNumericId ? apiClient(`/api/products/${id}/`, { silent: true }) : Promise.resolve(null),
        allProductsCache ? Promise.resolve(null) : this.getProducts()
      ]);

      if (singleRes.status === 'fulfilled' && singleRes.value && singleRes.value.success && singleRes.value.data) {
        const mapped = mapApiProductToProductItem(singleRes.value.data, 0);
        productCache.set(key, mapped);
        if (mapped.sku) productCache.set(String(mapped.sku), mapped);
        if (mapped.product_id) productCache.set(String(mapped.product_id), mapped);
        if (targetSlug) productCache.set(targetSlug, mapped);
        return mapped;
      }

      // Fallback matching from parallel list result
      const list = listRes.status === 'fulfilled' && Array.isArray(listRes.value) ? listRes.value : (allProductsCache || []);
      const match = list.find(
        (p) =>
          String(p.id) === key ||
          String(p.sku || '').toLowerCase() === keyLower ||
          String(p.product_id || '').toLowerCase() === keyLower ||
          (targetSlug && slugify(p.title) === targetSlug) ||
          p.title.toLowerCase().trim() === keyLower
      );
      if (match) {
        productCache.set(key, match);
        if (targetSlug) productCache.set(targetSlug, match);
        return match;
      }
    } catch (err) {
      console.warn(`[catalogService] Error fetching product ${id}:`, err);
    }

    return null;
  },

  /**
   * Fetch single lot by ID, lot_id, or slugified title
   */
  async getLotById(id: string | number): Promise<LotItem | null> {
    if (!id) return null;
    const key = String(id);
    const keyLower = key.toLowerCase().trim();
    const targetSlug = slugify(key);

    try {
      const isNumericId = /^\d+$/.test(key);
      const [singleRes, listRes] = await Promise.allSettled([
        isNumericId ? apiClient(`/api/lots/${id}/`, { silent: true }) : Promise.resolve(null),
        this.getLots()
      ]);

      if (singleRes.status === 'fulfilled' && singleRes.value && singleRes.value.success && singleRes.value.data) {
        return mapApiLotToLotItem(singleRes.value.data, 0);
      }

      const list = listRes.status === 'fulfilled' && Array.isArray(listRes.value) ? listRes.value : [];
      const match = list.find(
        (l) =>
          String(l.id).toLowerCase() === keyLower ||
          (targetSlug && slugify(l.title) === targetSlug) ||
          l.title.toLowerCase().trim() === keyLower ||
          encodeURIComponent(l.title) === key
      );
      if (match) return match;
      
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
      : (discount > 0 ? `${discount}% Off MSRP` : '');

    const enrichedPayload = {
      ...payload,
      title: payload.lot_title,
      price: askingPrice,
      asking_price: askingPrice,
      ask_price_surplus_payout: askingPrice,
      msrp: retailMsrp,
      total_retail: retailMsrp,
      total_est_retail_value_msrp: retailMsrp,
      total_units: payload.total_units,
      total_units_quantity: payload.total_units,
      inventory_location: payload.location,
      offer: computedOffer,
      currency: payload.currency || 'USD',
    };

    return apiClient('/api/submit-lot-request/', {
      method: 'POST',
      body: JSON.stringify(enrichedPayload),
    });
  },
};



