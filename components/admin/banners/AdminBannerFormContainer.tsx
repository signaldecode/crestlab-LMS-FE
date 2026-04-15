/**
 * 관리자 배너 생성/수정 공유 폼 (AdminBannerFormContainer)
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import ImageUploader, { type ImageUploaderCopy } from '@/components/ui/ImageUploader';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { createAdminBanner, fetchAdminBanners, updateAdminBanner } from '@/lib/adminApi';

interface Fields {
  titleLabel: string; titlePlaceholder: string;
  pcImageUrlLabel: string; mobileImageUrlLabel: string; imageUrlPlaceholder: string;
  imageHelp: string;
  imageUploader: Omit<ImageUploaderCopy, 'label' | 'hint'>;
  linkUrlLabel: string; linkUrlPlaceholder: string;
  startDateLabel: string; endDateLabel: string;
  sortOrderLabel: string; isActiveLabel: string;
}
interface Errors {
  titleRequired: string; pcImageUrlRequired: string; mobileImageUrlRequired: string;
  linkUrlRequired: string; datesRequired: string; datesInvalid: string;
}
interface Actions {
  submitCreateLabel: string; submitEditLabel: string; cancelLabel: string;
}

export interface BannerFormCopy {
  createTitle: string; editTitle: string; subtitle: string;
  backLinkLabel: string; backLinkHref: string;
  fields: Fields; errors: Errors; actions: Actions;
}

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

interface Props {
  mode: 'create' | 'edit';
  bannerId?: number;
  copy: BannerFormCopy;
  common: CommonCopy;
  notFoundText?: string;
}

export default function AdminBannerFormContainer({
  mode,
  bannerId,
  copy,
  common,
  notFoundText,
}: Props): JSX.Element {
  const router = useRouter();

  const listQuery = useAdminQuery(
    () => (mode === 'edit' ? fetchAdminBanners() : Promise.resolve([])),
    [mode, bannerId],
  );
  const initial = bannerId ? listQuery.data?.find((b) => b.id === bannerId) ?? null : null;

  const [title, setTitle] = useState('');
  const [pcImageUrl, setPcImageUrl] = useState('');
  const [mobileImageUrl, setMobileImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState<string>('1');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof Errors, string>>>({});
  const [initialized, setInitialized] = useState(mode === 'create');

  useEffect(() => {
    if (mode !== 'edit' || initialized || !initial) return;
    setTitle(initial.title);
    setPcImageUrl(initial.pcImageUrl);
    setMobileImageUrl(initial.mobileImageUrl);
    setLinkUrl(initial.linkUrl);
    setStartDate(initial.startDate);
    setEndDate(initial.endDate);
    setSortOrder(String(initial.sortOrder));
    setIsActive(initial.isActive);
    setInitialized(true);
  }, [mode, initialized, initial]);

  const mutation = useAdminMutation(
    async () => {
      const payload = {
        title: title.trim(),
        pcImageUrl: pcImageUrl.trim(),
        mobileImageUrl: mobileImageUrl.trim(),
        linkUrl: linkUrl.trim(),
        sortOrder: Number(sortOrder),
        isActive,
        startDate,
        endDate,
      };
      if (mode === 'edit' && initial) return updateAdminBanner(initial.id, payload);
      return createAdminBanner(payload);
    },
    () => router.push('/admin/banners'),
  );

  const handleSubmit = useCallback(() => {
    const e: Partial<Record<keyof Errors, string>> = {};
    if (!title.trim()) e.titleRequired = copy.errors.titleRequired;
    if (!pcImageUrl.trim()) e.pcImageUrlRequired = copy.errors.pcImageUrlRequired;
    if (!mobileImageUrl.trim()) e.mobileImageUrlRequired = copy.errors.mobileImageUrlRequired;
    if (!linkUrl.trim()) e.linkUrlRequired = copy.errors.linkUrlRequired;
    if (!startDate || !endDate) e.datesRequired = copy.errors.datesRequired;
    else if (new Date(endDate) < new Date(startDate)) e.datesInvalid = copy.errors.datesInvalid;
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    void mutation.run();
  }, [title, pcImageUrl, mobileImageUrl, linkUrl, startDate, endDate, copy.errors, mutation]);

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

        <div className="admin-form-page__field">
          <ImageUploader
            id="banner-pc-image"
            uploadType="BACKGROUND_IMAGE"
            value={pcImageUrl || null}
            onChange={(url) => setPcImageUrl(url ?? '')}
            aspectRatio="16 / 5"
            copy={{
              ...copy.fields.imageUploader,
              label: copy.fields.pcImageUrlLabel,
              hint: copy.fields.imageHelp,
            }}
          />
          {errors.pcImageUrlRequired && <span className="admin-modal__error">{errors.pcImageUrlRequired}</span>}
        </div>

        <div className="admin-form-page__field">
          <ImageUploader
            id="banner-mobile-image"
            uploadType="BACKGROUND_IMAGE"
            value={mobileImageUrl || null}
            onChange={(url) => setMobileImageUrl(url ?? '')}
            aspectRatio="3 / 4"
            copy={{
              ...copy.fields.imageUploader,
              label: copy.fields.mobileImageUrlLabel,
              hint: copy.fields.imageHelp,
            }}
          />
          {errors.mobileImageUrlRequired && <span className="admin-modal__error">{errors.mobileImageUrlRequired}</span>}
        </div>

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.linkUrlLabel}</span>
          <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
            placeholder={copy.fields.linkUrlPlaceholder} className="admin-form-page__input" />
          {errors.linkUrlRequired && <span className="admin-modal__error">{errors.linkUrlRequired}</span>}
        </label>

        <div className="admin-form-page__row">
          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.startDateLabel}</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="admin-form-page__input" />
          </label>
          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.endDateLabel}</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="admin-form-page__input" />
          </label>
        </div>
        {errors.datesRequired && <span className="admin-modal__error">{errors.datesRequired}</span>}
        {errors.datesInvalid && <span className="admin-modal__error">{errors.datesInvalid}</span>}

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.sortOrderLabel}</span>
          <input type="number" min={1} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
            className="admin-form-page__input" />
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
