import { apiClient, ApiResponse } from './apiClient';

export interface SendOtpPayload {
  email: string;
  full_name?: string;
  mobile_number?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface CompleteProfilePayload {
  email: string;
  full_name?: string;
  mobile_number?: string;
  phone?: string;
  account_entity_type: 'COMPANY' | 'INDIVIDUAL';
  company_name?: string;
  business_address?: string;
  tax_registration_number?: string;
  business_type?: string;
  business_location: string;
  user_type: string;
  category_interested?: string;
}

export const authService = {
  async sendRegistrationOtp(payload: SendOtpPayload): Promise<ApiResponse> {
    return apiClient('/api/auth/register/send-otp/', {
      method: 'POST',
      body: JSON.stringify({
        full_name: payload.full_name,
        email: payload.email,
        mobile_number: payload.mobile_number,
      }),
    });
  },

  async sendLoginOtp(email: string): Promise<ApiResponse> {
    return apiClient('/api/auth/login/send-otp/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async verifyRegistrationOtp(payload: VerifyOtpPayload): Promise<ApiResponse> {
    return apiClient('/api/auth/register/verify-otp/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async verifyLoginOtp(payload: VerifyOtpPayload): Promise<ApiResponse> {
    return apiClient('/api/auth/login/verify-otp/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async completeProfile(payload: CompleteProfilePayload): Promise<ApiResponse> {
    return apiClient('/api/auth/register/complete-profile/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getProfile(email: string): Promise<ApiResponse> {
    return apiClient(`/api/auth/register/complete-profile/?email=${encodeURIComponent(email)}`, {
      method: 'GET',
    });
  },
};
