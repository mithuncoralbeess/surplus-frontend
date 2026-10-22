/**
 * Lot & Virtual Warehouse Explorer Service
 * Interfaces and API endpoints for wholesale lots and manifest SKU explorer.
 */

import { apiClient, ApiResponse } from './apiClient';

export interface WarehouseExplorerSummary {
  total_skus: number;
  total_units: number;
  total_msrp: number;
  total_ask: number;
  blended_discount_pct: number;
  total_brands: number;
  total_categories: number;
}

export interface BrandAllocation {
  brand: string;
  skus: number;
  units: number;
  total_value: number;
  pct_of_value: number;
  pct_of_units: number;
}

export interface ConditionAllocation {
  condition: string;
  skus: number;
  units: number;
  pct_of_units: number;
}

export interface CategoryAllocation {
  category: string;
  skus: number;
  units: number;
  pct_of_units: number;
}

export interface SKUItem {
  s_no: number | string;
  product_name: string;
  product_description?: string;
  product_category?: string;
  subcategory?: string;
  brand?: string;
  model_part_number?: string;
  available_quantity: number;
  original_price?: number;
  asking_price?: number;
  line_msrp?: number;
  line_ask?: number;
  unit_savings?: number;
  country_of_origin?: string;
  year_of_manufacture?: string | number;
  datasheet_certificate_link?: string;
  functional_status?: string;
  tested_and_verified?: string;
  seller_custom_field_1?: string;
  seller_custom_field_2?: string;
  gross_weight_per_unit?: string | number;
  dimensions?: string;
  measurement_unit?: string;
  image?: string;
  stock_age?: string;
  certificate_type?: string;
  [key: string]: any;
}

export interface WarehouseExplorerResponse {
  summary: WarehouseExplorerSummary;
  brand_breakdown: BrandAllocation[];
  condition_breakdown?: ConditionAllocation[];
  category_breakdown?: CategoryAllocation[];
  top_profit_drivers: SKUItem[];
  items: SKUItem[];
  lot_title?: string;
  lot_number?: string;
  currency?: string;
}

/**
 * Generate client-side Warehouse Explorer calculation from raw lot products / manifest data.
 * Used as a zero-latency fallback if the backend endpoint is cold-starting or offline.
 */
export function buildClientWarehouseExplorer(
  rawItems: any[],
  lotMeta?: { title?: string; lot_number?: string; currency?: string; price?: number; msrp?: number }
): WarehouseExplorerResponse {
  const items: SKUItem[] = (rawItems || []).map((raw, idx) => {
    const qty = Number(raw.available_quantity || raw.quantity || raw.units || 1);
    const origPrice = Number(raw.original_price || raw.msrp || raw.retail_price || 0);
    const askPrice = Number(raw.asking_price || raw.price || raw.unit_price || 0);
    const lineMsrp = origPrice > 0 ? origPrice * qty : askPrice * qty;
    const lineAsk = askPrice * qty;
    const unitSavings = Math.max(0, origPrice - askPrice);

    return {
      s_no: raw.s_no || raw.serial_no || idx + 1,
      product_name: raw.product_name || raw.name || raw.title || 'Manifest Item',
      product_description: raw.product_description || raw.description || '',
      product_category: raw.product_category || raw.category || 'General Surplus',
      subcategory: raw.subcategory || '',
      brand: raw.brand && raw.brand !== '-' ? raw.brand.trim() : 'Unspecified',
      model_part_number: raw.model_part_number || raw.sku || raw.part_number || '',
      available_quantity: qty,
      original_price: origPrice,
      asking_price: askPrice,
      line_msrp: lineMsrp,
      line_ask: lineAsk,
      unit_savings: unitSavings,
      country_of_origin: raw.country_of_origin && raw.country_of_origin !== '-' ? raw.country_of_origin : '',
      year_of_manufacture: raw.year_of_manufacture && raw.year_of_manufacture !== '-' ? raw.year_of_manufacture : '',
      datasheet_certificate_link: raw.datasheet_certificate_link || raw.doc_url || '',
      functional_status: raw.functional_status || raw.tested_and_verified || '',
      tested_and_verified: raw.tested_and_verified || raw.functional_status || '',
      seller_custom_field_1: raw.seller_custom_field_1 || raw.bay || '',
      seller_custom_field_2: raw.seller_custom_field_2 || raw.shelf || '',
      gross_weight_per_unit: raw.gross_weight_per_unit || '',
      dimensions: raw.dimensions || '',
      measurement_unit: raw.measurement_unit || 'cm',
      image: raw.image || raw.image_url || raw.photo || '',
      stock_age: raw.stock_age || '',
      certificate_type: raw.certificate_type || '',
    };
  });

  const totalSkus = items.length;
  const totalUnits = items.reduce((sum, item) => sum + item.available_quantity, 0);
  const totalMsrp = Number(lotMeta?.msrp || 0);
  const totalAsk = Number(lotMeta?.price || 0);
  const blendedDiscount = totalMsrp > 0 && totalMsrp > totalAsk 
    ? Math.round(((totalMsrp - totalAsk) / totalMsrp) * 100) 
    : 0;

  // Aggregate Brand Allocations
  const brandMap = new Map<string, { skus: number; units: number; totalValue: number }>();
  items.forEach((item) => {
    const b = item.brand || 'Unspecified';
    const curr = brandMap.get(b) || { skus: 0, units: 0, totalValue: 0 };
    curr.skus += 1;
    curr.units += item.available_quantity;
    curr.totalValue += item.line_msrp || 0;
    brandMap.set(b, curr);
  });

  const brandBreakdown: BrandAllocation[] = Array.from(brandMap.entries())
    .map(([brand, data]) => ({
      brand,
      skus: data.skus,
      units: data.units,
      total_value: data.totalValue,
      pct_of_value: totalMsrp > 0 ? Math.round((data.totalValue / totalMsrp) * 100) : 0,
      pct_of_units: totalUnits > 0 ? Math.round((data.units / totalUnits) * 100) : 0,
    }))
    .sort((a, b) => b.total_value - a.total_value);

  // Extract Top Profit Drivers (Top 4 highest line value SKUs)
  const topProfitDrivers = [...items]
    .sort((a, b) => (b.line_msrp || 0) - (a.line_msrp || 0))
    .slice(0, 4);

  const distinctBrands = new Set(items.map((i) => i.brand).filter(Boolean)).size;
  const distinctCategories = new Set(items.map((i) => i.product_category).filter(Boolean)).size;

  return {
    summary: {
      total_skus: totalSkus,
      total_units: totalUnits,
      total_msrp: totalMsrp,
      total_ask: totalAsk,
      blended_discount_pct: blendedDiscount,
      total_brands: distinctBrands,
      total_categories: distinctCategories,
    },
    brand_breakdown: brandBreakdown,
    top_profit_drivers: topProfitDrivers,
    items,
    lot_title: lotMeta?.title,
    lot_number: lotMeta?.lot_number,
    currency: lotMeta?.currency || 'USD',
  };
}

/**
 * Fetch the complete Virtual Warehouse Explorer payload for a wholesale lot.
 * GET /api/lots/:lotId/explorer/
 */
export async function getLotWarehouseExplorer(
  lotId: string | number,
  fallbackItems?: any[],
  lotMeta?: { title?: string; lot_number?: string; currency?: string; price?: number; msrp?: number }
): Promise<WarehouseExplorerResponse> {
  const cleanId = String(lotId).trim();

  try {
    const res = await apiClient<WarehouseExplorerResponse>(`/api/lots/${cleanId}/explorer/`, {
      silent: true,
      timeout: 8000,
    });

    if (res.success && res.data) {
      const data: any = res.data;
      const payload: WarehouseExplorerResponse = data.data || data;

      if (payload.summary && Array.isArray(payload.items)) {
        return payload;
      }
    }
  } catch (err) {
    console.warn(`[lotService] /api/lots/${cleanId}/explorer/ request failed, falling back to local computation:`, err);
  }

  // Fallback to client-side calculated explorer if endpoint isn't live or returns 404
  if (fallbackItems && fallbackItems.length > 0) {
    return buildClientWarehouseExplorer(fallbackItems, lotMeta);
  }

  // Empty default response
  return {
    summary: {
      total_skus: 0,
      total_units: 0,
      total_msrp: 0,
      total_ask: 0,
      blended_discount_pct: 0,
      total_brands: 0,
      total_categories: 0,
    },
    brand_breakdown: [],
    top_profit_drivers: [],
    items: [],
  };
}

export const lotService = {
  getLotWarehouseExplorer,
  buildClientWarehouseExplorer,
};
