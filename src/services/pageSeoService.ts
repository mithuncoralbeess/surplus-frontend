import { Metadata } from 'next';

const getBackendUrl = (): string => {
  return (
    process.env.BACKEND_API_URL ||
    process.env.INTERNAL_BACKEND_URL ||
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    ''
  ).replace(/\/$/, '');
};

export interface PageSeoData {
  focus_keyphrase?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  robots_index?: string;
  robots_follow?: string;
  robots_advanced?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema_type?: string;
  structured_data?: Record<string, any>;
}

export interface PageResponseData {
  id: number;
  title: string;
  slug: string;
  category?: string;
  content?: string;
  seo?: PageSeoData;
  navigation?: {
    show_in_header?: boolean;
    show_in_footer?: boolean;
    sort_order?: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface PageApiResponse {
  success: boolean;
  page?: PageResponseData;
  message?: string;
}

const seoCache = new Map<string, { data: PageResponseData | null; expiresAt: number }>();
const SEO_CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

/**
 * Fetches page details & SEO metadata from backend API for a given slug.
 * Endpoint: GET /api/pages/{slug}/
 */
export async function fetchPageData(slug: string): Promise<PageResponseData | null> {
  const cached = seoCache.get(slug);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  try {
    const url = `${getBackendUrl()}/api/pages/${slug}/`;
    const res = await fetch(url, {
      next: { revalidate: 300 }, // Cache with 5-minute background revalidation
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      seoCache.set(slug, { data: null, expiresAt: Date.now() + 60000 });
      return null;
    }

    const data: PageApiResponse = await res.json();
    if (data.success && data.page) {
      seoCache.set(slug, { data: data.page, expiresAt: Date.now() + SEO_CACHE_TTL });
      return data.page;
    }

    seoCache.set(slug, { data: null, expiresAt: Date.now() + 60000 });
    return null;
  } catch (error) {
    console.warn(`[SEO API] Could not fetch dynamic SEO for '${slug}':`, error);
    return null;
  }
}

/**
 * Normalizes a canonical URL ensuring:
 * 1. Always uses canonical domain 'https://www.surplusmarket.com' (with www.)
 * 2. If canonical is blank or not provided, automatically constructs a self-referencing canonical from the page's own slug/path.
 */
export function resolveCanonicalUrl(
  rawCanonical?: string,
  pageSlugOrPath?: string
): string {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.surplusmarket.com')
    .trim()
    .replace(/\/$/, '')
    .replace(/^https?:\/\/surplusmarket\.com/i, 'https://www.surplusmarket.com')
    .replace(/^http:\/\/www\.surplusmarket\.com/i, 'https://www.surplusmarket.com');

  let cleaned = (rawCanonical || '').trim();

  // If blank or empty string, automatically construct self-referencing canonical URL
  if (!cleaned) {
    const path = (pageSlugOrPath || '').trim();
    if (!path || path === '/' || path === 'home') {
      return `${baseUrl}`;
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }

  // If relative path like '/about-us'
  if (cleaned.startsWith('/')) {
    return cleaned === '/' ? `${baseUrl}` : `${baseUrl}${cleaned}`;
  }

  // If slug without slash like 'about-us'
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    return `${baseUrl}/${cleaned}`;
  }

  // If absolute URL, ensure it uses https://www.surplusmarket.com
  cleaned = cleaned.replace(/^http:\/\/surplusmarket\.com/i, 'https://www.surplusmarket.com');
  cleaned = cleaned.replace(/^https:\/\/surplusmarket\.com/i, 'https://www.surplusmarket.com');
  cleaned = cleaned.replace(/^http:\/\/www\.surplusmarket\.com/i, 'https://www.surplusmarket.com');

  // Strip trailing slash unless root
  if (cleaned.endsWith('/') && cleaned !== `${baseUrl}/` && cleaned !== 'https://www.surplusmarket.com/') {
    cleaned = cleaned.slice(0, -1);
  }

  return cleaned;
}

/**
 * Generates Next.js Metadata object dynamically from API response,
 * with fallback metadata if API fails or metadata is missing.
 * Automatically computes a self-referencing canonical tag with www if left blank.
 */
export async function getPageMetadata(
  slug: string,
  fallbackMetadata: Metadata = {}
): Promise<Metadata> {
  const pageData = await fetchPageData(slug);
  const seo = pageData?.seo;

  // Determine canonical URL:
  // If seo.canonical_url is provided and non-empty, use it.
  // Else if fallbackMetadata.alternates.canonical is provided and non-empty, use it.
  // Else (if blank or omitted), automatically use the page's own URL based on its slug.
  const rawCanonical = (seo?.canonical_url && seo.canonical_url.trim())
    ? seo.canonical_url
    : (fallbackMetadata.alternates?.canonical ? String(fallbackMetadata.alternates.canonical) : '');

  const canonical = resolveCanonicalUrl(rawCanonical, slug);

  if (!seo && !pageData) {
    return {
      ...fallbackMetadata,
      alternates: {
        ...(fallbackMetadata.alternates || {}),
        canonical,
      },
    };
  }

  const title = seo?.meta_title || pageData?.title || fallbackMetadata.title;
  const description = seo?.meta_description || (typeof fallbackMetadata.description === 'string' ? fallbackMetadata.description : undefined);
  
  let keywords: string[] | undefined = undefined;
  if (seo?.meta_keywords) {
    keywords = seo.meta_keywords.split(',').map((k) => k.trim()).filter(Boolean);
  } else if (Array.isArray(fallbackMetadata.keywords)) {
    keywords = fallbackMetadata.keywords as string[];
  } else if (typeof fallbackMetadata.keywords === 'string') {
    keywords = (fallbackMetadata.keywords as string).split(',').map((k) => k.trim());
  }

  const isNoIndex = seo?.robots_index === 'noindex';
  const isNoFollow = seo?.robots_follow === 'nofollow';

  const ogTitle = seo?.og_title || (typeof title === 'string' ? title : undefined);
  const ogDesc = seo?.og_description || description;
  const ogImages = seo?.og_image ? [{ url: seo.og_image }] : undefined;

  const twTitle = seo?.twitter_title || ogTitle;
  const twDesc = seo?.twitter_description || ogDesc;
  const twImages = seo?.twitter_image ? [seo.twitter_image] : undefined;

  return {
    ...fallbackMetadata,
    title: title || fallbackMetadata.title,
    description: description || fallbackMetadata.description,
    keywords: keywords || fallbackMetadata.keywords,
    alternates: {
      ...(fallbackMetadata.alternates || {}),
      canonical,
    },
    robots: {
      index: !isNoIndex,
      follow: !isNoFollow,
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      images: ogImages,
      siteName: 'Surplus Market',
      type: 'website',
      ...(fallbackMetadata.openGraph || {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: twTitle,
      description: twDesc,
      images: twImages,
      ...(fallbackMetadata.twitter || {}),
    },
  };
}
