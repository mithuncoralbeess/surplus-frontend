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

export const inquiryService = {
  async submitContactForm(payload: ContactUsPayload): Promise<ApiResponse> {
    return apiClient('/api/contact-us/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async submitPartnershipEnquiry(payload: PartnershipEnquiryPayload): Promise<ApiResponse> {
    return apiClient('/api/partnership-enquiry/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
