import CategoryExplorer from "../../widgets/CategoryExplorer";
import CommonBanner from "../../widgets/CommonBanner";
import { Metadata } from 'next';
import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata: Metadata = {
  title: "Shop Surplus Inventory by Category | Surplus Market",
  description: "Source verified surplus, overstock, and wholesale liquidation inventory globally across all product categories.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('shop-by-category', fallbackMetadata);
}

export default function BuyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full">
      <CommonBanner 
        title="Shop by Category"
        subtitle="Source verified surplus, overstock, and wholesale liquidation inventory globally."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Shop by Category' }
        ]}
      />
      <CategoryExplorer />
    </main>
  );
}
