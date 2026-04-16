/**
 * 강의 리스트 카드 (CourseListCard)
 * - 강의 목록 페이지 전용 카드 (피그마 B타입, 342px 그리드)
 * - 썸네일(190px) + 제목 + 별점/강사 + 태그 행
 * - 호버 시 상세 팝오버 표시 (CourseCard와 동일한 UX)
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useState, useRef, useCallback, useEffect, type JSX } from 'react';
import type { Course } from '@/types';
import useCourseFavorite from '@/hooks/useCourseFavorite';
import useCartStore from '@/stores/useCartStore';
import uiData from '@/data/uiData.json';
import { resolveThumb } from '@/lib/images';

interface CourseListCardProps {
  course: Course;
}

function formatReviewCount(count: number): string {
  if (count >= 10000) return (count / 10000).toFixed(1).replace(/\.0$/, '') + '만';
  if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + '천';
  return count.toLocaleString('ko-KR');
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

function ListCardPopover({ course, wished, onWishToggle, position, onMouseEnter, onMouseLeave }: {
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

export default function CourseListCard({ course }: CourseListCardProps): JSX.Element {
  const { wished, toggle } = useCourseFavorite(course.id, course.slug);
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
    const popoverWidth = 288;
    const gap = 8;
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

  const handlePopoverEnter = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  const handlePopoverLeave = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => setShowPopover(false), 200);
  }, [clearTimer]);

  useEffect(() => {
    if (!showPopover) return;
    const handleScroll = () => { clearTimer(); setShowPopover(false); };
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    return () => window.removeEventListener('scroll', handleScroll, { capture: true });
  }, [showPopover, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void toggle();
  };

  return (
    <div
      className="course-list-card-wrap"
      ref={cardRef}
    >
      <Link href={`/courses/${course.id}`} className="course-list-card" aria-label={course.title}>
        {/* 썸네일 */}
        <div className="course-list-card__thumb">
          <Image
            src={resolveThumb(course.thumbnail)}
            alt={course.thumbnailAlt}
            fill
            sizes="(max-width: 639px) 50vw, 342px"
            className="course-list-card__image"
          />
          <button
            type="button"
            className={`course-list-card__wish${wished ? ' course-list-card__wish--active' : ''}`}
            onClick={handleWish}
            aria-label={wished ? uiData.wish.removeAriaLabel : uiData.wish.addAriaLabel}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="course-list-card__body">
          <div className="course-list-card__info">
            <h3 className="course-list-card__title">{course.title}</h3>
            <div className="course-list-card__meta">
              {course.rating != null && (
                <div className="course-list-card__rating">
                  <svg className="course-list-card__star" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 13.87 5.06 16.7l.94-5.49-4-3.9 5.53-.8z" fill="currentColor" />
                  </svg>
                  <span className="course-list-card__rating-value">{course.rating.toFixed(1)}</span>
                  <span className="course-list-card__review-count">({formatReviewCount(course.reviewCount ?? 0)})</span>
                </div>
              )}
              <div className="course-list-card__instructor">
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                  <circle cx="10" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span>{course.instructor}</span>
              </div>
            </div>
          </div>

          {/* 태그 행 */}
          <div className="course-list-card__tags">
            {course.badges.includes('BEST') && (
              <span className="course-list-card__tag course-list-card__tag--accent">BEST</span>
            )}
            {course.badges.includes('NEW') && (
              <span className="course-list-card__tag course-list-card__tag--new">NEW</span>
            )}
            {course.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="course-list-card__tag">#{tag}</span>
            ))}
          </div>

          <span className="course-list-card__cta" aria-hidden="true">바로가기</span>
        </div>
      </Link>

    </div>
  );
}
