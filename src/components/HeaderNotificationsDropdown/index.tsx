"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Package,
  FileText,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Inbox
} from 'lucide-react';
import { useNotifications, NotificationItem, NotificationType } from '../../context/NotificationContext';

export default function HeaderNotificationsDropdown() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'listing' | 'rfq'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'unread') {
      return notifications.filter(n => !n.read);
    }
    if (activeFilter === 'listing') {
      return notifications.filter(n => n.type === 'listing');
    }
    if (activeFilter === 'rfq') {
      return notifications.filter(n => n.type === 'rfq');
    }
    return notifications;
  }, [notifications, activeFilter]);

  // Format relative timestamp
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHours = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSec < 60) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'listing':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0f7a61] flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4" />
          </div>
        );
      case 'rfq':
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        );
      case 'system':
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0f7a61] flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
        );
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    if (item.link) {
      setIsOpen(false);
      router.push(item.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors focus:outline-none ${
          isOpen ? 'bg-emerald-50 text-[#0f7a61]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
        aria-label="View notifications"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />

        {/* Unread Badge Counter */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 min-w-3.5 px-0.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Flyout Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-3 w-80 sm:w-96 bg-white border border-gray-100 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.14)] z-50 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-[#e6f7ef] text-[#0f7a61] text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-semibold text-[#0f7a61] hover:text-[#0b5c49] flex items-center gap-1 transition-colors hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 bg-gray-50/70 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['all', 'unread', 'listing', 'rfq'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap transition-all ${
                  activeFilter === tab
                    ? 'bg-[#0f7a61] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200/60'
                }`}
              >
                {tab === 'listing' ? 'Listings' : tab === 'rfq' ? 'RFQs' : tab}
                {tab === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
              </button>
            ))}
          </div>

          {/* Notifications Scrollable List */}
          <div className="overflow-y-auto flex-1 divide-y divide-gray-50 max-h-[380px]">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-gray-700">No notifications found</p>
                <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
                  {activeFilter === 'unread'
                    ? "You've read all your notifications."
                    : 'New updates on products, RFQs, and messages will appear here.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`group relative p-4 flex items-start gap-3.5 transition-colors cursor-pointer ${
                    item.read ? 'bg-white hover:bg-gray-50/80' : 'bg-emerald-50/20 hover:bg-emerald-50/40'
                  }`}
                >
                  {/* Icon */}
                  {getNotificationIcon(item.type)}

                  {/* Body */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5">
                      <h4
                        className={`text-xs leading-tight truncate ${
                          item.read ? 'font-semibold text-gray-800' : 'font-bold text-gray-900'
                        }`}
                      >
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0f7a61] flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                      <span>{formatTime(item.createdAt)}</span>
                      {item.link && (
                        <span className="text-[#0f7a61] font-semibold flex items-center gap-0.5 group-hover:underline">
                          <span>View</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Buttons (hover on desktop) */}
                  <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-lg p-0.5 shadow-xs">
                    {!item.read && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          markAsRead(item.id);
                        }}
                        className="p-1 text-gray-400 hover:text-[#0f7a61] hover:bg-emerald-50 rounded-md transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        deleteNotification(item.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between text-xs">
            {notifications.length > 0 ? (
              <button
                type="button"
                onClick={clearAll}
                className="text-gray-400 hover:text-red-600 transition-colors font-medium text-[11px]"
              >
                Clear all
              </button>
            ) : (
              <span />
            )}

            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="font-bold text-[#0f7a61] hover:text-[#0b5c49] flex items-center gap-1 text-[11px] group"
            >
              <span>Manage notifications</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
