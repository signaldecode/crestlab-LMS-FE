/**
 * 관리자 쿠폰 목록 컨테이너 (AdminCouponListContainer)
 * - 목록 표시 + 비활성화 확인 모달
 */

'use client';

import { useState, useCallback } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import AdminModal from '@/components/admin/AdminModal';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { deactivateAdminCoupon, fetchAdminCoupons } from '@/lib/adminApi';
import type { AdminCouponDiscountType, AdminCouponListItem } from '@/types';

export interface CouponsCopy {
  title: string;
  subtitle: string;
  createButtonLabel: string;
  createButtonHref: string;
  createButtonAriaLabel: string;
  columns: { code: string; name: string; discount: string; minOrder: string; usage: string; period: string; isActive: string; actions: string };
  discountTypeLabels: Record<AdminCouponDiscountType, string>;
  activeLabels: { true: string; false: string };
  actionLabels: { deactivate: string };
  deactivateModal: {
    title: string; descriptionTemplate: string;
    confirmLabel: string; cancelLabel: string;
  };
  emptyText: string;
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

interface AdminCouponListContainerProps {
  copy: CouponsCopy;
  common: CommonCopy;
}

const formatNumber = (n: number): string => n.toLocaleString('ko-KR');
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function AdminCouponListContainer({
  copy,
  common,
}: AdminCouponListContainerProps): JSX.Element {
  const { data, loading, error, refetch } = useAdminQuery(fetchAdminCoupons, []);
  const [deactivateTarget, setDeactivateTarget] = useState<AdminCouponListItem | null>(null);

  const deactivateMutation = useAdminMutation(
    (id: number) => deactivateAdminCoupon(id),
    () => { setDeactivateTarget(null); refetch(); },
  );

  const handleDeactivate = useCallback(() => {
    if (!deactivateTarget) return;
    void deactivateMutation.run(deactivateTarget.id);
  }, [deactivateTarget, deactivateMutation]);

  if (loading && !data) return <AdminLoading label={common.loadingText} />;
  if (error && !data) {
    return (
      <AdminError
        title={common.errorTitle}
        message={error.message}
        retryLabel={common.errorRetryLabel}
        onRetry={refetch}
      />
    );
  }

  const coupons = data ?? [];

  return (
    <div className="admin-list">
      <header className="admin-list__header">
        <div>
          <h1 className="admin-list__title">{copy.title}</h1>
          <p className="admin-list__subtitle">{copy.subtitle}</p>
        </div>
        <Link href={copy.createButtonHref} aria-label={copy.createButtonAriaLabel} className="admin-list__cta-btn">
          {copy.createButtonLabel}
        </Link>
      </header>

      {coupons.length === 0 ? (
        <p className="admin-list__empty">{copy.emptyText}</p>
      ) : (
        <div className="admin-list__table-wrap">
          <table className="admin-list__table">
            <thead>
              <tr>
                <th scope="col" className="admin-list__th">{copy.columns.code}</th>
                <th scope="col" className="admin-list__th">{copy.columns.name}</th>
                <th scope="col" className="admin-list__th admin-list__th--num">{copy.columns.discount}</th>
                <th scope="col" className="admin-list__th admin-list__th--num">{copy.columns.minOrder}</th>
                <th scope="col" className="admin-list__th admin-list__th--num">{copy.columns.usage}</th>
                <th scope="col" className="admin-list__th">{copy.columns.period}</th>
                <th scope="col" className="admin-list__th">{copy.columns.isActive}</th>
                <th scope="col" className="admin-list__th admin-list__th--actions">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td className="admin-list__td admin-list__td--strong">{c.code}</td>
                  <td className="admin-list__td">{c.name}</td>
                  <td className="admin-list__td admin-list__td--num">
                    {c.discountType === 'PERCENT'
                      ? `${c.discountValue}${copy.discountTypeLabels.PERCENT}`
                      : `${formatNumber(c.discountValue)}${copy.discountTypeLabels.FIXED}`}
                  </td>
                  <td className="admin-list__td admin-list__td--num">{formatNumber(c.minOrderAmount)}원</td>
                  <td className="admin-list__td admin-list__td--num">
                    {formatNumber(c.usedCount)} / {formatNumber(c.totalQuantity)}
                  </td>
                  <td className="admin-list__td">{formatDate(c.startsAt)} ~ {formatDate(c.expiresAt)}</td>
                  <td className="admin-list__td">
                    <span className={`admin-list__badge admin-list__badge--${c.isActive ? 'success' : 'neutral'}`}>
                      {c.isActive ? copy.activeLabels.true : copy.activeLabels.false}
                    </span>
                  </td>
                  <td className="admin-list__td admin-list__td--actions">
                    {c.isActive && (
                      <button
                        type="button"
                        onClick={() => setDeactivateTarget(c)}
                        className="admin-list__action-btn admin-list__action-btn--danger"
                      >
                        {copy.actionLabels.deactivate}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal
        isOpen={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        title={copy.deactivateModal.title}
        description={
          deactivateTarget
            ? copy.deactivateModal.descriptionTemplate
                .replaceAll('{name}', deactivateTarget.name)
                .replaceAll('{code}', deactivateTarget.code)
            : ''
        }
      >
        {deactivateMutation.error && (
          <p className="admin-modal__error" role="alert">{deactivateMutation.error.message}</p>
        )}
        <footer className="admin-modal__footer">
          <button type="button" onClick={() => setDeactivateTarget(null)} className="admin-modal__btn admin-modal__btn--ghost">
            {copy.deactivateModal.cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleDeactivate}
            disabled={deactivateMutation.submitting}
            className="admin-modal__btn admin-modal__btn--danger"
          >
            {copy.deactivateModal.confirmLabel}
          </button>
        </footer>
      </AdminModal>
    </div>
  );
}
