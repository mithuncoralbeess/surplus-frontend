/**
 * Advanced File Upload Security Module
 * Protects against OWASP A04/A08 & File Upload Vulnerabilities:
 * - Unrestricted File Upload
 * - Executable / Malicious Script Execution (e.g. .php, .exe, .sh, .svg XSS)
 * - Double Extension Attacks (e.g. malicious.php.jpg)
 * - Path Traversal in Filenames (e.g. ../../etc/passwd)
 * - Denial of Service via Huge Files (File Size Limits)
 * - MIME Type Spoofing
 */

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFileName?: string;
}

export interface FileValidationOptions {
  maxSizeBytes?: number; // Default: 5MB for images, 10MB for documents
  allowedExtensions?: string[];
  allowedMimeTypes?: string[];
  preventDoubleExtension?: boolean;
}

// Strictly forbidden dangerous extensions (Executables, Scripts, System files, HTML/SVG XSS vectors)
const DANGEROUS_EXTENSIONS = new Set([
  'exe', 'php', 'phtml', 'php3', 'php4', 'php5', 'phps', 'phar',
  'js', 'jsp', 'asp', 'aspx', 'cgi', 'pl', 'py', 'sh', 'bash', 'bat',
  'cmd', 'com', 'vbs', 'vbe', 'js', 'jse', 'ws', 'wsf', 'wsc', 'wsh',
  'ps1', 'ps2', 'psc1', 'psc2', 'msh', 'msh1', 'msh2', 'inf', 'reg',
  'dll', 'drv', 'sys', 'scr', 'cpl', 'jar', 'iso', 'img', 'htm', 'html',
  'svg', 'xml', 'htaccess', 'htpasswd', 'env', 'config'
]);

// Allowed safe image extensions & MIME types (SVG excluded to prevent Stored XSS)
export const SAFE_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
export const SAFE_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

// Allowed manifest / document extensions & MIME types
export const SAFE_DOCUMENT_EXTENSIONS = ['csv', 'xlsx', 'xls', 'pdf'];
export const SAFE_DOCUMENT_MIME_TYPES = [
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/pdf',
];

/**
 * Sanitizes filename to prevent Path Traversal, Null Bytes, and Script Injection.
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName) return 'unnamed_file';

  // Remove directory traversal sequences (../, ..\) and null bytes (%00)
  let clean = fileName.replace(/(\.\.[\/\\]|\0|%00)/g, '');

  // Remove leading/trailing spaces and dots
  clean = clean.trim().replace(/^\.+|\.+$/g, '');

  // Replace any character that is not alphanumeric, underscore, hyphen, or dot with underscore
  clean = clean.replace(/[^a-zA-Z0-9_\-\.]/g, '_');

  // Limit filename length to 100 characters to prevent buffer overflow/long name attacks
  if (clean.length > 100) {
    const extIndex = clean.lastIndexOf('.');
    if (extIndex !== -1) {
      const namePart = clean.substring(0, 90);
      const extPart = clean.substring(extIndex);
      clean = `${namePart}${extPart}`;
    } else {
      clean = clean.substring(0, 100);
    }
  }

  return clean || 'sanitized_file';
}

/**
 * Validates a file against security constraints before processing or uploading.
 */
export function validateFileUpload(
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  const fileName = file.name || '';
  const sanitized = sanitizeFileName(fileName);
  const maxSizeBytes = options.maxSizeBytes || 10 * 1024 * 1024; // Default 10MB

  // 1. File Size Validation
  if (file.size <= 0) {
    return { valid: false, error: 'File is empty or corrupted (0 bytes).' };
  }

  if (file.size > maxSizeBytes) {
    const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size exceeds maximum allowed limit of ${maxMb}MB.`,
    };
  }

  // Extract file extensions
  const nameParts = fileName.toLowerCase().split('.').filter(Boolean);
  if (nameParts.length < 2) {
    return { valid: false, error: 'File has no extension.' };
  }

  const fileExtension = nameParts[nameParts.length - 1];

  // 2. Dangerous Extension Check (Blacklist)
  if (DANGEROUS_EXTENSIONS.has(fileExtension)) {
    return {
      valid: false,
      error: `Security Violation: Files with .${fileExtension} extensions are strictly prohibited.`,
    };
  }

  // 3. Double Extension Attack Prevention (e.g. file.php.png or script.exe.csv)
  if (options.preventDoubleExtension !== false && nameParts.length > 2) {
    for (let i = 1; i < nameParts.length - 1; i++) {
      if (DANGEROUS_EXTENSIONS.has(nameParts[i])) {
        return {
          valid: false,
          error: `Security Violation: Multi-extension files containing .${nameParts[i]} are strictly prohibited.`,
        };
      }
    }
  }

  // 4. Allowed Extension Check (Whitelist)
  if (options.allowedExtensions && options.allowedExtensions.length > 0) {
    const normalizedAllowed = options.allowedExtensions.map((e) =>
      e.toLowerCase().replace('.', '')
    );
    if (!normalizedAllowed.includes(fileExtension)) {
      return {
        valid: false,
        error: `Invalid file format. Allowed formats: .${normalizedAllowed.join(', .')}`,
      };
    }
  }

  // 5. Allowed MIME Type Check
  if (options.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
    const mimeType = file.type ? file.type.toLowerCase() : '';
    // If MIME type is present, verify against whitelist
    if (mimeType && !options.allowedMimeTypes.includes(mimeType)) {
      return {
        valid: false,
        error: `Security Error: File MIME type '${mimeType}' is not supported.`,
      };
    }
  }

  return {
    valid: true,
    sanitizedFileName: sanitized,
  };
}

/**
 * Validates batch of images (Max 5MB per image, safe formats only)
 */
export function validateImageUpload(file: File): FileValidationResult {
  return validateFileUpload(file, {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB max
    allowedExtensions: SAFE_IMAGE_EXTENSIONS,
    allowedMimeTypes: SAFE_IMAGE_MIME_TYPES,
    preventDoubleExtension: true,
  });
}

/**
 * Validates inventory manifest document (Max 10MB, CSV/XLSX/PDF only)
 */
export function validateManifestUpload(file: File): FileValidationResult {
  return validateFileUpload(file, {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB max
    allowedExtensions: SAFE_DOCUMENT_EXTENSIONS,
    allowedMimeTypes: SAFE_DOCUMENT_MIME_TYPES,
    preventDoubleExtension: true,
  });
}
