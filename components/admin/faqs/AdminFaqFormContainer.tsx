'use client';

import { useState, useCallback, useEffect } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { createAdminFaq, fetchAdminFaq, updateAdminFaq } from '@/lib/adminApi';

interface Fields {
  categoryLabel: string; categoryPlaceholder: string;
  questionLabel: string; questionPlaceholder: string;
  answerLabel: string; answerPlaceholder: string;
  sortOrderLabel: string;
}
interface Errors { categoryRequired: string; questionRequired: string; answerRequired: string; }

export interface FaqFormCopy {
  createTitle: string; editTitle: string; subtitle: string;
  backLinkLabel: string; backLinkHref: string;
  fields: Fields; errors: Errors;
  actions: { submitCreateLabel: string; submitEditLabel: string; cancelLabel: string };
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

interface Props {
  mode: 'create' | 'edit';
  faqId?: number;
  copy: FaqFormCopy;
  common: CommonCopy;
  notFoundText?: string;
}

export default function AdminFaqFormContainer({
  mode,
  faqId,
  copy,
  common,
  notFoundText,
}: Props): JSX.Element {
  const router = useRouter();

  const detailQuery = useAdminQuery(
    () => (mode === 'edit' && faqId ? fetchAdminFaq(faqId) : Promise.resolve(null)),
    [mode, faqId],
  );
  const initial = detailQuery.data;

  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sortOrder, setSortOrder] = useState<string>('1');
  const [errors, setErrors] = useState<Partial<Record<keyof Errors, string>>>({});
  const [initialized, setInitialized] = useState(mode === 'create');

  useEffect(() => {
    if (mode !== 'edit' || initialized || !initial) return;
    setCategory(initial.category);
    setQuestion(initial.question);
    setAnswer(initial.answer);
    setSortOrder(String(initial.sortOrder));
    setInitialized(true);
  }, [mode, initialized, initial]);

  const mutation = useAdminMutation(
    async () => {
      const payload = {
        category: category.trim(),
        question: question.trim(),
        answer: answer.trim(),
        sortOrder: Number(sortOrder),
      };
      if (mode === 'edit' && initial) return updateAdminFaq(initial.id, payload);
      return createAdminFaq(payload);
    },
    () => router.push('/admin/faqs'),
  );

  const handleSubmit = useCallback(() => {
    const e: Partial<Record<keyof Errors, string>> = {};
    if (!category.trim()) e.categoryRequired = copy.errors.categoryRequired;
    if (!question.trim()) e.questionRequired = copy.errors.questionRequired;
    if (!answer.trim()) e.answerRequired = copy.errors.answerRequired;
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    void mutation.run();
  }, [category, question, answer, copy.errors, mutation]);

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
        <div className="admin-form-page__row">
          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.categoryLabel}</span>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)}
              placeholder={copy.fields.categoryPlaceholder} className="admin-form-page__input" />
            {errors.categoryRequired && <span className="admin-modal__error">{errors.categoryRequired}</span>}
          </label>

          <label className="admin-form-page__field">
            <span className="admin-form-page__label">{copy.fields.sortOrderLabel}</span>
            <input type="number" min={1} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
              className="admin-form-page__input" />
          </label>
        </div>

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.questionLabel}</span>
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
            placeholder={copy.fields.questionPlaceholder} className="admin-form-page__input" />
          {errors.questionRequired && <span className="admin-modal__error">{errors.questionRequired}</span>}
        </label>

        <label className="admin-form-page__field">
          <span className="admin-form-page__label">{copy.fields.answerLabel}</span>
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
            placeholder={copy.fields.answerPlaceholder} rows={8} className="admin-form-page__textarea" />
          {errors.answerRequired && <span className="admin-modal__error">{errors.answerRequired}</span>}
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
