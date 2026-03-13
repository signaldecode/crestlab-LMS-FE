/**
 * 강의 카드 (CourseCard)
 * - 썸네일 + 뱃지 + 제목 + 강사명 + 평점/리뷰 + 가격
 * - 하트 버튼으로 위시리스트 토글
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import type { Course } from '@/types';
import useWishlistStore from '@/stores/useWishlistStore';
import uiData from '@/data/uiData.json';

interface CourseCardProps {
  course: Course;
}

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + uiData.priceUnit;
}

function formatReviewCount(count: number): string {
  if (count >= 10000) return (count / 10000).toFixed(1).replace(/\.0$/, '') + '만';
  if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + '천';
  return count.toLocaleString('ko-KR');
}

function getBadgeVariant(badge: string): string {
  if (badge === 'ORIGINAL') return 'original';
  if (badge === 'BEST') return 'best';
  if (badge === 'NEW' || badge.includes('신규')) return 'new';
  if (badge.includes('선착순') || badge.includes('마감')) return 'urgent';
  if (badge.startsWith('LV.')) return 'level';
  return 'default';
}

export default function CourseCard({ course }: CourseCardProps): JSX.Element {
  const toggleWish = useWishlistStore((s) => s.toggleWish);
  const wished = useWishlistStore((s) => s.slugs.includes(course.slug));

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWish(course.slug);
  };

  return (
    <Link href={`/courses/${course.slug}`} className="course-card">
      <div className="course-card__thumbnail">
        <Image
          src={course.thumbnail}
          alt={course.thumbnailAlt}
          fill
          sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 20vw"
          className="course-card__image"
        />
        {course.badges.length > 0 && (
          <div className="course-card__badge-overlay">
            {course.badges.map((badge) => (
              <span key={badge} className={`course-card__badge course-card__badge--${getBadgeVariant(badge)}`}>{badge}</span>
            ))}
          </div>
        )}
        <button
          type="button"
          className={`course-card__wish-btn${wished ? ' course-card__wish-btn--active' : ''}`}
          onClick={handleWish}
          aria-label={wished ? uiData.wish.removeAriaLabel : uiData.wish.addAriaLabel}
        >
          {wished ? uiData.wish.removeIcon : uiData.wish.addIcon}
        </button>
      </div>
      <div className="course-card__body">
        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__instructor">{course.instructor}</p>
        {course.rating != null && (
          <div className="course-card__rating">
            <span className="course-card__stars">★ {course.rating.toFixed(2)}</span>
            <span className="course-card__review-count">({formatReviewCount(course.reviewCount ?? 0)})</span>
          </div>
        )}
        <span className="course-card__price">{formatPrice(course.price)}</span>
      </div>
    </Link>
  );
}
