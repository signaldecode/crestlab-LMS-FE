/**
 * 개별 알림 아이템 (NotificationItem)
 * - 프로필 이미지, 시간, 제목, 메시지를 표시한다
 * - 읽지 않은 알림은 하이라이트 처리한다
 */

'use client';

import type { JSX } from 'react';
import type { NotificationData } from '@/types';

interface NotificationItemProps {
  notification: NotificationData;
  onRead: (id: string) => void;
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분전`;
  if (diffHour < 24) return `${diffHour}시간전`;
  return `${diffDay}일전`;
}

export default function NotificationItem({ notification, onRead }: NotificationItemProps): JSX.Element {
  const { id, title, message, profileImage, isRead, createdAt } = notification;

  const handleClick = () => {
    if (!isRead) onRead(id);
  };

  return (
    <button
      type="button"
      className={`notification-item${isRead ? '' : ' notification-item--unread'}`}
      onClick={handleClick}
      aria-label={`${title} - ${message}`}
    >
      <div className="notification-item__avatar">
        {profileImage ? (
          <img
            src={profileImage}
            alt=""
            className="notification-item__avatar-img"
          />
        ) : (
          <svg className="notification-item__avatar-default" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#60a5fa" />
            <path d="M20 12a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 12c5.523 0 10 2.239 10 5v1H10v-1c0-2.761 4.477-5 10-5Z" fill="#fff" />
          </svg>
        )}
        {!isRead && <span className="notification-item__badge" aria-hidden="true" />}
      </div>

      <div className="notification-item__body">
        <span className="notification-item__time">{getRelativeTime(createdAt)}</span>
        <strong className="notification-item__title">{title}</strong>
        <p className="notification-item__message">{message}</p>
      </div>
    </button>
  );
}
