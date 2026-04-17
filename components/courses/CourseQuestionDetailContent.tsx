/**
 * 강의 질문 상세 컴포넌트 (CourseQuestionDetailContent)
 * - 질문 카드 + 상태 뱃지 + 답변 목록 + 답변 작성 (강사/관리자만)
 */

'use client';

import { useState, useCallback, type JSX } from 'react';
import Link from 'next/link';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import {
  createAnswer,
  fetchQuestion,
} from '@/lib/userApi';
import useAuthStore, { selectIsAdmin } from '@/stores/useAuthStore';
import pagesData from '@/data/pagesData.json';

const SK = 'course-qna-detail';
const qd = ((pagesData as unknown as Record<string, Record<string, unknown>>).courses
  .detail as Record<string, unknown>).questionDetail as {
  backLabel: string;
  viewCountPrefix: string;
  statusLabels: Record<'WAITING' | 'ANSWERED', string>;
  answersTitlePrefix: string;
  emptyTitle: string;
  emptyDescription: string;
  instructorBadgeLabel: string;
  adminBadgeLabel: string;
  answerFormTitle: string;
  answerPlaceholder: string;
  answerSubmitLabel: string;
  loadingText: string;
};

interface Props {
  courseId: number;
  questionId: number;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function CourseQuestionDetailContent({ courseId, questionId }: Props): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore(selectIsAdmin);
  const canAnswer = isAdmin || user?.role === 'INSTRUCTOR';

  const { data, loading, error, refetch } = useAdminQuery(
    () => fetchQuestion(questionId),
    [questionId],
  );

  const [answerContent, setAnswerContent] = useState('');

  const mutation = useAdminMutation(
    () => createAnswer(questionId, { content: answerContent.trim() }),
    () => {
      setAnswerContent('');
      refetch();
    },
  );

  const handleAnswerSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!answerContent.trim()) return;
    void mutation.run();
  }, [answerContent, mutation]);

  if (loading && !data) {
    return <main className={SK}><p>{qd.loadingText}</p></main>;
  }
  if (error && !data) {
    return <main className={SK}><p>{error.message}</p></main>;
  }
  if (!data) return <main className={SK} />;

  const statusKey = data.status === 'ANSWERED' ? 'answered' : 'waiting';

  return (
    <div className={SK}>
      <Link href={`/courses/${courseId}?tab=질문답변`} className={`${SK}__back`}>← {qd.backLabel}</Link>

      <article className={`${SK}__card`}>
        <header className={`${SK}__header`}>
          <div className={`${SK}__title-row`}>
            <h1 className={`${SK}__title`}>{data.title}</h1>
            <span className={`${SK}__status ${SK}__status--${statusKey}`}>
              {qd.statusLabels[data.status]}
            </span>
          </div>
          <div className={`${SK}__meta`}>
            <span className={`${SK}__meta-nickname`}>{data.nickname}</span>
            <span className={`${SK}__meta-dot`} aria-hidden="true">·</span>
            <span>{formatDate(data.createdAt)}</span>
            <span className={`${SK}__meta-dot`} aria-hidden="true">·</span>
            <span>{qd.viewCountPrefix} {data.viewCount}</span>
          </div>
        </header>

        <div className={`${SK}__body`}>
          {data.content.split('\n').map((line, i) => (
            <p key={i}>{line || '\u00A0'}</p>
          ))}
        </div>
      </article>

      <section className={`${SK}__answers`}>
        <h2 className={`${SK}__answers-title`}>{qd.answersTitlePrefix} {data.answers.length}</h2>
        {data.answers.length === 0 ? (
          <div className={`${SK}__empty`}>
            <svg
              className={`${SK}__empty-icon`}
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M8 10h.01" />
              <path d="M12 10h.01" />
              <path d="M16 10h.01" />
            </svg>
            <p className={`${SK}__empty-title`}>{qd.emptyTitle}</p>
            <p className={`${SK}__empty-desc`}>{qd.emptyDescription}</p>
          </div>
        ) : (
          <ul className={`${SK}__answer-list`} role="list">
            {data.answers.map((a) => (
              <li key={a.id} className={`${SK}__answer`}>
                <div className={`${SK}__answer-meta`}>
                  <span className={`${SK}__answer-nickname`}>{a.nickname}</span>
                  {a.role === 'INSTRUCTOR' && (
                    <span className={`${SK}__answer-badge`}>{qd.instructorBadgeLabel}</span>
                  )}
                  {a.role === 'ADMIN' && (
                    <span className={`${SK}__answer-badge`}>{qd.adminBadgeLabel}</span>
                  )}
                  <span className={`${SK}__answer-date`}>{formatDate(a.createdAt)}</span>
                </div>
                <p className={`${SK}__answer-content`}>{a.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {canAnswer && (
        <form className={`${SK}__answer-form`} onSubmit={handleAnswerSubmit}>
          <h3 className={`${SK}__answer-form-title`}>{qd.answerFormTitle}</h3>
          <textarea
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder={qd.answerPlaceholder}
            rows={4}
            className={`${SK}__answer-textarea`}
            required
          />
          {mutation.error && <p className={`${SK}__error`}>{mutation.error.message}</p>}
          <button
            type="submit"
            className={`${SK}__answer-submit`}
            disabled={!answerContent.trim() || mutation.submitting}
          >
            {qd.answerSubmitLabel}
          </button>
        </form>
      )}
    </div>
  );
}
