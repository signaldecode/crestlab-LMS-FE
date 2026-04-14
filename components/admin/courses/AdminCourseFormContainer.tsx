/**
 * 관리자 강의 생성/수정 공유 폼 (AdminCourseFormContainer)
 * - mode=create / mode=edit 로 동작 분기
 * - 백엔드: POST /api/v1/admin/courses (create), PUT /api/v1/admin/courses/{id} (update)
 */

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { JSX, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import {
  createAdminCourse,
  fetchAdminCourse,
  fetchAdminCourseCategories,
  fetchAdminUsers,
  updateAdminCourse,
} from '@/lib/adminApi';
import type { AdminCourseLevel } from '@/types';

interface Fields {
  titleLabel: string; titlePlaceholder: string; titleMaxLength: number;
  categoryLabel: string; categoryPlaceholder: string;
  instructorsLabel: string; instructorsHelp: string;
  levelLabel: string;
  priceLabel: string; priceSuffix: string; priceHelp: string;
  thumbnailLabel: string; thumbnailPlaceholder: string; thumbnailMaxLength: number; thumbnailHelp: string;
  descriptionLabel: string; descriptionPlaceholder: string;
}

interface Errors {
  titleRequired: string; titleTooLong: string;
  categoryRequired: string; instructorsRequired: string;
  levelRequired: string; priceInvalid: string; thumbnailTooLong: string;
}

interface Actions {
  submitCreateLabel: string; submitEditLabel: string; cancelLabel: string;
}

export interface CourseFormCopy {
  createTitle: string;
  editTitle: string;
  createSubtitle: string;
  editSubtitle: string;
  backLinkLabel: string;
  backLinkHref: string;
  sections: { basicTitle: string; pricingTitle: string; mediaTitle: string };
  fields: Fields;
  levelLabels: Record<AdminCourseLevel, string>;
  errors: Errors;
  actions: Actions;
}

const LEVEL_VALUES: AdminCourseLevel[] = ['BEGINNER', 'BASIC', 'INTERMEDIATE', 'ADVANCED'];

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

interface AdminCourseFormContainerProps {
  mode: 'create' | 'edit';
  courseId?: number;
  copy: CourseFormCopy;
  common: CommonCopy;
  notFoundText?: string;
}

export default function AdminCourseFormContainer({
  mode,
  courseId,
  copy,
  common,
  notFoundText,
}: AdminCourseFormContainerProps): JSX.Element {
  const router = useRouter();

  const categoriesQuery = useAdminQuery(fetchAdminCourseCategories, []);
  const instructorsQuery = useAdminQuery(
    () => fetchAdminUsers({ role: 'INSTRUCTOR', status: 'ACTIVE', size: 500 }),
    [],
  );
  const initialQuery = useAdminQuery(
    () => (mode === 'edit' && courseId ? fetchAdminCourse(courseId) : Promise.resolve(null)),
    [mode, courseId],
  );

  const categories = categoriesQuery.data ?? [];
  const instructors = instructorsQuery.data?.content ?? [];
  const initial = initialQuery.data;

  const initialInstructorIds = useMemo<number[]>(() => {
    if (!initial) return [];
    return instructors
      .filter((u) => initial.instructorNames.includes(u.nickname))
      .map((u) => u.id);
  }, [initial, instructors]);

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [instructorIds, setInstructorIds] = useState<number[]>([]);
  const [level, setLevel] = useState<AdminCourseLevel | ''>('');
  const [price, setPrice] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof Errors, string>>>({});
  const [initialized, setInitialized] = useState(mode === 'create');

  // edit 모드: 초기 데이터 수신 시 1회 prefill
  useEffect(() => {
    if (mode !== 'edit' || initialized || !initial || instructors.length === 0) return;
    setTitle(initial.title);
    setCategoryId(initial.categoryId);
    setInstructorIds(initialInstructorIds);
    setLevel(initial.level);
    setPrice(String(initial.price));
    setInitialized(true);
  }, [mode, initialized, initial, instructors.length, initialInstructorIds]);

  const toggleInstructor = useCallback((id: number) => {
    setInstructorIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const validate = useCallback(() => {
    const e: Partial<Record<keyof Errors, string>> = {};
    if (!title.trim()) e.titleRequired = copy.errors.titleRequired;
    else if (title.length > copy.fields.titleMaxLength) e.titleTooLong = copy.errors.titleTooLong;
    if (!categoryId) e.categoryRequired = copy.errors.categoryRequired;
    if (instructorIds.length === 0) e.instructorsRequired = copy.errors.instructorsRequired;
    if (!level) e.levelRequired = copy.errors.levelRequired;
    const priceNum = Number(price);
    if (!price || Number.isNaN(priceNum) || priceNum < 0 || !Number.isInteger(priceNum)) {
      e.priceInvalid = copy.errors.priceInvalid;
    }
    if (thumbnailUrl.length > copy.fields.thumbnailMaxLength) e.thumbnailTooLong = copy.errors.thumbnailTooLong;
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [title, categoryId, instructorIds, level, price, thumbnailUrl, copy]);

  const mutation = useAdminMutation(
    async () => {
      const payload = {
        title: title.trim(),
        categoryId: Number(categoryId),
        description: description.trim() || undefined,
        instructorIds,
        level: level as AdminCourseLevel,
        price: Number(price),
        thumbnailUrl: thumbnailUrl.trim() || undefined,
      };
      if (mode === 'edit' && initial) {
        return updateAdminCourse(initial.id, payload);
      }
      return createAdminCourse(payload);
    },
    () => router.push('/admin/courses'),
  );

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    void mutation.run();
  }, [validate, mutation]);

  // 로딩/에러 처리
  const initialLoading =
    (categoriesQuery.loading && !categoriesQuery.data) ||
    (instructorsQuery.loading && !instructorsQuery.data) ||
    (mode === 'edit' && initialQuery.loading && !initialQuery.data);
  const initialError =
    (categoriesQuery.error && !categoriesQuery.data) ||
    (instructorsQuery.error && !instructorsQuery.data) ||
    (mode === 'edit' && initialQuery.error && !initialQuery.data);

  if (initialLoading) return <AdminLoading label={common.loadingText} />;
  if (initialError) {
    return (
      <AdminError
        title={common.errorTitle}
        message={(categoriesQuery.error ?? instructorsQuery.error ?? initialQuery.error)?.message ?? ''}
        retryLabel={common.errorRetryLabel}
        onRetry={() => {
          categoriesQuery.refetch();
          instructorsQuery.refetch();
          if (mode === 'edit') initialQuery.refetch();
        }}
      />
    );
  }
  if (mode === 'edit' && !initial) {
    return <p className="admin-list__empty">{notFoundText ?? ''}</p>;
  }

  const pageTitle = mode === 'create' ? copy.createTitle : copy.editTitle;
  const pageSubtitle = mode === 'create' ? copy.createSubtitle : copy.editSubtitle;
  const submitLabel = mode === 'create' ? copy.actions.submitCreateLabel : copy.actions.submitEditLabel;

  return (
    <div className="admin-form-page">
      <header className="admin-form-page__header">
        <Link href={copy.backLinkHref} className="admin-user-detail__back">
          ← {copy.backLinkLabel}
        </Link>
        <h1 className="admin-form-page__title">{pageTitle}</h1>
        <p className="admin-form-page__subtitle">{pageSubtitle}</p>
      </header>

      <div className="admin-form-page__field-group">
        <h2 className="admin-user-detail__section-title">{copy.sections.basicTitle}</h2>

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.titleLabel}</span>
          <input
            type="text"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder={copy.fields.titlePlaceholder}
            maxLength={copy.fields.titleMaxLength}
            className="admin-form-page__input"
          />
          {errors.titleRequired && <FieldError>{errors.titleRequired}</FieldError>}
          {errors.titleTooLong && <FieldError>{errors.titleTooLong}</FieldError>}
        </label>

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.categoryLabel}</span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
            className="admin-form-page__select"
          >
            <option value="">{copy.fields.categoryPlaceholder}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryRequired && <FieldError>{errors.categoryRequired}</FieldError>}
        </label>

        <fieldset className="admin-form-page__field">
          <legend className="admin-form-page__label">{copy.fields.instructorsLabel}</legend>
          <div className="admin-form-page__checkbox-list">
            {instructors.map((u) => (
              <label key={u.id} className="admin-form-page__checkbox">
                <input
                  type="checkbox"
                  checked={instructorIds.includes(u.id)}
                  onChange={() => toggleInstructor(u.id)}
                />
                <span>{u.nickname}</span>
                <span className="admin-form-page__suggest-email">{u.email}</span>
              </label>
            ))}
          </div>
          <span className="admin-modal__field-help">{copy.fields.instructorsHelp}</span>
          {errors.instructorsRequired && <FieldError>{errors.instructorsRequired}</FieldError>}
        </fieldset>
      </div>

      <div className="admin-form-page__field-group">
        <h2 className="admin-user-detail__section-title">{copy.sections.pricingTitle}</h2>

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.levelLabel}</span>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as AdminCourseLevel | '')}
            className="admin-form-page__select"
          >
            <option value="">—</option>
            {LEVEL_VALUES.map((l) => (
              <option key={l} value={l}>{copy.levelLabels[l]}</option>
            ))}
          </select>
          {errors.levelRequired && <FieldError>{errors.levelRequired}</FieldError>}
        </label>

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">
            {copy.fields.priceLabel} ({copy.fields.priceSuffix})
          </span>
          <input
            type="number"
            min={0}
            step={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="admin-form-page__input"
          />
          <span className="admin-modal__field-help">{copy.fields.priceHelp}</span>
          {errors.priceInvalid && <FieldError>{errors.priceInvalid}</FieldError>}
        </label>
      </div>

      <div className="admin-form-page__field-group">
        <h2 className="admin-user-detail__section-title">{copy.sections.mediaTitle}</h2>

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.thumbnailLabel}</span>
          <input
            type="url"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder={copy.fields.thumbnailPlaceholder}
            maxLength={copy.fields.thumbnailMaxLength}
            className="admin-form-page__input"
          />
          <span className="admin-modal__field-help">{copy.fields.thumbnailHelp}</span>
          {errors.thumbnailTooLong && <FieldError>{errors.thumbnailTooLong}</FieldError>}
        </label>

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.descriptionLabel}</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={copy.fields.descriptionPlaceholder}
            rows={6}
            className="admin-form-page__textarea"
          />
        </label>
      </div>

      {mutation.error && <p className="admin-form-page__error" role="alert">{mutation.error.message}</p>}

      <footer className="admin-form-page__footer">
        <Link href={copy.backLinkHref} className="admin-modal__btn admin-modal__btn--ghost">
          {copy.actions.cancelLabel}
        </Link>
        <button type="button" onClick={handleSubmit} disabled={mutation.submitting} className="admin-modal__btn admin-modal__btn--primary">
          {submitLabel}
        </button>
      </footer>
    </div>
  );
}

function FieldError({ children }: { children: string }): JSX.Element {
  return <span className="admin-modal__error" role="alert">{children}</span>;
}
