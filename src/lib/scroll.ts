/**
 * Global Scroll Utility
 * 
 * Provides unified, robust scroll-to-top execution across Next.js App Router,
 * Lenis smooth-scroll instance, and native browser document scrolling.
 */

export interface ScrollToTopOptions {
  /** If true, instantly jumps to top with no animation (recommended for route changes). */
  immediate?: boolean;
  /** Explicit scroll behavior: 'smooth' | 'instant' | 'auto'. */
  behavior?: 'smooth' | 'instant' | 'auto';
}

/**
 * Scrolls the window to the top (0, 0).
 * Coordinates with Lenis (if loaded) and native browser scroll.
 */
export function scrollToTop(options: ScrollToTopOptions = {}) {
  if (typeof window === 'undefined') return;

  const immediate = options.immediate ?? (options.behavior === 'instant');
  const behavior = immediate ? 'instant' : (options.behavior || 'smooth');

  // 1. Lenis Smooth Scroll handling
  const lenis = (window as any).__lenis;
  if (lenis && typeof lenis.scrollTo === 'function') {
    try {
      lenis.scrollTo(0, {
        immediate: immediate,
        force: true,
      });
    } catch (e) {
      // Non-blocking fallback
    }
  }

  // 2. Browser window.scrollTo
  try {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: behavior,
    });
  } catch {
    window.scrollTo(0, 0);
  }

  // 3. Direct document element scrollTop fallback
  if (immediate) {
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }
}

/**
 * Checks for a valid URL hash anchor. If found, scrolls to it.
 * Otherwise, scrolls to the top of the page.
 */
export function scrollToHashOrTop(options: ScrollToTopOptions = {}) {
  if (typeof window === 'undefined') return;

  const hash = window.location.hash;
  if (hash && hash.length > 1) {
    try {
      const target = document.querySelector(hash);
      if (target && target instanceof HTMLElement) {
        const lenis = (window as any).__lenis;
        const immediate = options.immediate ?? false;
        if (lenis && typeof lenis.scrollTo === 'function') {
          lenis.scrollTo(target, { immediate: immediate });
        } else {
          target.scrollIntoView({ behavior: immediate ? 'instant' : 'smooth' });
        }
        return;
      }
    } catch {
      // Invalid selector (e.g. malformed hash), fallback to top
    }
  }

  scrollToTop(options);
}
