/**
 * 강의 후기 페이지 콘텐츠 (CourseReviewsContent)
 * - /courses/[slug]/reviews 에서 사용
 * - 해당 강의 수강 후기 목록 + 후기 작성 폼
 */

'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { findCourseBySlug, getReviewsByCourse } from '@/lib/data';
import accountData from '@/data/accountData.json';

const SK = 'course-reviews';
const pageData = accountData.mypage.courseReviewsPage;

interface Props {
  slug: string;
}

function StarRating({ rating, onChange }: { rating: number; onChange?: (v: number) => void }): JSX.Element {
  return (
    <div className={`${SK}__stars`} role={onChange ? 'radiogroup' : 'img'} aria-label={`${pageData.ratingLabel} ${rating}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const value = i + 1;
        return onChange ? (
          <button
            key={i}
            type="button"
            className={`${SK}__star${value <= rating ? ` ${SK}__star--filled` : ''}`}
            aria-label={pageData.starAriaLabel.replace('{n}', String(value))}
            onClick={() => onChange(value)}
          >
            ★
          </button>
        ) : (
          <span
            key={i}
            className={`${SK}__star${value <= rating ? ` ${SK}__star--filled` : ''}`}
            aria-hidden="true"
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default function CourseReviewsContent({ slug }: Props): JSX.Element {
  const course = findCourseBySlug(slug);
  const reviews = getReviewsByCourse(slug);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: POST /api/reviews
    setContent('');
    setRating(5);
  };

  return (
    <div className={SK}>
      {/* 상단 헤더 */}
      <div className={`${SK}__header`}>
        <Link
          href={`/courses/${slug}`}
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

      {/* 전체 평점 요약 */}
      {reviews.length > 0 && (
        <div className={`${SK}__summary`}>
          <span className={`${SK}__summary-score`}>{avgRating.toFixed(1)}</span>
          <StarRating rating={Math.round(avgRating)} />
          <span className={`${SK}__summary-count`}>
            {reviews.length}{pageData.reviewCountSuffix}
          </span>
        </div>
      )}

      {/* 후기 작성 폼 */}
      <section className={`${SK}__form-section`} aria-labelledby={`${SK}-form-title`}>
        <h2 id={`${SK}-form-title`} className={`${SK}__section-title`}>
          {pageData.formTitle}
        </h2>
        <form className={`${SK}__form`} onSubmit={handleSubmit}>
          <div className={`${SK}__rating-row`}>
            <span className={`${SK}__rating-label`}>{pageData.ratingLabel}</span>
            <StarRating rating={rating} onChange={setRating} />
          </div>
          <textarea
            className={`${SK}__textarea`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
              disabled={!content.trim()}
            >
              {pageData.submitLabel}
            </button>
          </div>
        </form>
      </section>

      {/* 후기 목록 */}
      <section className={`${SK}__list-section`} aria-labelledby={`${SK}-list-title`}>
        <h2 id={`${SK}-list-title`} className={`${SK}__section-title`}>
          {pageData.listTitle}
        </h2>
        {reviews.length === 0 ? (
          <p className={`${SK}__empty`}>{pageData.emptyText}</p>
        ) : (
          <ul className={`${SK}__list`} role="list">
            {reviews.map((item) => (
              <li key={item.id} className={`${SK}__item`}>
                <div className={`${SK}__item-header`}>
                  <StarRating rating={item.rating} />
                  <span className={`${SK}__item-date`}>{item.createdAt}</span>
                </div>
                <p className={`${SK}__item-content`}>{item.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
