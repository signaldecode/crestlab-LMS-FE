/**
 * 강의 카드 (CourseCard)
 * - 썸네일 + 뱃지 + 제목 + 강사명 + 평점/리뷰 + 가격
 * - 하트 버튼으로 위시리스트 토글
 * - 호버 시 상세 팝오버 표시 (Portal로 body에 마운트, overflow 이슈 회피)
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useState, useRef, useCallback, useEffect, type JSX } from 'react';
import type { Course } from '@/types';
import useWishlistStore from '@/stores/useWishlistStore';
import useCartStore from '@/stores/useCartStore';
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

function getLevelLabel(level: string): string {
  switch (level) {
    case 'beginner': return '입문';
    case 'intermediate': return '중급이상';
    case 'advanced': return '고급';
    default: return '전체';
  }
}

interface PopoverPosition {
  top: number;
  left: number;
  direction: 'right' | 'left';
}

function CourseCardPopover({ course, wished, onWishToggle, position, onMouseEnter, onMouseLeave }: {
  course: Course;
  wished: boolean;
  onWishToggle: () => void;
  position: PopoverPosition;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const addToCart = useCartStore((s) => s.addItem);

  const handleAddCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(course);
  };

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWishToggle();
  };

  const style: React.CSSProperties = {
    position: 'fixed',
    top: position.top,
    left: position.left,
    zIndex: 9999,
  };

  return createPortal(
    <div
      className={`course-popover course-popover--${position.direction}`}
      role="tooltip"
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h4 className="course-popover__title">{course.title}</h4>
      <p className="course-popover__desc">{course.summary}</p>

      <div className="course-popover__meta">
        <span className="course-popover__level">{getLevelLabel(course.level)}</span>
        {course.tags.length > 0 && (
          <>
            <span className="course-popover__dot" aria-hidden="true" />
            <span className="course-popover__tags">{course.tags.join(' ')}</span>
          </>
        )}
      </div>

      <div className="course-popover__info">
        <span>{course.instructor}</span>
        <span>{course.duration}</span>
      </div>

      {course.learningPoints.length > 0 && (
        <div className="course-popover__learn">
          <p className="course-popover__learn-title">이런 걸 배울 수 있어요</p>
          <ul className="course-popover__learn-list">
            {course.learningPoints.map((point) => (
              <li key={point} className="course-popover__learn-item">
                <svg className="course-popover__check" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M13.5 4.5l-7 7L3 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="course-popover__actions">
        <button
          type="button"
          className={`course-popover__wish${wished ? ' course-popover__wish--active' : ''}`}
          onClick={handleWish}
          aria-label={wished ? uiData.wish.removeAriaLabel : uiData.wish.addAriaLabel}
        >
          {wished ? '♥' : '♡'}
        </button>
        <button
          type="button"
          className="course-popover__cart-btn"
          onClick={handleAddCart}
        >
          바구니에 담기
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default function CourseCard({ course }: CourseCardProps): JSX.Element {
  const toggleWish = useWishlistStore((s) => s.toggleWish);
  const wished = useWishlistStore((s) => s.slugs.includes(course.slug));
  const [showPopover, setShowPopover] = useState(false);
  const [position, setPosition] = useState<PopoverPosition>({ top: 0, left: 0, direction: 'right' });
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const calcPosition = useCallback(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const popoverWidth = 288; // 18rem
    const gap = 8;

    // 오른쪽에 공간이 있으면 오른쪽, 없으면 왼쪽
    const spaceRight = window.innerWidth - rect.right;
    const direction = spaceRight >= popoverWidth + gap ? 'right' : 'left';

    setPosition({
      top: rect.top,
      left: direction === 'right' ? rect.right + gap : rect.left - popoverWidth - gap,
      direction,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      calcPosition();
      setShowPopover(true);
    }, 300);
  }, [clearTimer, calcPosition]);

  const handleMouseLeave = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => setShowPopover(false), 200);
  }, [clearTimer]);

  // 팝오버 위에 마우스가 있으면 닫지 않음
  const handlePopoverEnter = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  const handlePopoverLeave = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => setShowPopover(false), 200);
  }, [clearTimer]);

  // 스크롤 시 팝오버 즉시 닫기
  useEffect(() => {
    if (!showPopover) return;

    const handleScroll = () => {
      clearTimer();
      setShowPopover(false);
    };

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    return () => window.removeEventListener('scroll', handleScroll, { capture: true });
  }, [showPopover, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWish(course.slug);
  };

  return (
    <div
      className="course-card-wrap"
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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

      {showPopover && (
        <CourseCardPopover
          course={course}
          wished={wished}
          onWishToggle={() => toggleWish(course.slug)}
          position={position}
          onMouseEnter={handlePopoverEnter}
          onMouseLeave={handlePopoverLeave}
        />
      )}
    </div>
  );
}
