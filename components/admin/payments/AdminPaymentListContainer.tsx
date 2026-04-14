/**
 * 관리자 결제 목록 컨테이너 (AdminPaymentListContainer)
 * - 필터(상태/키워드) + 테이블 + 페이지네이션
 * - 키워드는 주문번호/닉네임/이메일/강의명 모두 검색
 * - 상세에서 환불 처리; 헤더에서 수동 수강 등록 진입
 */

'use client';

import { useMemo, useState, useCallback } from 'react';
import type { JSX, ChangeEvent } from 'react';
import Link from 'next/link';
import type { AdminOrderListItem, AdminOrderStatus } from '@/types';

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

interface AdminPaymentListContainerProps {
  orders: AdminOrderListItem[];
  copy: AdminPaymentsCopy;
}

const STATUS_VALUES: AdminOrderStatus[] = ['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'];

const formatNumber = (n: number): string => n.toLocaleString('ko-KR');
const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
};

const fillTemplate = (template: string, vars: Record<string, string | number>): string =>
  Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template,
  );

export default function AdminPaymentListContainer({
  orders,
  copy,
}: AdminPaymentListContainerProps): JSX.Element {
  const [statusFilter, setStatusFilter] = useState<AdminOrderStatus | 'ALL'>('ALL');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const normalizedKeyword = keyword.trim().toLowerCase();

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
      if (normalizedKeyword) {
        const haystack = [o.orderNumber, o.nickname, o.email, o.courseTitle]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(normalizedKeyword)) return false;
      }
      return true;
    });
  }, [orders, statusFilter, normalizedKeyword]);

  const pageSize = copy.pagination.pageSize;
  const totalCount = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedOrders = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, safePage, pageSize]);

  const handleStatusChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as AdminOrderStatus | 'ALL');
    setPage(1);
  }, []);

  const handleKeywordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setStatusFilter('ALL');
    setKeyword('');
    setPage(1);
  }, []);

  const goPrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goNext = useCallback(
    () => setPage((p) => Math.min(totalPages, p + 1)),
    [totalPages],
  );

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
            onChange={handleStatusChange}
            className="admin-payments__select"
          >
            <option value="ALL">{copy.filters.statusAllLabel}</option>
            {STATUS_VALUES.map((s) => (
              <option key={s} value={s}>
                {copy.statusLabels[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-payments__filter admin-payments__filter--grow">
          <span className="admin-payments__filter-label">{copy.filters.keywordLabel}</span>
          <input
            type="search"
            value={keyword}
            onChange={handleKeywordChange}
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

      {pagedOrders.length === 0 ? (
        <p className="admin-payments__empty">{copy.emptyText}</p>
      ) : (
        <div className="admin-payments__table-wrap">
          <table className="admin-payments__table">
            <thead>
              <tr>
                <th scope="col" className="admin-payments__th">{copy.columns.orderNumber}</th>
                <th scope="col" className="admin-payments__th">{copy.columns.user}</th>
                <th scope="col" className="admin-payments__th">{copy.columns.course}</th>
                <th scope="col" className="admin-payments__th admin-payments__th--num">
                  {copy.columns.originalAmount}
                </th>
                <th scope="col" className="admin-payments__th admin-payments__th--num">
                  {copy.columns.discountAmount}
                </th>
                <th scope="col" className="admin-payments__th admin-payments__th--num">
                  {copy.columns.finalAmount}
                </th>
                <th scope="col" className="admin-payments__th">{copy.columns.status}</th>
                <th scope="col" className="admin-payments__th">{copy.columns.createdAt}</th>
                <th scope="col" className="admin-payments__th admin-payments__th--actions">
                  {copy.columns.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedOrders.map((o) => (
                <tr key={o.id}>
                  <td className="admin-payments__td admin-payments__td--order-number">
                    {o.orderNumber}
                  </td>
                  <td className="admin-payments__td">
                    <div className="admin-payments__user">
                      <span className="admin-payments__user-nickname">{o.nickname}</span>
                      <span className="admin-payments__user-email">{o.email}</span>
                    </div>
                  </td>
                  <td className="admin-payments__td admin-payments__td--course">{o.courseTitle}</td>
                  <td className="admin-payments__td admin-payments__td--num">
                    {formatNumber(o.originalAmount)}
                    {copy.currencyUnit}
                  </td>
                  <td className="admin-payments__td admin-payments__td--num">
                    {o.discountAmount > 0
                      ? `-${formatNumber(o.discountAmount)}${copy.currencyUnit}`
                      : '—'}
                  </td>
                  <td className="admin-payments__td admin-payments__td--num admin-payments__td--final">
                    {formatNumber(o.finalAmount)}
                    {copy.currencyUnit}
                  </td>
                  <td className="admin-payments__td">
                    <span
                      className={`admin-payments__status admin-payments__status--${o.status.toLowerCase()}`}
                    >
                      {copy.statusLabels[o.status]}
                    </span>
                  </td>
                  <td className="admin-payments__td">{formatDateTime(o.createdAt)}</td>
                  <td className="admin-payments__td admin-payments__td--actions">
                    <Link
                      href={`/admin/payments/${o.id}`}
                      aria-label={fillTemplate(copy.actions.viewAriaLabelTemplate, {
                        orderNumber: o.orderNumber,
                      })}
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
          onClick={goPrev}
          disabled={safePage <= 1}
          aria-label={copy.pagination.previousAriaLabel}
          className="admin-payments__page-btn"
        >
          {copy.pagination.previousLabel}
        </button>
        <span className="admin-payments__page-info" aria-live="polite">
          {fillTemplate(copy.pagination.pageInfoTemplate, {
            current: safePage,
            total: totalPages,
            totalCount,
          })}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={safePage >= totalPages}
          aria-label={copy.pagination.nextAriaLabel}
          className="admin-payments__page-btn"
        >
          {copy.pagination.nextLabel}
        </button>
      </nav>
    </div>
  );
}
