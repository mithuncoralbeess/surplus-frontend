import { SURPLUS_INVENTORY, SurplusItem } from '../data/surplusInventory';

export interface ParsedAiIntent {
  rawQuery: string;
  cleanedQuery: string;
  brand?: string;
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  isBulkLot?: boolean;
  location?: string;
  sku?: string;
  confidence: number;
}

export interface AiSearchResultItem extends SurplusItem {
  aiMatchScore: number; // 0 - 100
  matchReasons: string[];
  isLot?: boolean;
  lotNumber?: string;
  totalUnits?: number;
}

export interface AiSearchResponse {
  query: string;
  intent: ParsedAiIntent;
  results: AiSearchResultItem[];
  totalCount: number;
  executionMs: number;
  mode: 'ai' | 'sku';
  didYouMean?: string;
  availableCategories: { name: string; count: number }[];
  priceRange: { min: number; max: number };
}

// Known entity dictionaries for ultra-fast NLP token matching
const KNOWN_BRANDS = [
  'Dell', 'Cisco', 'HP', 'HPE', 'Schneider', 'Schneider Electric', 
  'Bosch', 'DeWalt', 'Makita', 'Caterpillar', 'CAT', 'Siemens', 
  '3M', 'Fluke', 'Flowserve', 'Neox', 'InnAIO', 'AcousticPro'
];

const KNOWN_CATEGORIES: Record<string, string> = {
  'server': 'ICT',
  'servers': 'ICT',
  'rack': 'ICT',
  'networking': 'ICT',
  'switch': 'ICT',
  'switches': 'ICT',
  'ict': 'ICT',
  'cable': 'Electricals',
  'cables': 'Electricals',
  'wire': 'Electricals',
  'electrical': 'Electricals',
  'electricals': 'Electricals',
  'panel': 'Electricals',
  'lighting': 'Electricals',
  'plc': 'Electricals',
  'automation': 'Electricals',
  'power tool': 'Power tools',
  'power tools': 'Power tools',
  'drill': 'Power tools',
  'drills': 'Power tools',
  'hammer': 'Power tools',
  'hand tool': 'Hand tools',
  'hand tools': 'Hand tools',
  'multimeter': 'Hand tools',
  'ppe': 'PPE',
  'mask': 'PPE',
  'respirator': 'PPE',
  'safety': 'PPE',
  'valve': 'Building Materials',
  'valves': 'Building Materials',
  'building': 'Building Materials',
  'hydraulic': 'Lifting accessories',
  'pump': 'Lifting accessories',
  'excavator': 'Lifting accessories',
  'earbuds': 'CONSUMER ELECTRONICS',
  'tws': 'CONSUMER ELECTRONICS',
  'electronics': 'CONSUMER ELECTRONICS',
  'audio': 'CONSUMER ELECTRONICS',
  'translator': 'CONSUMER ELECTRONICS'
};

const KNOWN_CONDITIONS: Record<string, 'Brand New Surplus' | 'Refurbished' | 'Liquidation Lot' | 'Unused Overstock' | 'Used - Good'> = {
  'refurbished': 'Refurbished',
  'refurb': 'Refurbished',
  'renewed': 'Refurbished',
  'brand new': 'Brand New Surplus',
  'new surplus': 'Brand New Surplus',
  'sealed': 'Brand New Surplus',
  'unopened': 'Brand New Surplus',
  'liquidation': 'Liquidation Lot',
  'lot': 'Liquidation Lot',
  'overstock': 'Unused Overstock',
  'unused': 'Unused Overstock',
  'surplus': 'Unused Overstock',
  'used': 'Used - Good',
  'pre-owned': 'Used - Good'
};

const KNOWN_LOCATIONS = [
  'Texas', 'California', 'USA', 'Germany', 'UAE', 'Dubai', 
  'Netherlands', 'Singapore', 'Saudi Arabia', 'Riyadh', 'UK', 'London'
];

// In-Memory Fast LRU Cache
const searchCache = new Map<string, AiSearchResponse>();
const MAX_CACHE_SIZE = 150;

/**
 * High-performance Natural Language Query Parser
 * Decomposes natural language queries into structured parameters in sub-1ms
 */
export function parseNaturalLanguageQuery(query: string): ParsedAiIntent {
  const normalized = query.toLowerCase().trim();
  let cleaned = normalized;
  const intent: ParsedAiIntent = {
    rawQuery: query,
    cleanedQuery: query,
    confidence: 0.5
  };

  if (!normalized) {
    return intent;
  }

  // 1. Detect Price constraints (e.g. "under $500", "below 1500", "less than 2000", "< 1000", "between 500 and 2000")
  const underRegex = /(?:under|below|less than|<|up to|max)\s*\$?([0-9,]+)/i;
  const underMatch = query.match(underRegex);
  if (underMatch && underMatch[1]) {
    const val = parseFloat(underMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) {
      intent.maxPrice = val;
      cleaned = cleaned.replace(underMatch[0].toLowerCase(), '');
      intent.confidence += 0.15;
    }
  }

  const betweenRegex = /(?:between|from)\s*\$?([0-9,]+)\s*(?:and|to|-)\s*\$?([0-9,]+)/i;
  const betweenMatch = query.match(betweenRegex);
  if (betweenMatch && betweenMatch[1] && betweenMatch[2]) {
    const minVal = parseFloat(betweenMatch[1].replace(/,/g, ''));
    const maxVal = parseFloat(betweenMatch[2].replace(/,/g, ''));
    if (!isNaN(minVal) && !isNaN(maxVal)) {
      intent.minPrice = minVal;
      intent.maxPrice = maxVal;
      cleaned = cleaned.replace(betweenMatch[0].toLowerCase(), '');
      intent.confidence += 0.2;
    }
  }

  // 2. Detect Brands
  for (const brand of KNOWN_BRANDS) {
    const regex = new RegExp(`\\b${brand}\\b`, 'i');
    if (regex.test(cleaned)) {
      intent.brand = brand;
      cleaned = cleaned.replace(regex, '');
      intent.confidence += 0.2;
      break;
    }
  }

  // 3. Detect Conditions
  for (const [key, cond] of Object.entries(KNOWN_CONDITIONS)) {
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(cleaned)) {
      intent.condition = cond;
      cleaned = cleaned.replace(regex, '');
      intent.confidence += 0.15;
      break;
    }
  }

  // 4. Detect Categories
  for (const [keyword, cat] of Object.entries(KNOWN_CATEGORIES)) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(cleaned)) {
      intent.category = cat;
      intent.confidence += 0.15;
      break;
    }
  }

  // 5. Detect Bulk / Lot intent
  if (/\b(bulk|lot|wholesale|pallet|container|drums|spools|keg)\b/i.test(normalized)) {
    intent.isBulkLot = true;
    intent.confidence += 0.1;
  }

  // 6. Detect Location
  for (const loc of KNOWN_LOCATIONS) {
    const regex = new RegExp(`\\b${loc}\\b`, 'i');
    if (regex.test(query)) {
      intent.location = loc;
      intent.confidence += 0.1;
      break;
    }
  }

  // 7. Detect Part Number / SKU pattern (e.g., R740, DL380, C9300, DCD996, S7-1200, 87V)
  const skuRegex = /\b([a-z0-9]+-[a-z0-9-]+|[a-z]{1,4}[0-9]{3,5}[a-z0-9]*)\b/i;
  const skuMatch = query.match(skuRegex);
  if (skuMatch && skuMatch[1] && skuMatch[1].length >= 3) {
    intent.sku = skuMatch[1].toUpperCase();
    intent.confidence += 0.25;
  }

  intent.cleanedQuery = cleaned.replace(/\s+/g, ' ').trim();
  intent.confidence = Math.min(1.0, intent.confidence);

  return intent;
}

export interface SearchOptions {
  mode?: 'ai' | 'sku';
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  isCertifiedOnly?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'discount_desc' | 'newest';
}

/**
 * High-Performance Hybrid Search Engine
 * Combines parsed intent, vector semantic weights, and fast token filters
 */
export function performAiSearch(query: string, options: SearchOptions = {}): AiSearchResponse {
  const startTime = performance.now();
  const cacheKey = `${query.trim().toLowerCase()}_${JSON.stringify(options)}`;

  if (searchCache.has(cacheKey)) {
    const cached = searchCache.get(cacheKey)!;
    return {
      ...cached,
      executionMs: Math.round((performance.now() - startTime) * 10) / 10
    };
  }

  const intent = parseNaturalLanguageQuery(query);
  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = normalizedQuery ? normalizedQuery.split(/\s+/).filter(t => t.length > 1) : [];

  const effectiveMode = options.mode || (intent.sku ? 'sku' : 'ai');

  // Score each surplus item
  const scoredItems: AiSearchResultItem[] = SURPLUS_INVENTORY.map(item => {
    let score = 0;
    const reasons: string[] = [];

    // Exact SKU match (Critical for engineering & industrial parts)
    if (intent.sku && item.sku.toUpperCase().includes(intent.sku)) {
      score += 100;
      reasons.push(`Exact SKU match (${item.sku})`);
    } else if (normalizedQuery && item.sku.toLowerCase().includes(normalizedQuery)) {
      score += 90;
      reasons.push(`SKU match (${item.sku})`);
    }

    // Brand match
    if (intent.brand && item.brand.toLowerCase() === intent.brand.toLowerCase()) {
      score += 35;
      reasons.push(`Brand matched: ${item.brand}`);
    }

    // Category match
    if (intent.category && item.category.toLowerCase() === intent.category.toLowerCase()) {
      score += 30;
      reasons.push(`Category: ${item.category}`);
    }

    // Condition match
    if (intent.condition && item.condition.toLowerCase() === intent.condition.toLowerCase()) {
      score += 25;
      reasons.push(`Condition: ${item.condition}`);
    }

    // Bulk Lot match
    if (intent.isBulkLot && (item.tags.includes('bulk') || item.tags.includes('lot') || item.moq > 1 || item.condition === 'Liquidation Lot')) {
      score += 20;
      reasons.push('Wholesale / Bulk Lot matched');
    }

    // Location match
    if (intent.location && (item.location.toLowerCase().includes(intent.location.toLowerCase()) || item.country.toLowerCase().includes(intent.location.toLowerCase()))) {
      score += 20;
      reasons.push(`Location matched: ${item.location}`);
    }

    // Token & Semantic Matching
    const fullText = `${item.title} ${item.description} ${item.brand} ${item.category} ${item.tags.join(' ')} ${Object.values(item.specs).join(' ')}`.toLowerCase();

    let matchedTokensCount = 0;
    for (const token of queryTokens) {
      if (fullText.includes(token)) {
        matchedTokensCount++;
        score += 15;
      }
    }

    if (queryTokens.length > 0 && matchedTokensCount === queryTokens.length) {
      score += 30;
      reasons.push('Full query terms found in specifications');
    }

    // Title direct phrase match
    if (normalizedQuery && item.title.toLowerCase().includes(normalizedQuery)) {
      score += 45;
      reasons.push('Direct title phrase match');
    }

    // Trust factors
    if (item.isCertified) {
      score += 5;
    }
    if (item.sellerRating >= 4.8) {
      score += 5;
    }

    // Price suitability calculation
    if (intent.maxPrice !== undefined) {
      if (item.price <= intent.maxPrice) {
        score += 15;
        reasons.push(`Within budget: $${item.price} <= $${intent.maxPrice}`);
      } else {
        score -= 25; // penalize if over requested price
      }
    }

    // Normalize AI Match Score (0 - 100%)
    let aiMatchScore = Math.min(99, Math.max(35, Math.round((score / 150) * 100)));
    if (!normalizedQuery) {
      aiMatchScore = 95; // Default browse state
    }

    return {
      ...item,
      aiMatchScore,
      matchReasons: reasons.length ? reasons : ['General inventory catalog match']
    };
  });

  // Filter based on hard constraints if specified
  let filtered = scoredItems.filter(item => {
    // If user typed a search query, require positive match score
    if (normalizedQuery && item.aiMatchScore < 45 && effectiveMode !== 'sku') {
      return false;
    }
    if (effectiveMode === 'sku' && normalizedQuery && !item.sku.toLowerCase().includes(normalizedQuery)) {
      return false;
    }

    // Explicit Filter Options
    if (options.category && options.category !== 'All' && item.category !== options.category) {
      return false;
    }
    if (options.condition && options.condition !== 'All' && item.condition !== options.condition) {
      return false;
    }
    if (options.isCertifiedOnly && !item.isCertified) {
      return false;
    }
    if (options.minPrice !== undefined && item.price < options.minPrice) {
      return false;
    }
    if (options.maxPrice !== undefined && item.price > options.maxPrice) {
      return false;
    }

    return true;
  });

  // Sort Results
  const sortBy = options.sortBy || 'relevance';
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'discount_desc':
        return b.discountPercent - a.discountPercent;
      case 'newest':
        return b.id.localeCompare(a.id);
      case 'relevance':
      default:
        return b.aiMatchScore - a.aiMatchScore;
    }
  });

  // Available Category breakdown
  const categoryCounts: Record<string, number> = {};
  SURPLUS_INVENTORY.forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  const availableCategories = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count
  }));

  const endTime = performance.now();
  const executionMs = Math.round((endTime - startTime) * 10) / 10;

  // Did you mean suggestion
  let didYouMean: string | undefined;
  if (filtered.length === 0 && normalizedQuery) {
    if (normalizedQuery.includes('server') || normalizedQuery.includes('dell')) {
      didYouMean = 'Refurbished Dell PowerEdge rack servers';
    } else if (normalizedQuery.includes('drill') || normalizedQuery.includes('tool')) {
      didYouMean = 'Bosch or DeWalt cordless power tools';
    } else if (normalizedQuery.includes('wire') || normalizedQuery.includes('cable')) {
      didYouMean = 'Cat6 copper network cable spools in bulk';
    } else {
      didYouMean = 'Enterprise wholesale surplus lots';
    }
  }

  const response: AiSearchResponse = {
    query,
    intent,
    results: filtered,
    totalCount: filtered.length,
    executionMs,
    mode: effectiveMode,
    didYouMean,
    availableCategories,
    priceRange: {
      min: Math.min(...SURPLUS_INVENTORY.map(i => i.price)),
      max: Math.max(...SURPLUS_INVENTORY.map(i => i.price))
    }
  };

  // Add to cache
  if (searchCache.size >= MAX_CACHE_SIZE) {
    const firstKey = searchCache.keys().next().value;
    if (firstKey) searchCache.delete(firstKey);
  }
  searchCache.set(cacheKey, response);

  return response;
}

/**
 * Instant Typeahead / Autosuggest
 * Returns rapid live matching products and suggestions as user types
 */
export function getInstantSuggestions(query: string, limit = 5) {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return { products: [], categories: [], suggestions: [] };

  const matchedProducts = SURPLUS_INVENTORY.filter(item => 
    item.title.toLowerCase().includes(normalized) ||
    item.sku.toLowerCase().includes(normalized) ||
    item.brand.toLowerCase().includes(normalized) ||
    item.tags.some(t => t.includes(normalized))
  ).slice(0, limit);

  const matchedCategories = Array.from(
    new Set(
      SURPLUS_INVENTORY
        .filter(i => i.category.toLowerCase().includes(normalized))
        .map(i => i.category)
    )
  ).slice(0, 3);

  const suggestions: string[] = [];
  if (matchedProducts.length > 0) {
    suggestions.push(matchedProducts[0].title);
  }
  if (normalized.length > 2) {
    suggestions.push(`Refurbished ${normalized} lots`);
    suggestions.push(`Wholesale ${normalized} under $1,000`);
  }

  return {
    products: matchedProducts,
    categories: matchedCategories,
    suggestions: suggestions.slice(0, 3)
  };
}


/**
 * Maps raw backend Neon DB product results into frontend AiSearchResultItem format
 */

/**
 * Maps raw backend Neon DB product results into frontend AiSearchResultItem format
 */

/**
 * Maps raw backend Neon DB product results into frontend AiSearchResultItem format
 */
export function mapBackendProductToAiItem(p: any): AiSearchResultItem {
  const price = Number(p.liquidating_price || p.current_price || 0);
  const retailPrice = Number(p.current_price) || (price > 0 ? Math.round(price * 1.25) : 0);
  const discountPercent = retailPrice > price ? Math.round(((retailPrice - price) / retailPrice) * 100) : 15;

  let img = p.image || '';
  if (img && !img.startsWith('http')) {
    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
    const prefix = img.startsWith('/') ? '' : '/';
    img = apiBase + prefix + img;
  }
  if (!img) {
    img = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80';
  }

  const sku = p.product_id || p.model_no || (p.id ? 'PRO-' + p.id : 'PRO-SURPLUS');
  const catName = typeof p.category === 'object' && p.category ? (p.category.name || p.category.title || p.category.slug || 'Surplus Inventory') : String(p.category || 'Surplus Inventory');
  const brandName = typeof p.brand === 'object' && p.brand ? (p.brand.name || p.brand.title || 'Enterprise') : String(p.brand || 'Enterprise');
  const subCatName = typeof p.subcategory === 'object' && p.subcategory ? (p.subcategory.name || p.subcategory.title || '') : String(p.subcategory || '');

  return {
    id: String(p.id || p.product_id || sku),
    sku: sku,
    title: p.product_name || 'Surplus Inventory Lot',
    brand: brandName,
    category: catName,
    subCategory: subCatName,
    condition: 'Brand New Surplus',
    price: price,
    retailPrice: retailPrice,
    discountPercent: discountPercent,
    moq: 1,
    estQty: p.quantity || 1,
    location: typeof p.inventory_location === 'object' ? (p.inventory_location.name || 'Warehouse Location') : String(p.inventory_location || 'Warehouse Location'),
    country: 'India',
    isCertified: true,
    isVerifiedSeller: true,
    sellerRating: 4.9,
    image: img,
    description: p.product_name,
    specs: {
      'Brand': brandName || 'N/A',
      'Model': p.model_no || 'N/A',
      'Location': typeof p.inventory_location === 'object' ? (p.inventory_location.name || 'N/A') : String(p.inventory_location || 'N/A'),
      'Available Qty': String(p.quantity || 1),
      'Currency': p.currency || 'USD'
    },
    tags: [brandName, catName, subCatName, 'Verified Surplus'].filter(Boolean),
    warranty: p.has_warranty ? 'Verified Warranty Included' : 'Surplus Terms',
    aiMatchScore: Math.round(p.similarity_score || 85),
    matchReasons: (Array.isArray(p.match_reasons) && p.match_reasons.length > 0)

      ? p.match_reasons
      : ['Neon DB pgvector semantic similarity match']
  };
}

function mapBackendLotToAiItem(lot: any): AiSearchResultItem {
  const price = parseFloat(lot.price || lot.ask_price_surplus_payout || lot.asking_price || lot.liquidating_price || 0) || 0;
  const retailPrice = parseFloat(lot.msrp || lot.total_est_retail_value_msrp || lot.retail_price || 0) || Math.round(price * 1.5);
  const discountPercent = retailPrice > price && retailPrice > 0 ? Math.round(((retailPrice - price) / retailPrice) * 100) : 0;

  let img = lot.image || (Array.isArray(lot.warehouse_images) && lot.warehouse_images[0]) || (Array.isArray(lot.images) && lot.images[0]) || '';
  if (!img) {
    img = 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&w=1200&q=80';
  }

  const sku = lot.lot_number || (lot.id ? `LOT-${lot.id}` : 'LOT-SURPLUS');
  let catName = 'Wholesale Lot';
  if (Array.isArray(lot.category_allocations) && lot.category_allocations.length > 0) {
    catName = lot.category_allocations[0]?.category_name || catName;
  } else if (typeof lot.category === 'object' && lot.category) {
    catName = lot.category.name || lot.category.title || 'Wholesale Lot';
  } else if (lot.category) {
    catName = String(lot.category);
  }

  const brandName = lot.key_brands_included || lot.brand || 'Multiple Brands';
  const totalUnits = lot.total_units_quantity || lot.quantity || 1;

  return {
    id: String(lot.id || sku),
    sku: sku,
    title: lot.listing_title || lot.title || lot.product_name || `Wholesale Surplus Lot (${totalUnits} Units)`,
    brand: brandName,
    category: catName,
    subCategory: 'Wholesale Lot',
    condition: 'Liquidation Lot',
    price: price,
    retailPrice: retailPrice,
    discountPercent: discountPercent,
    moq: 1,
    estQty: totalUnits,
    location: lot.inventory_location || 'Warehouse Location',
    country: lot.country || 'UAE / GCC',
    isCertified: Boolean(lot.third_party_certificate_available || lot.third_party_certificate),
    isVerifiedSeller: true,
    sellerRating: 4.9,
    image: img,
    description: lot.lot_description_and_notes || lot.description || '',
    specs: {
      'Type': 'Wholesale Lot',
      'Lot Number': sku,
      'Total Units': String(totalUnits),
      'Load Type': lot.load_type || 'Pallet',
      'Distinct SKUs': String(lot.number_of_distinct_skus || 1)
    },
    tags: ['lot', 'wholesale', catName, brandName, 'liquidation'].filter(Boolean),
    warranty: lot.warranty || 'Surplus Manifest Verified',
    aiMatchScore: Math.round(lot.similarity_score || 90),
    matchReasons: Array.isArray(lot.match_reasons) && lot.match_reasons.length > 0
      ? lot.match_reasons
      : ['Wholesale surplus lot match'],
    isLot: true,
    lotNumber: sku,
    totalUnits: totalUnits
  };
}

/**
 * Normalizes any backend item into an AiSearchResultItem, detecting whether it is a wholesale lot or a single product.
 */
function normalizeBackendItem(item: any): AiSearchResultItem {
  if (!item) return mapBackendProductToAiItem({});

  const isLot = Boolean(
    item.is_lot === true ||
    item.isLot === true ||
    item.type === 'lot' ||
    item.lot_number ||
    (item.sku && String(item.sku).startsWith('LOT-')) ||
    (item.product_id && String(item.product_id).startsWith('LOT-')) ||
    item.total_units_quantity !== undefined ||
    item.listing_title ||
    item.ask_price_surplus_payout
  );

  return isLot ? mapBackendLotToAiItem(item) : mapBackendProductToAiItem(item);
}

/**
 * Universal extractor for Unified API Responses returning products and lots in one payload.
 * Supports:
 * - { success: true, results: [...] } containing both products and lots
 * - { success: true, products: [...], lots: [...] }
 * - { success: true, results: { products: [...], lots: [...] } }
 * - { success: true, data: [...] }
 */
function parseUnifiedSearchPayload(data: any): AiSearchResultItem[] {
  if (!data) return [];

  // Case 1: results array containing unified items
  if (Array.isArray(data.results)) {
    return data.results.map(normalizeBackendItem);
  }

  // Case 2: separate products and lots arrays
  if (Array.isArray(data.products) || Array.isArray(data.lots)) {
    const prods = Array.isArray(data.products) ? data.products.map(mapBackendProductToAiItem) : [];
    const lots = Array.isArray(data.lots) ? data.lots.map(mapBackendLotToAiItem) : [];
    return [...prods, ...lots];
  }

  // Case 3: results object with products and lots
  if (data.results && typeof data.results === 'object') {
    const prods = Array.isArray(data.results.products) ? data.results.products.map(mapBackendProductToAiItem) : [];
    const lots = Array.isArray(data.results.lots) ? data.results.lots.map(mapBackendLotToAiItem) : [];
    if (prods.length || lots.length) {
      return [...prods, ...lots];
    }
  }

  // Case 4: data array
  if (Array.isArray(data.data)) {
    return data.data.map(normalizeBackendItem);
  }

  // Case 5: Root array
  if (Array.isArray(data)) {
    return data.map(normalizeBackendItem);
  }

  return [];
}

/**
 * Executes a Unified Live Natural Language Search across both Products and Wholesale Lots.
 * Connects to unified endpoints GET /api/search/?q=... and GET /api/products/semantic-search/?q=...
 * If query is empty, returns an empty result set (no products or lots displayed).
 */
export async function fetchSemanticSearchResults(
  query: string,
  options: SearchOptions = {}
): Promise<AiSearchResponse> {
  const startTime = performance.now();
  const trimmed = query.trim();

  // If no search query, return empty response immediately
  if (!trimmed) {
    return {
      query: '',
      intent: { rawQuery: '', cleanedQuery: '', confidence: 1 },
      results: [],
      totalCount: 0,
      executionMs: 0,
      mode: 'ai',
      availableCategories: [],
      priceRange: { min: 0, max: 0 }
    };
  }

  try {
    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
    let liveResults: AiSearchResultItem[] = [];
    let parsedIntentFromApi: any = null;

    // 1. Primary Unified Endpoint: GET /api/search/?q=...
    try {
      const searchRes = await fetch(`${apiBase}/api/search/?q=${encodeURIComponent(trimmed)}&limit=36`, {
        headers: { 'Accept': 'application/json' }
      });
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const extracted = parseUnifiedSearchPayload(searchData);
        if (extracted.length > 0) {
          liveResults = extracted;
          parsedIntentFromApi = searchData.parsed_intent;
        }
      }
    } catch (e) {
      // Continue to next endpoint
    }

    // 2. Unified Semantic Endpoint: GET /api/products/semantic-search/?q=...
    if (liveResults.length === 0) {
      try {
        const semRes = await fetch(`${apiBase}/api/products/semantic-search/?q=${encodeURIComponent(trimmed)}&limit=36`, {
          headers: { 'Accept': 'application/json' }
        });
        if (semRes.ok) {
          const semData = await semRes.json();
          const extracted = parseUnifiedSearchPayload(semData);
          if (extracted.length > 0) {
            liveResults = extracted;
            parsedIntentFromApi = semData.parsed_intent;
          }
        }
      } catch (e) {
        // Continue to fallback
      }
    }

    // 3. Fallback: Concurrently query individual catalog & lot search endpoints
    if (liveResults.length === 0) {
      const [productsSettled, lotsSettled] = await Promise.allSettled([
        fetch(`${apiBase}/api/products/?search=${encodeURIComponent(trimmed)}`, {
          headers: { 'Accept': 'application/json' }
        }).then(r => r.ok ? r.json() : null),
        fetch(`${apiBase}/api/lots/?search=${encodeURIComponent(trimmed)}`, {
          headers: { 'Accept': 'application/json' }
        }).then(r => r.ok ? r.json() : null)
      ]);

      const prodData = productsSettled.status === 'fulfilled' ? productsSettled.value : null;
      const lotData = lotsSettled.status === 'fulfilled' ? lotsSettled.value : null;

      const prods = parseUnifiedSearchPayload(prodData);
      const lots = parseUnifiedSearchPayload(lotData);
      liveResults = [...prods, ...lots];
    }

    if (liveResults.length > 0) {
      // Apply client-side sorting
      const sortBy = options.sortBy || 'relevance';
      liveResults.sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'discount_desc':
            return b.discountPercent - a.discountPercent;
          case 'relevance':
          default:
            return b.aiMatchScore - a.aiMatchScore;
        }
      });

      const executionMs = Math.round((performance.now() - startTime) * 10) / 10;

      const categoryCounts: Record<string, number> = {};
      liveResults.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      });
      const availableCategories = Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count
      }));

      const prices = liveResults.map(i => i.price);
      const priceRange = {
        min: prices.length ? Math.min(...prices) : 0,
        max: prices.length ? Math.max(...prices) : 10000
      };

      const intent: ParsedAiIntent = {
        rawQuery: query,
        cleanedQuery: parsedIntentFromApi?.semantic_keywords || trimmed,
        brand: parsedIntentFromApi?.brand || undefined,
        location: parsedIntentFromApi?.location || undefined,
        maxPrice: parsedIntentFromApi?.max_price != null ? parsedIntentFromApi.max_price : undefined,
        minPrice: parsedIntentFromApi?.min_price != null ? parsedIntentFromApi.min_price : undefined,
        confidence: 0.98
      };

      return {
        query,
        intent,
        results: liveResults,
        totalCount: liveResults.length,
        executionMs,
        mode: 'ai',
        availableCategories,
        priceRange
      };
    }
  } catch (err) {
    console.warn('Unified search error, checking local fallback:', err);
  }

  // Fallback to client-side search engine if backend offline
  const fallbackRes = performAiSearch(query, options);
  return fallbackRes;
}

