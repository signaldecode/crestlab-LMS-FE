/**
 * 관리자 공통 모달 (AdminModal)
 * - 확인 다이얼로그, 폼 모달 등에서 재사용되는 베이스
 * - ESC 키, 오버레이 클릭으로 닫힘
 * - role=dialog + aria-modal + 타이틀 연결
 */

'use client';

import { useEffect, useRef } from 'react';
import type { JSX, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** 모달 크기: sm(440) | md(560) | lg(720) */
  size?: 'sm' | 'md' | 'lg';
  /** 닫기 버튼 aria-label */
  closeAriaLabel?: string;
}

export default function AdminModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'sm',
  closeAriaLabel = '닫기',
}: AdminModalProps): JSX.Element | null {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof window === 'undefined') return null;

  const titleId = `admin-modal-title-${title.replace(/\s+/g, '-')}`;
  const descId = description ? `admin-modal-desc-${title.replace(/\s+/g, '-')}` : undefined;

  return createPortal(
    <div
      className="admin-modal__overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className={`admin-modal admin-modal--${size}`}
      >
        <header className="admin-modal__header">
          <h2 id={titleId} className="admin-modal__title">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeAriaLabel}
            className="admin-modal__close-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {description && (
          <p id={descId} className="admin-modal__description">{description}</p>
        )}

        <div className="admin-modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
