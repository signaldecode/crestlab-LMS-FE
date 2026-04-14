/**
 * 강의 후기 페이지 콘텐츠 (CourseReviewsContent)
 * - /courses/[id]/reviews 에서 사용
 * - 백엔드: GET/POST /v1/courses/{courseId}/reviews, PUT/DELETE /v1/reviews/{reviewId}
 * - 본인 리뷰는 수정/삭제 가능 (nickname 매칭)
 */

'use client';

import { useCallback, useState, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import {
  createCourseReview,
  deleteCourseReview,
  fetchCourseReviews,
  toggleReviewLike,
  updateCourseReview,
  type CourseReviewItem,
} from '@/lib/userApi';
import { fetchUserCourseById } from '@/lib/userApi';
import { resolveThumb } from '@/lib/images';
import useAuth from '@/hooks/useAuth';
import accountData from '@/data/accountData.json';

const SK = 'course-reviews';
const pageData = accountData.mypage.courseReviewsPage;

interface Props {
  courseId: number;
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function ReviewItem({
  item,
  mine,
  onEdit,
  onDelete,
}: {
  item: CourseReviewItem;
  mine: boolean;
  onEdit: (r: CourseReviewItem) => void;
  onDelete: (id: number) => void;
}): JSX.Element {
  // 좋아요 토글 — 낙관적 UI, 실패 시 원복
  const [likeCount, setLikeCount] = useState(item.likeCount ?? 0);
  const [liked, setLiked] = useState(false);
  const handleLike = useCallback(async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((c) => c + (nextLiked ? 1 : -1));
    try {
      await toggleReviewLike(item.id);
    } catch {
      setLiked(!nextLiked);
      setLikeCount((c) => c + (nextLiked ? -1 : 1));
    }
  }, [liked, item.id]);

  return (
    <li className={`${SK}__item`}>
      <div className={`${SK}__item-header`}>
        <StarRating rating={item.rating} />
        <span className={`${SK}__item-date`}>{formatDate(item.createdAt)}</span>
        <button
          type="button"
          className={`${SK}__item-like${liked ? ` ${SK}__item-like--active` : ''}`}
          onClick={handleLike}
          aria-pressed={liked}
          aria-label={liked ? '좋아요 취소' : '좋아요'}
        >
          <span aria-hidden="true">{liked ? '♥' : '♡'}</span>
          <span>{likeCount}</span>
        </button>
        {mine && (
          <div className={`${SK}__item-actions`}>
            <button type="button" className={`${SK}__item-btn`} onClick={() => onEdit(item)}>수정</button>
            <button type="button" className={`${SK}__item-btn ${SK}__item-btn--danger`} onClick={() => onDelete(item.id)}>삭제</button>
          </div>
        )}
      </div>
      <p className={`${SK}__item-content`}>{item.content}</p>
    </li>
  );
}

export default function CourseReviewsContent({ courseId }: Props): JSX.Element {
  const { user } = useAuth();

  const courseQuery = useAdminQuery(
    () => fetchUserCourseById(courseId),
    [courseId],
  );
  const info = courseQuery.data?.courseInfo ?? null;
  const instructor = courseQuery.data?.instructors[0]?.name ?? '';

  const reviewsQuery = useAdminQuery(
    () => fetchCourseReviews(courseId, { size: 50 }),
    [courseId],
  );
  const reviews = reviewsQuery.data?.content ?? [];

  // 작성/수정 공용 상태 — editingId가 있으면 수정 모드
  const [editingId, setEditingId] = useState<number | null>(null);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setContent('');
    setRating(5);
  }, []);

  const createMutation = useAdminMutation(
    () => createCourseReview(courseId, { rating, content: content.trim() }),
    () => { resetForm(); void reviewsQuery.refetch(); },
  );

  const updateMutation = useAdminMutation(
    (id: number) => updateCourseReview(id, { rating, content: content.trim() }),
    () => { resetForm(); void reviewsQuery.refetch(); },
  );

  const deleteMutation = useAdminMutation(
    (id: number) => deleteCourseReview(id),
    () => { void reviewsQuery.refetch(); },
  );

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (editingId != null) void updateMutation.run(editingId);
    else void createMutation.run();
  }, [content, editingId, createMutation, updateMutation]);

  const handleEdit = useCallback((r: CourseReviewItem) => {
    setEditingId(r.id);
    setRating(r.rating);
    setContent(r.content);
    // 수정 폼으로 스크롤
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleDelete = useCallback((id: number) => {
    if (typeof window !== 'undefined' && !window.confirm('리뷰를 삭제하시겠습니까?')) return;
    void deleteMutation.run(id);
  }, [deleteMutation]);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const isEditing = editingId != null;
  const submitting = createMutation.submitting || updateMutation.submitting;
  const submitError = (isEditing ? updateMutation.error : createMutation.error)?.message;

  return (
    <div className={SK}>
      <div className={`${SK}__header`}>
        <Link
          href={`/courses/${courseId}`}
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

      {info && (
        <div className={`${SK}__course-row`}>
          <div className={`${SK}__course-thumb-wrap`}>
            <Image
              src={resolveThumb(info.thumbnailUrl)}
              alt={info.title}
              width={64}
              height={64}
              className={`${SK}__course-img`}
            />
          </div>
          <div className={`${SK}__course-info`}>
            <span className={`${SK}__course-title`}>{info.title}</span>
            <span className={`${SK}__course-instructor`}>{instructor}</span>
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div className={`${SK}__summary`}>
          <span className={`${SK}__summary-score`}>{avgRating.toFixed(1)}</span>
          <StarRating rating={Math.round(avgRating)} />
          <span className={`${SK}__summary-count`}>
            {reviews.length}{pageData.reviewCountSuffix}
          </span>
        </div>
      )}

      <section className={`${SK}__form-section`} aria-labelledby={`${SK}-form-title`}>
        <h2 id={`${SK}-form-title`} className={`${SK}__section-title`}>
          {isEditing ? '리뷰 수정' : pageData.formTitle}
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
          {submitError && (
            <p className={`${SK}__error`} role="alert">{submitError}</p>
          )}
          <div className={`${SK}__form-footer`}>
            {isEditing && (
              <button
                type="button"
                className={`${SK}__cancel-btn`}
                onClick={resetForm}
                disabled={submitting}
              >
                취소
              </button>
            )}
            <button
              type="submit"
              className={`${SK}__submit-btn`}
              aria-label={pageData.submitAriaLabel}
              disabled={!content.trim() || submitting}
            >
              {isEditing ? '수정 완료' : pageData.submitLabel}
            </button>
          </div>
        </form>
      </section>

      <section className={`${SK}__list-section`} aria-labelledby={`${SK}-list-title`}>
        <h2 id={`${SK}-list-title`} className={`${SK}__section-title`}>
          {pageData.listTitle}
        </h2>
        {reviewsQuery.loading && !reviewsQuery.data ? (
          <p className={`${SK}__empty`}>불러오는 중…</p>
        ) : reviewsQuery.error && !reviewsQuery.data ? (
          <p className={`${SK}__empty`}>{reviewsQuery.error.message}</p>
        ) : reviews.length === 0 ? (
          <p className={`${SK}__empty`}>{pageData.emptyText}</p>
        ) : (
          <ul className={`${SK}__list`} role="list">
            {reviews.map((item) => (
              <ReviewItem
                key={item.id}
                item={item}
                mine={!!user?.nickname && item.nickname === user.nickname}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
