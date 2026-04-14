'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import {
  createAdminMainSection,
  fetchAdminMainSections,
  updateAdminMainSection,
} from '@/lib/adminApi';
import type { AdminMainSectionType } from '@/types';

interface Fields {
  titleLabel: string; titlePlaceholder: string;
  typeLabel: string;
  filterValueLabel: string; filterValueHelpTemplate: string; filterValueHelpActive: string;
  sortOrderLabel: string; isActiveLabel: string;
}
interface Errors { titleRequired: string; filterValueRequired: string; }

export interface MainSectionFormCopy {
  createTitle: string; editTitle: string; subtitle: string;
  backLinkLabel: string; backLinkHref: string;
  fields: Fields;
  typeLabels: Record<AdminMainSectionType, string>;
  errors: Errors;
  actions: { submitCreateLabel: string; submitEditLabel: string; cancelLabel: string };
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

interface Props {
  mode: 'create' | 'edit';
  sectionId?: number;
  copy: MainSectionFormCopy;
  common: CommonCopy;
  notFoundText?: string;
}

const TYPES: AdminMainSectionType[] = ['NEW', 'POPULAR', 'LEVEL', 'CUSTOM'];
const TYPES_REQUIRING_FILTER: AdminMainSectionType[] = ['LEVEL', 'CUSTOM'];

export default function AdminMainSectionFormContainer({
  mode,
  sectionId,
  copy,
  common,
  notFoundText,
}: Props): JSX.Element {
  const router = useRouter();

  const listQuery = useAdminQuery(
    () => (mode === 'edit' ? fetchAdminMainSections() : Promise.resolve([])),
    [mode, sectionId],
  );
  const initial = sectionId ? listQuery.data?.find((s) => s.id === sectionId) ?? null : null;

  const [title, setTitle] = useState('');
  const [type, setType] = useState<AdminMainSectionType>('POPULAR');
  const [filterValue, setFilterValue] = useState('');
  const [sortOrder, setSortOrder] = useState<string>('1');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof Errors, string>>>({});
  const [initialized, setInitialized] = useState(mode === 'create');

  useEffect(() => {
    if (mode !== 'edit' || initialized || !initial) return;
    setTitle(initial.title);
    setType(initial.type);
    setFilterValue(initial.filterValue ?? '');
    setSortOrder(String(initial.sortOrder));
    setIsActive(initial.isActive);
    setInitialized(true);
  }, [mode, initialized, initial]);

  const needsFilter = TYPES_REQUIRING_FILTER.includes(type);

  const filterHelp = useMemo(() => {
    if (needsFilter) return copy.fields.filterValueHelpActive;
    return copy.fields.filterValueHelpTemplate.replaceAll('{type}', copy.typeLabels[type]);
  }, [needsFilter, copy, type]);

  const mutation = useAdminMutation(
    async () => {
      const payload = {
        title: title.trim(),
        type,
        filterValue: needsFilter ? filterValue.trim() : null,
        sortOrder: Number(sortOrder),
        isActive,
      };
      if (mode === 'edit' && initial) return updateAdminMainSection(initial.id, payload);
      return createAdminMainSection(payload);
    },
    () => router.push('/admin/main-sections'),
  );

  const handleSubmit = useCallback(() => {
    const e: Partial<Record<keyof Errors, string>> = {};
    if (!title.trim()) e.titleRequired = copy.errors.titleRequired;
    if (needsFilter && !filterValue.trim()) e.filterValueRequired = copy.errors.filterValueRequired;
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    void mutation.run();
  }, [title, filterValue, needsFilter, copy.errors, mutation]);

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
            <span className="admin-form-page__label">{copy.fields.typeLabel}</span>
            <select value={type} onChange={(e) => setType(e.target.value as AdminMainSectionType)}
              className="admin-form-page__select">
              {TYPES.map((t) => (<option key={t} value={t}>{copy.typeLabels[t]}</option>))}
            </select>
          </label>

          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.sortOrderLabel}</span>
            <input type="number" min={1} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
              className="admin-form-page__input" />
          </label>
        </div>

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.filterValueLabel}</span>
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            disabled={!needsFilter}
            className="admin-form-page__input"
          />
          <span className="admin-modal__field-help">{filterHelp}</span>
          {errors.filterValueRequired && <span className="admin-modal__error">{errors.filterValueRequired}</span>}
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
