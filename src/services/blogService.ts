import { BlogPost, MOCK_BLOG_POSTS } from '../data/blogData';
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
}

export interface ApiBlogsResponse {
  success?: boolean;
  blogs?: ApiBlogPost[];
  data?: ApiBlogPost[] | { blogs?: ApiBlogPost[] };
  results?: ApiBlogPost[];
  [key: string]: any;
}

export function extractFaqsFromContent(content: string): Array<{ question: string; answer: string }> {
  if (!content) return [];

  const faqs: Array<{ question: string; answer: string }> = [];

  // Find FAQ section or start from first numbered item
  let faqSection = content;
  const faqHeaderMatch = content.match(/(?:(?:<h[1-6][^>]*>|<p[^>]*>(?:\s*<(?:strong|b)[^>]*>)?|<div[^>]*>)\s*(?:FAQ[s]?|Frequently Asked Questions)[\s\S]*|1[\.\)]\s*[^<\n\r]+[?\:][\s\S]*)/i);
  if (faqHeaderMatch && faqHeaderMatch[0]) {
    faqSection = faqHeaderMatch[0];
  }

  // Match numbered questions: "1. What is...", "2. Where can...", etc.
  const itemRegex = /(?:<p[^>]*>)?\s*(?:<(?:strong|b)[^>]*>)?\s*(\d+[\.\)]\s*[^<\n\r\?]+[?\:]?)\s*(?:<\/(?:strong|b)>)?\s*(?:<br\s*\/?>)?\s*([\s\S]*?)(?=(?:<p[^>]*>)?\s*(?:<(?:strong|b)[^>]*>)?\s*\d+[\.\)]|(?:<h[1-6]|$))/gi;

  let match;
  while ((match = itemRegex.exec(faqSection)) !== null) {
    let rawQ = match[1] || '';
    let rawA = match[2] || '';

    let q = rawQ.replace(/<[^>]*>/g, '').trim();
    let a = rawA.replace(/<[^>]*>/g, '').trim();

    a = a.replace(/^(?:<br\s*\/?>|\s)+/gi, '').trim();

    if (q && a && a.length > 3) {
      faqs.push({
        question: q,
        answer: a,
      });
    }
  }

  // Fallback for H3/H4 questions if numbered format was not used
  if (faqs.length === 0) {
    const headingQuestionRegex = /(?:<h[3-6][^>]*>|<p[^>]*>\s*<(?:strong|b)[^>]*>)([^<]+[?\:])(?:<\/h[3-6]>|<\/(?:strong|b)>\s*<\/p>)\s*(?:<p[^>]*>([\s\S]*?)<\/p>)/gi;
    while ((match = headingQuestionRegex.exec(faqSection)) !== null) {
      let q = match[1].replace(/<[^>]*>/g, '').trim();
      let a = match[2].replace(/<[^>]*>/g, '').trim();
      if (q && a && a.length > 3) {
        faqs.push({
          question: q,
          answer: a,
        });
      }
    }
  }

  return faqs;
}

export function stripFaqFromContent(content: string): string {
  if (!content) return '';

  // 1. Strip from FAQ or Frequently Asked Questions header tag
  const faqHeadingRegex = /(?:<h[1-6][^>]*>|<p[^>]*>(?:\s*<(?:strong|b)[^>]*>)?|<div[^>]*>)\s*(?:FAQ[s]?|Frequently Asked Questions)/i;
  const headingMatch = content.search(faqHeadingRegex);
  if (headingMatch !== -1 && headingMatch > 30) {
    return content.substring(0, headingMatch).trim();
  }

  // 2. Strip from standalone FAQ text (e.g. <h2>FAQ</h2> or FAQ on its own line)
  const standaloneFaqRegex = /\bFAQ[s]?\b/i;
  const standaloneMatch = content.search(standaloneFaqRegex);
  if (standaloneMatch !== -1 && standaloneMatch > 30) {
    // Find preceding tag start if any
    const lastTagStart = content.lastIndexOf('<', standaloneMatch);
    const cutIndex = (lastTagStart !== -1 && lastTagStart > 30) ? lastTagStart : standaloneMatch;
    return content.substring(0, cutIndex).trim();
  }

  // 3. Fallback: Strip from first numbered question like "1. What is..."
  const firstQuestionRegex = /(?:<p[^>]*>)?\s*(?:<(?:strong|b)[^>]*>)?\s*1[\.\)]\s*[^<\n\r]+[?\:]/i;
  const questionMatch = content.search(firstQuestionRegex);
  if (questionMatch !== -1 && questionMatch > 30) {
    return content.substring(0, questionMatch).trim();
  }

  return content;
}

export function fixContentImageUrls(content: string): string {
  if (!content) return '';
  const fallbackImg = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80';

  // 1. Rewrite media URLs to relative /media/...
  let fixed = content.replace(/src=["'](?:https?:\/\/[^\/]+)?\/media\/([^"']+)["']/gi, (match, path) => {
    return `src="/media/${path}" onerror="this.onerror=null;this.src='${fallbackImg}';"`;
  });

  // 2. Add fallback onerror to any other <img> tag missing an error handler
  fixed = fixed.replace(/<img\s+(?![^>]*\bonerror=)([^>]+)>/gi, (match, p1) => {
    return `<img ${p1} onerror="this.onerror=null;this.src='${fallbackImg}';">`;
  });

  return fixed;
}

export function mapApiBlogToBlogPost(apiPost: ApiBlogPost): BlogPost {
  const authorName = apiPost.author?.name || apiPost.author_name || 'Surplus Market Team';
  const authorRole = apiPost.author?.role || apiPost.author_role || 'Supply Chain Specialist';
  const authorAvatar = apiPost.author?.avatar || apiPost.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  let coverImage =
    apiPost.coverImage ||
    apiPost.cover_image ||
    apiPost.image ||
    apiPost.image_url ||
    apiPost.featured_image_url ||
    apiPost.featured_image ||
    '';
  if (coverImage && coverImage.includes('/media/')) {
    coverImage = coverImage.substring(coverImage.indexOf('/media/'));
  }
  if (!coverImage) {
    coverImage = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80';
  }

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
  };
}

/**
 * Fetch all blogs from API: GET /api/blogs/
 * Cached with 5-minute TTL and fallback to local posts.
 */
export async function getBlogs(): Promise<BlogPost[]> {
  try {
    const res = await apiClient('/api/blogs/', {
      cacheTtl: 5 * 60 * 1000,
      silent: true,
    });

    if (!res.success || !res.data) {
      return MOCK_BLOG_POSTS;
    }

    const json = res.data;
    let rawPosts: ApiBlogPost[] = [];

    if (Array.isArray(json)) {
      rawPosts = json;
    } else if (Array.isArray(json.blogs)) {
      rawPosts = json.blogs;
    } else if (Array.isArray(json.data)) {
      rawPosts = json.data;
    } else if (json.data?.blogs && Array.isArray(json.data.blogs)) {
      rawPosts = json.data.blogs;
    } else if (Array.isArray(json.results)) {
      rawPosts = json.results;
    }

    if (rawPosts.length === 0) {
      return MOCK_BLOG_POSTS;
    }

    return rawPosts.map(mapApiBlogToBlogPost);
  } catch (error) {
    console.warn('[Blog API] Network error fetching blogs:', error);
    return MOCK_BLOG_POSTS;
  }
}

/**
 * Fetch a single blog by slug from API: GET /api/blogs/<slug>/
 * Cached with 5-minute TTL and fallback to local posts.
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await apiClient(`/api/blogs/${slug}/`, {
      cacheTtl: 5 * 60 * 1000,
      silent: true,
    });

    if (!res.success || !res.data) {
      return MOCK_BLOG_POSTS.find((p) => p.slug === slug) || null;
    }

    const json = res.data;
    const rawPost: ApiBlogPost = json.blog || json.data || json;

    if (!rawPost || !rawPost.title) {
      return MOCK_BLOG_POSTS.find((p) => p.slug === slug) || null;
    }

    return mapApiBlogToBlogPost(rawPost);
  } catch (error) {
    console.warn(`[Blog API] Network error fetching blog detail for '${slug}':`, error);
    return MOCK_BLOG_POSTS.find((p) => p.slug === slug) || null;
  }
}
