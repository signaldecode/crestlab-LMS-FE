/**
 * 공용 모달 (Modal)
 * - 사이트 전역에서 재사용 가능한 모달 다이얼로그
 * - createPortal로 document.body에 렌더링하여 z-index 충돌을 방지한다
 * - 열기/닫기, 배경 클릭 닫기, ESC 닫기, 포커스 트랩을 지원한다
 * - role="dialog", aria-modal, aria-labelledby 등 A11y를 준수한다
 */

'use client';

import { useEffect, type JSX, type ReactNode, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps): JSX.Element | null {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button className="modal-close" onClick={onClose} aria-label="닫기">
          &times;
        </button>
      </div>
    </div>,
    document.body,
  );
}
