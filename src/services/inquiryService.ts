import { apiClient, ApiResponse } from './apiClient';

export interface ContactUsPayload {
  fullName?: string;
  name?: string;
  email: string;
  phone?: string;
  enquiryType?: string;
  subject?: string;
  message: string;
  [key: string]: any;
}

export interface PartnershipEnquiryPayload {
  name?: string;
  company_name?: string;
  contact_person?: string;
  email: string;
  phone?: string;
  location?: string;
  interest?: string;
  partnership_type?: string;
  country?: string;
  subject?: string;
  message: string;
  [key: string]: any;
}

export interface RfqItemPayload {
  id: string;
  productId?: string | number;
  title: string;
  sku?: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  targetPrice?: number;
  notes?: string;
}

export interface RfqEnquiryPayload {
  contact_person: string;
  company_name: string;
  email: string;
  phone?: string;
  destination_port?: string;
  business_location?: string;
  country?: string;
  incoterm?: string;
  payment_method?: string;
  target_date?: string;
  additional_notes?: string;
  items: RfqItemPayload[];
  total_units: number;
  estimated_value: number;
  currency: string;
  [key: string]: any;
}

export const inquiryService = {
  async submitContactForm(payload: ContactUsPayload): Promise<ApiResponse> {
    return apiClient('/api/enquiries/contact-us/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async submitPartnershipEnquiry(payload: PartnershipEnquiryPayload): Promise<ApiResponse> {
    return apiClient('/api/enquiries/partnership/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async submitRfqEnquiry(payload: RfqEnquiryPayload): Promise<ApiResponse> {
    try {
      // First attempt dedicated RFQ enquiry endpoint
      const res = await apiClient('/api/enquiries/rfq/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.success || res.status === 200 || res.status === 201) {
        return res;
      }
      if (res.status !== 404) {
        return res;
      }
    } catch (e) {
      // If endpoint doesn't exist, proceed to unified contact fallback
    }

    // Fallback through standard contact-us submission endpoint
    const summaryLines = payload.items.map(
      (it, idx) => `${idx + 1}. ${it.title} (SKU: ${it.sku || 'N/A'}) - Qty: ${it.quantity} units @ $${it.unitPrice}${it.targetPrice ? ` [Target: $${it.targetPrice}]` : ''}`
    ).join('\n');

    const formattedMessage = `
[OFFICIAL RFQ ENQUIRY BASKET SUBMISSION]
Company: ${payload.company_name}
Contact Person: ${payload.contact_person}
Destination Port / Location: ${payload.destination_port || 'N/A'}, ${payload.country || ''}
Total Units: ${payload.total_units}
Estimated Total Value: $${payload.estimated_value} (${payload.currency})

ITEMS LIST:
${summaryLines}

ADDITIONAL NOTES:
${payload.additional_notes || 'None'}
    `.trim();

    return apiClient('/api/enquiries/contact-us/', {
      method: 'POST',
      body: JSON.stringify({
        fullName: payload.contact_person,
        name: payload.contact_person,
        email: payload.email,
        phone: payload.phone,
        enquiryType: 'RFQ Quotation Request',
        subject: `RFQ Basket Enquiry: ${payload.company_name} (${payload.total_units} units)`,
        message: formattedMessage,
        metadata: {
          items_count: payload.items.length,
          total_units: payload.total_units,
          estimated_value: payload.estimated_value,
        }
      }),
    });
  },

  async getUserRfqs(email?: string, vendorId?: string): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams();
      if (email) params.append('email', email);
      if (vendorId) params.append('vendor_id', vendorId);
      const query = params.toString() ? `?${params.toString()}` : '';
      return await apiClient(`/api/enquiries/rfq/${query}`, {
        method: 'GET',
      });
    } catch (err: any) {
      console.warn('[inquiryService] Error fetching user RFQs:', err);
      return { success: false, data: [] };
    }
  },
};

export const enquiryService = inquiryService;
