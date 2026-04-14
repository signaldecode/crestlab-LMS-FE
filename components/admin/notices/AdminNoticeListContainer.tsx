/**
 * 관리자 공지사항 목록 컨테이너 (AdminNoticeListContainer)
 * - 백엔드 GET /api/v1/admin/notices 실 API 연동
 */

'use client';

import { useState, useCallback } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import AdminDeleteAction from '@/components/admin/AdminDeleteAction';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchAdminNotices } from '@/lib/adminApi';

export interface NoticesCopy {
  title: string;
  subtitle: string;
  createButtonLabel: string;
  createButtonHref: string;
  createButtonAriaLabel: string;
  columns: { title: string; pinned: string; isActive: string; createdAt: string; actions: string };
  pinnedLabels: { true: string; false: string };
  activeLabels: { true: string; false: string };
  actionLabels: { edit: string; delete: string };
  deleteModal: {
    title: string; descriptionTemplate: string;
    confirmLabel: string; cancelLabel: string;
  };
  emptyText: string;
  pagination: {
    previousLabel: string; previousAriaLabel: string;
    nextLabel: string; nextAriaLabel: string;
    pageInfoTemplate: string; pageSize: number;
  };
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

interface Props { copy: NoticesCopy; common: CommonCopy; }

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};
const fillTemplate = (template: string, vars: Record<string, string | number>): string =>
  Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template,
  );

export default function AdminNoticeListContainer({ copy, common }: Props): JSX.Element {
  const [page, setPage] = useState(1);
  const pageSize = copy.pagination.pageSize;

  const { data, loading, error, refetch } = useAdminQuery(
    () => fetchAdminNotices({ page, size: pageSize }),
    [page, pageSize],
  );

  const handlePrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const handleNext = useCallback(() => setPage((p) => p + 1), []);

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

  const notices = data?.content ?? [];
  const totalCount = data?.totalElements ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);
  const currentPage = data?.page ?? page;

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

      {notices.length === 0 ? (
        <p className="admin-list__empty">{copy.emptyText}</p>
      ) : (
        <div className="admin-list__table-wrap">
          <table className="admin-list__table">
            <thead>
              <tr>
                <th scope="col" className="admin-list__th">{copy.columns.title}</th>
                <th scope="col" className="admin-list__th">{copy.columns.pinned}</th>
                <th scope="col" className="admin-list__th">{copy.columns.isActive}</th>
                <th scope="col" className="admin-list__th">{copy.columns.createdAt}</th>
                <th scope="col" className="admin-list__th admin-list__th--actions">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n.id}>
                  <td className="admin-list__td admin-list__td--strong">{n.title}</td>
                  <td className="admin-list__td">
                    {n.pinned && <span className="admin-list__badge admin-list__badge--info">{copy.pinnedLabels.true}</span>}
                  </td>
                  <td className="admin-list__td">
                    <span className={`admin-list__badge admin-list__badge--${n.isActive ? 'success' : 'neutral'}`}>
                      {n.isActive ? copy.activeLabels.true : copy.activeLabels.false}
                    </span>
                  </td>
                  <td className="admin-list__td">{formatDate(n.createdAt)}</td>
                  <td className="admin-list__td admin-list__td--actions">
                    <Link href={`/admin/notices/${n.id}/edit`} className="admin-list__action-link">
                      {copy.actionLabels.edit}
                    </Link>
                    <AdminDeleteAction
                      targetId={n.id}
                      resource="notice"
                      onDeleted={refetch}
                      buttonLabel={copy.actionLabels.delete}
                      modalTitle={copy.deleteModal.title}
                      modalDescription={copy.deleteModal.descriptionTemplate.replaceAll('{title}', n.title)}
                      confirmLabel={copy.deleteModal.confirmLabel}
                      cancelLabel={copy.deleteModal.cancelLabel}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <nav className="admin-list__pagination" aria-label="페이지 탐색">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage <= 1}
          aria-label={copy.pagination.previousAriaLabel}
          className="admin-list__page-btn"
        >
          {copy.pagination.previousLabel}
        </button>
        <span className="admin-list__page-info" aria-live="polite">
          {fillTemplate(copy.pagination.pageInfoTemplate, { current: currentPage, total: totalPages, totalCount })}
        </span>
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          aria-label={copy.pagination.nextAriaLabel}
          className="admin-list__page-btn"
        >
          {copy.pagination.nextLabel}
        </button>
      </nav>
    </div>
  );
}
