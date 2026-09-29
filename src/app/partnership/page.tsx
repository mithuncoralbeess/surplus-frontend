import React from 'react';
import CommonBanner from '../../widgets/CommonBanner';
import PartnershipValueProps from '../../widgets/PartnershipValueProps';
import PartnershipForm from '../../widgets/PartnershipForm';
import PartnershipCTA from '../../widgets/PartnershipCTA';
import { Metadata } from 'next';
import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata: Metadata = {
  title: "Partner With Us | Surplus Market",
  description: "Build a strategic partnership with Surplus Market to connect excess inventory, buyers, services, and commercial opportunities globally.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('partnership', fallbackMetadata);
}

export default function PartnershipPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      <CommonBanner 
        title="Let's Build a Partnership That Works"
        subtitle="Have a network, capability, inventory, or service that can create value in the surplus ecosystem? We're always open to working with businesses that can help us connect the right inventory, buyers, services, and opportunities."
        align="center"
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Partnership' }
        ]}
      />
      <PartnershipValueProps />
      <PartnershipForm />
      <PartnershipCTA />
    </main>
  );
}
