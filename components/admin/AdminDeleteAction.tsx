/**
 * 관리자 삭제/비활성화 액션 버튼 + 확인 모달 (AdminDeleteAction)
 * - 리소스 타입에 따라 적절한 admin API를 호출한다
 * - 성공 시 onDeleted 콜백으로 상위 Container에서 refetch를 트리거
 */

'use client';

import { useState, useCallback } from 'react';
import type { JSX } from 'react';
import AdminActionButton from '@/components/admin/AdminActionButton';
import AdminModal from '@/components/admin/AdminModal';
import {
  deactivateAdminCoupon,
  deleteAdminBanner,
  deleteAdminCategory,
  deleteAdminFaq,
  deleteAdminMainSection,
  deleteAdminNotice,
  deleteAdminReview,
  deleteAdminSuccessStory,
  deleteAdminTag,
} from '@/lib/adminApi';

export type AdminDeleteResource =
  | 'banner'
  | 'mainSection'
  | 'successStory'
  | 'faq'
  | 'review'
  | 'notice'
  | 'category'
  | 'tag'
  | 'coupon'; // coupon은 실제로 비활성화 (deactivate)

interface AdminDeleteActionProps {
  buttonLabel: string;
  modalTitle: string;
  modalDescription: string;
  confirmLabel: string;
  cancelLabel: string;
  /** 삭제 대상 식별자 */
  targetId: number;
  /** 리소스 종류 */
  resource: AdminDeleteResource;
  /** 삭제 성공 후 콜백 (보통 상위 Container refetch) */
  onDeleted?: () => void;
  variant?: 'danger' | 'primary';
}

function executeDelete(resource: AdminDeleteResource, id: number): Promise<void> {
  switch (resource) {
    case 'banner': return deleteAdminBanner(id);
    case 'mainSection': return deleteAdminMainSection(id);
    case 'successStory': return deleteAdminSuccessStory(id);
    case 'faq': return deleteAdminFaq(id);
    case 'review': return deleteAdminReview(id);
    case 'notice': return deleteAdminNotice(id);
    case 'category': return deleteAdminCategory(id);
    case 'tag': return deleteAdminTag(id);
    case 'coupon': return deactivateAdminCoupon(id);
  }
}

export default function AdminDeleteAction({
  buttonLabel,
  modalTitle,
  modalDescription,
  confirmLabel,
  cancelLabel,
  targetId,
  resource,
  onDeleted,
  variant = 'danger',
}: AdminDeleteActionProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      await executeDelete(resource, targetId);
      setIsOpen(false);
      onDeleted?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  }, [resource, targetId, onDeleted]);

  return (
    <>
      <AdminActionButton
        variant={variant === 'danger' ? 'danger' : 'default'}
        onClick={() => setIsOpen(true)}
      >
        {buttonLabel}
      </AdminActionButton>

      <AdminModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={modalTitle}
        description={modalDescription}
      >
        {error && <p className="admin-modal__error" role="alert">{error}</p>}
        <footer className="admin-modal__footer">
          <button type="button" onClick={() => setIsOpen(false)} className="admin-modal__btn admin-modal__btn--ghost">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className={`admin-modal__btn admin-modal__btn--${variant}`}
          >
            {confirmLabel}
          </button>
        </footer>
      </AdminModal>
    </>
  );
}
