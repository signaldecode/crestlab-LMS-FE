/**
 * ConfirmModal
 * - 확인/취소 두 버튼이 있는 확인 대화상자
 * - 메시지는 외부에서 주입, 버튼 라벨은 data 기반 (props로 오버라이드 가능)
 * - 기존 Modal 포탈/ESC/배경 클릭 패턴을 동일하게 따른다
 */

'use client';

import { useEffect, useCallback, type JSX, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import uiData from '@/data/uiData.json';

const texts = uiData.confirmModal;

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
}

export default function ConfirmModal({
  isOpen,
  message,
  onCancel,
  onConfirm,
  cancelLabel = texts.cancelLabel,
  confirmLabel = texts.confirmLabel,
}: ConfirmModalProps): JSX.Element | null {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel],
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div
        className="confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-label={texts.ariaLabel}
        aria-describedby="confirm-modal-message"
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <p className="confirm-modal__message" id="confirm-modal-message">
          {message}
        </p>

        <div className="confirm-modal__actions">
          <button
            type="button"
            className="confirm-modal__btn confirm-modal__btn--cancel"
            onClick={onCancel}
            aria-label={texts.cancelAriaLabel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="confirm-modal__btn confirm-modal__btn--confirm"
            onClick={onConfirm}
            aria-label={texts.confirmAriaLabel}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
