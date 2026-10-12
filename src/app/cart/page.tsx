import React from 'react';
import CartWidget from '../../widgets/CartWidget';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RFQ Enquiry Basket | Surplus Marketplace',
  description: 'Review your selected wholesale surplus lots, customize target pricing and quantities, and request formal commercial proforma bids.',
};

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#fcfbf7]">
      <CartWidget />
    </main>
  );
}
