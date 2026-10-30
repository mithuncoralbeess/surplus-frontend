import React from 'react';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://surplusmarket.com').replace(/\/$/, '');

/**
 * Organization & WebSite JSON-LD Schema (Google Knowledge Graph & Sitelinks Searchbox)
 */
export function RootJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Surplus Market',
        legalName: 'Surplus Market Global B2B Trading Platform',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          url: `${SITE_URL}/logo.png`,
          contentUrl: `${SITE_URL}/logo.png`,
          caption: 'Surplus Market Logo',
        },
        description: 'B2B marketplace for buying and selling verified excess inventory, wholesale liquidation pallets, and overstock materials across the GCC and globally.',
        email: 'contact@surplusmarket.com',
        telephone: '+974-3026-9988',
        areaServed: [
          { '@type': 'Country', name: 'Qatar' },
          { '@type': 'Country', name: 'United Arab Emirates' },
          { '@type': 'Country', name: 'Saudi Arabia' },
          { '@type': 'Country', name: 'India' },
          { '@type': 'Country', name: 'Kuwait' },
          { '@type': 'Country', name: 'Oman' },
          { '@type': 'Country', name: 'Bahrain' },
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+974-3026-9988',
            contactType: 'customer service',
            areaServed: ['QA', 'AE', 'SA', 'IN', 'KW', 'OM', 'BH'],
            availableLanguage: ['English', 'Arabic'],
          },
        ],
        sameAs: [
          'https://www.linkedin.com/company/surplus-market',
          'https://twitter.com/surplusmarket',
          'https://www.facebook.com/surplusmarket',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Surplus Market',
        description: 'B2B Liquidation Marketplace for verified surplus stock and wholesale inventory.',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/browse?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: ['en-US', 'ar'],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQPage JSON-LD Schema (Google Rich Snippets FAQ accordions in SERP)
 */
export function FaqJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * BreadcrumbList JSON-LD Schema (Google Rich Results breadcrumbs)
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url?: string }[];
}) {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}` } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Product & Offer JSON-LD Schema (Google Merchant / Shopping / Product Rich Snippets)
 */
export function ProductJsonLd({
  name,
  description,
  image,
  price,
  priceCurrency = 'USD',
  sku,
  brand,
  condition,
  availability = 'InStock',
  url,
}: {
  name: string;
  description?: string;
  image?: string | string[];
  price?: number;
  priceCurrency?: string;
  sku?: string;
  brand?: string;
  condition?: string;
  availability?: 'InStock' | 'LimitedAvailability' | 'PreOrder' | 'OutOfStock';
  url?: string;
}) {
  const itemCondition =
    condition?.toLowerCase().includes('refurbish')
      ? 'https://schema.org/RefurbishedCondition'
      : condition?.toLowerCase().includes('used')
      ? 'https://schema.org/UsedCondition'
      : condition?.toLowerCase().includes('damaged') || condition?.toLowerCase().includes('salvage')
      ? 'https://schema.org/DamagedCondition'
      : 'https://schema.org/NewCondition';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description || name,
    ...(image ? { image: Array.isArray(image) ? image : [image] } : {}),
    ...(sku ? { sku } : {}),
    brand: {
      '@type': 'Brand',
      name: brand || 'Surplus Market',
    },
    itemCondition,
    offers: {
      '@type': 'Offer',
      price: price !== undefined ? String(price) : '0',
      priceCurrency,
      availability: `https://schema.org/${availability}`,
      url: url ? (url.startsWith('http') ? url : `${SITE_URL}${url}`) : SITE_URL,
      seller: {
        '@type': 'Organization',
        name: 'Surplus Market',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

