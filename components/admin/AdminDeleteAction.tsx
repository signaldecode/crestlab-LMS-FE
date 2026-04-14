/**
 * 관리자 삭제/비활성화 액션 버튼 + 확인 모달 (AdminDeleteAction)
 * - 상태와 모달이 버튼 내부에 캡슐화되어 있어 서버 페이지에서도 그대로 사용 가능
 * - 실제 API 호출은 onConfirm 콜백에서 처리
 */

'use client';

import { useState, useCallback } from 'react';
import type { JSX } from 'react';
import AdminModal from '@/components/admin/AdminModal';

interface AdminDeleteActionProps {
  /** 버튼 라벨 (예: "삭제") */
  buttonLabel: string;
  /** 모달 제목 */
  modalTitle: string;
  /** 모달 설명 (이미 치환된 문자열) */
  modalDescription: string;
  /** 확인 버튼 라벨 */
  confirmLabel: string;
  /** 취소 버튼 라벨 */
  cancelLabel: string;
  /** 삭제 대상 식별자 (API 연동 시 사용) */
  targetId: string | number;
  /** 모달 종류 시각적 구분 (danger 기본) */
  variant?: 'danger' | 'primary';
}

export default function AdminDeleteAction({
  buttonLabel,
  modalTitle,
  modalDescription,
  confirmLabel,
  cancelLabel,
  targetId,
  variant = 'danger',
}: AdminDeleteActionProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = useCallback(() => {
    // TODO: 실제 API 호출은 백엔드 연동 시 server action 또는 client fetch로 교체
    // targetId를 endpoint path parameter로 사용
    void targetId;
    setIsOpen(false);
  }, [targetId]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`admin-list__action-btn${variant === 'danger' ? ' admin-list__action-btn--danger' : ''}`}
      >
        {buttonLabel}
      </button>

      <AdminModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={modalTitle}
        description={modalDescription}
      >
        <footer className="admin-modal__footer">
          <button type="button" onClick={() => setIsOpen(false)} className="admin-modal__btn admin-modal__btn--ghost">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`admin-modal__btn admin-modal__btn--${variant}`}
          >
            {confirmLabel}
          </button>
        </footer>
      </AdminModal>
    </>
  );
}
