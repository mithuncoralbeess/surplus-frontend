'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to error monitoring service
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] bg-[#fdfcf9] flex items-center justify-center py-16 px-4">
      <div className="max-w-xl w-full text-center space-y-6 bg-white p-8 md:p-12 rounded-3xl border border-red-100 shadow-xl relative overflow-hidden">
        
        {/* Error Badge Icon */}
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-xs">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Something went wrong
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            An unexpected error occurred while processing your request. Don't worry, your session is safe.
          </p>
        </div>

        {/* Error Details snippet */}
        {error?.message && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left font-mono text-xs text-gray-600 overflow-x-auto max-h-32">
            <span className="font-bold text-red-600 block mb-1">Error Message:</span>
            {error.message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-[#0f7a61] hover:bg-[#0c6651] text-white px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
        </div>

      </div>
    </div>
  );
}
