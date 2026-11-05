import { Metadata } from "next";
import nextDynamic from "next/dynamic";
import HomeBanner from "../widgets/HomeBanner";
import CuratedProducts from "../widgets/CuratedProducts";
import {
  mapApiProductToProductItem,
  mapApiLotToLotItem,
  ProductItem,
  LotItem,
} from "../services/catalogService";

const PromoBanner = nextDynamic(() => import("../widgets/PromoBanner"));
const PalletDeals = nextDynamic(() => import("../widgets/PalletDeals"));
const JourneySection = nextDynamic(() => import("../widgets/JourneySection"));
const Testimonials = nextDynamic(() => import("../widgets/Testimonials"));
const FAQ = nextDynamic(() => import("../widgets/FAQ"));
const SellerPromoBanner = nextDynamic(() => import("../widgets/SellerPromoBanner"));

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

import { fetchWithFailover } from "../lib/loadBalancer";

async function getHomepageInitialData(): Promise<{
  initialProducts: ProductItem[];
  initialLots: LotItem[];
}> {
  try {
    const [prodRes, lotRes] = await Promise.allSettled([
      fetchWithFailover("/api/products/?limit=32", {
        cache: "no-store",
        next: { revalidate: 0 },
        timeoutMs: 3000,
        maxRetries: 1,
      }),
      fetchWithFailover("/api/lots/?limit=6", {
        cache: "no-store",
        next: { revalidate: 0 },
        timeoutMs: 3000,
        maxRetries: 1,
      }),
    ]);

    let initialProducts: ProductItem[] = [];
    if (prodRes.status === "fulfilled" && prodRes.value.response.ok) {
      const prodJson = await prodRes.value.response.json();
      const rawProducts = Array.isArray(prodJson)
        ? prodJson
        : prodJson?.products || prodJson?.results || prodJson?.data || [];
      initialProducts = rawProducts
        .filter((item: any) => item.type !== "lot" && !item.is_lot)
        .map(mapApiProductToProductItem)
        .sort((a: ProductItem, b: ProductItem) => {
          const tA = a.dateApproved ? new Date(a.dateApproved).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const tB = b.dateApproved ? new Date(b.dateApproved).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return (isNaN(tB) ? 0 : tB) - (isNaN(tA) ? 0 : tA);
        })
        .slice(0, 8);
    }

    let initialLots: LotItem[] = [];
    if (lotRes.status === "fulfilled" && lotRes.value.response.ok) {
      const lotJson = await lotRes.value.response.json();
      const rawLots = Array.isArray(lotJson)
        ? lotJson
        : lotJson?.lots || lotJson?.results || lotJson?.data || [];
      initialLots = rawLots
        .map(mapApiLotToLotItem)
        .sort((a: LotItem, b: LotItem) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          if (dateB !== dateA) return dateB - dateA;
          return Number(b.id || 0) - Number(a.id || 0);
        })
        .slice(0, 6);
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
