import { Metadata } from "next";
import HomeBanner from "../widgets/HomeBanner";
import CuratedProducts from "../widgets/CuratedProducts";
import PromoBanner from "../widgets/PromoBanner";
import PalletDeals from "../widgets/PalletDeals";
import JourneySection from "../widgets/JourneySection";
import Testimonials from "../widgets/Testimonials";
import FAQ from "../widgets/FAQ";
import SellerPromoBanner from "../widgets/SellerPromoBanner";

export const metadata: Metadata = {
  title: "Surplus Market - B2B Liquidation Marketplace | Circular Commerce",
  description: "Connect with verified global buyers and sellers of surplus inventory to unlock savings, maximize revenue, and reduce industrial waste.",
  keywords: ["surplus inventory", "B2B liquidation marketplace", "excess stock", "overstock deals", "circular economy"],
  openGraph: {
    title: "Surplus Market - B2B Liquidation Marketplace",
    description: "Buy and sell verified surplus inventory, wholesale lots, and excess stock globally.",
    url: "https://surplusmarket.com",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <HomeBanner />
      <CuratedProducts />
      <PromoBanner />
      <PalletDeals />
      <JourneySection />
      <Testimonials />
      <FAQ />
      <SellerPromoBanner />
    </main>
  );
}
