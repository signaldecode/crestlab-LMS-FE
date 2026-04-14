/**
 * 강의 Q&A 탭 (CourseQuestionsTab)
 * - 강의 상세 페이지의 "질문·답변" 탭에 사용
 * - 백엔드: GET /v1/courses/{courseId}/questions, POST /v1/courses/{courseId}/questions
 */

'use client';

import { useState, useCallback, type JSX } from 'react';
import Link from 'next/link';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { createQuestion, fetchCourseQuestions } from '@/lib/userApi';

const SK = 'course-qna';

interface Props {
  courseId: number;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function CourseQuestionsTab({ courseId }: Props): JSX.Element {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { data, loading, error, refetch } = useAdminQuery(
    () => fetchCourseQuestions(courseId, { page, size: 10 }),
    [courseId, page],
  );

  const mutation = useAdminMutation(
    () => createQuestion(courseId, { title: title.trim(), content: content.trim() }),
    () => {
      setTitle('');
      setContent('');
      setShowForm(false);
      refetch();
    },
  );

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    void mutation.run();
  }, [title, content, mutation]);

  const questions = data?.content ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  return (
    <div className={SK}>
      <div className={`${SK}__head`}>
        <h3 className={`${SK}__title`}>질문 · 답변</h3>
        <button
          type="button"
          className={`${SK}__write-btn`}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? '취소' : '질문 작성'}
        </button>
      </div>

      {showForm && (
        <form className={`${SK}__form`} onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="질문 제목"
            className={`${SK}__input`}
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="질문 내용을 입력하세요"
            rows={5}
            className={`${SK}__textarea`}
            required
          />
          {mutation.error && <p className={`${SK}__error`} role="alert">{mutation.error.message}</p>}
          <div className={`${SK}__form-footer`}>
            <button
              type="submit"
              className={`${SK}__submit-btn`}
              disabled={mutation.submitting || !title.trim() || !content.trim()}
            >
              등록
            </button>
          </div>
        </form>
      )}

      {loading && !data ? (
        <p className={`${SK}__empty`}>불러오는 중…</p>
      ) : error && !data ? (
        <p className={`${SK}__empty`}>{error.message}</p>
      ) : questions.length === 0 ? (
        <p className={`${SK}__empty`}>아직 등록된 질문이 없습니다.</p>
      ) : (
        <ul className={`${SK}__list`} role="list">
          {questions.map((q) => (
            <li key={q.id} className={`${SK}__item`}>
              <Link href={`/courses/${courseId}/questions/${q.id}`} className={`${SK}__item-link`}>
                <div className={`${SK}__item-row`}>
                  <span
                    className={`${SK}__status ${q.status === 'ANSWERED' ? `${SK}__status--answered` : `${SK}__status--pending`}`}
                  >
                    {q.status === 'ANSWERED' ? '답변완료' : '답변대기'}
                  </span>
                  <span className={`${SK}__item-title`}>{q.title}</span>
                </div>
                <div className={`${SK}__item-meta`}>
                  <span>{q.nickname}</span>
                  <span>{formatDate(q.createdAt)}</span>
                  <span>조회 {q.viewCount}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav className={`${SK}__pagination`} aria-label="질문 페이지">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>이전</button>
          <span>{page} / {totalPages}</span>
          <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>다음</button>
        </nav>
      )}
    </div>
  );
}
