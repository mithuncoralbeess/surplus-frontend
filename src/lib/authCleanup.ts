"use client";

import { signOut } from 'next-auth/react';

/**
 * Clears all user session data from sessionStorage and localStorage.
 */
export function clearUserSessionData(): void {
  if (typeof window === 'undefined') return;

  try {
    // 1. Clear session storage completely
    sessionStorage.clear();
  } catch (err) {
    console.warn('[authCleanup] Failed to clear sessionStorage:', err);
  }

  try {
    // 2. Clear known user-specific keys from localStorage
    const knownUserKeys = [
      'vendor_id',
      'surplus_account_settings',
      'surplus_product_submissions',
      'surplus_saved_deals',
      'surplus_rfqs_history',
      'surplus_notifications',
      'surplus_user_profile',
      'surplus_user_info',
      'surplus_whatsapp_subscribed',
      'surplus_whatsapp_phone',
      'nextauth.message',
    ];
    knownUserKeys.forEach((key) => localStorage.removeItem(key));

    // 3. Scan and remove any user, vendor, profile, or session notification keys from localStorage
    const dynamicKeysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith('user_') ||
          key.startsWith('profile_') ||
          key.startsWith('vendor_') ||
          key.startsWith('surplus_market_notifications') ||
          key.includes('user_info') ||
          key.includes('auth_user'))
      ) {
        dynamicKeysToRemove.push(key);
      }
    }
    dynamicKeysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (err) {
    console.warn('[authCleanup] Failed to clear user localStorage items:', err);
  }
}

let isLoggingOut = false;

/**
 * Perform complete user sign-out:
 * 1. Clears sessionStorage and all user data in localStorage.
 * 2. Dispatches custom events so active components/listeners update immediately.
 * 3. Triggers NextAuth signOut with redirect.
 */
export async function performLogout(options?: {
  redirect?: boolean;
  callbackUrl?: string;
  reason?: 'account_deleted' | 'user_signout' | 'unauthorized';
}): Promise<void> {
  if (isLoggingOut) return;
  isLoggingOut = true;

  clearUserSessionData();

  const callbackUrl =
    options?.callbackUrl ||
    (options?.reason === 'account_deleted' ? '/?account_deleted=true' : '/');

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('surplus:auth-logout', {
        detail: { reason: options?.reason || 'user_signout' },
      })
    );
  }

  try {
    await signOut({
      redirect: options?.redirect ?? true,
      callbackUrl,
    });
  } catch (err) {
    console.warn('[authCleanup] NextAuth signOut error, performing hard redirect:', err);
    if (typeof window !== 'undefined') {
      window.location.href = callbackUrl;
    }
  } finally {
    setTimeout(() => {
      isLoggingOut = false;
    }, 2000);
  }
}
