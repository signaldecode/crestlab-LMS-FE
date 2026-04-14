/**
 * 관리자 리뷰 관리 페이지 (/admin/reviews)
 * - 키워드/평점 필터 + 페이지네이션 + 삭제 액션
 */

'use client';

import { useMemo, useState, useCallback } from 'react';
import type { JSX, ChangeEvent } from 'react';
import AdminActionButton from '@/components/admin/AdminActionButton';
import AdminModal from '@/components/admin/AdminModal';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { deleteAdminReview, fetchAdminReviews } from '@/lib/adminApi';
import { getPageData } from '@/lib/data';
import type { AdminReviewListItem } from '@/types';

interface ReviewsCopy {
  seo: { title: string; description: string };
  title: string;
  subtitle: string;
  filters: {
    keywordLabel: string; keywordPlaceholder: string; keywordAriaLabel: string;
    ratingLabel: string; ratingAllLabel: string;
    resetLabel: string; resetAriaLabel: string;
  };
  columns: { rating: string; course: string; user: string; content: string; likeCount: string; createdAt: string; actions: string };
  actionLabels: { delete: string };
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

function getCopy(): ReviewsCopy | null {
  const adminPage = getPageData('admin') as { reviews?: ReviewsCopy } | null;
  return adminPage?.reviews ?? null;
}

const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const fillTemplate = (template: string, vars: Record<string, string | number>): string =>
  Object.entries(vars).reduce((acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)), template);

function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export default function AdminReviewsPage(): JSX.Element {
  const copy = getCopy();
  const common = getCommonCopy();
  const [keyword, setKeyword] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminReviewListItem | null>(null);

  const pageSize = copy?.pagination.pageSize ?? 10;

  const { data, loading, error, refetch } = useAdminQuery(
    () => fetchAdminReviews({ page, size: pageSize }),
    [page, pageSize],
  );

  const deleteMutation = useAdminMutation(
    (id: number) => deleteAdminReview(id),
    () => { setDeleteTarget(null); refetch(); },
  );

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    void deleteMutation.run(deleteTarget.id);
  }, [deleteTarget, deleteMutation]);

  const filtered = useMemo(() => {
    const content = data?.content ?? [];
    const k = keyword.trim().toLowerCase();
    return content.filter((r) => {
      if (ratingFilter !== 'ALL' && r.rating !== Number(ratingFilter)) return false;
      if (k) {
        const haystack = [r.courseTitle, r.nickname, r.email, r.content].join(' ').toLowerCase();
        if (!haystack.includes(k)) return false;
      }
      return true;
    });
  }, [data, keyword, ratingFilter]);

  const handleReset = useCallback(() => {
    setKeyword('');
    setRatingFilter('ALL');
    setPage(1);
  }, []);

  if (!copy || !common) return <main>데이터를 불러올 수 없습니다.</main>;
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

  const totalCount = data?.totalElements ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);
  const safePage = Math.min(page, totalPages);
  const paged = filtered;

  return (
    <div className="admin-list">
      <header className="admin-list__header">
        <div>
          <h1 className="admin-list__title">{copy.title}</h1>
          <p className="admin-list__subtitle">{copy.subtitle}</p>
        </div>
      </header>

      <section className="admin-list__filters">
        <label className="admin-list__filter">
          <span className="admin-list__filter-label">{copy.filters.ratingLabel}</span>
          <select
            value={ratingFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => { setRatingFilter(e.target.value); setPage(1); }}
            className="admin-list__select"
          >
            <option value="ALL">{copy.filters.ratingAllLabel}</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r}점</option>
            ))}
          </select>
        </label>

        <label className="admin-list__filter admin-list__filter--grow">
          <span className="admin-list__filter-label">{copy.filters.keywordLabel}</span>
          <input
            type="search"
            value={keyword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => { setKeyword(e.target.value); setPage(1); }}
            placeholder={copy.filters.keywordPlaceholder}
            aria-label={copy.filters.keywordAriaLabel}
            className="admin-list__input"
          />
        </label>

        <button type="button" onClick={handleReset} aria-label={copy.filters.resetAriaLabel} className="admin-list__reset-btn">
          {copy.filters.resetLabel}
        </button>
      </section>

      {paged.length === 0 ? (
        <p className="admin-list__empty">{copy.emptyText}</p>
      ) : (
        <div className="admin-list__table-wrap">
          <table className="admin-list__table">
            <thead>
              <tr>
                <th scope="col" className="admin-list__th admin-list__th--narrow">{copy.columns.rating}</th>
                <th scope="col" className="admin-list__th">{copy.columns.course}</th>
                <th scope="col" className="admin-list__th">{copy.columns.user}</th>
                <th scope="col" className="admin-list__th">{copy.columns.content}</th>
                <th scope="col" className="admin-list__th admin-list__th--num">{copy.columns.likeCount}</th>
                <th scope="col" className="admin-list__th">{copy.columns.createdAt}</th>
                <th scope="col" className="admin-list__th admin-list__th--actions">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((r) => (
                <tr key={r.id}>
                  <td className="admin-list__td admin-list__td--narrow">{'★'.repeat(r.rating)}</td>
                  <td className="admin-list__td admin-list__td--strong">{r.courseTitle}</td>
                  <td className="admin-list__td">{r.nickname}</td>
                  <td className="admin-list__td admin-list__td--ellipsis">{r.content}</td>
                  <td className="admin-list__td admin-list__td--num">{r.likeCount}</td>
                  <td className="admin-list__td">{formatDateTime(r.createdAt)}</td>
                  <td className="admin-list__td admin-list__td--actions">
                    <AdminActionButton
                      variant="danger"
                      onClick={() => setDeleteTarget(r)}
                    >
                      {copy.actionLabels.delete}
                    </AdminActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <nav className="admin-list__pagination" aria-label="페이지 탐색">
        <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} aria-label={copy.pagination.previousAriaLabel} className="admin-list__page-btn">
          {copy.pagination.previousLabel}
        </button>
        <span className="admin-list__page-info" aria-live="polite">
          {fillTemplate(copy.pagination.pageInfoTemplate, { current: safePage, total: totalPages, totalCount })}
        </span>
        <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} aria-label={copy.pagination.nextAriaLabel} className="admin-list__page-btn">
          {copy.pagination.nextLabel}
        </button>
      </nav>

      <AdminModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={copy.deleteModal.title}
        description={
          deleteTarget
            ? copy.deleteModal.descriptionTemplate
                .replaceAll('{nickname}', deleteTarget.nickname)
                .replaceAll('{course}', deleteTarget.courseTitle)
            : ''
        }
      >
        {deleteMutation.error && (
          <p className="admin-modal__error" role="alert">{deleteMutation.error.message}</p>
        )}
        <footer className="admin-modal__footer">
          <button type="button" onClick={() => setDeleteTarget(null)} className="admin-modal__btn admin-modal__btn--ghost">
            {copy.deleteModal.cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.submitting}
            className="admin-modal__btn admin-modal__btn--danger"
          >
            {copy.deleteModal.confirmLabel}
          </button>
        </footer>
      </AdminModal>
    </div>
  );
}
