import { apiClient, ApiResponse } from './apiClient';

export interface ProductRequestPayload {
  user_email: string;
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
  previousPrice: string;
  excludedCountries: string[];
  description: string;
  reasonToSell: string;
  warranty: string;
  certificate: boolean;
  imagesUploaded: boolean;
}

export interface LotRequestPayload {
  user_email: string;
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
  location: string;
  notes?: string;
}

export const catalogService = {
  async submitProductRequest(payload: ProductRequestPayload): Promise<ApiResponse> {
    return apiClient('/submit-product-request/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async submitLotRequest(payload: LotRequestPayload): Promise<ApiResponse> {
    return apiClient('/submit-lot-request/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
