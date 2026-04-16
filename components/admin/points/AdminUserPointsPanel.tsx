/**
 * 관리자 사용자 포인트 패널 (AdminUserPointsPanel)
 * - 사용자 상세 내 "포인트" 탭
 * - 잔액/소멸예정: GET /admin/users/{id}/points/summary
 * - 적립·사용·소멸 내역: GET /admin/users/{id}/points/history (type 필터, 페이지네이션)
 * - 수동 조정: POST /admin/points/adjust
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import type { JSX } from 'react';
import AdminModal from '@/components/admin/AdminModal';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import {
  adjustAdminPoints,
  fetchAdminUserPointHistory,
  fetchAdminUserPointSummary,
  type AdminPointHistoryType,
} from '@/lib/adminApi';

export interface AdminUserPointsPanelCopy {
  description: string;
  balanceLabel: string;
  balanceUnit: string;
  balanceUnavailableText: string;
  expiringLabel?: string;
  historyTitle?: string;
  historyEmpty?: string;
  historyFilters?: {
    allLabel: string;
    earnLabel: string;
    useLabel: string;
    expireLabel: string;
  };
  historyColumns?: {
    type: string;
    amount: string;
    description: string;
    createdAt: string;
  };
  historyTypeLabels?: Record<AdminPointHistoryType, string>;
  paginationPrev?: string;
  paginationNext?: string;
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
  /** 조정 성공 시 상위에서 유저 정보 리프레시 */
  onAdjustSuccess?: () => void;
  copy: AdminUserPointsPanelCopy;
}

type FormErrorKey = keyof AdminUserPointsPanelCopy['errors'];
type HistoryFilter = 'ALL' | AdminPointHistoryType;

const HISTORY_PAGE_SIZE = 10;

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function AdminUserPointsPanel({ userId, nickname, onAdjustSuccess, copy }: Props): JSX.Element {
  // ── 잔액 ──
  const {
    data: summary,
    loading: summaryLoading,
    refetch: refetchSummary,
  } = useAdminQuery(() => fetchAdminUserPointSummary(userId), [userId]);

  // ── 내역 ──
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('ALL');
  const [page, setPage] = useState(1);

  const historyParams = useMemo(
    () => ({
      type: historyFilter === 'ALL' ? undefined : historyFilter,
      page,
      size: HISTORY_PAGE_SIZE,
    }),
    [historyFilter, page],
  );

  const {
    data: historyPage,
    loading: historyLoading,
    refetch: refetchHistory,
  } = useAdminQuery(() => fetchAdminUserPointHistory(userId, historyParams), [userId, historyFilter, page]);

  // ── 폼 ──
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
      // 잔액/내역 갱신 + 상위 유저 정보도 갱신
      void refetchSummary();
      setPage(1);
      void refetchHistory();
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

  const filterOptions: Array<{ key: HistoryFilter; label: string }> = copy.historyFilters
    ? [
      { key: 'ALL', label: copy.historyFilters.allLabel },
      { key: 'EARN', label: copy.historyFilters.earnLabel },
      { key: 'USE', label: copy.historyFilters.useLabel },
      { key: 'EXPIRE', label: copy.historyFilters.expireLabel },
    ]
    : [];

  const historyItems = historyPage?.content ?? [];
  const totalPages = historyPage?.totalPages ?? 1;

  const handleFilterChange = (key: HistoryFilter) => {
    setHistoryFilter(key);
    setPage(1);
  };

  return (
    <div className="admin-form-page__field-group">
      {/* ── 잔액 박스 ── */}
      <dl className="admin-user-detail__balance">
        <div>
          <dt className="admin-user-detail__balance-label">{copy.balanceLabel}</dt>
          <dd className="admin-user-detail__balance-value">
            {summaryLoading && !summary
              ? '...'
              : summary
                ? `${summary.totalPoints.toLocaleString('ko-KR')}${copy.balanceUnit}`
                : copy.balanceUnavailableText}
          </dd>
        </div>
        {copy.expiringLabel && summary && summary.expiringPoints > 0 && (
          <div>
            <dt className="admin-user-detail__balance-label">{copy.expiringLabel}</dt>
            <dd className="admin-user-detail__balance-value admin-user-detail__balance-value--muted">
              {summary.expiringPoints.toLocaleString('ko-KR')}{copy.balanceUnit}
            </dd>
          </div>
        )}
      </dl>

      {/* ── 내역 테이블 ── */}
      {copy.historyTitle && copy.historyColumns && copy.historyTypeLabels && (
        <section className="admin-user-detail__history">
          <div className="admin-user-detail__history-head">
            <h3 className="admin-user-detail__history-title">{copy.historyTitle}</h3>
            {filterOptions.length > 0 && (
              <div className="admin-user-detail__history-filters" role="tablist">
                {filterOptions.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={historyFilter === key}
                    onClick={() => handleFilterChange(key)}
                    className={`admin-user-detail__history-filter${historyFilter === key ? ' is-active' : ''}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {historyLoading && historyItems.length === 0 ? (
            <p className="admin-list__empty">...</p>
          ) : historyItems.length === 0 ? (
            <p className="admin-list__empty">{copy.historyEmpty ?? ''}</p>
          ) : (
            <>
              <div className="admin-list__table-wrap">
                <table className="admin-list__table">
                  <thead>
                    <tr>
                      <th scope="col" className="admin-list__th admin-list__th--narrow">{copy.historyColumns.type}</th>
                      <th scope="col" className="admin-list__th admin-list__th--num">{copy.historyColumns.amount}</th>
                      <th scope="col" className="admin-list__th">{copy.historyColumns.description}</th>
                      <th scope="col" className="admin-list__th">{copy.historyColumns.createdAt}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyItems.map((item) => (
                      <tr key={item.id}>
                        <td className="admin-list__td admin-list__td--narrow">
                          <span className={`admin-user-detail__history-type admin-user-detail__history-type--${item.type.toLowerCase()}`}>
                            {copy.historyTypeLabels![item.type]}
                          </span>
                        </td>
                        <td className="admin-list__td admin-list__td--num">
                          {item.type === 'EARN' ? '+' : '-'}
                          {Math.abs(item.amount).toLocaleString('ko-KR')}{copy.balanceUnit}
                        </td>
                        <td className="admin-list__td">{item.description}</td>
                        <td className="admin-list__td">{formatDate(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <nav className="admin-user-detail__pagination" aria-label="포인트 내역 페이지">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="admin-modal__btn admin-modal__btn--ghost"
                  >
                    {copy.paginationPrev ?? '이전'}
                  </button>
                  <span className="admin-user-detail__pagination-info">{page} / {totalPages}</span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="admin-modal__btn admin-modal__btn--ghost"
                  >
                    {copy.paginationNext ?? '다음'}
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      )}

      {/* ── 조정 폼 ── */}
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
