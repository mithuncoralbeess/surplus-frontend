import React from 'react';
import BuyCatalog from '../../widgets/BuyCatalog';
import BuyHeroSection from '../../widgets/BuyHeroSection';

export default function BuyPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <BuyHeroSection />

      {/* Catalog Section */}
      <section className="flex-1">
        <BuyCatalog />
      </section>
    </div>
  );
}
