/**
 * 관리자 레벨 기준 관리 페이지 (/admin/levels)
 * - 레벨별 승급 기준 표시 + 기준 수정 모달 + 수동 갱신 확인 모달
 */

'use client';

import { useState, useCallback } from 'react';
import type { JSX } from 'react';
import AdminModal from '@/components/admin/AdminModal';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchAdminLevels, refreshAdminLevels, updateAdminLevel } from '@/lib/adminApi';
import { getPageData } from '@/lib/data';
import type { AdminLevelCriteriaItem } from '@/types';

interface EditModalCopy {
  titleTemplate: string; description: string;
  minEnrollmentLabel: string; minReviewLabel: string; minTotalSpentLabel: string;
  negativeError: string;
  confirmLabel: string; cancelLabel: string;
}

interface RefreshModalCopy {
  title: string; description: string;
  confirmLabel: string; cancelLabel: string;
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

interface LevelsCopy {
  seo: { title: string; description: string };
  title: string;
  subtitle: string;
  refreshButtonLabel: string;
  refreshButtonAriaLabel: string;
  refreshHelpText: string;
  columns: { level: string; minEnrollmentCount: string; minReviewCount: string; minTotalSpent: string; actions: string };
  actionLabels: { edit: string };
  currencyUnit: string;
  courseUnit: string;
  reviewUnit: string;
  editModal: EditModalCopy;
  refreshModal: RefreshModalCopy;
}

function getCopy(): LevelsCopy | null {
  const adminPage = getPageData('admin') as { levels?: LevelsCopy } | null;
  return adminPage?.levels ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

const formatNumber = (n: number): string => n.toLocaleString('ko-KR');

export default function AdminLevelsPage(): JSX.Element {
  const copy = getCopy();
  const common = getCommonCopy();

  const { data, loading, error, refetch } = useAdminQuery(fetchAdminLevels, []);

  const [editTarget, setEditTarget] = useState<AdminLevelCriteriaItem | null>(null);
  const [isRefreshOpen, setRefreshOpen] = useState(false);
  const [minEnroll, setMinEnroll] = useState('0');
  const [minReview, setMinReview] = useState('0');
  const [minSpent, setMinSpent] = useState('0');
  const [editError, setEditError] = useState('');

  const editMutation = useAdminMutation(
    (args: { level: AdminLevelCriteriaItem['level']; minEnrollmentCount: number; minReviewCount: number; minTotalSpent: number }) =>
      updateAdminLevel(args.level, {
        minEnrollmentCount: args.minEnrollmentCount,
        minReviewCount: args.minReviewCount,
        minTotalSpent: args.minTotalSpent,
      }),
    () => { setEditTarget(null); refetch(); },
  );

  const refreshMutation = useAdminMutation(
    () => refreshAdminLevels(),
    () => { setRefreshOpen(false); refetch(); },
  );

  const openEdit = useCallback((l: AdminLevelCriteriaItem) => {
    setEditTarget(l);
    setMinEnroll(String(l.minEnrollmentCount));
    setMinReview(String(l.minReviewCount));
    setMinSpent(String(l.minTotalSpent));
    setEditError('');
  }, []);

  const handleEditSubmit = useCallback(() => {
    if (!copy || !editTarget) return;
    const enrollNum = Number(minEnroll);
    const reviewNum = Number(minReview);
    const spentNum = Number(minSpent);
    if ([enrollNum, reviewNum, spentNum].some((n) => Number.isNaN(n) || n < 0 || !Number.isInteger(n))) {
      setEditError(copy.editModal.negativeError);
      return;
    }
    void editMutation.run({
      level: editTarget.level,
      minEnrollmentCount: enrollNum,
      minReviewCount: reviewNum,
      minTotalSpent: spentNum,
    });
  }, [minEnroll, minReview, minSpent, copy, editTarget, editMutation]);

  const handleRefreshSubmit = useCallback(() => {
    void refreshMutation.run();
  }, [refreshMutation]);

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

  const levels = data ?? [];

  return (
    <div className="admin-list">
      <header className="admin-list__header">
        <div>
          <h1 className="admin-list__title">{copy.title}</h1>
          <p className="admin-list__subtitle">{copy.subtitle}</p>
        </div>
        <div>
          <button type="button" onClick={() => setRefreshOpen(true)} aria-label={copy.refreshButtonAriaLabel} className="admin-list__cta-btn">
            {copy.refreshButtonLabel}
          </button>
          <p className="admin-list__refresh-help">{copy.refreshHelpText}</p>
        </div>
      </header>

      <div className="admin-list__table-wrap">
        <table className="admin-list__table">
          <thead>
            <tr>
              <th scope="col" className="admin-list__th admin-list__th--narrow">{copy.columns.level}</th>
              <th scope="col" className="admin-list__th admin-list__th--num">{copy.columns.minEnrollmentCount}</th>
              <th scope="col" className="admin-list__th admin-list__th--num">{copy.columns.minReviewCount}</th>
              <th scope="col" className="admin-list__th admin-list__th--num">{copy.columns.minTotalSpent}</th>
              <th scope="col" className="admin-list__th admin-list__th--actions">{copy.columns.actions}</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((l) => (
              <tr key={l.level}>
                <td className="admin-list__td admin-list__td--strong">{l.level}</td>
                <td className="admin-list__td admin-list__td--num">{l.minEnrollmentCount}{copy.courseUnit}</td>
                <td className="admin-list__td admin-list__td--num">{l.minReviewCount}{copy.reviewUnit}</td>
                <td className="admin-list__td admin-list__td--num">{formatNumber(l.minTotalSpent)}{copy.currencyUnit}</td>
                <td className="admin-list__td admin-list__td--actions">
                  <button type="button" onClick={() => openEdit(l)} className="admin-list__action-btn">{copy.actionLabels.edit}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={editTarget ? copy.editModal.titleTemplate.replaceAll('{level}', editTarget.level) : ''}
        description={copy.editModal.description}
        size="md"
      >
        <div className="admin-form-page__row">
          <label className="admin-modal__field">
            <span className="admin-modal__field-label">{copy.editModal.minEnrollmentLabel}</span>
            <input type="number" min={0} value={minEnroll} onChange={(e) => setMinEnroll(e.target.value)}
              className="admin-modal__input" />
          </label>
          <label className="admin-modal__field">
            <span className="admin-modal__field-label">{copy.editModal.minReviewLabel}</span>
            <input type="number" min={0} value={minReview} onChange={(e) => setMinReview(e.target.value)}
              className="admin-modal__input" />
          </label>
        </div>
        <label className="admin-modal__field">
          <span className="admin-modal__field-label">{copy.editModal.minTotalSpentLabel}</span>
          <input type="number" min={0} value={minSpent} onChange={(e) => setMinSpent(e.target.value)}
            className="admin-modal__input" />
        </label>
        {editError && <p className="admin-modal__error" role="alert">{editError}</p>}
        <footer className="admin-modal__footer">
          <button type="button" onClick={() => setEditTarget(null)} className="admin-modal__btn admin-modal__btn--ghost">{copy.editModal.cancelLabel}</button>
          <button type="button" onClick={handleEditSubmit} disabled={editMutation.submitting} className="admin-modal__btn admin-modal__btn--primary">{copy.editModal.confirmLabel}</button>
        </footer>
      </AdminModal>

      <AdminModal
        isOpen={isRefreshOpen}
        onClose={() => setRefreshOpen(false)}
        title={copy.refreshModal.title}
        description={copy.refreshModal.description}
      >
        <footer className="admin-modal__footer">
          <button type="button" onClick={() => setRefreshOpen(false)} className="admin-modal__btn admin-modal__btn--ghost">{copy.refreshModal.cancelLabel}</button>
          <button type="button" onClick={handleRefreshSubmit} disabled={refreshMutation.submitting} className="admin-modal__btn admin-modal__btn--primary">{copy.refreshModal.confirmLabel}</button>
        </footer>
      </AdminModal>
    </div>
  );
}
