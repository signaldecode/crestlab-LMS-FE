/**
 * 강의별 상담 페이지 콘텐츠 (CourseConsultationContent)
 * - /learn/[courseSlug]/consultation 에서 사용
 * - 해당 강의에 대한 상담 내역 목록 + 새 문의 폼
 */

'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { findCourseBySlug, getConsultationsByCourse } from '@/lib/data';
import accountData from '@/data/accountData.json';

const SK = 'course-consultation';
const pageData = accountData.mypage.learnConsultationPage;

interface Props {
  courseSlug: string;
}

export default function CourseConsultationContent({ courseSlug }: Props): JSX.Element {
  const course = findCourseBySlug(courseSlug);
  const consultations = getConsultationsByCourse(courseSlug);
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: POST /api/consultations
    setQuestion('');
  };

  return (
    <div className={SK}>
      {/* 상단 헤더 */}
      <div className={`${SK}__header`}>
        <Link
          href={`/learn/${courseSlug}`}
          className={`${SK}__back`}
          aria-label={pageData.backAriaLabel}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {pageData.backLabel}
        </Link>
        <h1 className={`${SK}__title`}>{pageData.title}</h1>
      </div>

      {/* 강의 정보 */}
      {course && (
        <div className={`${SK}__course-row`}>
          <div className={`${SK}__course-thumb-wrap`}>
            <Image
              src={course.thumbnail}
              alt={course.thumbnailAlt}
              width={64}
              height={64}
              className={`${SK}__course-img`}
            />
          </div>
          <div className={`${SK}__course-info`}>
            <span className={`${SK}__course-title`}>{course.title}</span>
            <span className={`${SK}__course-instructor`}>{course.instructor}</span>
          </div>
        </div>
      )}

      {/* 새 문의 폼 */}
      <section className={`${SK}__form-section`} aria-labelledby={`${SK}-form-title`}>
        <h2 id={`${SK}-form-title`} className={`${SK}__section-title`}>
          {pageData.formTitle}
        </h2>
        <form className={`${SK}__form`} onSubmit={handleSubmit}>
          <textarea
            className={`${SK}__textarea`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={pageData.formPlaceholder}
            aria-label={pageData.formAriaLabel}
            rows={5}
            required
          />
          <div className={`${SK}__form-footer`}>
            <button
              type="submit"
              className={`${SK}__submit-btn`}
              aria-label={pageData.submitAriaLabel}
              disabled={!question.trim()}
            >
              {pageData.submitLabel}
            </button>
          </div>
        </form>
      </section>

      {/* 상담 내역 목록 */}
      <section className={`${SK}__list-section`} aria-labelledby={`${SK}-list-title`}>
        <h2 id={`${SK}-list-title`} className={`${SK}__section-title`}>
          {pageData.listTitle}
        </h2>
        {consultations.length === 0 ? (
          <p className={`${SK}__empty`}>{pageData.emptyText}</p>
        ) : (
          <ul className={`${SK}__list`} role="list">
            {consultations.map((item) => {
              const isDone = item.status === '답변완료';
              return (
                <li key={item.id} className={`${SK}__item`}>
                  {/* 질문 */}
                  <div className={`${SK}__item-header`}>
                    <span className={`${SK}__item-label`}>{pageData.questionLabel}</span>
                    <span
                      className={`${SK}__status ${SK}__status--${isDone ? 'done' : 'pending'}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className={`${SK}__question`}>{item.question}</p>
                  <span className={`${SK}__date`}>
                    {pageData.dateLabel}: {item.createdAt}
                  </span>

                  {/* 답변 */}
                  <div className={`${SK}__answer-wrap`}>
                    <span className={`${SK}__item-label ${SK}__item-label--answer`}>
                      {pageData.answerLabel}
                    </span>
                    {item.answer ? (
                      <>
                        <p className={`${SK}__answer`}>{item.answer}</p>
                        {item.answeredAt && (
                          <span className={`${SK}__date`}>
                            {pageData.answeredAtLabel}: {item.answeredAt}
                          </span>
                        )}
                      </>
                    ) : (
                      <p className={`${SK}__pending`}>{pageData.pendingAnswerText}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
