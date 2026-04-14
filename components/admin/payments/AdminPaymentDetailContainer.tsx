/**
 * 관리자 결제 상세 컨테이너 (AdminPaymentDetailContainer)
 * - 주문 정보 + 사용자 + 금액 + 환불 정보
 * - PAID 상태일 때 환불 처리 모달 제공 (mock)
 */

'use client';

import { useState, useCallback } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import AdminModal from '@/components/admin/AdminModal';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchAdminPayments, refundAdminPayment } from '@/lib/adminApi';
import type { AdminOrderStatus } from '@/types';

interface SectionTitles {
  orderTitle: string; userTitle: string; amountTitle: string; refundInfoTitle: string;
}

interface Labels {
  orderNumber: string; courseTitle: string; status: string; createdAt: string;
  nickname: string; email: string;
  originalAmount: string; discountAmount: string; finalAmount: string;
  refundReason: string; refundedAt: string;
}

interface Actions {
  refundLabel: string; refundAriaLabel: string;
  refundDisabledLabel: string; viewUserLabel: string;
}

interface RefundModalCopy {
  title: string; description: string;
  reasonLabel: string; reasonPlaceholder: string; reasonMaxLength: number;
  reasonRequiredError: string;
  confirmLabel: string; cancelLabel: string;
}

export interface PaymentDetailCopy {
  backLinkLabel: string;
  backLinkHref: string;
  sections: SectionTitles;
  labels: Labels;
  actions: Actions;
  currencyUnit: string;
  refundModal: RefundModalCopy;
  statusLabels: Record<AdminOrderStatus, string>;
}

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

interface AdminPaymentDetailContainerProps {
  orderId: number;
  copy: PaymentDetailCopy;
  common: CommonCopy;
  notFoundText: string;
}

const formatNumber = (n: number): string => n.toLocaleString('ko-KR');
const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export default function AdminPaymentDetailContainer({
  orderId,
  copy,
  common,
  notFoundText,
}: AdminPaymentDetailContainerProps): JSX.Element {
  // 백엔드에 단건 조회 엔드포인트가 별도로 없어서 페이지네이션 없이 전체 조회 후 id로 찾는 방식
  const { data, loading, error, refetch } = useAdminQuery(
    () => fetchAdminPayments({ size: 500 }),
    [orderId],
  );

  const order = data?.content.find((o) => o.id === orderId) ?? null;

  const [isRefundModalOpen, setRefundModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const refundMutation = useAdminMutation(
    (args: { orderNumber: string; reason: string }) => refundAdminPayment(args.orderNumber, args.reason),
    () => { setRefundModalOpen(false); refetch(); },
  );

  const openRefundModal = useCallback(() => {
    setReason('');
    setReasonError('');
    setRefundModalOpen(true);
  }, []);

  const handleRefundSubmit = useCallback(() => {
    if (!order) return;
    if (!reason.trim()) {
      setReasonError(copy.refundModal.reasonRequiredError);
      return;
    }
    void refundMutation.run({ orderNumber: order.orderNumber, reason: reason.trim() });
  }, [reason, order, copy.refundModal.reasonRequiredError, refundMutation]);

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
  if (!order) return <p className="admin-list__empty">{notFoundText}</p>;

  const isRefundable = order.status === 'PAID';

  return (
    <div className="admin-payment-detail">
      <header className="admin-payment-detail__header">
        <Link href={copy.backLinkHref} className="admin-user-detail__back">
          ← {copy.backLinkLabel}
        </Link>
        <h1 className="admin-payment-detail__title">{order.orderNumber}</h1>
        <span className={`admin-payments__status admin-payments__status--${order.status.toLowerCase()}`}>
          {copy.statusLabels[order.status]}
        </span>
      </header>

      <div className="admin-payment-detail__actions">
        <button
          type="button"
          onClick={openRefundModal}
          aria-label={copy.actions.refundAriaLabel}
          disabled={!isRefundable}
          className="admin-user-detail__action-btn admin-user-detail__action-btn--danger"
        >
          {isRefundable ? copy.actions.refundLabel : copy.actions.refundDisabledLabel}
        </button>
      </div>

      <section className="admin-user-detail__section" aria-labelledby="section-order">
        <h2 id="section-order" className="admin-user-detail__section-title">
          {copy.sections.orderTitle}
        </h2>
        <dl className="admin-user-detail__info-list">
          <InfoRow label={copy.labels.orderNumber} value={order.orderNumber} />
          <InfoRow label={copy.labels.courseTitle} value={order.courseTitle} />
          <InfoRow label={copy.labels.status} value={copy.statusLabels[order.status]} />
          <InfoRow label={copy.labels.createdAt} value={formatDateTime(order.createdAt)} />
        </dl>
      </section>

      <section className="admin-user-detail__section" aria-labelledby="section-user">
        <h2 id="section-user" className="admin-user-detail__section-title">
          {copy.sections.userTitle}
        </h2>
        <dl className="admin-user-detail__info-list">
          <InfoRow label={copy.labels.nickname} value={order.nickname} />
          <InfoRow label={copy.labels.email} value={order.email} />
        </dl>
      </section>

      <section className="admin-user-detail__section" aria-labelledby="section-amount">
        <h2 id="section-amount" className="admin-user-detail__section-title">
          {copy.sections.amountTitle}
        </h2>
        <dl className="admin-user-detail__info-list">
          <InfoRow
            label={copy.labels.originalAmount}
            value={`${formatNumber(order.originalAmount)}${copy.currencyUnit}`}
          />
          <InfoRow
            label={copy.labels.discountAmount}
            value={order.discountAmount > 0 ? `-${formatNumber(order.discountAmount)}${copy.currencyUnit}` : '—'}
          />
          <InfoRow
            label={copy.labels.finalAmount}
            value={`${formatNumber(order.finalAmount)}${copy.currencyUnit}`}
            emphasized
          />
        </dl>
      </section>

      {(order.refundReason || order.refundedAt) && (
        <section className="admin-user-detail__section" aria-labelledby="section-refund">
          <h2 id="section-refund" className="admin-user-detail__section-title">
            {copy.sections.refundInfoTitle}
          </h2>
          <dl className="admin-user-detail__info-list">
            {order.refundReason && (
              <InfoRow label={copy.labels.refundReason} value={order.refundReason} />
            )}
            {order.refundedAt && (
              <InfoRow label={copy.labels.refundedAt} value={formatDateTime(order.refundedAt)} />
            )}
          </dl>
        </section>
      )}

      <AdminModal
        isOpen={isRefundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        title={copy.refundModal.title}
        description={copy.refundModal.description}
        size="md"
      >
        <label className="admin-modal__field">
          <span className="admin-modal__field-label">{copy.refundModal.reasonLabel}</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={copy.refundModal.reasonPlaceholder}
            maxLength={copy.refundModal.reasonMaxLength}
            rows={5}
            className="admin-modal__textarea"
          />
          <span className="admin-modal__field-help">
            {reason.length} / {copy.refundModal.reasonMaxLength}
          </span>
        </label>
        {reasonError && <p className="admin-modal__error" role="alert">{reasonError}</p>}
        {refundMutation.error && <p className="admin-modal__error" role="alert">{refundMutation.error.message}</p>}
        <footer className="admin-modal__footer">
          <button type="button" onClick={() => setRefundModalOpen(false)} className="admin-modal__btn admin-modal__btn--ghost">
            {copy.refundModal.cancelLabel}
          </button>
          <button type="button" onClick={handleRefundSubmit} disabled={refundMutation.submitting} className="admin-modal__btn admin-modal__btn--danger">
            {refundMutation.submitting ? common.loadingText : copy.refundModal.confirmLabel}
          </button>
        </footer>
      </AdminModal>
    </div>
  );
}

function InfoRow({
  label,
  value,
  emphasized,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}): JSX.Element {
  return (
    <div className="admin-user-detail__info-row">
      <dt className="admin-user-detail__info-label">{label}</dt>
      <dd className={`admin-user-detail__info-value${emphasized ? ' admin-user-detail__info-value--emphasized' : ''}`}>
        {value}
      </dd>
    </div>
  );
}
