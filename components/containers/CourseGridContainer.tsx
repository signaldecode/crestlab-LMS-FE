/**
 * 강의 그리드 컨테이너 (CourseGridContainer)
 * - 피그마: 섹션 타이틀 + 셀렉트 필터 행 + 4열 카드 그리드 + 페이지네이션
 * - URL searchParams의 category 파라미터로 강의를 필터링한다
 */

'use client';

import { useMemo, useState, type JSX } from 'react';
import { useSearchParams } from 'next/navigation';
import CourseListCard from '@/components/courses/CourseListCard';
import { getCourses } from '@/lib/data';
import type { Course } from '@/types';

const ITEMS_PER_PAGE = 16;

const CATEGORY_LABELS: Record<string, string> = {
  stock: '주식',
  crypto: '가상자산',
  'real-estate': '부동산',
};

const SORT_OPTIONS = [
  { value: 'popular', label: '인기순' },
  { value: 'latest', label: '최신순' },
  { value: 'rating', label: '평점순' },
  { value: 'price-low', label: '가격 낮은순' },
  { value: 'price-high', label: '가격 높은순' },
];

function matchCategory(course: Course, category: string): boolean {
  switch (category) {
    case 'stock':
      return course.category === 'stock' || course.category === 'finance';
    case 'crypto':
      return course.category === 'crypto' || course.category === 'online-store';
    case 'real-estate':
      return course.category === 'real-estate' || course.category === 'my-house';
    default:
      return true;
  }
}

function sortCourses(courses: Course[], sort: string): Course[] {
  const sorted = [...courses];
  switch (sort) {
    case 'latest':
      return sorted.reverse();
    case 'rating':
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    default:
      return sorted.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
  }
}

export default function CourseGridContainer(): JSX.Element {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? '';
  const [sort, setSort] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);

  const allCourses = getCourses();

  const filteredCourses = useMemo(() => {
    const filtered = category
      ? allCourses.filter((c) => matchCategory(c, category))
      : allCourses;
    return sortCourses(filtered, sort);
  }, [allCourses, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));
  const pageCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const pageTitle = category
    ? `${CATEGORY_LABELS[category] ?? category} 강의`
    : '전체 강의';

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <section className="courses-page">
      {/* 섹션 타이틀 */}
      <h1 className="courses-page__title">{pageTitle}</h1>

      {/* 필터 + 정렬 행 */}
      <div className="courses-page__toolbar">
        <div className="courses-page__filters">
          <span className="courses-page__count">
            전체 <strong>{filteredCourses.length}</strong>개
          </span>
        </div>

        <div className="courses-page__sort">
          <select
            className="courses-page__sort-select"
            value={sort}
            onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
            aria-label="정렬 기준"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <svg className="courses-page__sort-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* 4열 카드 그리드 */}
      {pageCourses.length > 0 ? (
        <div className="courses-page__grid">
          {pageCourses.map((course) => (
            <CourseListCard key={course.slug} course={course} />
          ))}
        </div>
      ) : (
        <div className="courses-page__empty">
          해당 카테고리에 강의가 없습니다.
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <nav className="courses-page__pagination" aria-label="강의 목록 페이지 네비게이션">
          <button
            type="button"
            className="courses-page__page-btn courses-page__page-btn--arrow"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
              <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`courses-page__page-btn${page === currentPage ? ' courses-page__page-btn--active' : ''}`}
              onClick={() => goToPage(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`${page} 페이지`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="courses-page__page-btn courses-page__page-btn--arrow"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
              <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </nav>
      )}
    </section>
  );
}
