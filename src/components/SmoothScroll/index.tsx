"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      prevent: (node) => {
        if (typeof document !== 'undefined') {
          if (
            document.body.classList.contains('modal-open') ||
            document.body.style.overflow === 'hidden'
          ) {
            return true;
          }
        }
        if (node && node instanceof HTMLElement) {
          if (node.hasAttribute('data-lenis-prevent') || node.closest('[data-lenis-prevent]')) {
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

