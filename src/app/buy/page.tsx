import CategoryExplorer from "../../widgets/CategoryExplorer";
import CommonBanner from "../../widgets/CommonBanner";
import { Metadata } from 'next';
import { getPageMetadata } from '../../services/pageSeoService';
import { BreadcrumbJsonLd } from '../../components/StructuredData';

export const revalidate = 300;

const fallbackMetadata: Metadata = {
  title: "Buy Surplus Inventory & Wholesale Lots | Surplus Market",
  description: "Source verified surplus, overstock, and wholesale liquidation inventory globally across all product categories.",
  alternates: {
    canonical: "https://www.surplusmarket.com/buy",
  },
  openGraph: {
    title: "Buy Surplus Inventory & Wholesale Lots | Surplus Market",
    description: "Source verified surplus, overstock, and wholesale liquidation inventory globally across all product categories.",
    url: "https://www.surplusmarket.com/buy",
    siteName: "Surplus Market",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Surplus Inventory & Wholesale Lots | Surplus Market",
    description: "Source verified surplus, overstock, and wholesale liquidation inventory globally across all product categories.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('buy', fallbackMetadata);
}

export default function BuyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Buy', url: '/buy' },
        ]}
      />
      <CommonBanner 
        title="Buy"
        subtitle="Source verified surplus, overstock, and wholesale liquidation inventory globally."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Buy' }
        ]}
      />
      <CategoryExplorer />
    </main>
  );
}

