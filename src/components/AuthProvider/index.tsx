"use client";

import { SessionProvider, useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import { authService } from "../../services/authService";
import { performLogout, clearUserSessionData } from "../../lib/authCleanup";

function SessionWatcher() {
  const { data: session, status, update } = useSession();
  const checkingRef = useRef(false);

  useEffect(() => {
    // 1. Check for account_deleted notification in URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('account_deleted') === 'true') {
        clearUserSessionData();
        url.searchParams.delete('account_deleted');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
        setTimeout(() => {
          alert('Your account is no longer active or has been deleted from the system. You have been signed out.');
        }, 200);
      }
    }

    // 2. Listen for custom logout events
    const handleAuthLogout = () => {
      clearUserSessionData();
    };

    window.addEventListener('surplus:auth-logout', handleAuthLogout);
    return () => {
      window.removeEventListener('surplus:auth-logout', handleAuthLogout);
    };
  }, []);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.email || process.env.NEXT_PUBLIC_IS_MAINTENANCE === 'true') {
      return;
    }

    const email = session.user.email;

    const verifyAccountStatus = async () => {
      if (process.env.NEXT_PUBLIC_IS_MAINTENANCE === 'true') return;
      if (checkingRef.current) return;
      checkingRef.current = true;

      try {
        const res = await authService.getProfile(email);
        if (
          res.status === 404 ||
          res.status === 401 ||
          res.status === 403 ||
          (res && !res.success && (
            res.message?.toLowerCase().includes('not found') ||
            res.message?.toLowerCase().includes('deleted') ||
            res.message?.toLowerCase().includes('does not exist') ||
            res.message?.toLowerCase().includes('inactive')
          ))
        ) {
          console.warn('[SessionWatcher] Account deleted from backend. Logging out immediately...');
          await performLogout({
            redirect: true,
            callbackUrl: '/?account_deleted=true',
            reason: 'account_deleted',
          });
          return;
        }

        // Live vendor_id healing: Ensure browser localStorage and session cookie match backend
        if (res?.success && res.data) {
          const vData = res.data;
          const liveVendorId = vData.vendor_id || vData.raw_vendor_id || vData.id || (res as any).vendor_id;
          if (liveVendorId) {
            const liveVendorStr = String(liveVendorId);
            if (typeof window !== 'undefined') {
              const storedVid = localStorage.getItem('vendor_id');
              if (storedVid !== liveVendorStr) {
                localStorage.setItem('vendor_id', liveVendorStr);
              }
            }
            const currentSessionVid = String((session?.user as any)?.vendor_id || '');
            if (currentSessionVid && currentSessionVid !== liveVendorStr) {
              console.log(`[SessionWatcher] Auto-healing stale vendor_id: ${currentSessionVid} -> ${liveVendorStr}`);
              update({
                vendor_id: liveVendorStr,
                id: liveVendorStr,
              });
            }
          }
        }
      } catch (err: any) {
        if (err?.status === 404 || err?.status === 401 || err?.status === 403) {
          console.warn('[SessionWatcher] Account deleted from backend (catch). Logging out immediately...');
          await performLogout({
            redirect: true,
            callbackUrl: '/?account_deleted=true',
            reason: 'account_deleted',
          });
        }
      } finally {
        checkingRef.current = false;
      }
    };

    // Verify on mount / when authenticated
    verifyAccountStatus();

    // Verify on tab focus / visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        verifyAccountStatus();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    // Periodic heartbeat check every 45 seconds
    const interval = setInterval(verifyAccountStatus, 45000);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [session, status]);

  return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionWatcher />
      {children}
    </SessionProvider>
  );
}
