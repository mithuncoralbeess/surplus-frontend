import { Metadata } from "next";
import dynamic from "next/dynamic";
import HomeBanner from "../widgets/HomeBanner";
import CuratedProducts from "../widgets/CuratedProducts";
import {
  mapApiProductToProductItem,
  mapApiLotToLotItem,
  ProductItem,
  LotItem,
} from "../services/catalogService";

const PromoBanner = dynamic(() => import("../widgets/PromoBanner"));
const PalletDeals = dynamic(() => import("../widgets/PalletDeals"));
const JourneySection = dynamic(() => import("../widgets/JourneySection"));
const Testimonials = dynamic(() => import("../widgets/Testimonials"));
const FAQ = dynamic(() => import("../widgets/FAQ"));
const SellerPromoBanner = dynamic(() => import("../widgets/SellerPromoBanner"));

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Surplus Market - B2B Liquidation Marketplace | Circular Commerce",
  description: "Connect with verified global buyers and sellers of surplus inventory to unlock savings, maximize revenue, and reduce industrial waste.",
  keywords: ["surplus inventory", "B2B liquidation marketplace", "excess stock", "overstock deals", "circular economy"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Surplus Market - B2B Liquidation Marketplace",
    description: "Buy and sell verified surplus inventory, wholesale lots, and excess stock globally.",
    url: "https://surplusmarket.com",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/hero-warehouse.jpg",
        width: 1200,
        height: 630,
        alt: "Surplus Market - B2B Liquidation Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Surplus Market - B2B Liquidation Marketplace",
    description: "Buy and sell verified surplus inventory, wholesale lots, and excess stock globally.",
    images: ["/hero-warehouse.jpg"],
  },
};

const BACKEND_BASE = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dev.surplusmarket.com"
).replace(/\/$/, "");

async function getHomepageInitialData(): Promise<{
  initialProducts: ProductItem[];
  initialLots: LotItem[];
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const [prodRes, lotRes] = await Promise.allSettled([
      fetch(`${BACKEND_BASE}/api/products/?collection=best_selling&limit=8`, {
        next: { revalidate: 120 },
        signal: controller.signal,
      }),
      fetch(`${BACKEND_BASE}/api/lots/?limit=6`, {
        next: { revalidate: 120 },
        signal: controller.signal,
      }),
    ]);

    clearTimeout(timeoutId);

    let initialProducts: ProductItem[] = [];
    if (prodRes.status === "fulfilled" && prodRes.value.ok) {
      const prodJson = await prodRes.value.json();
      const rawProducts = Array.isArray(prodJson)
        ? prodJson
        : prodJson?.products || prodJson?.results || prodJson?.data || [];
      initialProducts = rawProducts
        .filter((item: any) => item.type !== "lot" && !item.is_lot)
        .slice(0, 8)
        .map(mapApiProductToProductItem);
    }

    let initialLots: LotItem[] = [];
    if (lotRes.status === "fulfilled" && lotRes.value.ok) {
      const lotJson = await lotRes.value.json();
      const rawLots = Array.isArray(lotJson)
        ? lotJson
        : lotJson?.lots || lotJson?.results || lotJson?.data || [];
      initialLots = rawLots.slice(0, 6).map(mapApiLotToLotItem);
    }

    return { initialProducts, initialLots };
  } catch {
    return { initialProducts: [], initialLots: [] };
  }
}

export default async function Home() {
  const { initialProducts, initialLots } = await getHomepageInitialData();

  return (
    <main className="flex min-h-screen flex-col items-center w-full overflow-x-hidden">
      <HomeBanner />
      <CuratedProducts initialProducts={initialProducts} />
      <PromoBanner />
      <PalletDeals initialLots={initialLots} />
      <JourneySection />
      <Testimonials />
      <FAQ />
      <SellerPromoBanner />
    </main>
  );
}
