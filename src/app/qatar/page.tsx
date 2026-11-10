import React from 'react';
import QatarMarketplaceWidget from '../../widgets/QatarMarketplace';
import { QATAR_FAQS } from '../../widgets/QatarMarketplace/qatarData';
import { BreadcrumbJsonLd, FaqJsonLd } from '../../components/StructuredData';
import { getPageMetadata } from '../../services/pageSeoService';

export const revalidate = 3600;

const fallbackMetadata = {
  title: "Buy & Sell Excess Inventory in Qatar With Surplus Market",
  description: "Managing unsold or unused stock can be challenging for businesses in Qatar. Surplus Market makes the process simple by connecting sellers with serious buyers in one trusted space.",
  keywords: "Excess inventory Qatar, Surplus market Qatar, Overstock liquidation Qatar, Wholesale surplus Qatar, Buy surplus Qatar, Sell stock Qatar, inventory liquidators Qatar",
  alternates: {
    canonical: "https://www.surplusmarket.com/qatar",
  },
  openGraph: {
    title: "Buy & Sell Excess Inventory in Qatar With Surplus Market",
    description: "Managing unsold or unused stock can be challenging for businesses in Qatar. Surplus Market makes the process simple by connecting sellers with serious buyers in one trusted space.",
    url: "https://www.surplusmarket.com/qatar",
    siteName: "Surplus Market",
    locale: "en_US",
    type: "website",
  },
};

export async function generateMetadata() {
  return getPageMetadata('qatar', fallbackMetadata);
}

export default function QatarRegionalPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Qatar Surplus Marketplace', url: '/qatar' },
        ]}
      />
      <FaqJsonLd
        faqs={QATAR_FAQS.map((faq) => ({
          question: faq.q,
          answer: faq.a,
        }))}
      />
      <QatarMarketplaceWidget />
    </main>
  );
}
