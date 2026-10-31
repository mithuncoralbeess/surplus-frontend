import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/main.scss";
import Script from "next/script";
import AppShell from "../components/AppShell";
import SmoothScroll from "../components/SmoothScroll";
import AuthProvider from "../components/AuthProvider";
import { CurrencyProvider } from "../context/CurrencyContext";


import { LanguageProvider } from "../context/LanguageContext";
import { NotificationProvider } from "../context/NotificationContext";
import { CartProvider } from "../context/CartContext";
import ReduxProvider from "../store/ReduxProvider";
import { RootJsonLd } from "../components/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://surplusmarket.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Surplus Market | B2B Marketplace for Excess & Surplus Inventory",
    template: "%s | Surplus Market",
  },
  description: "Connect with verified global buyers and sellers of excess inventory, overstock equipment, wholesale liquidation lots, and industrial materials across GCC and globally.",
  keywords: [
    "surplus inventory",
    "B2B liquidation marketplace",
    "excess inventory liquidation",
    "wholesale lots",
    "overstock equipment",
    "circular commerce",
    "industrial surplus GCC",
    "pallet liquidation",
    "verified inventory manifests",
  ],
  authors: [{ name: "Surplus Market" }],
  creator: "Surplus Market",
  publisher: "Surplus Market",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Surplus Market",
    title: "Surplus Market | B2B Marketplace for Excess & Surplus Inventory",
    description: "Buy and sell verified surplus inventory, wholesale liquidation lots, and excess equipment globally.",
    images: [
      {
        url: "/hero-warehouse.jpg",
        width: 1200,
        height: 630,
        alt: "Surplus Market - B2B Surplus & Liquidation Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Surplus Market | B2B Marketplace for Excess & Surplus Inventory",
    description: "Buy and sell verified surplus inventory, wholesale liquidation lots, and excess equipment globally.",
    images: ["/hero-warehouse.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B7050KKWHV"
          strategy="lazyOnload"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B7050KKWHV');
            `,
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MGT4SQLM"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MGT4SQLM');`,
          }}
        />
        {/* End Google Tag Manager */}

        <RootJsonLd />

        <AuthProvider>
          <ReduxProvider>
            <LanguageProvider>
              <CurrencyProvider>
                <NotificationProvider>
                  <CartProvider>
                    <SmoothScroll>
                      <AppShell>
                        {children}
                      </AppShell>
                    </SmoothScroll>
                  </CartProvider>
                </NotificationProvider>
              </CurrencyProvider>
            </LanguageProvider>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
