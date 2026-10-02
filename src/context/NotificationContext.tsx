"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import ToastContainer from '../components/Toast/ToastContainer';

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
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    read: false,
    link: '/profile'
  },
  {
    id: 'notif-2',
    title: 'Listing Guidelines & Verification',
    message: 'Ensure all products include model numbers, warranty terms, and authentic photos for rapid approval.',
    type: 'info',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    read: false,
    link: '/sell'
  },
  {
    id: 'notif-3',
    title: 'RFQ Marketplace Alert',
    message: 'New buyer quote requests are live in Industrial Machinery and Consumer Electronics categories.',
    type: 'rfq',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    link: '/profile'
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load notifications from localStorage on mount
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
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_NOTIFICATIONS));
          }
        } else {
          setNotifications(INITIAL_DEFAULT_NOTIFICATIONS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_NOTIFICATIONS));
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

  // Mark single as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, read: true } : item))
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(item => ({ ...item, read: true })));
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

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
