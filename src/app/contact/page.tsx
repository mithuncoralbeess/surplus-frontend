import React from 'react';
import CommonBanner from '../../widgets/CommonBanner';
import ContactForm from '../../widgets/ContactForm';

import { getPageMetadata } from '../../services/pageSeoService';

const fallbackMetadata = {
  title: "Contact Us | Surplus Marketplace",
  description: "Get in touch with our surplus inventory experts for buyer support, vendor onboarding, freight logistics, or general inquiries.",
};

export async function generateMetadata() {
  return getPageMetadata('contact', fallbackMetadata);
}

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      <CommonBanner 
        title="Contact Our Global Surplus Operations Team"
        subtitle="Whether you need assistance with buying bulk inventory, listing a lot, logistics, or custom enterprise solutions, our team is ready to assist you."
        align="center"
        image="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact Us' }
        ]}
      />
      <ContactForm />
    </main>
  );
}
