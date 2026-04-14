/**
 * 관리자 결제 목록 컨테이너 (AdminPaymentListContainer)
 * - 백엔드 GET /api/v1/admin/payments 실 API 연동
 * - 상태 필터는 server-side, 키워드 검색은 현재 API 미지원이므로 client-side에서 필터링
 */

'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import type { JSX, ChangeEvent } from 'react';
import Link from 'next/link';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchAdminPayments } from '@/lib/adminApi';
import type { AdminOrderStatus } from '@/types';

interface FiltersCopy {
  statusLabel: string;
  statusAllLabel: string;
  keywordLabel: string;
  keywordPlaceholder: string;
  keywordAriaLabel: string;
  resetLabel: string;
  resetAriaLabel: string;
}

interface ColumnsCopy {
  orderNumber: string;
  user: string;
  course: string;
  originalAmount: string;
  discountAmount: string;
  finalAmount: string;
  status: string;
  createdAt: string;
  actions: string;
}

interface ActionsCopy {
  viewLabel: string;
  viewAriaLabelTemplate: string;
}

interface PaginationCopy {
  previousLabel: string;
  previousAriaLabel: string;
  nextLabel: string;
  nextAriaLabel: string;
  pageInfoTemplate: string;
  pageSize: number;
}

export interface AdminPaymentsCopy {
  title: string;
  subtitle: string;
  manualEnrollButtonLabel: string;
  manualEnrollButtonAriaLabel: string;
  manualEnrollButtonHref: string;
  filters: FiltersCopy;
  statusLabels: Record<AdminOrderStatus, string>;
  columns: ColumnsCopy;
  actions: ActionsCopy;
  currencyUnit: string;
  emptyText: string;
  pagination: PaginationCopy;
}

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

interface AdminPaymentListContainerProps {
  copy: AdminPaymentsCopy;
  common: CommonCopy;
}

const STATUS_VALUES: AdminOrderStatus[] = ['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'];

const formatNumber = (n: number): string => n.toLocaleString('ko-KR');
const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
const fillTemplate = (template: string, vars: Record<string, string | number>): string =>
  Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template,
  );

export default function AdminPaymentListContainer({
  copy,
  common,
}: AdminPaymentListContainerProps): JSX.Element {
  const [statusFilter, setStatusFilter] = useState<AdminOrderStatus | 'ALL'>('ALL');
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setKeyword(keywordInput.trim().toLowerCase()), 400);
    return () => clearTimeout(t);
  }, [keywordInput]);

  const pageSize = copy.pagination.pageSize;

  const paymentsQuery = useAdminQuery(
    () =>
      fetchAdminPayments({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        page,
        size: pageSize,
      }),
    [statusFilter, page, pageSize],
  );

  const handleReset = useCallback(() => {
    setStatusFilter('ALL');
    setKeywordInput('');
    setKeyword('');
    setPage(1);
  }, []);

  if (paymentsQuery.error && !paymentsQuery.data) {
    return (
      <AdminError
        title={common.errorTitle}
        message={paymentsQuery.error.message}
        retryLabel={common.errorRetryLabel}
        onRetry={paymentsQuery.refetch}
      />
    );
  }

  const rawOrders = paymentsQuery.data?.content ?? [];
  const orders = useMemo(() => {
    if (!keyword) return rawOrders;
    return rawOrders.filter((o) => {
      const haystack = [o.orderNumber, o.nickname, o.email, o.courseTitle].join(' ').toLowerCase();
      return haystack.includes(keyword);
    });
  }, [rawOrders, keyword]);

  const totalCount = paymentsQuery.data?.totalElements ?? 0;
  const totalPages = Math.max(1, paymentsQuery.data?.totalPages ?? 1);
  const currentPage = paymentsQuery.data?.currentPage ?? page;

  return (
    <div className="admin-payments">
      <header className="admin-payments__header">
        <div>
          <h1 className="admin-payments__title">{copy.title}</h1>
          <p className="admin-payments__subtitle">{copy.subtitle}</p>
        </div>
        <Link
          href={copy.manualEnrollButtonHref}
          aria-label={copy.manualEnrollButtonAriaLabel}
          className="admin-payments__manual-enroll-btn"
        >
          {copy.manualEnrollButtonLabel}
        </Link>
      </header>

      <section className="admin-payments__filters" aria-label={copy.filters.keywordLabel}>
        <label className="admin-payments__filter">
          <span className="admin-payments__filter-label">{copy.filters.statusLabel}</span>
          <select
            value={statusFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => { setStatusFilter(e.target.value as AdminOrderStatus | 'ALL'); setPage(1); }}
            className="admin-payments__select"
          >
            <option value="ALL">{copy.filters.statusAllLabel}</option>
            {STATUS_VALUES.map((s) => (
              <option key={s} value={s}>{copy.statusLabels[s]}</option>
            ))}
          </select>
        </label>

        <label className="admin-payments__filter admin-payments__filter--grow">
          <span className="admin-payments__filter-label">{copy.filters.keywordLabel}</span>
          <input
            type="search"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder={copy.filters.keywordPlaceholder}
            aria-label={copy.filters.keywordAriaLabel}
            className="admin-payments__input"
          />
        </label>

        <button
          type="button"
          onClick={handleReset}
          aria-label={copy.filters.resetAriaLabel}
          className="admin-payments__reset-btn"
        >
          {copy.filters.resetLabel}
        </button>
      </section>

      {paymentsQuery.loading && !paymentsQuery.data ? (
        <AdminLoading label={common.loadingText} />
      ) : orders.length === 0 ? (
        <p className="admin-payments__empty">{copy.emptyText}</p>
      ) : (
        <div className="admin-payments__table-wrap">
          <table className="admin-payments__table">
            <thead>
              <tr>
                <th scope="col" className="admin-payments__th">{copy.columns.orderNumber}</th>
                <th scope="col" className="admin-payments__th">{copy.columns.user}</th>
                <th scope="col" className="admin-payments__th">{copy.columns.course}</th>
                <th scope="col" className="admin-payments__th admin-payments__th--num">{copy.columns.originalAmount}</th>
                <th scope="col" className="admin-payments__th admin-payments__th--num">{copy.columns.discountAmount}</th>
                <th scope="col" className="admin-payments__th admin-payments__th--num">{copy.columns.finalAmount}</th>
                <th scope="col" className="admin-payments__th">{copy.columns.status}</th>
                <th scope="col" className="admin-payments__th">{copy.columns.createdAt}</th>
                <th scope="col" className="admin-payments__th admin-payments__th--actions">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="admin-payments__td admin-payments__td--order-number">{o.orderNumber}</td>
                  <td className="admin-payments__td">
                    <div className="admin-payments__user">
                      <span className="admin-payments__user-nickname">{o.nickname}</span>
                      <span className="admin-payments__user-email">{o.email}</span>
                    </div>
                  </td>
                  <td className="admin-payments__td admin-payments__td--course">{o.courseTitle}</td>
                  <td className="admin-payments__td admin-payments__td--num">
                    {formatNumber(o.originalAmount)}{copy.currencyUnit}
                  </td>
                  <td className="admin-payments__td admin-payments__td--num">
                    {o.discountAmount > 0 ? `-${formatNumber(o.discountAmount)}${copy.currencyUnit}` : '—'}
                  </td>
                  <td className="admin-payments__td admin-payments__td--num admin-payments__td--final">
                    {formatNumber(o.finalAmount)}{copy.currencyUnit}
                  </td>
                  <td className="admin-payments__td">
                    <span className={`admin-payments__status admin-payments__status--${o.status.toLowerCase()}`}>
                      {copy.statusLabels[o.status]}
                    </span>
                  </td>
                  <td className="admin-payments__td">{formatDateTime(o.createdAt)}</td>
                  <td className="admin-payments__td admin-payments__td--actions">
                    <Link
                      href={`/admin/payments/${o.id}`}
                      aria-label={fillTemplate(copy.actions.viewAriaLabelTemplate, { orderNumber: o.orderNumber })}
                      className="admin-payments__action-link"
                    >
                      {copy.actions.viewLabel}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <nav className="admin-payments__pagination" aria-label="페이지 탐색">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          aria-label={copy.pagination.previousAriaLabel}
          className="admin-payments__page-btn"
        >
          {copy.pagination.previousLabel}
        </button>
        <span className="admin-payments__page-info" aria-live="polite">
          {fillTemplate(copy.pagination.pageInfoTemplate, { current: currentPage, total: totalPages, totalCount })}
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          aria-label={copy.pagination.nextAriaLabel}
          className="admin-payments__page-btn"
        >
          {copy.pagination.nextLabel}
        </button>
      </nav>
    </div>
  );
}
