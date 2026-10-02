/**
 * Surplus Market API Client
 * Centralized, secure HTTP client with error handling, URL resolution, and request sanitization.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
}

export interface RequestOptions extends RequestInit {
  silent?: boolean;
  timeout?: number;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { silent = false, timeout = 12000, ...fetchOptions } = options;
  const base = API_BASE_URL.replace(/\/$/, '');
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${base}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Controller for request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const config: RequestInit = {
    ...fetchOptions,
    signal: fetchOptions.signal || controller.signal,
    headers: {
      ...defaultHeaders,
      ...fetchOptions.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    const text = await response.text();
    let json: any = {};

    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = { message: text };
    }

    if (!response.ok) {
      const errorMsg =
        json.message ||
        json.detail ||
        (typeof json === 'object' && Object.keys(json).length > 0
          ? JSON.stringify(json)
          : `Request failed with status ${response.status}`);

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
    clearTimeout(timeoutId);
    if (!silent) {
      console.warn(`[API Client Notice] ${endpoint}:`, error?.message || error);
    }
    return {
      success: false,
      status: error?.name === 'AbortError' ? 408 : 500,
      message:
        error?.name === 'AbortError'
          ? 'Request timed out. Server may be starting up.'
          : error?.message || 'Network error or server unavailable.',
    };
  }
}
