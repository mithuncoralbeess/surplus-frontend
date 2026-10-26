import React from 'react';
import { Metadata } from 'next';
import AssistanceDesk from '../../widgets/AssistanceDesk';
import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata: Metadata = {
  title: "Assistance Desk & Sourcing Support | Surplus Market",
  description: "Request custom product sourcing, report platform issues, suggest new marketplace features, or receive dedicated order help from Surplus Market operations.",
  keywords: [
    "product sourcing desk",
    "surplus inventory assistance",
    "custom procurement",
    "B2B marketplace support",
    "report issue",
    "order tracking help",
  ],
  alternates: {
    canonical: "https://surplusmarket.com/assistance",
  },
  openGraph: {
    title: "Assistance Desk & Sourcing Support | Surplus Market",
    description: "Request custom product sourcing, report platform issues, suggest new marketplace features, or receive dedicated order help.",
    url: "https://surplusmarket.com/assistance",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('assistance', fallbackMetadata);
}

export default function AssistancePage() {
  return (
    <main className="min-h-screen bg-[#fbfcfc]">
      <AssistanceDesk />
    </main>
  );
}
