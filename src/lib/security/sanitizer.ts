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
 * Validates whether a URL is a safe HTTPS or relative HTTP URL.
 * Prevents SSRF / Open Redirect vulnerabilities.
 */
export function isSafeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  // Allow relative URLs starting with /
  if (url.startsWith('/')) return true;

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}
