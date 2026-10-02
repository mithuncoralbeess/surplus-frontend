import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/main.scss";
import AppShell from "../components/AppShell";
import SmoothScroll from "../components/SmoothScroll";
import AuthProvider from "../components/AuthProvider";
import { CurrencyProvider } from "../context/CurrencyContext";
import AOSProvider from "../components/AosProvider";

import { Suspense } from "react";
import GoogleAnalytics from "../components/GoogleAnalytics";
import AnalyticsTracker from "../components/AnalyticsTracker";

import { LanguageProvider } from "../context/LanguageContext";
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
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <AuthProvider>
          <ReduxProvider>
            <LanguageProvider>
              <CurrencyProvider>
                <AOSProvider>
                  <SmoothScroll>
                    <AppShell>
                      {children}
                    </AppShell>
                  </SmoothScroll>
                </AOSProvider>
              </CurrencyProvider>
            </LanguageProvider>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
