/**
 * 강의 질문 상세 컴포넌트 (CourseQuestionDetailContent)
 * - 질문 본문 + 답변 목록 + 답변 작성 (강사/관리자만)
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

const SK = 'course-qna-detail';

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
    return <main className={SK}><p>불러오는 중…</p></main>;
  }
  if (error && !data) {
    return <main className={SK}><p>{error.message}</p></main>;
  }
  if (!data) return <main className={SK} />;

  return (
    <div className={SK}>
      <Link href={`/courses/${courseId}?tab=질문답변`} className={`${SK}__back`}>← 질문 목록</Link>

      <header className={`${SK}__header`}>
        <h1 className={`${SK}__title`}>{data.title}</h1>
        <div className={`${SK}__meta`}>
          <span>{data.nickname}</span>
          <span>{formatDate(data.createdAt)}</span>
          <span>조회 {data.viewCount}</span>
        </div>
      </header>

      <article className={`${SK}__body`}>
        {data.content.split('\n').map((line, i) => (
          <p key={i}>{line || '\u00A0'}</p>
        ))}
      </article>

      <section className={`${SK}__answers`}>
        <h2 className={`${SK}__answers-title`}>답변 {data.answers.length}</h2>
        {data.answers.length === 0 ? (
          <p className={`${SK}__empty`}>아직 답변이 없습니다.</p>
        ) : (
          <ul className={`${SK}__answer-list`} role="list">
            {data.answers.map((a) => (
              <li key={a.id} className={`${SK}__answer`}>
                <div className={`${SK}__answer-meta`}>
                  <span className={`${SK}__answer-nickname`}>{a.nickname}</span>
                  {a.role === 'INSTRUCTOR' && (
                    <span className={`${SK}__answer-badge`}>강사</span>
                  )}
                  {a.role === 'ADMIN' && (
                    <span className={`${SK}__answer-badge`}>관리자</span>
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
          <h3 className={`${SK}__answer-form-title`}>답변 작성</h3>
          <textarea
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder="답변 내용을 입력하세요"
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
            답변 등록
          </button>
        </form>
      )}
    </div>
  );
}
