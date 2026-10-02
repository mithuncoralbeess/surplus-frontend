"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      syncTouch: false,
      prevent: (node) => {
        // Prevent smooth scrolling when background scroll is locked
        if (typeof document !== 'undefined') {
          if (
            document.body.style.overflow === 'hidden' ||
            document.documentElement.style.overflow === 'hidden'
          ) {
            return true;
          }
        }
        // Prevent smooth scrolling inside any modal, dialog, or lenis-prevent container
        if (node && node instanceof HTMLElement) {
          if (
            node.hasAttribute('data-lenis-prevent') ||
            Boolean(node.closest('[data-lenis-prevent], [role="dialog"], .fixed'))
          ) {
            return true;
          }
        }
        return false;
      }
    });

    (window as any).__lenis = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

// Backwards compatibility export for SmoothScroll
export { LenisProvider as SmoothScroll };

