/**
 * 관리자 사용자 포인트 조정 패널 (AdminUserPointsPanel)
 * - 사용자 상세 내 탭으로 사용
 * - 백엔드: POST /api/v1/admin/points/adjust
 */

'use client';

import { useState, useCallback } from 'react';
import type { JSX } from 'react';
import AdminModal from '@/components/admin/AdminModal';
import { useAdminMutation } from '@/hooks/useAdminQuery';
import { adjustAdminPoints } from '@/lib/adminApi';

export interface AdminUserPointsPanelCopy {
  description: string;
  balanceLabel: string;
  balanceUnit: string;
  balanceUnavailableText: string;
  fields: {
    amountLabel: string; amountPlaceholder: string;
    reasonLabel: string; reasonPlaceholder: string;
  };
  errors: {
    amountRequired: string; amountZero: string;
    reasonRequired: string; reasonTooLong: string;
  };
  confirmModal: {
    title: string;
    creditTemplate: string; debitTemplate: string;
    reasonLabel: string;
    confirmLabel: string; cancelLabel: string;
  };
  successText: string;
  successCloseLabel: string;
  actions: { submitLabel: string; resetLabel: string };
}

interface Props {
  userId: number;
  nickname: string;
  /** 백엔드가 `AdminUserDetailResponse.pointBalance` 를 내려주기 시작하면 자동으로 표시됨 */
  pointBalance?: number;
  /** 조정 성공 시 상위에서 유저 정보 리프레시 */
  onAdjustSuccess?: () => void;
  copy: AdminUserPointsPanelCopy;
}

type FormErrorKey = keyof AdminUserPointsPanelCopy['errors'];

export default function AdminUserPointsPanel({ userId, nickname, pointBalance, onAdjustSuccess, copy }: Props): JSX.Element {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Partial<Record<FormErrorKey, string>>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const mutation = useAdminMutation(
    () => adjustAdminPoints({
      userId,
      amount: Number(amount.trim()),
      reason: reason.trim(),
    }),
    () => {
      setConfirmOpen(false);
      setSuccessOpen(true);
      setAmount('');
      setReason('');
      onAdjustSuccess?.();
    },
  );

  const validate = useCallback((): boolean => {
    const next: Partial<Record<FormErrorKey, string>> = {};
    const amtTrim = amount.trim();
    const amt = Number(amtTrim);
    if (!amtTrim) next.amountRequired = copy.errors.amountRequired;
    else if (!Number.isInteger(amt)) next.amountRequired = copy.errors.amountRequired;
    else if (amt === 0) next.amountZero = copy.errors.amountZero;

    const rTrim = reason.trim();
    if (!rTrim) next.reasonRequired = copy.errors.reasonRequired;
    else if (rTrim.length > 150) next.reasonTooLong = copy.errors.reasonTooLong;

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [amount, reason, copy.errors]);

  const handleRequestConfirm = useCallback(() => {
    if (!validate()) return;
    setConfirmOpen(true);
  }, [validate]);

  const handleReset = useCallback(() => {
    setAmount('');
    setReason('');
    setErrors({});
  }, []);

  const numericAmount = Number(amount.trim());
  const isCredit = Number.isFinite(numericAmount) && numericAmount > 0;
  const confirmDescription = (isCredit
    ? copy.confirmModal.creditTemplate
    : copy.confirmModal.debitTemplate)
    .replaceAll('{nickname}', nickname)
    .replaceAll('{amount}', Math.abs(numericAmount).toLocaleString('ko-KR'));

  return (
    <div className="admin-form-page__field-group">
      <dl className="admin-user-detail__balance">
        <dt className="admin-user-detail__balance-label">{copy.balanceLabel}</dt>
        <dd className="admin-user-detail__balance-value">
          {typeof pointBalance === 'number'
            ? `${pointBalance.toLocaleString('ko-KR')}${copy.balanceUnit}`
            : copy.balanceUnavailableText}
        </dd>
      </dl>

      <p className="admin-form-page__subtitle">{copy.description}</p>

      <label className="admin-form-page__field">
        <span className="admin-form-page__label">{copy.fields.amountLabel}</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={copy.fields.amountPlaceholder}
          className="admin-form-page__input"
        />
        {errors.amountRequired && <span className="admin-modal__error">{errors.amountRequired}</span>}
        {errors.amountZero && <span className="admin-modal__error">{errors.amountZero}</span>}
      </label>

      <label className="admin-form-page__field">
        <span className="admin-form-page__label">{copy.fields.reasonLabel}</span>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={copy.fields.reasonPlaceholder}
          maxLength={150}
          rows={3}
          className="admin-form-page__textarea"
        />
        {errors.reasonRequired && <span className="admin-modal__error">{errors.reasonRequired}</span>}
        {errors.reasonTooLong && <span className="admin-modal__error">{errors.reasonTooLong}</span>}
      </label>

      <footer className="admin-form-page__footer">
        <button type="button" onClick={handleReset} className="admin-modal__btn admin-modal__btn--ghost">
          {copy.actions.resetLabel}
        </button>
        <button type="button" onClick={handleRequestConfirm} className="admin-modal__btn admin-modal__btn--primary">
          {copy.actions.submitLabel}
        </button>
      </footer>

      <AdminModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={copy.confirmModal.title}
        description={confirmDescription}
      >
        <p className="admin-modal__field">
          <span className="admin-modal__field-label">{copy.confirmModal.reasonLabel}</span>
          <span>{reason.trim()}</span>
        </p>
        {mutation.error && (
          <p className="admin-modal__error" role="alert">{mutation.error.message}</p>
        )}
        <footer className="admin-modal__footer">
          <button type="button" onClick={() => setConfirmOpen(false)} className="admin-modal__btn admin-modal__btn--ghost">
            {copy.confirmModal.cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => void mutation.run()}
            disabled={mutation.submitting}
            className={`admin-modal__btn admin-modal__btn--${isCredit ? 'primary' : 'danger'}`}
          >
            {copy.confirmModal.confirmLabel}
          </button>
        </footer>
      </AdminModal>

      <AdminModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        title={copy.successText}
      >
        <footer className="admin-modal__footer">
          <button type="button" onClick={() => setSuccessOpen(false)} className="admin-modal__btn admin-modal__btn--primary">
            {copy.successCloseLabel}
          </button>
        </footer>
      </AdminModal>
    </div>
  );
}
