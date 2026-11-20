"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';

declare global {
  interface Window {
    grecaptcha?: {
      render?: (
        container: HTMLElement | string,
        parameters: {
          sitekey: string;
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark';
          size?: 'normal' | 'compact';
        }
      ) => number;
      reset?: (opt_widget_id?: number) => void;
      getResponse?: (opt_widget_id?: number) => string;
      ready?: (callback: () => void) => void;
    };
    __onGoogleRecaptchaLoad?: () => void;
    __googleRecaptchaQueue?: Array<() => void>;
  }
}

// Google official public test key (always passes verification, works out-of-the-box in local & dev)
const DEFAULT_TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

export interface GoogleReCaptchaRef {
  reset: () => void;
  getResponse: () => string;
}

export interface GoogleReCaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  siteKey?: string;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
  className?: string;
}

const GoogleReCaptcha = forwardRef<GoogleReCaptchaRef, GoogleReCaptchaProps>(function GoogleReCaptcha(
  {
    onVerify,
    onExpire,
    onError,
    siteKey,
    theme = 'light',
    size = 'normal',
    className = '',
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const activeSiteKey =
    siteKey ||
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
    DEFAULT_TEST_SITE_KEY;

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (typeof window !== 'undefined' && window.grecaptcha?.reset && widgetIdRef.current !== null) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch {
          // Ignore reset errors
        }
      }
    },
    getResponse: () => {
      if (typeof window !== 'undefined' && window.grecaptcha?.getResponse && widgetIdRef.current !== null) {
        try {
          return window.grecaptcha.getResponse(widgetIdRef.current) || '';
        } catch {
          return '';
        }
      }
      return '';
    },
  }));

  useEffect(() => {
    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.grecaptcha?.render) return;
      if (widgetIdRef.current !== null) return; // Already rendered

      try {
        const id = window.grecaptcha.render(containerRef.current, {
          sitekey: activeSiteKey,
          theme,
          size,
          callback: (token: string) => {
            if (isMounted) onVerify(token);
          },
          'expired-callback': () => {
            if (isMounted && onExpire) onExpire();
          },
          'error-callback': () => {
            if (isMounted && onError) onError();
          },
        });
        widgetIdRef.current = id;
        setIsLoaded(true);
      } catch (err) {
        console.warn('[Google reCAPTCHA] render failed:', err);
      }
    };

    // Case 1: grecaptcha is already loaded on window
    if (typeof window !== 'undefined' && window.grecaptcha && window.grecaptcha.render) {
      if (window.grecaptcha.ready) {
        window.grecaptcha.ready(renderWidget);
      } else {
        renderWidget();
      }
      return;
    }

    // Initialize callback queue
    if (typeof window !== 'undefined') {
      window.__googleRecaptchaQueue = window.__googleRecaptchaQueue || [];
      window.__googleRecaptchaQueue.push(renderWidget);

      if (!window.__onGoogleRecaptchaLoad) {
        window.__onGoogleRecaptchaLoad = () => {
          if (window.__googleRecaptchaQueue) {
            while (window.__googleRecaptchaQueue.length > 0) {
              const fn = window.__googleRecaptchaQueue.shift();
              if (fn) {
                if (window.grecaptcha?.ready) {
                  window.grecaptcha.ready(fn);
                } else {
                  fn();
                }
              }
            }
          }
        };
      }
    }

    // Case 2: Check if script tag exists
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="google.com/recaptcha/api.js"]'
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=__onGoogleRecaptchaLoad&render=explicit';
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        if (isMounted) {
          setLoadError(true);
          if (onError) onError();
        }
      };
      document.head.appendChild(script);
    } else {
      // Check periodically if script finishes loading
      const interval = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.render) {
          clearInterval(interval);
          if (isMounted) renderWidget();
        }
      }, 150);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        if (isMounted && !isLoaded) setLoadError(true);
      }, 8000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [activeSiteKey, theme, size, onVerify, onExpire, onError]);

  return (
    <div className={`recaptcha-wrapper flex flex-col items-center sm:items-start my-1.5 ${className}`}>
      <div 
        ref={containerRef} 
        className="min-h-[78px] min-w-[304px] flex items-center justify-center sm:justify-start" 
      />
      {loadError && (
        <p className="text-xs text-amber-600 mt-1 font-medium">
          Unable to load Google reCAPTCHA. Please check your network connection or ad-blocker.
        </p>
      )}
    </div>
  );
});

export default GoogleReCaptcha;
