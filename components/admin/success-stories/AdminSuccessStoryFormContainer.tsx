'use client';

import { useState, useCallback, useEffect } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import {
  createAdminSuccessStory,
  fetchAdminSuccessStories,
  updateAdminSuccessStory,
} from '@/lib/adminApi';

interface Fields {
  titleLabel: string; titlePlaceholder: string;
  authorNameLabel: string; imageUrlLabel: string; imageUrlPlaceholder: string;
  contentLabel: string; contentPlaceholder: string;
  sortOrderLabel: string; isActiveLabel: string;
}
interface Errors { titleRequired: string; authorNameRequired: string; contentRequired: string; }

export interface SuccessStoryFormCopy {
  createTitle: string; editTitle: string; subtitle: string;
  backLinkLabel: string; backLinkHref: string;
  fields: Fields; errors: Errors;
  actions: { submitCreateLabel: string; submitEditLabel: string; cancelLabel: string };
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

interface Props {
  mode: 'create' | 'edit';
  storyId?: number;
  copy: SuccessStoryFormCopy;
  common: CommonCopy;
  notFoundText?: string;
}

export default function AdminSuccessStoryFormContainer({
  mode,
  storyId,
  copy,
  common,
  notFoundText,
}: Props): JSX.Element {
  const router = useRouter();
  const listQuery = useAdminQuery(
    () => (mode === 'edit' ? fetchAdminSuccessStories() : Promise.resolve([])),
    [mode, storyId],
  );
  const initial = storyId ? listQuery.data?.find((s) => s.id === storyId) ?? null : null;

  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [sortOrder, setSortOrder] = useState<string>('1');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof Errors, string>>>({});
  const [initialized, setInitialized] = useState(mode === 'create');

  useEffect(() => {
    if (mode !== 'edit' || initialized || !initial) return;
    setTitle(initial.title);
    setAuthorName(initial.authorName);
    setImageUrl(initial.imageUrl);
    setSortOrder(String(initial.sortOrder));
    setIsActive(initial.isActive);
    setInitialized(true);
  }, [mode, initialized, initial]);

  const mutation = useAdminMutation(
    async () => {
      const payload = {
        title: title.trim(),
        authorName: authorName.trim(),
        imageUrl: imageUrl.trim(),
        content: content.trim(),
        sortOrder: Number(sortOrder),
        isActive,
      };
      if (mode === 'edit' && initial) return updateAdminSuccessStory(initial.id, payload);
      return createAdminSuccessStory(payload);
    },
    () => router.push('/admin/success-stories'),
  );

  const handleSubmit = useCallback(() => {
    const e: Partial<Record<keyof Errors, string>> = {};
    if (!title.trim()) e.titleRequired = copy.errors.titleRequired;
    if (!authorName.trim()) e.authorNameRequired = copy.errors.authorNameRequired;
    if (!content.trim()) e.contentRequired = copy.errors.contentRequired;
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    void mutation.run();
  }, [title, authorName, content, copy.errors, mutation]);

  if (mode === 'edit') {
    if (listQuery.loading && !listQuery.data) return <AdminLoading label={common.loadingText} />;
    if (listQuery.error && !listQuery.data) {
      return (
        <AdminError
          title={common.errorTitle}
          message={listQuery.error.message}
          retryLabel={common.errorRetryLabel}
          onRetry={listQuery.refetch}
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
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={copy.fields.titlePlaceholder} className="admin-form-page__input" />
          {errors.titleRequired && <span className="admin-modal__error">{errors.titleRequired}</span>}
        </label>

        <div className="admin-form-page__row">
          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.authorNameLabel}</span>
            <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)}
              className="admin-form-page__input" />
            {errors.authorNameRequired && <span className="admin-modal__error">{errors.authorNameRequired}</span>}
          </label>

          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.sortOrderLabel}</span>
            <input type="number" min={1} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
              className="admin-form-page__input" />
          </label>
        </div>

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.imageUrlLabel}</span>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            placeholder={copy.fields.imageUrlPlaceholder} className="admin-form-page__input" />
        </label>

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.contentLabel}</span>
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            placeholder={copy.fields.contentPlaceholder} rows={8} className="admin-form-page__textarea" />
          {errors.contentRequired && <span className="admin-modal__error">{errors.contentRequired}</span>}
        </label>

        <label className="admin-form-page__checkbox admin-form-page__checkbox--standalone">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <span>{copy.fields.isActiveLabel}</span>
        </label>
      </div>

      {mutation.error && <p className="admin-form-page__error" role="alert">{mutation.error.message}</p>}

      <footer className="admin-form-page__footer">
        <Link href={copy.backLinkHref} className="admin-modal__btn admin-modal__btn--ghost">{copy.actions.cancelLabel}</Link>
        <button type="button" onClick={handleSubmit} disabled={mutation.submitting} className="admin-modal__btn admin-modal__btn--primary">{submitLabel}</button>
      </footer>
    </div>
  );
}
