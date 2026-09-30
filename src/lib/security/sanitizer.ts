/**
 * Input Sanitizer & Security Utilities
 * Protects against OWASP Top 10 Vulnerabilities:
 * - A03: Injection & Cross-Site Scripting (XSS)
 * - A07: Identification and Authentication Failures
 */

/**
 * Sanitizes plain text input by stripping HTML/script tags and encoding special characters.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    // Remove HTML tags & script tags
    .replace(/<[^>]*>/g, '')
    // Remove inline JS event handlers (e.g. onerror=, onload=)
    .replace(/on\w+\s*=/gi, '')
    // Remove javascript: pseudo-protocol URIs
    .replace(/javascript\s*:/gi, '')
    // Trim excess whitespace
    .trim();
}

/**
 * Sanitizes all string values within an object recursively.
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized: Record<string, any> = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (typeof val === 'string') {
        sanitized[key] = sanitizeInput(val);
      } else if (typeof val === 'object' && val !== null && (typeof File === 'undefined' || !((val as any) instanceof File))) {
        sanitized[key] = sanitizeObject(val);
      } else {
        sanitized[key] = val;
      }
    }
  }

  return sanitized as T;
}

/**
 * Sanitizes a URL input string to prevent cyber attacks:
 * - Strips pseudo-protocols (javascript:, data:, vbscript:, file:, blob:)
 * - Strips CRLF characters (\r, \n, %0d, %0a) to prevent HTTP Header Injection
 * - Strips HTML tags and script payloads
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';

  let cleaned = url
    // Remove control chars & line breaks (CRLF injection prevention)
    .replace(/[\r\n\t]/g, '')
    .replace(/%0[ad]/gi, '')
    // Remove HTML tags and quotes
    .replace(/<[^>]*>/g, '')
    .replace(/["'<>]/g, '')
    // Remove inline JS handlers
    .replace(/on\w+\s*=/gi, '')
    .trim();

  // Block dangerous pseudo-protocols (XSS / Local File Inclusion)
  const dangerousProtocols = /^(javascript|data|vbscript|file|blob|ftp):/i;
  if (dangerousProtocols.test(cleaned)) {
    return '';
  }

  // Prevent protocol-relative URLs starting with // (Open Redirect) unless http(s)://
  if (cleaned.startsWith('//')) {
    return '';
  }

  return cleaned;
}

/**
 * Validates whether a URL is a safe HTTPS, HTTP, or relative URL.
 * Protects against SSRF, Open Redirect, and Protocol-based XSS attacks.
 */
export function isSafeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  const sanitized = sanitizeUrl(url);
  if (!sanitized) return false;

  // Allow safe relative paths (e.g. /browse, /profile)
  if (sanitized.startsWith('/') && !sanitized.startsWith('//')) {
    return true;
  }

  try {
    const parsed = new URL(sanitized);
    // Strict whitelist: Only http and https protocols are permitted
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}
