import { BlogPost, BlogSeoData } from '../data/blogData';
import { apiClient } from './apiClient';

export interface ApiBlogPost {
  id?: string | number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  author_name?: string;
  author_role?: string;
  author_avatar?: string;
  author?: {
    name?: string;
    role?: string;
    avatar?: string;
  };
  created_at?: string;
  published_at?: string;
  publishedAt?: string;
  read_time?: string;
  readTime?: string;
  cover_image?: string;
  coverImage?: string;
  image?: string;
  image_url?: string;
  featured_image?: string;
  featured_image_url?: string;
  featured?: boolean;
  tags?: string[] | string;
  key_takeaways?: string[];
  keyTakeaways?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  seo?: BlogSeoData;
}

export interface ApiBlogsResponse {
  success?: boolean;
  blogs?: ApiBlogPost[];
  data?: ApiBlogPost[] | { blogs?: ApiBlogPost[] };
  results?: ApiBlogPost[];
  [key: string]: any;
}

/**
 * Finds the starting index of an explicit FAQ section heading in the content.
 * Matches <h1-6>, <p>, or <div> tags whose inner text is strictly FAQ / FAQs / Frequently Asked Questions.
 * Returns -1 if no FAQ section header is present.
 */
export function findFaqHeaderIndex(content: string): number {
  if (!content) return -1;

  const headingRegex = /<(h[1-6]|p|div)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const innerText = match[2]
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .trim();

    // Must be exclusively FAQ / FAQs / Frequently Asked Questions (not part of an article sentence)
    if (/^(?:FAQ|FAQs|FAQ’s|FAQ's|Frequently Asked Questions)[\s.:?!]*$/i.test(innerText)) {
      return match.index;
    }
  }

  return -1;
}

export function extractFaqsFromContent(content: string): Array<{ question: string; answer: string }> {
  if (!content) return [];

  const headerIndex = findFaqHeaderIndex(content);
  if (headerIndex === -1) {
    // If there is no explicit FAQ section header, do not treat random numbered points as FAQs
    return [];
  }

  const faqSection = content.substring(headerIndex);
  const faqs: Array<{ question: string; answer: string }> = [];

  // Structure A: List items under FAQ header (<ol><li>...</li> or <ul><li>...</li>)
  const listItems = faqSection.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
  if (listItems && listItems.length > 0) {
    for (const item of listItems) {
      const clean = item.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim();
      const qMatch = clean.match(/^([\s\S]*?\?)\s*([\s\S]*)$/);
      if (qMatch) {
        faqs.push({ question: qMatch[1].trim(), answer: qMatch[2].trim() });
      } else {
        const colonMatch = clean.match(/^(\d+[\.\)]\s*[^:\n]+[:])\s*([\s\S]*)$/);
        if (colonMatch) {
          faqs.push({ question: colonMatch[1].trim(), answer: colonMatch[2].trim() });
        }
      }
    }
    if (faqs.length > 0) return faqs;
  }

  // Structure B: Paragraphs & headings under FAQ section
  const blocks = faqSection.match(/<(p|h[3-6])[^>]*>([\s\S]*?)<\/\1>/gi) || [];
  let currentQ = '';
  let currentA: string[] = [];

  for (const block of blocks) {
    const cleanText = block.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim();
    if (!cleanText) continue;

    // Check if the block has a bold question inside: e.g. <p><strong>1. Question?</strong>Answer...</p>
    const boldMatch = block.match(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/i);
    let inlineQ = '';
    let inlineA = '';

    if (boldMatch) {
      const qCandidate = boldMatch[1].replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim();
      if ((/^\d+[\.\)]/.test(qCandidate) && (qCandidate.includes('?') || qCandidate.endsWith(':'))) || /^[^\n\r]+[?:]$/.test(qCandidate)) {
        inlineQ = qCandidate;
        const afterStrong = block.substring(boldMatch.index! + boldMatch[0].length).replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim();
        if (afterStrong) {
          inlineA = afterStrong;
        }
      }
    }

    if (inlineQ) {
      if (currentQ && currentA.length > 0) {
        faqs.push({ question: currentQ, answer: currentA.join(' ') });
      }
      currentQ = inlineQ;
      currentA = inlineA ? [inlineA] : [];
    } else {
      // Standalone question block
      const isStandaloneQ = ((/^(?:\d+[\.\)]\s*)?[^?\n\r]+[?:]$/i.test(cleanText) || (/^\d+[\.\)]/.test(cleanText) && cleanText.includes('?')))) && cleanText.length < 250;
      if (isStandaloneQ) {
        if (currentQ && currentA.length > 0) {
          faqs.push({ question: currentQ, answer: currentA.join(' ') });
        }
        currentQ = cleanText;
        currentA = [];
      } else if (currentQ) {
        currentA.push(cleanText);
      }
    }
  }

  if (currentQ && currentA.length > 0) {
    faqs.push({ question: currentQ, answer: currentA.join(' ') });
  }

  return faqs;
}

export function stripFaqFromContent(content: string): string {
  if (!content) return '';

  const index = findFaqHeaderIndex(content);
  if (index !== -1 && index > 30) {
    return content.substring(0, index).trim();
  }

  return content;
}

function getBackendBaseUrl(): string {
  return (
    process.env.BACKEND_API_URL ||
    process.env.BACKEND_APT_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.INTERNAL_BACKEND_URL ||
    process.env.API_BASE_URL ||
    'https://dev.surplusmarket.com'
  ).replace(/\/$/, '');
}

export function resolveMediaUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const base = getBackendBaseUrl();
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
}

export function fixContentImageUrls(content: string): string {
  if (!content) return '';
  const base = getBackendBaseUrl();
  return content.replace(/src=["'](?:https?:\/\/[^\/]+)?\/media\/([^"']+)["']/gi, `src="${base}/media/$1"`);
}

export function mapApiBlogToBlogPost(apiPost: ApiBlogPost): BlogPost {
  const authorName = apiPost.author?.name || apiPost.author_name || 'Surplus Market Team';
  const authorRole = apiPost.author?.role || apiPost.author_role || 'Supply Chain Specialist';
  const authorAvatar = resolveMediaUrl(apiPost.author?.avatar || apiPost.author_avatar || '');

  const rawCoverImage =
    (apiPost as any).absolute_image_url ||
    apiPost.coverImage ||
    apiPost.cover_image ||
    apiPost.image ||
    apiPost.image_url ||
    apiPost.featured_image_url ||
    apiPost.featured_image ||
    '';
  const coverImage = resolveMediaUrl(rawCoverImage);

  let tagsArray: string[] = [];
  if (Array.isArray(apiPost.tags)) {
    tagsArray = apiPost.tags;
  } else if (typeof apiPost.tags === 'string') {
    tagsArray = (apiPost.tags as string).split(',').map((t) => t.trim()).filter(Boolean);
  }

  let rawContent = apiPost.content || '';
  if (rawContent) {
    rawContent = fixContentImageUrls(rawContent);
  }

  let parsedFaqs: Array<{ question: string; answer: string }> = [];
  const rawFaqs = apiPost.faqs || (apiPost as any).faq || (apiPost as any).faq_items || (apiPost as any).faqs_data;

  if (Array.isArray(rawFaqs) && rawFaqs.length > 0) {
    parsedFaqs = rawFaqs
      .map((f: any) => ({
        question: f.question || f.q || f.title || f.name || '',
        answer: f.answer || f.a || f.content || f.description || f.body || '',
      }))
      .filter((f) => f.question && f.answer);
  } else if (rawContent) {
    parsedFaqs = extractFaqsFromContent(rawContent);
  }

  return {
    id: String(apiPost.id || apiPost.slug),
    slug: apiPost.slug,
    title: apiPost.title,
    excerpt: apiPost.excerpt || '',
    content: rawContent,
    category: apiPost.category || 'Market Insights',
    author: {
      name: authorName,
      role: authorRole,
      avatar: authorAvatar,
    },
    publishedAt: apiPost.publishedAt || apiPost.published_at || apiPost.created_at || 'Sept 2026',
    readTime: apiPost.readTime || apiPost.read_time || '5 min read',
    coverImage: coverImage,
    featured: apiPost.featured || false,
    tags: tagsArray,
    keyTakeaways: apiPost.keyTakeaways || apiPost.key_takeaways || [],
    faqs: parsedFaqs,
    seo: apiPost.seo || (apiPost as any).seo_data || undefined,
  };
}

export interface BlogsPageResponse {
  posts: BlogPost[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

/**
 * Fetch a specific page of blogs from API: GET /api/blogs/?page=<page>
 */
export async function getBlogsPage(page: number = 1): Promise<BlogsPageResponse> {
  try {
    const res = await apiClient<any>(`/api/blogs/?page=${page}`, {
      cacheTtl: false,
      revalidate: true,
      persistCache: false,
      silent: true,
    });

    if (!res.success) {
      return { posts: [], totalPages: 1, totalCount: 0, currentPage: page };
    }

    const rawObj = res.raw || {};
    const totalPages = Number(res.total_pages || rawObj.total_pages || (res.data as any)?.total_pages || 1);
    const totalCount = Number(res.count || rawObj.count || (res.data as any)?.count || 0);
    const currentPage = Number(res.current_page || rawObj.current_page || (res.data as any)?.current_page || page);

    let rawPosts: ApiBlogPost[] = [];
    if (Array.isArray(res.data)) {
      rawPosts = res.data;
    } else if (Array.isArray((res.data as any)?.blogs)) {
      rawPosts = (res.data as any).blogs;
    } else if (Array.isArray(rawObj.blogs)) {
      rawPosts = rawObj.blogs;
    } else if (Array.isArray(rawObj.data)) {
      rawPosts = rawObj.data;
    } else if (Array.isArray(rawObj.results)) {
      rawPosts = rawObj.results;
    }

    return {
      posts: rawPosts.map(mapApiBlogToBlogPost),
      totalPages,
      totalCount: totalCount || (totalPages * 12),
      currentPage,
    };
  } catch (error) {
    console.warn(`[Blog API] Network error fetching page ${page}:`, error);
    return { posts: [], totalPages: 1, totalCount: 0, currentPage: page };
  }
}

/**
 * Fetch all blogs from API across all paginated pages.
 * Real-time dynamic fetch - automatically fetches across all paginated pages
 * to ensure all published blogs (52+) from the backend API are retrieved.
 */
export async function getBlogs(): Promise<BlogPost[]> {
  try {
    const firstPage = await getBlogsPage(1);
    const allPosts: BlogPost[] = [...firstPage.posts];

    if (firstPage.totalPages > 1) {
      const pageRequests = [];
      for (let p = 2; p <= firstPage.totalPages; p++) {
        pageRequests.push(getBlogsPage(p));
      }
      const pageResponses = await Promise.all(pageRequests);
      for (const pRes of pageResponses) {
        allPosts.push(...pRes.posts);
      }
    }

    if (allPosts.length === 0) {
      return [];
    }

    // Deduplicate by slug or id
    const seen = new Set<string>();
    const uniquePosts: BlogPost[] = [];
    for (const post of allPosts) {
      const identifier = post.slug || String(post.id);
      if (!seen.has(identifier)) {
        seen.add(identifier);
        uniquePosts.push(post);
      }
    }

    return uniquePosts;
  } catch (error) {
    console.warn('[Blog API] Network error fetching blogs:', error);
    return [];
  }
}

/**
 * Fetch a single blog by slug from API: GET /api/blogs/<slug>/
 * Real-time dynamic fetch - uses backend API data only (no static/fallback mock data).
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await apiClient(`/api/blogs/${slug}/`, {
      cacheTtl: false,
      revalidate: true,
      persistCache: false,
      silent: true,
    });

    if (!res.success || !res.data) {
      return null;
    }

    const json = res.data;
    const rawPost: ApiBlogPost = json.blog || json.data || json;

    if (!rawPost || !rawPost.title) {
      return null;
    }

    return mapApiBlogToBlogPost(rawPost);
  } catch (error) {
    console.warn(`[Blog API] Network error fetching blog detail for '${slug}':`, error);
    return null;
  }
}
