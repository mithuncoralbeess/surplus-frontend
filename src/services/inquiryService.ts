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

  async submitSourcingEnquiry(payload: {
    fullName?: string;
    name?: string;
    email: string;
    phone?: string;
    sourcingItem?: string;
    lookingFor?: string;
    quantity?: string | number;
    targetPrice?: string;
    notes?: string;
    message?: string;
    searchQuery?: string;
    country?: string;
    source?: string;
    metadata?: any;
    [key: string]: any;
  }): Promise<ApiResponse> {
    try {
      const res = await apiClient('/api/enquiries/sourcing/', {
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
      // Proceed to fallback
    }

    // Fallback to contact-us submission
    return this.submitContactForm({
      fullName: payload.fullName || payload.name,
      name: payload.name || payload.fullName,
      email: payload.email,
      phone: payload.phone,
      enquiryType: payload.enquiryType || (payload.country ? `Regional Quote Request - ${payload.country}` : 'B2B Fast Sourcing Desk'),
      subject: payload.subject || `Sourcing Request: ${payload.sourcingItem || payload.lookingFor || 'Item'} (Qty: ${payload.quantity || '1'})`,
      message: payload.message || `
[B2B SOURCING DESK INQUIRY]
Item / Specs: ${payload.sourcingItem || payload.lookingFor}
Quantity: ${payload.quantity || '1'}
Target Price: ${payload.targetPrice || 'N/A'}
Contact: ${payload.fullName || payload.name} (${payload.email}, ${payload.phone || 'N/A'})
Notes: ${payload.notes || 'None'}
Search Context: ${payload.searchQuery || payload.country || 'N/A'}
      `.trim(),
      metadata: payload.metadata || payload,
    });
  },

  async submitRegionalEnquiry(payload: {
    country: string;
    countrySlug?: string;
    fullName?: string;
    name?: string;
    email: string;
    phone?: string;
    lookingFor?: string;
    sourcingItem?: string;
    quantity?: string | number;
    targetPrice?: string;
    currency?: string;
    notes?: string;
    message?: string;
    source?: string;
    metadata?: any;
    [key: string]: any;
  }): Promise<ApiResponse> {
    try {
      const res = await apiClient('/api/enquiries/regional/', {
        method: 'POST',
        body: JSON.stringify({
          ...payload,
          countryName: payload.country,
          businessEmail: payload.email,
        }),
      });
      if (res.success || res.status === 200 || res.status === 201) {
        return res;
      }
      if (res.status !== 404) {
        return res;
      }
    } catch (e) {
      // Proceed to fallback
    }

    // Fallback to contact-us submission
    return this.submitContactForm({
      fullName: payload.fullName || payload.name || payload.email.split('@')[0],
      name: payload.name || payload.fullName || payload.email.split('@')[0],
      email: payload.email,
      phone: payload.phone,
      enquiryType: `Regional Quote Request - ${payload.country}`,
      subject: payload.subject || `[${payload.country}] Quote Request: ${payload.lookingFor || payload.sourcingItem} (Qty: ${payload.quantity || '1'})`,
      message: payload.message || `
[REGIONAL B2B QUOTE REQUEST]
Country: ${payload.country} (${payload.countrySlug || ''})
Item / Product: ${payload.lookingFor || payload.sourcingItem}
Quantity: ${payload.quantity || '1'}
Target Price: ${payload.targetPrice || 'Open for offers'}
Business Email: ${payload.email}
      `.trim(),
      metadata: payload.metadata || payload,
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
