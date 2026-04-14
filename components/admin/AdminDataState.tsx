/**
 * 관리자 조회/뮤테이션 상태 표시 컴포넌트
 * - 로딩/에러 상태를 공통 패턴으로 표시
 */

import type { JSX } from 'react';

interface AdminLoadingProps {
  label: string;
}

export function AdminLoading({ label }: AdminLoadingProps): JSX.Element {
  return (
    <p className="admin-list__empty" role="status" aria-live="polite">{label}</p>
  );
}

interface AdminErrorProps {
  title: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function AdminError({ title, message, retryLabel, onRetry }: AdminErrorProps): JSX.Element {
  return (
    <div className="admin-list__notice" role="alert">
      <h2 className="admin-list__notice-title">{title}</h2>
      <p className="admin-list__notice-body">{message}</p>
      {onRetry && retryLabel && (
        <button type="button" onClick={onRetry} className="admin-list__cta-btn">
          {retryLabel}
        </button>
      )}
    </div>
  );
}
