/**
 * Surplus Market API Client
 * Centralized, secure HTTP client with error handling, URL resolution, and request sanitization.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const text = await response.text();
    let json: any = {};

    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = { message: text };
    }

    if (!response.ok) {
      if (response.status === 503 && json?.error === 'Maintenance Mode') {
        if (typeof window !== 'undefined' && window.location.pathname !== '/maintenance') {
          window.location.href = '/maintenance';
        }
      }
      const errorMsg = json.message || json.detail || (typeof json === 'object' && Object.keys(json).length > 0 ? JSON.stringify(json) : `Request failed with status ${response.status}`);
      return {
        success: false,
        status: response.status,
        message: errorMsg,
      };
    }

    return {
      success: true,
      status: response.status,
      data: json.data || json,
      message: json.message,
    };
  } catch (error: any) {
    console.error(`API Client Error [${endpoint}]:`, error);
    return {
      success: false,
      status: 500,
      message: error?.message || 'Network error or server unavailable. Please try again later.',
    };
  }
}
