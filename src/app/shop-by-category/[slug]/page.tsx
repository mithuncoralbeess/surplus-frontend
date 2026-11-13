import { permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const canonicalUrl = `https://www.surplusmarket.com/buy/${slug}`;

  return {
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

/**
 * Legacy shop-by-category route
 * Permanently 308 redirects to canonical category URL (/buy/[category]).
 */
export default async function LegacyShopByCategoryPage(props: PageProps) {
  const { slug } = await props.params;
  permanentRedirect(`/buy/${slug}`);
}
