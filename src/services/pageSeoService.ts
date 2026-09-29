import { Metadata } from 'next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

/**
 * Fetches page details & SEO metadata from backend API for a given slug.
 * Endpoint: GET /api/pages/{slug}/
 */
export async function fetchPageData(slug: string): Promise<PageResponseData | null> {
  try {
    const url = `${API_BASE_URL}/api/pages/${slug}/`;
    const res = await fetch(url, {
      cache: 'no-store', // Always fetch fresh SEO data instantly from backend
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      return null;
    }

    const data: PageApiResponse = await res.json();
    if (data.success && data.page) {
      return data.page;
    }
    return null;
  } catch (error) {
    console.warn(`[SEO API] Could not fetch dynamic SEO for '${slug}':`, error);
    return null;
  }
}

/**
 * Generates Next.js Metadata object dynamically from API response,
 * with fallback metadata if API fails or metadata is missing.
 */
export async function getPageMetadata(
  slug: string,
  fallbackMetadata: Metadata = {}
): Promise<Metadata> {
  const pageData = await fetchPageData(slug);
  const seo = pageData?.seo;

  if (!seo && !pageData) {
    return fallbackMetadata;
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

  const canonical = seo?.canonical_url || (fallbackMetadata.alternates?.canonical ? String(fallbackMetadata.alternates.canonical) : undefined);

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
    alternates: canonical ? { canonical } : fallbackMetadata.alternates,
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
