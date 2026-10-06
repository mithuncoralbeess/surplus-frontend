"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import LotDetailWidget from '../../../../widgets/LotDetailWidget';

export default function LotDetailPage() {
  const params = useParams();
  const id = params?.id ? String(params.id) : '';

  return <LotDetailWidget lotId={id} />;
}
