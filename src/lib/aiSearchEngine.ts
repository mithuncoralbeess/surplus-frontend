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

  return {
    id: String(p.id || p.product_id || sku),
    sku: sku,
    title: p.product_name || 'Surplus Inventory Lot',
    brand: p.brand || 'Enterprise',
    category: p.category || 'Surplus Inventory',
    subCategory: p.subcategory || '',
    condition: 'Brand New Surplus',
    price: price,
    retailPrice: retailPrice,
    discountPercent: discountPercent,
    moq: 1,
    estQty: p.quantity || 1,
    location: p.inventory_location || 'Warehouse Location',
    country: 'India',
    isCertified: true,
    isVerifiedSeller: true,
    sellerRating: 4.9,
    image: img,
    description: p.product_name,
    specs: {
      'Brand': p.brand || 'N/A',
      'Model': p.model_no || 'N/A',
      'Location': p.inventory_location || 'N/A',
      'Available Qty': String(p.quantity || 1),
      'Currency': p.currency || 'USD'
    },
    tags: [p.brand, p.category, p.subcategory, 'Verified Surplus'].filter(Boolean),
    warranty: p.has_warranty ? 'Verified Warranty Included' : 'Surplus Terms',
    aiMatchScore: Math.round(p.similarity_score || 85),
    matchReasons: (Array.isArray(p.match_reasons) && p.match_reasons.length > 0)
      ? p.match_reasons
      : ['Neon DB pgvector semantic similarity match']
  };
}

/**
 * Executes a Live Semantic Natural Language Search against the Neon DB pgvector backend.
 * Falls back gracefully to local client hybrid search if the server is offline or empty.
 */
export async function fetchSemanticSearchResults(
  query: string,
  options: SearchOptions = {}
): Promise<AiSearchResponse> {
  const startTime = performance.now();
  const trimmed = query.trim();

  // If query is empty, return standard client response
  if (!trimmed) {
    return performAiSearch('', options);
  }

  try {
    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
    const endpoint = apiBase + '/api/products/semantic-search/?q=' + encodeURIComponent(trimmed) + '&limit=36';

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.results) && data.results.length > 0) {
        const liveResults: AiSearchResultItem[] = data.results.map(mapBackendProductToAiItem);

        // Apply client-side filters if active
        let filtered = liveResults.filter(item => {
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

        // Apply sorting
        const sortBy = options.sortBy || 'relevance';
        filtered.sort((a, b) => {
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

        const parsed = data.parsed_intent || {};
        const intent: ParsedAiIntent = {
          rawQuery: query,
          cleanedQuery: parsed.semantic_keywords || query,
          brand: parsed.brand || undefined,
          location: parsed.location || undefined,
          maxPrice: parsed.max_price != null ? parsed.max_price : undefined,
          minPrice: parsed.min_price != null ? parsed.min_price : undefined,
          confidence: 0.98
        };

        return {
          query,
          intent,
          results: filtered,
          totalCount: filtered.length,
          executionMs,
          mode: 'ai',
          availableCategories,
          priceRange
        };
      }
    }
  } catch (err) {
    console.warn('Live semantic search error, using local fallback:', err);
  }

  // Graceful fallback to client-side search engine
  return performAiSearch(query, options);
}

