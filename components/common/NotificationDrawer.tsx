/**
 * 알림 드로어 패널 (NotificationDrawer)
 * - 오른쪽에서 슬라이드되는 알림 패널
 * - 탭 필터(전체/새글/활동/소식), 알림 리스트, ESC 닫기 지원
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import type { JSX } from 'react';
import useNotificationStore from '@/stores/useNotificationStore';
import NotificationItem from '@/components/common/NotificationItem';
import { getMainData } from '@/lib/data';
import type { NotificationType } from '@/types';

type NotificationTab = 'all' | NotificationType;

interface TabData {
  id: string;
  label: string;
}

export default function NotificationDrawer(): JSX.Element | null {
  const notifUi = getMainData().ui.notification as {
    title: string;
    closeAriaLabel: string;
    tabs: TabData[];
    tabsAriaLabel: string;
    recentLabel: string;
    emptyText: string;
  };

  const isOpen = useNotificationStore((s) => s.isOpen);
  const activeTab = useNotificationStore((s) => s.activeTab);
  const close = useNotificationStore((s) => s.close);
  const setActiveTab = useNotificationStore((s) => s.setActiveTab);
  const filteredNotifications = useNotificationStore((s) => s.filteredNotifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    },
    [close],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const items = filteredNotifications();

  return (
    <>
      {/* 백드롭 오버레이 */}
      <div
        className={`notification-drawer__overlay${isOpen ? ' notification-drawer__overlay--visible' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* 드로어 패널 */}
      <aside
        ref={drawerRef}
        className={`notification-drawer${isOpen ? ' notification-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={notifUi.title}
        aria-hidden={!isOpen}
      >
        {/* 헤더 */}
        <div className="notification-drawer__header">
          <h2 className="notification-drawer__title">{notifUi.title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="notification-drawer__close"
            onClick={close}
            aria-label={notifUi.closeAriaLabel}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* 탭 필터 */}
        <nav className="notification-drawer__tabs" role="tablist" aria-label={notifUi.tabsAriaLabel}>
          {notifUi.tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                className={`notification-drawer__tab${isActive ? ' notification-drawer__tab--active' : ''}`}
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id as NotificationTab)}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* 기간 라벨 */}
        <div className="notification-drawer__period">
          <span>{notifUi.recentLabel}</span>
        </div>

        {/* 알림 리스트 */}
        <div className="notification-drawer__list" role="list" aria-live="polite">
          {items.length === 0 ? (
            <p className="notification-drawer__empty">{notifUi.emptyText}</p>
          ) : (
            items.map((n) => (
              <div key={n.id} role="listitem">
                <NotificationItem notification={n} onRead={markAsRead} />
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
