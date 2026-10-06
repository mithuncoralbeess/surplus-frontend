"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import ProductDetailWidget from '../../../widgets/ProductDetailWidget';

export default function BuyDetailPage() {
  const params = useParams();
  const id = params?.id ? String(params.id) : '';

  return <ProductDetailWidget productId={id} />;
}
