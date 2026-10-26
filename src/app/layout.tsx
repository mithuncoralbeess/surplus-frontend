import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/main.scss";
import AppShell from "../components/AppShell";
import SmoothScroll from "../components/SmoothScroll";
import AuthProvider from "../components/AuthProvider";
import { CurrencyProvider } from "../context/CurrencyContext";


import { LanguageProvider } from "../context/LanguageContext";
import { NotificationProvider } from "../context/NotificationContext";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import ReduxProvider from "../store/ReduxProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Surplus Market | B2B Marketplace for Surplus Inventory",
  description: "Buy and sell surplus inventory, overstock equipment, and materials.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MGT4SQLM');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
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
                      <CartDrawer />
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
