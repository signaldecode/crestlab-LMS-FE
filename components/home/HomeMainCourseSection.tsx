/**
 * 홈 강의 섹션 — 백엔드 메인 페이지 큐레이션 데이터용 (HomeMainCourseSection)
 * - 기존 `HomeCourseSection` 은 mock `Course` 타입을 사용하지만,
 *   백엔드 `MainCourseCard` 는 더 가벼운 구조라 별도 카드 컴포넌트를 사용한다
 * - 3열 캐러셀, 좌우 화살표 컨트롤
 * - 데이터: useMainPage() → bestCourses | recommendedCourses | newCourses
 */

'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { MainCourseCard } from '@/lib/userApi';
import { resolveThumb } from '@/lib/images';

/** 카드 태그 행 앞에 표시되는 기본 뱃지 종류 */
export type MainCourseBadge = 'best' | 'new' | 'hot';

interface HomeMainCourseSectionProps {
  /** 섹션 상단 보조 라벨 (예: "BEST") */
  subtitle?: string;
  /** 섹션 제목 (예: "지금 가장 인기있는 강의") */
  title: string;
  /** 백엔드에서 내려온 큐레이션 카드 목록 */
  courses: MainCourseCard[];
  /** 기본 뱃지 — 섹션별로 모든 카드에 동일하게 표시 */
  badge?: MainCourseBadge;
  /** 데이터 로딩/에러/빈 상태 */
  loading?: boolean;
  error?: string | null;
}

const BADGE_LABEL: Record<MainCourseBadge, string> = {
  best: 'BEST',
  new: 'NEW',
  hot: 'HOT',
};

const VISIBLE_COUNT = 3;

function formatReviewCount(count: number): string {
  if (count >= 10000) return (count / 10000).toFixed(1).replace(/\.0$/, '') + '만';
  if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + '천';
  return count.toLocaleString('ko-KR');
}

function MainCourseItem({ course, badge }: { course: MainCourseCard; badge?: MainCourseBadge }): JSX.Element {
  const instructor = course.instructorNames[0] ?? '';
  const hasTagsRow = !!badge || course.tags.length > 0;
  return (
    <Link href={`/courses/${course.courseId}`} className="course-card">
      <div className="course-card__thumbnail">
        <Image
          src={resolveThumb(course.thumbnailUrl)}
          alt={course.title}
          fill
          sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 20vw"
          className="course-card__image"
        />
      </div>
      <div className="course-card__body">
        <div className="course-card__info">
          <div className="course-card__info-top">
            <h3 className="course-card__title">{course.title}</h3>
            <div className="course-card__meta">
              {course.averageRating > 0 && (
                <div className="course-card__rating">
                  <svg className="course-card__star-icon" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 13.87 5.06 16.7l.94-5.49-4-3.9 5.53-.8z" fill="currentColor" />
                  </svg>
                  <span className="course-card__rating-value">{course.averageRating.toFixed(1)}</span>
                  <span className="course-card__review-count">({formatReviewCount(course.reviewCount)})</span>
                </div>
              )}
              {instructor && (
                <div className="course-card__instructor-row">
                  <svg className="course-card__instructor-icon" viewBox="0 0 20 20" aria-hidden="true">
                    <circle cx="10" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="course-card__instructor-name">{instructor}</span>
                </div>
              )}
            </div>
          </div>
          {hasTagsRow && (
            <div className="course-card__tags">
              {badge && (
                <span className={`course-card__tag course-card__tag--${badge}`}>{BADGE_LABEL[badge]}</span>
              )}
              {course.tags.map((tag) => (
                <span key={tag} className="course-card__tag course-card__tag--keyword">#{tag}</span>
              ))}
            </div>
          )}
        </div>
        <span className="course-card__cta">바로가기</span>
      </div>
    </Link>
  );
}

export default function HomeMainCourseSection({
  subtitle,
  title,
  courses,
  badge,
  loading = false,
  error = null,
}: HomeMainCourseSectionProps): JSX.Element | null {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(courses.length / VISIBLE_COUNT));
  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  const offset = page * VISIBLE_COUNT;
  const visibleCourses = courses.slice(offset, offset + VISIBLE_COUNT);

  // 로딩/에러/빈 상태에서도 섹션 헤더는 유지하되 본문만 상태 표시
  const isEmpty = !loading && !error && courses.length === 0;

  return (
    <section className="home-course-section">
      <div className="home-course-section__inner">
        <div className="home-course-section__header">
          <div className="home-course-section__header-left">
            {subtitle && <span className="home-course-section__subtitle">{subtitle}</span>}
            <h2 className="home-course-section__title">{title}</h2>
          </div>

          {courses.length > VISIBLE_COUNT && (
            <div className="home-course-section__controls">
              <button
                type="button"
                className={`home-course-section__arrow${page === 0 ? ' home-course-section__arrow--disabled' : ''}`}
                onClick={handlePrev}
                disabled={page === 0}
                aria-label="이전"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className={`home-course-section__arrow${page === totalPages - 1 ? ' home-course-section__arrow--disabled' : ''}`}
                onClick={handleNext}
                disabled={page === totalPages - 1}
                aria-label="다음"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="home-course-section__status" role="status">불러오는 중…</div>
        ) : error ? (
          <div className="home-course-section__status" role="alert">{error}</div>
        ) : isEmpty ? (
          <div className="home-course-section__status">등록된 강의가 없습니다.</div>
        ) : (
          <div className="home-course-section__grid">
            {visibleCourses.map((course) => (
              <div key={course.courseId} className="home-course-section__card">
                <MainCourseItem course={course} badge={badge} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
