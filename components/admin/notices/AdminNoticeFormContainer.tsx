/**
 * 관리자 공지사항 생성/수정 폼 (AdminNoticeFormContainer)
 * - 백엔드: POST /api/v1/admin/notices, PUT /api/v1/admin/notices/{id}
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { createAdminNotice, fetchAdminNoticeById, updateAdminNotice } from '@/lib/adminApi';

interface Fields {
  titleLabel: string; titlePlaceholder: string;
  contentLabel: string; contentPlaceholder: string;
  pinnedLabel: string;
  isActiveLabel: string;
}

interface Errors {
  titleRequired: string;
  contentRequired: string;
}

export interface NoticeFormCopy {
  createTitle: string;
  editTitle: string;
  subtitle: string;
  backLinkLabel: string;
  backLinkHref: string;
  fields: Fields;
  errors: Errors;
  actions: { submitCreateLabel: string; submitEditLabel: string; cancelLabel: string };
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

interface Props {
  mode: 'create' | 'edit';
  noticeId?: number;
  copy: NoticeFormCopy;
  common: CommonCopy;
  notFoundText?: string;
}

export default function AdminNoticeFormContainer({
  mode, noticeId, copy, common, notFoundText,
}: Props): JSX.Element {
  const router = useRouter();

  const detailQuery = useAdminQuery(
    () => (mode === 'edit' && noticeId ? fetchAdminNoticeById(noticeId) : Promise.resolve(null)),
    [mode, noticeId],
  );
  const initial = detailQuery.data;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pinned, setPinned] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof Errors, string>>>({});
  const [initialized, setInitialized] = useState(mode === 'create');

  useEffect(() => {
    if (mode !== 'edit' || initialized || !initial) return;
    setTitle(initial.title);
    setContent(initial.content);
    setPinned(initial.pinned);
    setIsActive(initial.isActive);
    setInitialized(true);
  }, [mode, initialized, initial]);

  const mutation = useAdminMutation(
    async () => {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        pinned,
        isActive,
      };
      if (mode === 'edit' && initial) return updateAdminNotice(initial.id, payload);
      return createAdminNotice(payload);
    },
    () => router.push('/admin/notices'),
  );

  const handleSubmit = useCallback(() => {
    const e: Partial<Record<keyof Errors, string>> = {};
    if (!title.trim()) e.titleRequired = copy.errors.titleRequired;
    if (!content.trim()) e.contentRequired = copy.errors.contentRequired;
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    void mutation.run();
  }, [title, content, copy.errors, mutation]);

  if (mode === 'edit') {
    if (detailQuery.loading && !detailQuery.data) return <AdminLoading label={common.loadingText} />;
    if (detailQuery.error && !detailQuery.data) {
      return (
        <AdminError
          title={common.errorTitle}
          message={detailQuery.error.message}
          retryLabel={common.errorRetryLabel}
          onRetry={detailQuery.refetch}
        />
      );
    }
    if (!initial) return <p className="admin-list__empty">{notFoundText ?? ''}</p>;
  }

  const pageTitle = mode === 'create' ? copy.createTitle : copy.editTitle;
  const submitLabel = mode === 'create' ? copy.actions.submitCreateLabel : copy.actions.submitEditLabel;

  return (
    <div className="admin-form-page">
      <header className="admin-form-page__header">
        <Link href={copy.backLinkHref} className="admin-user-detail__back">← {copy.backLinkLabel}</Link>
        <h1 className="admin-form-page__title">{pageTitle}</h1>
        <p className="admin-form-page__subtitle">{copy.subtitle}</p>
      </header>

      <div className="admin-form-page__field-group">
        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.titleLabel}</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={copy.fields.titlePlaceholder}
            className="admin-form-page__input"
          />
          {errors.titleRequired && <span className="admin-modal__error">{errors.titleRequired}</span>}
        </label>

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.contentLabel}</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={copy.fields.contentPlaceholder}
            rows={12}
            className="admin-form-page__textarea"
          />
          {errors.contentRequired && <span className="admin-modal__error">{errors.contentRequired}</span>}
        </label>

        <label className="admin-form-page__checkbox admin-form-page__checkbox--standalone">
          <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
          <span>{copy.fields.pinnedLabel}</span>
        </label>

        <label className="admin-form-page__checkbox admin-form-page__checkbox--standalone">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <span>{copy.fields.isActiveLabel}</span>
        </label>
      </div>

      {mutation.error && <p className="admin-form-page__error" role="alert">{mutation.error.message}</p>}

      <footer className="admin-form-page__footer">
        <Link href={copy.backLinkHref} className="admin-modal__btn admin-modal__btn--ghost">
          {copy.actions.cancelLabel}
        </Link>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={mutation.submitting}
          className="admin-modal__btn admin-modal__btn--primary"
        >
          {submitLabel}
        </button>
      </footer>
    </div>
  );
}
