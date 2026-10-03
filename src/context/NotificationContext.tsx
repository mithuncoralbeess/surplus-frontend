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

const INITIAL_DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Welcome to Surplus Market',
    message: 'Your vendor account is active. Explore verified listings and submit inventory to buyers worldwide.',
    type: 'system',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    link: '/profile'
  },
  {
    id: 'notif-2',
    title: 'Listing Guidelines & Verification',
    message: 'Ensure all products include model numbers, warranty terms, and authentic photos for rapid approval.',
    type: 'info',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: false,
    link: '/sell'
  }
];

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
    const rawVid = userObj.vendor_id;
    if (rawVid && (String(rawVid).toUpperCase().startsWith('USR-') || !isNaN(Number(rawVid)))) {
      return String(rawVid);
    }
    if (userObj.email && String(userObj.email).includes('@')) {
      return String(userObj.email).trim();
    }
    if (userObj.user_id) return String(userObj.user_id);
    if (rawVid) return String(rawVid);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vendor_id') || localStorage.getItem('user_id') || localStorage.getItem('email');
      if (stored) return stored;
    }
    return userObj.id ? String(userObj.id) : '';
  }, [userObj]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setNotifications(parsed);
          } else {
            setNotifications(INITIAL_DEFAULT_NOTIFICATIONS);
          }
        } else {
          setNotifications(INITIAL_DEFAULT_NOTIFICATIONS);
        }
      } catch (err) {
        setNotifications(INITIAL_DEFAULT_NOTIFICATIONS);
      }
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when notifications update (after hydration)
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      } catch (err) {
        console.error('Failed to save notifications to localStorage:', err);
      }
    }
  }, [notifications, isHydrated]);

  // Fetch notifications from Backend for the active vendor
  const refreshNotifications = useCallback(async () => {
    if (!vendorId || isFetchingRef.current) return;
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
  }, [vendorId]);

  // Fetch from backend when vendorId becomes available
  useEffect(() => {
    if (vendorId) {
      refreshNotifications();
    }
  }, [vendorId, refreshNotifications]);

  // Periodic lightweight unread count check (every 45s)
  useEffect(() => {
    if (!vendorId) return;

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
  }, [vendorId, notifications, refreshNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

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

  return (
    <NotificationContext.Provider
      value={{
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
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
