import { apiClient, ApiResponse } from './apiClient';

export interface BackendNotification {
  id: number | string;
  vendor_id?: string;
  title: string;
  message: string;
  notification_type: 'LISTING' | 'RFQ' | 'AUCTION' | 'SYSTEM' | 'ORDER' | string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsListResponse {
  results: BackendNotification[];
  count: number;
  unread_count: number;
}

export const notificationService = {
  /**
   * Fetch paginated notifications for vendor
   */
  async getNotifications(
    vendorId: string,
    params?: { unread?: boolean; type?: string; page?: number; limit?: number }
  ): Promise<ApiResponse<NotificationsListResponse>> {
    const query = new URLSearchParams();
    query.set('vendor_id', vendorId);
    if (params?.unread !== undefined) {
      query.set('unread', String(params.unread));
    }
    if (params?.type) {
      query.set('type', params.type.toUpperCase());
    }
    if (params?.page) {
      query.set('page', String(params.page));
    }
    if (params?.limit) {
      query.set('limit', String(params.limit));
    }

    return apiClient<NotificationsListResponse>(`/api/notifications/?${query.toString()}`, {
      method: 'GET',
    });
  },

  /**
   * Fetch unread notifications count for header badge
   */
  async getUnreadCount(vendorId: string): Promise<ApiResponse<{ unread_count: number }>> {
    return apiClient<{ unread_count: number }>(
      `/api/notifications/unread-count/?vendor_id=${encodeURIComponent(vendorId)}`,
      { method: 'GET', silent: true }
    );
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(id: number | string): Promise<ApiResponse> {
    return apiClient(`/api/notifications/${id}/mark-read/`, {
      method: 'POST',
    });
  },

  /**
   * Mark all notifications for vendor as read
   */
  async markAllAsRead(vendorId: string): Promise<ApiResponse<{ updated_count?: number }>> {
    return apiClient('/api/notifications/mark-all-read/', {
      method: 'POST',
      body: JSON.stringify({ vendor_id: vendorId }),
    });
  },

  /**
   * Delete / dismiss a notification record
   */
  async deleteNotification(id: number | string): Promise<ApiResponse> {
    return apiClient(`/api/notifications/${id}/`, {
      method: 'DELETE',
    });
  },
  /**
   * Clear all notifications for vendor (permanently delete from backend)
   */
  async clearAll(vendorId: string): Promise<ApiResponse<{ deleted_count?: number }>> {
    return apiClient('/api/notifications/clear-all/', {
      method: 'POST',
      body: JSON.stringify({ vendor_id: vendorId }),
    });
  },
};