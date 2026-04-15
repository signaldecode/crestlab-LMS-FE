/**
 * LectureSidebarQna — 강의 플레이어 사이드바 Q&A 패널
 * - 백엔드 `/v1/courses/{courseId}/questions` 연동 (목록 조회 + 작성)
 * - 상세/답변은 `/courses/{courseId}/questions/{id}` 페이지에서 처리
 */

'use client';

import { useCallback, useState, type JSX } from 'react';
import Link from 'next/link';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { createQuestion, fetchCourseQuestions } from '@/lib/userApi';
import { uiData } from '@/data';

interface LectureSidebarQnaProps {
  courseId: number;
}

const PAGE_SIZE = 10;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function LectureSidebarQna({ courseId }: LectureSidebarQnaProps): JSX.Element {
  const copy = uiData.sidebar.qna;

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { data, loading, error, refetch } = useAdminQuery(
    () => fetchCourseQuestions(courseId, { page: 1, size: PAGE_SIZE }),
    [courseId],
  );

  const mutation = useAdminMutation(
    () => createQuestion(courseId, { title: title.trim(), content: content.trim() }),
    () => {
      setTitle('');
      setContent('');
      setShowForm(false);
      void refetch();
    },
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!title.trim() || !content.trim()) return;
      void mutation.run();
    },
    [title, content, mutation],
  );

  const questions = data?.content ?? [];
  const total = data?.totalElements ?? 0;

  return (
    <div className="lecture-sidebar-qna">
      <div className="lecture-sidebar-qna__head">
        <span className="lecture-sidebar-qna__count">
          {copy.totalFormat.replace('{count}', String(total))}
        </span>
        <button
          type="button"
          className="lecture-sidebar-qna__write-btn"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? copy.cancelLabel : copy.writeLabel}
        </button>
      </div>

      {showForm && (
        <form className="lecture-sidebar-qna__form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={copy.titlePlaceholder}
            className="lecture-sidebar-qna__input"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={copy.contentPlaceholder}
            rows={4}
            className="lecture-sidebar-qna__textarea"
            required
          />
          {mutation.error && (
            <p className="lecture-sidebar-qna__error" role="alert">
              {mutation.error.message}
            </p>
          )}
          <button
            type="submit"
            className="lecture-sidebar-qna__submit-btn"
            disabled={mutation.submitting || !title.trim() || !content.trim()}
          >
            {mutation.submitting ? copy.submittingLabel : copy.submitLabel}
          </button>
        </form>
      )}

      {loading && !data ? (
        <p className="lecture-sidebar-qna__state">{copy.loading}</p>
      ) : error && !data ? (
        <p className="lecture-sidebar-qna__state" role="alert">
          {error.message}
        </p>
      ) : questions.length === 0 ? (
        <p className="lecture-sidebar-qna__state">{copy.empty}</p>
      ) : (
        <ul className="lecture-sidebar-qna__list" role="list">
          {questions.map((q) => (
            <li key={q.id} className="lecture-sidebar-qna__item">
              <Link
                href={`/courses/${courseId}/questions/${q.id}`}
                className="lecture-sidebar-qna__item-link"
              >
                <div className="lecture-sidebar-qna__item-row">
                  <span
                    className={`lecture-sidebar-qna__status lecture-sidebar-qna__status--${q.status === 'ANSWERED' ? 'answered' : 'pending'}`}
                  >
                    {q.status === 'ANSWERED' ? copy.statusAnswered : copy.statusPending}
                  </span>
                  <span className="lecture-sidebar-qna__item-title">{q.title}</span>
                </div>
                <div className="lecture-sidebar-qna__item-meta">
                  <span>{q.nickname}</span>
                  <span>{formatDate(q.createdAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {total > PAGE_SIZE && (
        <Link
          href={`/courses/${courseId}?tab=Q%26A`}
          className="lecture-sidebar-qna__more-link"
        >
          {copy.viewAllLabel}
        </Link>
      )}
    </div>
  );
}
