"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import ToastContainer from '../components/Toast/ToastContainer';
import { notificationService, BackendNotification } from '../services/notificationService';

export type NotificationType = 'success' | 'info' | 'warning' | 'error' | 'rfq' | 'listing' | 'system';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string; // ISO date string
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
}

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // ms
  link?: string;
  linkText?: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  toasts: ToastItem[];
  unreadCount: number;
  addNotification: (item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'> & Partial<Pick<NotificationItem, 'id' | 'createdAt' | 'read'>>) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  refreshNotifications: () => Promise<void>;
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  dismissToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'surplus_market_notifications_v1';

function mapBackendTypeToLocal(backendType: string): NotificationType {
  const norm = String(backendType || '').toUpperCase();
  if (norm === 'LISTING') return 'listing';
  if (norm === 'RFQ') return 'rfq';
  if (norm === 'WARNING') return 'warning';
  if (norm === 'ERROR') return 'error';
  if (norm === 'SUCCESS') return 'success';
  return 'system';
}

function mapBackendToLocal(item: BackendNotification): NotificationItem {
  return {
    id: String(item.id),
    title: item.title,
    message: item.message,
    type: mapBackendTypeToLocal(item.notification_type),
    createdAt: item.created_at || new Date().toISOString(),
    read: Boolean(item.is_read),
    link: item.action_url || '/profile',
    metadata: { backend_id: item.id }
  };
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const isFetchingRef = useRef(false);

  // Resolved active vendor identifier
  const userObj = (session?.user || {}) as any;
  const vendorId = useMemo(() => {
    if (!session) return '';
    const rawVid = userObj.vendor_id;
    if (rawVid && (String(rawVid).toUpperCase().startsWith('USR-') || !isNaN(Number(rawVid)))) {
      return String(rawVid);
    }
    if (userObj.email && String(userObj.email).includes('@')) {
      return String(userObj.email).trim();
    }
    if (userObj.user_id) return String(userObj.user_id);
    if (rawVid) return String(rawVid);
    return userObj.id ? String(userObj.id) : '';
  }, [userObj, session]);

  // Load from localStorage only when user is logged in
  useEffect(() => {
    if (!session) {
      setNotifications([]);
      setIsHydrated(true);
      return;
    }

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`${STORAGE_KEY}_${vendorId || 'user'}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setNotifications(parsed);
          } else {
            setNotifications([]);
          }
        } else {
          setNotifications([]);
        }
      } catch (err) {
        setNotifications([]);
      }
      setIsHydrated(true);
    }
  }, [session, vendorId]);

  // Save to localStorage when notifications update (only when session exists)
  useEffect(() => {
    if (session && isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${STORAGE_KEY}_${vendorId || 'user'}`, JSON.stringify(notifications));
      } catch (err) {
        console.error('Failed to save notifications to localStorage:', err);
      }
    }
  }, [notifications, isHydrated, session, vendorId]);

  // Fetch notifications from Backend for the active vendor
  const refreshNotifications = useCallback(async () => {
    if (!session || !vendorId || isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const res = await notificationService.getNotifications(String(vendorId));
      if (res.success && res.data) {
        const backendItems = res.data.results || [];
        if (backendItems.length > 0) {
          const mapped = backendItems.map(mapBackendToLocal);
          setNotifications(mapped);
        } else {
          setNotifications([]);
        }
      }
    } catch {
      // Gracefully fall back to local notifications if offline or backend error
    } finally {
      isFetchingRef.current = false;
    }
  }, [session, vendorId]);

  // Fetch from backend when vendorId becomes available
  useEffect(() => {
    if (session && vendorId) {
      refreshNotifications();
    } else if (!session) {
      setNotifications([]);
    }
  }, [session, vendorId, refreshNotifications]);

  // Periodic lightweight unread count check (every 45s, only when logged in)
  useEffect(() => {
    if (!session || !vendorId) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await notificationService.getUnreadCount(String(vendorId));
        if (res.success && res.data) {
          const remoteUnread = res.data.unread_count;
          const currentLocalUnread = notifications.filter(n => !n.read).length;
          // If remote unread differs from current, pull fresh list
          if (remoteUnread !== currentLocalUnread) {
            refreshNotifications();
          }
        }
      } catch {
        // Ignore polling error
      }
    }, 45000);

    return () => clearInterval(intervalId);
  }, [session, vendorId, notifications, refreshNotifications]);

  const unreadCount = useMemo(() => {
    if (!session) return 0;
    return notifications.filter(n => !n.read).length;
  }, [notifications, session]);

  // Add Notification
  const addNotification = useCallback((item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'> & Partial<Pick<NotificationItem, 'id' | 'createdAt' | 'read'>>) => {
    const id = item.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newNotif: NotificationItem = {
      id,
      title: item.title,
      message: item.message,
      type: item.type || 'info',
      createdAt: item.createdAt || new Date().toISOString(),
      read: item.read !== undefined ? item.read : false,
      link: item.link,
      metadata: item.metadata
    };

    setNotifications(prev => [newNotif, ...prev]);
    return id;
  }, []);

  // Mark single as read (optimistic + backend sync)
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, read: true } : item))
    );

    // If it's a numeric backend id, sync with backend
    if (!isNaN(Number(id))) {
      notificationService.markAsRead(id).catch(() => {});
    }
  }, []);

  // Mark all as read (optimistic + backend sync)
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(item => ({ ...item, read: true })));

    if (vendorId) {
      notificationService.markAllAsRead(String(vendorId)).catch(() => {});
    }
  }, [vendorId]);

  // Delete notification (optimistic + backend sync)
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));

    if (!isNaN(Number(id))) {
      notificationService.deleteNotification(id).catch(() => {});
    }
  }, []);

  // Clear all (optimistic state clear + backend permanent delete + remove local storage)
  const clearAll = useCallback(() => {
    setNotifications([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    if (vendorId) {
      notificationService.clearAll(String(vendorId)).catch((err) => {
        console.warn('[Notifications] Failed to clear notifications on backend:', err);
      });
    }
  }, [vendorId]);

  // Dismiss Toast
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Show Toast
  const showToast = useCallback((toastData: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newToast: ToastItem = {
      ...toastData,
      id,
      duration: toastData.duration !== undefined ? toastData.duration : 5000,
      type: toastData.type || 'info',
    };

    setToasts(prev => [...prev, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, newToast.duration);
    }

    return id;
  }, [dismissToast]);

  // Listen to window-level custom toast events for safe, decoupled toast triggering
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleCustomToast = (e: Event) => {
      const customEvent = e as CustomEvent<Omit<ToastItem, 'id'>>;
      if (customEvent.detail) {
        showToast(customEvent.detail);
      }
    };
    window.addEventListener('surplus-toast', handleCustomToast);
    return () => window.removeEventListener('surplus-toast', handleCustomToast);
  }, [showToast]);

  const contextValue = useMemo(() => ({
    notifications,
    toasts,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refreshNotifications,
    showToast,
    dismissToast,
  }), [
    notifications,
    toasts,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refreshNotifications,
    showToast,
    dismissToast,
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </NotificationContext.Provider>
  );
};

export const triggerToast = (toastData: Omit<ToastItem, 'id'>) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('surplus-toast', { detail: toastData }));
  }
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
