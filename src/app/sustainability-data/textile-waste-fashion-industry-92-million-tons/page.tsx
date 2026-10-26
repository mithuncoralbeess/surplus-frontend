import React from 'react';
import { Metadata } from 'next';
import { getPageMetadata } from '../../../services/pageSeoService';
import TextileWasteFashion from '../../../widgets/TextileWasteFashion';

const fallbackMetadata: Metadata = {
  title: 'The Fashion Industry Generates 92 Million Tons of Textile Waste Annually | Surplus Market',
  description: 'Learn about the 92 million tons of annual textile waste, pre-consumer vs post-consumer dynamics, fast fashion overstock, and how surplus re-commerce drives circular solutions.',
  keywords: [
    'textile waste fashion industry',
    '92 million tons textile waste',
    'fast fashion waste',
    'unsold inventory textiles',
    'pre-consumer textile waste',
    'circular fashion economy',
    'surplus textile marketplace'
  ],
  alternates: {
    canonical: 'https://surplusmarket.com/sustainability-data/textile-waste-fashion-industry-92-million-tons',
  },
  openGraph: {
    title: 'The Fashion Industry Generates 92 Million Tons of Textile Waste Annually',
    description: 'Explore the global scale of textile waste, environmental costs of fast fashion, and the surge in circular re-commerce.',
    url: 'https://surplusmarket.com/sustainability-data/textile-waste-fashion-industry-92-million-tons',
    siteName: 'Surplus Market',
    type: 'article',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('sustainability-data/textile-waste-fashion-industry-92-million-tons', fallbackMetadata);
}

export default function TextileWasteFashionIndustryPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <TextileWasteFashion />
    </main>
  );
}
