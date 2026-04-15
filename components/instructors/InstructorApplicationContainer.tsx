/**
 * 강사 지원 컨테이너 (InstructorApplicationContainer)
 * - 기존 지원이 있으면 상태 표시, 없으면 지원 폼 노출
 * - 백엔드 계약: POST /api/v1/instructor-applications { name, phone, specialty, career, lecturePlan }
 */

'use client';

import { useState, useCallback, type JSX, type ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { applyInstructor, fetchMyInstructorApplication, UserApiError } from '@/lib/userApi';
import pagesData from '@/data/pagesData.json';

const SK = 'instructor-apply';
const data = pagesData.instructorApply;
const { fields, actions, validation, statusView } = data;

const PHONE_REGEX = /^01[016789]\d{7,8}$/;

type FieldKey = 'name' | 'phone' | 'specialty' | 'career' | 'lecturePlan';
type FormState = Record<FieldKey, string>;
type Errors = Partial<Record<FieldKey, string>>;

const initialState: FormState = {
  name: '',
  phone: '',
  specialty: '',
  career: '',
  lecturePlan: '',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function InstructorApplicationContainer(): JSX.Element {
  const router = useRouter();

  const myAppQuery = useAdminQuery(
    () => fetchMyInstructorApplication().catch((e) => {
      if (e instanceof UserApiError && e.status === 404) return null;
      throw e;
    }),
    [],
  );

  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});

  const setField = (key: FieldKey) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = key === 'phone' ? e.target.value.replace(/\D/g, '') : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = validation.required;
    else if (form.name.trim().length > fields.name.maxLength) next.name = validation.tooLongName;

    if (!form.phone.trim()) next.phone = validation.required;
    else if (!PHONE_REGEX.test(form.phone.trim())) next.phone = validation.invalidPhone;

    if (!form.specialty.trim()) next.specialty = validation.required;
    else if (form.specialty.trim().length > fields.specialty.maxLength) next.specialty = validation.tooLongSpecialty;

    if (!form.career.trim()) next.career = validation.required;
    if (!form.lecturePlan.trim()) next.lecturePlan = validation.required;

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const mutation = useAdminMutation(
    () => applyInstructor({
      name: form.name.trim(),
      phone: form.phone.trim(),
      specialty: form.specialty.trim(),
      career: form.career.trim(),
      lecturePlan: form.lecturePlan.trim(),
    }),
    () => myAppQuery.refetch(),
  );

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    void mutation.run();
  }, [form, mutation]);

  const handleCancel = useCallback(() => {
    router.push(data.cancelHref);
  }, [router]);

  if (myAppQuery.loading && !myAppQuery.data) {
    return <div className={SK}><p>{data.loadingText}</p></div>;
  }

  if (myAppQuery.data) {
    const app = myAppQuery.data;
    return (
      <section className={SK} aria-labelledby={`${SK}-status-title`}>
        <div className={`${SK}__inner`}>
          <h1 id={`${SK}-status-title`} className={`${SK}__title`}>{statusView.title}</h1>
          <div className={`${SK}__status-card`}>
            <div className={`${SK}__status-row`}>
              <span className={`${SK}__status-label`}>{statusView.labels.status}</span>
              <span className={`${SK}__status-badge ${SK}__status-badge--${app.status.toLowerCase()}`}>
                {statusView.statusLabels[app.status]}
              </span>
            </div>
            <div className={`${SK}__status-row`}>
              <span className={`${SK}__status-label`}>{statusView.labels.appliedAt}</span>
              <span>{formatDate(app.createdAt)}</span>
            </div>
            <div className={`${SK}__status-row`}>
              <span className={`${SK}__status-label`}>{statusView.labels.specialty}</span>
              <span>{app.specialty}</span>
            </div>
            {app.status === 'REJECTED' && app.rejectReason && (
              <div className={`${SK}__status-row`}>
                <span className={`${SK}__status-label`}>{statusView.labels.rejectReason}</span>
                <span className={`${SK}__reject-reason`}>{app.rejectReason}</span>
              </div>
            )}
          </div>
          <Link href={statusView.homeLinkHref} className={`${SK}__home-link`}>{statusView.homeLinkLabel}</Link>
        </div>
      </section>
    );
  }

  return (
    <section className={SK} aria-labelledby={`${SK}-title`}>
      <div className={`${SK}__inner`}>
        <header className={`${SK}__header`}>
          <h1 id={`${SK}-title`} className={`${SK}__title`}>{data.title}</h1>
          <p className={`${SK}__subtitle`}>
            {data.subtitle.split('\n').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        </header>

        <form className={`${SK}__form`} onSubmit={handleSubmit} noValidate>
          <div className={`${SK}__field`}>
            <label htmlFor={fields.name.id} className={`${SK}__label`}>
              {fields.name.label}
              {fields.name.required && <span className={`${SK}__required`} aria-hidden="true"> *</span>}
            </label>
            <input
              id={fields.name.id}
              type="text"
              value={form.name}
              onChange={setField('name')}
              placeholder={fields.name.placeholder}
              maxLength={fields.name.maxLength}
              aria-required={fields.name.required}
              aria-invalid={!!errors.name}
              className={`${SK}__input${errors.name ? ` ${SK}__input--error` : ''}`}
            />
            {errors.name && <p className={`${SK}__error`} role="alert">{errors.name}</p>}
          </div>

          <div className={`${SK}__field`}>
            <label htmlFor={fields.phone.id} className={`${SK}__label`}>
              {fields.phone.label}
              {fields.phone.required && <span className={`${SK}__required`} aria-hidden="true"> *</span>}
            </label>
            <input
              id={fields.phone.id}
              type={fields.phone.type}
              inputMode="numeric"
              value={form.phone}
              onChange={setField('phone')}
              placeholder={fields.phone.placeholder}
              aria-required={fields.phone.required}
              aria-invalid={!!errors.phone}
              className={`${SK}__input${errors.phone ? ` ${SK}__input--error` : ''}`}
            />
            {errors.phone && <p className={`${SK}__error`} role="alert">{errors.phone}</p>}
          </div>

          <div className={`${SK}__field`}>
            <label htmlFor={fields.specialty.id} className={`${SK}__label`}>
              {fields.specialty.label}
              {fields.specialty.required && <span className={`${SK}__required`} aria-hidden="true"> *</span>}
            </label>
            <input
              id={fields.specialty.id}
              type="text"
              value={form.specialty}
              onChange={setField('specialty')}
              placeholder={fields.specialty.placeholder}
              maxLength={fields.specialty.maxLength}
              aria-required={fields.specialty.required}
              aria-invalid={!!errors.specialty}
              className={`${SK}__input${errors.specialty ? ` ${SK}__input--error` : ''}`}
            />
            {errors.specialty && <p className={`${SK}__error`} role="alert">{errors.specialty}</p>}
          </div>

          <div className={`${SK}__field`}>
            <label htmlFor={fields.career.id} className={`${SK}__label`}>
              {fields.career.label}
              {fields.career.required && <span className={`${SK}__required`} aria-hidden="true"> *</span>}
            </label>
            <textarea
              id={fields.career.id}
              value={form.career}
              onChange={setField('career')}
              placeholder={fields.career.placeholder}
              rows={fields.career.rows}
              aria-required={fields.career.required}
              aria-invalid={!!errors.career}
              className={`${SK}__textarea${errors.career ? ` ${SK}__textarea--error` : ''}`}
            />
            {errors.career && <p className={`${SK}__error`} role="alert">{errors.career}</p>}
          </div>

          <div className={`${SK}__field`}>
            <label htmlFor={fields.lecturePlan.id} className={`${SK}__label`}>
              {fields.lecturePlan.label}
              {fields.lecturePlan.required && <span className={`${SK}__required`} aria-hidden="true"> *</span>}
            </label>
            <textarea
              id={fields.lecturePlan.id}
              value={form.lecturePlan}
              onChange={setField('lecturePlan')}
              placeholder={fields.lecturePlan.placeholder}
              rows={fields.lecturePlan.rows}
              aria-required={fields.lecturePlan.required}
              aria-invalid={!!errors.lecturePlan}
              className={`${SK}__textarea${errors.lecturePlan ? ` ${SK}__textarea--error` : ''}`}
            />
            {errors.lecturePlan && <p className={`${SK}__error`} role="alert">{errors.lecturePlan}</p>}
          </div>

          {mutation.error && <p className={`${SK}__error`} role="alert">{mutation.error.message}</p>}

          <div className={`${SK}__actions`}>
            <button
              type="button"
              className={`${SK}__cancel`}
              onClick={handleCancel}
              aria-label={actions.cancelAriaLabel}
            >
              {actions.cancel}
            </button>
            <button
              type="submit"
              className={`${SK}__submit`}
              disabled={mutation.submitting}
              aria-label={actions.submitAriaLabel}
            >
              {mutation.submitting ? actions.submitting : actions.submit}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
