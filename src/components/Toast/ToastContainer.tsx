"use client";

import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ToastItem } from '../../context/NotificationContext';

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map(toast => {
        const type = toast.type || 'info';

        let badgeStyles = 'border-blue-200/80 bg-white/95 text-blue-900 shadow-blue-500/10';
        let iconElem = <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;
        let barColor = 'bg-blue-600';

        if (type === 'success') {
          badgeStyles = 'border-emerald-200/90 bg-white/95 text-emerald-950 shadow-emerald-500/10';
          iconElem = <CheckCircle2 className="w-5 h-5 text-[#0f7a61] flex-shrink-0" />;
          barColor = 'bg-[#0f7a61]';
        } else if (type === 'warning') {
          badgeStyles = 'border-amber-200/90 bg-white/95 text-amber-950 shadow-amber-500/10';
          iconElem = <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
          barColor = 'bg-amber-500';
        } else if (type === 'error') {
          badgeStyles = 'border-red-200/90 bg-white/95 text-red-950 shadow-red-500/10';
          iconElem = <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
          barColor = 'bg-red-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-bottom-5 ${badgeStyles}`}
          >
            <div className="flex items-start gap-3">
              <div className="pt-0.5">{iconElem}</div>
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-sm font-bold leading-tight text-gray-900">{toast.title}</h4>
                {toast.message && (
                  <p className="mt-1 text-xs text-gray-600 leading-relaxed break-words">
                    {toast.message}
                  </p>
                )}
                {toast.link && (
                  <Link
                    href={toast.link}
                    onClick={() => onDismiss(toast.id)}
                    className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#0f7a61] hover:underline"
                  >
                    <span>{toast.linkText || 'View details'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-1 transition-colors -mr-1 -mt-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Countdown Bar */}
            {toast.duration && toast.duration > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100/60 overflow-hidden">
                <div
                  className={`h-full ${barColor} animate-toast-shrink`}
                  style={{ animationDuration: `${toast.duration}ms` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
