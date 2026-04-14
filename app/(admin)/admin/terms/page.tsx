/**
 * 관리자 약관 관리 페이지 (/admin/terms)
 * - 약관 종류별 탭 + 버전 이력 테이블
 * - 새 버전 등록 모달 + 내용 보기 모달
 */

'use client';

import { useState, useCallback } from 'react';
import type { JSX } from 'react';
import AdminModal from '@/components/admin/AdminModal';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { createAdminTerms, fetchAdminTermsHistory } from '@/lib/adminApi';
import { getPageData } from '@/lib/data';
import type { AdminTermsListItem, AdminTermsType } from '@/types';

interface CreateModalCopy {
  title: string; descriptionTemplate: string;
  effectiveDateLabel: string; contentLabel: string; contentPlaceholder: string;
  effectiveDateRequiredError: string; contentRequiredError: string;
  confirmLabel: string; cancelLabel: string;
}

interface ViewModalCopy {
  titleTemplate: string; effectiveDateLabel: string;
  placeholderContent: string; closeLabel: string;
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

interface TermsCopy {
  seo: { title: string; description: string };
  title: string;
  subtitle: string;
  createButtonLabel: string;
  createButtonAriaLabel: string;
  typeLabels: Record<AdminTermsType, string>;
  columns: { version: string; effectiveDate: string; isCurrent: string; createdAt: string; actions: string };
  currentBadgeLabel: string;
  actionLabels: { view: string };
  emptyText: string;
  createModal: CreateModalCopy;
  viewModal: ViewModalCopy;
}

function getCopy(): TermsCopy | null {
  const adminPage = getPageData('admin') as { terms?: TermsCopy } | null;
  return adminPage?.terms ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

const TYPE_VALUES: AdminTermsType[] = ['TERMS_OF_SERVICE', 'PRIVACY_POLICY', 'LEARNING_POLICY', 'REFUND_POLICY'];

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function AdminTermsPage(): JSX.Element {
  const copy = getCopy();
  const common = getCommonCopy();
  const [activeType, setActiveType] = useState<AdminTermsType>('TERMS_OF_SERVICE');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<AdminTermsListItem | null>(null);
  const [effectiveDate, setEffectiveDate] = useState('');
  const [content, setContent] = useState('');
  const [createErrors, setCreateErrors] = useState<{ date?: string; content?: string }>({});

  const { data, loading, error, refetch } = useAdminQuery(
    () => fetchAdminTermsHistory(activeType),
    [activeType],
  );

  const createMutation = useAdminMutation(
    (args: { type: AdminTermsType; content: string; effectiveDate: string }) =>
      createAdminTerms(args.type, args.content, args.effectiveDate),
    () => { setCreateOpen(false); refetch(); },
  );

  const filtered = (data ?? []).slice().sort((a, b) => b.version - a.version);

  const openCreate = useCallback(() => {
    setEffectiveDate('');
    setContent('');
    setCreateErrors({});
    setCreateOpen(true);
  }, []);

  const handleCreateSubmit = useCallback(() => {
    if (!copy) return;
    const errs: { date?: string; content?: string } = {};
    if (!effectiveDate) errs.date = copy.createModal.effectiveDateRequiredError;
    if (!content.trim()) errs.content = copy.createModal.contentRequiredError;
    setCreateErrors(errs);
    if (Object.keys(errs).length > 0) return;
    void createMutation.run({ type: activeType, content: content.trim(), effectiveDate });
  }, [effectiveDate, content, activeType, copy, createMutation]);

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

  const createDescription = copy.createModal.descriptionTemplate.replaceAll('{type}', copy.typeLabels[activeType]);

  return (
    <div className="admin-list">
      <header className="admin-list__header">
        <div>
          <h1 className="admin-list__title">{copy.title}</h1>
          <p className="admin-list__subtitle">{copy.subtitle}</p>
        </div>
        <button type="button" onClick={openCreate} aria-label={copy.createButtonAriaLabel} className="admin-list__cta-btn">
          {copy.createButtonLabel}
        </button>
      </header>

      <div className="admin-list__tabs" role="tablist">
        {TYPE_VALUES.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={activeType === t}
            onClick={() => setActiveType(t)}
            className={`admin-list__tab${activeType === t ? ' is-active' : ''}`}
          >
            {copy.typeLabels[t]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="admin-list__empty">{copy.emptyText}</p>
      ) : (
        <div className="admin-list__table-wrap">
          <table className="admin-list__table">
            <thead>
              <tr>
                <th scope="col" className="admin-list__th admin-list__th--narrow">{copy.columns.version}</th>
                <th scope="col" className="admin-list__th">{copy.columns.effectiveDate}</th>
                <th scope="col" className="admin-list__th">{copy.columns.isCurrent}</th>
                <th scope="col" className="admin-list__th">{copy.columns.createdAt}</th>
                <th scope="col" className="admin-list__th admin-list__th--actions">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="admin-list__td admin-list__td--strong">v{t.version}</td>
                  <td className="admin-list__td">{t.effectiveDate}</td>
                  <td className="admin-list__td">
                    {t.isCurrent && (
                      <span className="admin-list__badge admin-list__badge--success">{copy.currentBadgeLabel}</span>
                    )}
                  </td>
                  <td className="admin-list__td">{formatDate(t.createdAt)}</td>
                  <td className="admin-list__td admin-list__td--actions">
                    <button type="button" onClick={() => setViewTarget(t)} className="admin-list__action-btn">
                      {copy.actionLabels.view}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        title={copy.createModal.title}
        description={createDescription}
        size="lg"
      >
        <label className="admin-modal__field">
          <span className="admin-modal__field-label">{copy.createModal.effectiveDateLabel}</span>
          <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)}
            className="admin-modal__input" />
        </label>
        {createErrors.date && <p className="admin-modal__error" role="alert">{createErrors.date}</p>}
        <label className="admin-modal__field">
          <span className="admin-modal__field-label">{copy.createModal.contentLabel}</span>
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            placeholder={copy.createModal.contentPlaceholder} rows={10} className="admin-modal__textarea" />
        </label>
        {createErrors.content && <p className="admin-modal__error" role="alert">{createErrors.content}</p>}
        {createMutation.error && <p className="admin-modal__error" role="alert">{createMutation.error.message}</p>}
        <footer className="admin-modal__footer">
          <button type="button" onClick={() => setCreateOpen(false)} className="admin-modal__btn admin-modal__btn--ghost">
            {copy.createModal.cancelLabel}
          </button>
          <button type="button" onClick={handleCreateSubmit} disabled={createMutation.submitting} className="admin-modal__btn admin-modal__btn--primary">
            {copy.createModal.confirmLabel}
          </button>
        </footer>
      </AdminModal>

      <AdminModal
        isOpen={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title={
          viewTarget
            ? copy.viewModal.titleTemplate
                .replaceAll('{type}', copy.typeLabels[viewTarget.type])
                .replaceAll('{version}', String(viewTarget.version))
            : ''
        }
        size="lg"
      >
        {viewTarget && (
          <>
            <dl className="admin-modal__info">
              <div className="admin-modal__info-row">
                <dt>{copy.viewModal.effectiveDateLabel}</dt>
                <dd>{viewTarget.effectiveDate}</dd>
              </div>
            </dl>
            <p className="admin-modal__field-help">{copy.viewModal.placeholderContent}</p>
          </>
        )}
        <footer className="admin-modal__footer">
          <button type="button" onClick={() => setViewTarget(null)} className="admin-modal__btn admin-modal__btn--ghost">
            {copy.viewModal.closeLabel}
          </button>
        </footer>
      </AdminModal>
    </div>
  );
}
