import React from 'react';
import { notFound } from 'next/navigation';
import { getBlogs, getBlogBySlug } from '../../../services/blogService';
import { resolveCanonicalUrl } from '../../../services/pageSeoService';
import BlogDetail from '../../../widgets/BlogDetail';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Surplus Market',
      description: 'The requested surplus inventory article could not be found.',
    };
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.surplusmarket.com')
    .trim()
    .replace(/\/$/, '')
    .replace(/^https?:\/\/surplusmarket\.com/i, 'https://www.surplusmarket.com');
  const seo = post.seo || {};

  // SEO Title, description, keywords, canonical
  const metaTitle = seo.meta_title || post.title;
  const fullTitle = metaTitle.toLowerCase().includes('surplus')
    ? metaTitle
    : `${metaTitle} | Surplus Market Insights`;
  const metaDescription = seo.meta_description || post.excerpt;
  const metaKeywords = seo.meta_keywords || (post.tags ? post.tags.join(', ') : 'Surplus Market, Liquidation, B2B Inventory, Supply Chain');
  const canonicalUrl = resolveCanonicalUrl(seo.canonical_url, `blog/${post.slug}`);

  // Robots directives
  const isIndex = seo.robots_index !== 'noindex';
  const isFollow = seo.robots_follow !== 'nofollow';

  // Social / Open Graph & Twitter Cards
  const ogTitle = seo.og_title || metaTitle;
  const ogDescription = seo.og_description || metaDescription;
  const ogImage = seo.og_image || post.coverImage;

  const twitterTitle = seo.twitter_title || ogTitle;
  const twitterDescription = seo.twitter_description || ogDescription;
  const twitterImage = seo.twitter_image || ogImage;

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: post.author.name }],
    publisher: 'Surplus Market',
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: isIndex,
      follow: isFollow,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: 'Surplus Market',
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      ...(ogImage ? {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: ogTitle,
          },
        ],
      } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      ...(twitterImage ? { images: [twitterImage] } : {}),
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch API blogs for related articles
  const allPosts = await getBlogs();
  const relatedPosts = allPosts.filter(p => p.id !== post.id && p.slug !== post.slug).slice(0, 3);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.surplusmarket.com')
    .trim()
    .replace(/\/$/, '')
    .replace(/^https?:\/\/surplusmarket\.com/i, 'https://www.surplusmarket.com');
  const canonicalUrl = resolveCanonicalUrl(post.seo?.canonical_url, `blog/${post.slug}`);

  // JSON-LD Article / BlogPosting Schema
  const schemaType = post.seo?.schema_type || 'BlogPosting';
  const blogPostingSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: post.seo?.meta_title || post.title,
    description: post.seo?.meta_description || post.excerpt,
    ...((post.seo?.og_image || post.coverImage) ? { image: [post.seo?.og_image || post.coverImage] } : {}),
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
      ...(post.author.avatar ? { image: post.author.avatar } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Surplus Market',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    keywords: post.seo?.meta_keywords || (post.tags ? post.tags.join(', ') : ''),
  };

  // Custom JSON-LD schema if provided in post.seo.structured_data
  let customStructuredData: Record<string, any> | null = null;
  if (post.seo?.structured_data) {
    try {
      const cleanJson = post.seo.structured_data
        .replace(/<script[^>]*>/gi, '')
        .replace(/<\/script>/gi, '')
        .trim();
      if (cleanJson) {
        customStructuredData = JSON.parse(cleanJson);
      }
    } catch {
      customStructuredData = null;
    }
  }

  // JSON-LD Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  // JSON-LD FAQ Schema
  const faqs = post.faqs && post.faqs.length > 0 ? post.faqs : [];
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* Structured Data (JSON-LD) for SEO */}
      {customStructuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(customStructuredData) }}
        />
      ) : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <BlogDetail post={post} relatedPosts={relatedPosts} />
    </main>
  );
}
