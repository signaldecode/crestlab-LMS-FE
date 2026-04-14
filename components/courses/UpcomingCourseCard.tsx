/**
 * 오픈예정 강의 카드 (UpcomingCourseCard)
 * - 썸네일(카테고리 태그 + 찜 버튼) + 제목 + 평점/리뷰 + 강사/태그 + 알림신청 버튼
 * - 알림신청 버튼 클릭 시 "알림 신청 완료" 상태로 토글된다
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { UpcomingCourse } from '@/types';
import { resolveThumb } from '@/lib/images';

interface UpcomingCourseCardProps {
  course: UpcomingCourse;
}

export default function UpcomingCourseCard({ course }: UpcomingCourseCardProps) {
  const [notified, setNotified] = useState(false);

  const formattedReviewCount = course.reviewCount.toLocaleString();

  return (
    <article className="upcoming-card">
      <div className="upcoming-card__thumbnail">
        <Image
          src={resolveThumb(course.thumbnail)}
          alt={course.thumbnailAlt}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="upcoming-card__image"
        />
        <span className="upcoming-card__category-tag">{course.categoryLabel}</span>
        <button
          className="upcoming-card__wish-btn"
          type="button"
          aria-label="찜하기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="upcoming-card__body">
        <h3 className="upcoming-card__title">{course.title}</h3>

        <div className="upcoming-card__meta">
          <span className="upcoming-card__rating">
            <svg className="upcoming-card__star-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {course.rating}({formattedReviewCount})
          </span>
          <span className="upcoming-card__instructor">{course.instructor}</span>
          {course.tags.length > 0 && (
            <>
              <span className="upcoming-card__separator">,</span>
              <span className="upcoming-card__tags">
                {course.tags.join(', ')}
              </span>
            </>
          )}
        </div>

        {course.openDate ? (
          <button
            className={`upcoming-card__notify-btn ${notified ? 'upcoming-card__notify-btn--done' : ''}`}
            type="button"
            onClick={() => setNotified((prev) => !prev)}
            aria-label={notified ? '알림 신청 완료됨' : '알림 신청하기'}
          >
            {notified ? '알림 신청 취소' : `${course.openDate} 알림 신청`}
          </button>
        ) : (
          <button
            className={`upcoming-card__notify-btn ${notified ? 'upcoming-card__notify-btn--done' : ''}`}
            type="button"
            onClick={() => setNotified((prev) => !prev)}
            aria-label={notified ? '알림 신청 완료됨' : '알림 신청하기'}
          >
            {notified ? '알림 신청 취소' : '알림 신청'}
          </button>
        )}
      </div>
    </article>
  );
}
