import { apiClient, ApiResponse } from './apiClient';

export interface WhatsAppSubscriptionPayload {
  phone: string;
  name: string;
  company_name?: string;
  email?: string;
  categories: string[];
  preferred_location?: string;
  min_discount_pct?: number;
}

export interface WhatsAppSubscriptionResponse {
  message?: string;
  subscription_id?: string | number;
  status?: string;
  data?: any;
}

export const whatsappService = {
  /**
   * Subscribe a buyer to the WhatsApp Liquidation Pipeline
   * POST /api/whatsapp/subscribe/
   */
  subscribe: async (
    payload: WhatsAppSubscriptionPayload
  ): Promise<ApiResponse<WhatsAppSubscriptionResponse>> => {
    return apiClient<WhatsAppSubscriptionResponse>('/api/whatsapp/subscribe/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
