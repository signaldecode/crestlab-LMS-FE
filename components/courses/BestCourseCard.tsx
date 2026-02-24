/**
 * 베스트 강의 카드 (BestCourseCard)
 * - 썸네일(카테고리 태그 + 뱃지 오버레이) + 제목 + 평점/리뷰 + 강사/태그
 */

import type { BestCourse } from '@/types';

interface BestCourseCardProps {
  course: BestCourse;
}

export default function BestCourseCard({ course }: BestCourseCardProps) {
  const formattedReviewCount = course.reviewCount.toLocaleString();

  return (
    <article className="best-card">
      <div className="best-card__thumbnail">
        <span className="best-card__category-tag">
          {course.badge && (
            <span className="best-card__badge">{course.badge}</span>
          )}
          {course.categoryLabel}
        </span>
      </div>

      <div className="best-card__body">
        <h3 className="best-card__title">{course.title}</h3>

        <div className="best-card__meta">
          <span className="best-card__rating">
            <svg className="best-card__star-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {course.rating}({formattedReviewCount})
          </span>
          <span className="best-card__instructor">{course.instructor}</span>
          {course.tags.length > 0 && (
            <>
              <span className="best-card__separator">,</span>
              <span className="best-card__tags">
                {course.tags.join(', ')}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
