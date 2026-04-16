/**
 * 내 후기 상세/수정 콘텐츠 (ReviewDetailContent)
 * - 백엔드는 단건 조회 엔드포인트가 없어 `GET /v1/enrollments/reviews` 목록에서 id로 조회
 * - 수정: `PUT /v1/reviews/{id}`
 * - 삭제: `DELETE /v1/reviews` (body로 id 리스트)
 */

'use client';

import { useCallback, useMemo, useState, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import {
  deleteCourseReview,
  fetchMyReviews,
  updateCourseReview,
  UserApiError,
  type MyReviewItem,
  type MyReviewPageResponse,
} from '@/lib/userApi';
import { resolveThumb } from '@/lib/images';
import accountData from '@/data/accountData.json';

const pageData = accountData.mypage.reviewDetailPage;
const SK = 'review-detail';

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('ko-KR');
}

interface Props {
  reviewId: string;
}

export default function ReviewDetailContent({ reviewId }: Props): JSX.Element {
  const router = useRouter();
  const { data, loading, refetch } = useAdminQuery<MyReviewPageResponse>(
    () => fetchMyReviews({ page: 1, size: 100 }),
    [],
  );

  const target: MyReviewItem | undefined = useMemo(
    () => (data?.content ?? []).find((r) => String(r.reviewId) === reviewId),
    [data, reviewId],
  );

  const [isEditing, setIsEditing] = useState(false);
  const [draftRating, setDraftRating] = useState(0);
  const [draftContent, setDraftContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorText, setErrorText] = useState('');

  const startEdit = useCallback(() => {
    if (!target) return;
    setDraftRating(target.rating);
    setDraftContent(target.content);
    setErrorText('');
    setIsEditing(true);
  }, [target]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setErrorText('');
  }, []);

  const handleSave = useCallback(async () => {
    if (!target) return;
    if (saving) return;
    setSaving(true);
    setErrorText('');
    try {
      await updateCourseReview(target.reviewId, {
        rating: draftRating,
        content: draftContent.trim(),
      });
      await refetch();
      setIsEditing(false);
    } catch (err) {
      setErrorText(err instanceof UserApiError ? err.message : pageData.saveFailedText);
    } finally {
      setSaving(false);
    }
  }, [target, saving, draftRating, draftContent, refetch]);

  const handleDelete = useCallback(async () => {
    if (!target) return;
    if (deleting) return;
    if (!window.confirm(pageData.deleteConfirmMessage)) return;
    setDeleting(true);
    setErrorText('');
    try {
      await deleteCourseReview(target.reviewId);
      router.push('/mypage/reviews');
    } catch (err) {
      setErrorText(err instanceof UserApiError ? err.message : pageData.deleteFailedText);
      setDeleting(false);
    }
  }, [target, deleting, router]);

  if (loading) {
    return (
      <div className={SK}>
        <p className={`${SK}__loading`}>불러오는 중...</p>
      </div>
    );
  }

  if (!target) {
    return (
      <div className={SK}>
        <div className={`${SK}__not-found`}>
          <h2 className={`${SK}__not-found-title`}>{pageData.notFoundTitle}</h2>
          <p className={`${SK}__not-found-desc`}>{pageData.notFoundDescription}</p>
          <Link href="/mypage/reviews" className={`${SK}__not-found-link`}>
            {pageData.notFoundLinkLabel}
          </Link>
        </div>
      </div>
    );
  }

  const activeRating = isEditing ? draftRating : target.rating;

  return (
    <div className={SK}>
      <Link href="/mypage/reviews" className={`${SK}__back`} aria-label={pageData.backAriaLabel}>
        &larr; {pageData.backLabel}
      </Link>

      <header className={`${SK}__header`}>
        <Link
          href={`/courses/${target.courseId}`}
          className={`${SK}__thumb`}
          aria-label={pageData.thumbnailAriaLabel.replace('{course}', target.courseTitle)}
        >
          <Image
            src={resolveThumb(target.courseThumbnailUrl)}
            alt={target.courseTitle}
            width={160}
            height={90}
            className={`${SK}__thumb-img`}
          />
        </Link>
        <div className={`${SK}__header-info`}>
          <h2 className={`${SK}__title`}>{pageData.title}</h2>
          <Link href={`/courses/${target.courseId}`} className={`${SK}__course-link`}>
            {target.courseTitle}
          </Link>
        </div>
      </header>

      <section className={`${SK}__section`}>
        <h3 className={`${SK}__section-title`}>{pageData.ratingLabel}</h3>
        <div className={`${SK}__rating`} role={isEditing ? 'radiogroup' : undefined}>
          {Array.from({ length: 5 }).map((_, i) => {
            const n = i + 1;
            const filled = n <= activeRating;
            const starClass = `${SK}__star${filled ? ` ${SK}__star--filled` : ''}`;
            if (isEditing) {
              return (
                <button
                  key={n}
                  type="button"
                  className={starClass}
                  aria-label={pageData.starAriaLabel.replace('{n}', String(n))}
                  aria-pressed={filled}
                  onClick={() => setDraftRating(n)}
                >
                  ★
                </button>
              );
            }
            return (
              <span key={n} className={starClass} aria-hidden="true">★</span>
            );
          })}
        </div>
      </section>

      <section className={`${SK}__section`}>
        <h3 className={`${SK}__section-title`}>{pageData.contentLabel}</h3>
        {isEditing ? (
          <textarea
            className={`${SK}__textarea`}
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            placeholder={pageData.contentPlaceholder}
            rows={6}
          />
        ) : (
          <p className={`${SK}__content`}>{target.content}</p>
        )}
      </section>

      <section className={`${SK}__meta`}>
        <span className={`${SK}__meta-label`}>{pageData.createdAtLabel}</span>
        <span className={`${SK}__meta-value`}>{formatDate(target.createdAt)}</span>
      </section>

      {errorText && <p className={`${SK}__error`} role="alert">{errorText}</p>}

      <div className={`${SK}__actions`}>
        {isEditing ? (
          <>
            <button
              type="button"
              className={`${SK}__action-btn ${SK}__action-btn--secondary`}
              onClick={() => { void handleSave(); }}
              disabled={saving || draftRating === 0 || !draftContent.trim()}
            >
              {saving ? '저장 중...' : pageData.saveLabel}
            </button>
            <button
              type="button"
              className={`${SK}__action-btn ${SK}__action-btn--outline`}
              onClick={cancelEdit}
              disabled={saving}
            >
              {pageData.cancelLabel}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={`${SK}__action-btn ${SK}__action-btn--secondary`}
              onClick={startEdit}
            >
              {pageData.editLabel}
            </button>
            <button
              type="button"
              className={`${SK}__action-btn ${SK}__action-btn--outline`}
              onClick={() => { void handleDelete(); }}
              disabled={deleting}
            >
              {deleting ? '삭제 중...' : pageData.deleteLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
