import React from 'react';
import CommonBanner from '../../widgets/CommonBanner';
import BlogListing from '../../widgets/BlogListing';
import { getBlogs } from '../../services/blogService';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://surplusmarket.com';

export const metadata = {
  title: "Blog & Market Insights | Surplus Market",
  description: "Explore enterprise inventory liquidation trends, circular economy insights, ESG strategies, and GCC trade intelligence.",
  keywords: "Surplus Market Blog, Inventory Liquidation, B2B Supply Chain, ESG Reporting, GCC Wholesale, Liquidation Insights",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Blog & Market Insights | Surplus Market",
    description: "Explore enterprise inventory liquidation trends, circular economy insights, ESG strategies, and GCC trade intelligence.",
    url: `${siteUrl}/blog`,
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Market Insights | Surplus Market",
    description: "Explore enterprise inventory liquidation trends, circular economy insights, ESG strategies, and GCC trade intelligence.",
  },
};

export default async function BlogPage() {
  const posts = await getBlogs();

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      <CommonBanner 
        title="Market Insights & Supply Chain Intelligence"
        subtitle="Expert perspectives on excess inventory liquidation, ESG carbon reporting, circular economy models, and secondary market trends."
        align="center"
        image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog' }
        ]}
      />
      <BlogListing initialPosts={posts} />
    </main>
  );
}
