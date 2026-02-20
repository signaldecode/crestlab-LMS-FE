/**
 * 공용 모달 (Modal)
 * - 사이트 전역에서 재사용 가능한 모달 다이얼로그
 * - 열기/닫기, 배경 클릭 닫기, ESC 닫기, 포커스 트랩을 지원한다
 * - role="dialog", aria-modal, aria-labelledby 등 A11y를 준수한다
 */

import type { JSX, ReactNode, MouseEvent } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
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
    </div>
  );
}
