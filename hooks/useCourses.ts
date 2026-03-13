/**
 * useCourses — 강의 목록 조회 + 필터/정렬/검색/페이지네이션 통합 Hook
 *
 * lib/data.ts의 데이터 접근 함수와 useCourseStore 상태를 하나로 묶어
 * 컴포넌트에서 한 줄 호출로 강의 관련 기능을 모두 사용할 수 있게 한다.
 */

'use client';

import { useMemo } from 'react';
import useCourseStore from '@/stores/useCourseStore';
import { getCourses, findCourseBySlug, getFeaturedCourses } from '@/lib/data';
import type { Course } from '@/types';

export default function useCourses() {
  const category = useCourseStore((s) => s.category);
  const level = useCourseStore((s) => s.level);
  const sort = useCourseStore((s) => s.sort);
  const query = useCourseStore((s) => s.query);
  const page = useCourseStore((s) => s.page);
  const pageSize = useCourseStore((s) => s.pageSize);
  const setCategory = useCourseStore((s) => s.setCategory);
  const setLevel = useCourseStore((s) => s.setLevel);
  const setSort = useCourseStore((s) => s.setSort);
  const setQuery = useCourseStore((s) => s.setQuery);
  const setPage = useCourseStore((s) => s.setPage);
  const resetFilters = useCourseStore((s) => s.resetFilters);

  const allCourses = getCourses();

  const filtered = useMemo(() => {
    let result: Course[] = [...allCourses];

    if (category) {
      result = result.filter((c) => c.category === category);
    }
    if (level) {
      result = result.filter((c) => c.level === level);
    }
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q)
      );
    }

    if (sort === 'latest') {
      // 기본 순서 유지 (data 순서 = 최신순)
    } else if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return result;
  }, [allCourses, category, level, query, sort]);

  const totalCount = filtered.length;
  const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return {
    /** 필터/정렬/검색/페이지네이션 적용된 강의 목록 */
    courses: paged,
    /** 필터 적용 후 전체 건수 */
    totalCount,
    /** 전체 페이지 수 */
    totalPages,

    /** 현재 필터 상태 */
    category,
    level,
    sort,
    query,
    page,
    pageSize,

    /** 필터 액션 */
    setCategory,
    setLevel,
    setSort,
    setQuery,
    setPage,
    resetFilters,

    /** 데이터 접근 헬퍼 */
    findBySlug: findCourseBySlug,
    getFeatured: getFeaturedCourses,
  };
}
