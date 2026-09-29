"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';

const BrowseResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return (
    <section className="container max-w-5xl mx-auto px-4 py-12 flex-1">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {query ? `Search results for "${query}"` : 'All items'}
      </h2>
      <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500 border border-gray-100">
        <p>This is a placeholder for the browse page results.</p>
        <p className="mt-2 text-sm">Product grid and filters will go here.</p>
      </div>
    </section>
  );
};

export default BrowseResults;
