/**
 * 알림 Zustand 스토어 (useNotificationStore.ts)
 * - 알림 목록, 드로어 open/close, 필터 탭, 읽음 처리를 관리한다
 */

import { create } from 'zustand';
import type { NotificationData, NotificationType } from '@/types';

type NotificationTab = 'all' | NotificationType;

interface NotificationState {
  isOpen: boolean;
  activeTab: NotificationTab;
  notifications: NotificationData[];

  open: () => void;
  close: () => void;
  toggle: () => void;
  setActiveTab: (tab: NotificationTab) => void;
  setNotifications: (items: NotificationData[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  filteredNotifications: () => NotificationData[];
  unreadCount: () => number;
}

const useNotificationStore = create<NotificationState>((set, get) => ({
  isOpen: false,
  activeTab: 'all',
  notifications: [],

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setNotifications: (items) => set({ notifications: items }),

  markAsRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    })),

  markAllAsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
    })),

  filteredNotifications: () => {
    const { activeTab, notifications } = get();
    if (activeTab === 'all') return notifications;
    return notifications.filter((n) => n.type === activeTab);
  },

  unreadCount: () => get().notifications.filter((n) => !n.isRead).length,
}));

export default useNotificationStore;
