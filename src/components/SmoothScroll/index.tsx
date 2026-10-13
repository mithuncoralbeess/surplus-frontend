"use client";

import { ReactNode, useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Lenis from "lenis";
import { scrollToTop, scrollToHashOrTop } from "../../lib/scroll";

/**
 * Route Scroll Watcher:
 * Listens to Next.js route transitions (both pathname and search params).
 * Whenever a route change occurs, immediately lands at the top of the page.
 */
function RouteScrollWatcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams?.toString();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip on the very first mount if no hash, letting natural entry happen
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (window.location.hash) {
        scrollToHashOrTop({ immediate: true });
      }
      return;
    }

    // When changing route, always land at the top of the page
    scrollToHashOrTop({ immediate: true });

    // Schedule RAF frame to ensure scroll position is locked after Next.js hydrates DOM
    const rafId = requestAnimationFrame(() => {
      scrollToHashOrTop({ immediate: true });
    });

    return () => cancelAnimationFrame(rafId);
  }, [pathname, searchString]);

  return null;
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Set manual scroll restoration so browser history doesn't fight programmatic scroll
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Global Form Submit Listener:
    // Whenever any form in the application is submitted, scroll to the top of the page
    const handleGlobalFormSubmit = (e: Event) => {
      const target = e.target as HTMLElement | null;

      // If the form is inside an overlay modal with its own scrolling or explicitly opted out, skip
      if (
        document.body.classList.contains('modal-open') ||
        (target && (
          target.hasAttribute('data-lenis-prevent') ||
          target.closest('[data-lenis-prevent]') ||
          target.hasAttribute('data-no-scroll-top') ||
          target.closest('[data-no-scroll-top]')
        ))
      ) {
        return;
      }

      // Smoothly scroll to the top of the page upon form submission
      requestAnimationFrame(() => {
        scrollToTop({ immediate: false, behavior: 'smooth' });
      });
    };

    window.addEventListener('submit', handleGlobalFormSubmit, true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        window.removeEventListener('submit', handleGlobalFormSubmit, true);
      };
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
          if (
            node.hasAttribute('data-lenis-prevent') ||
            node.closest('[data-lenis-prevent]') ||
            node.closest('[class*="-menu"]') ||
            node.closest('[class*="MenuList"]') ||
            node.closest('[class*="menu-list"]') ||
            node.closest('[role="listbox"]')
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
      window.removeEventListener('submit', handleGlobalFormSubmit, true);
      lenis.destroy();
      (window as any).__lenis = null;
    };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <RouteScrollWatcher />
      </Suspense>
      {children}
    </>
  );
}

// Backwards compatibility export for SmoothScroll
export { LenisProvider as SmoothScroll };


