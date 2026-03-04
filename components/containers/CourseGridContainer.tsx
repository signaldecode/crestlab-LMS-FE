/**
 * 강의 그리드 컨테이너 (CourseGridContainer)
 * - 배너 + 2단 레이아웃(사이드바 필터 + 강의 카드 그리드)을 조립한다
 * - URL searchParams의 category/sub 파라미터로 강의를 필터링한다
 */

'use client';

import { useMemo, type JSX } from 'react';
import { useSearchParams } from 'next/navigation';
import CourseBanner from '@/components/courses/CourseBanner';
import CourseSidebar from '@/components/courses/CourseSidebar';
import CourseSort from '@/components/courses/CourseSort';
import CourseCard from '@/components/courses/CourseCard';
import { getCourses } from '@/lib/data';
import type { Course } from '@/types';

/** 사이드바 category 값 → 강의 데이터 category 매핑 */
function matchCategory(course: Course, category: string): boolean {
  switch (category) {
    case 'real-estate':
      return course.category === 'real-estate' || course.category === 'my-house';
    case 'finance':
      return course.category === 'finance' || course.category === 'stock';
    case 'original':
      return course.badges.some((b) => b === 'ORIGINAL');
    case 'coaching':
      return course.category === 'coaching';
    case 'book-club':
      return course.category === 'book-club';
    default:
      return course.category === category;
  }
}

export default function CourseGridContainer(): JSX.Element {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? '';
  const sub = searchParams.get('sub') ?? '';

  const allCourses = getCourses();

  const filteredCourses = useMemo(() => {
    if (!category) return allCourses;

    let results = allCourses.filter((c) => matchCategory(c, category));

    // sub 필터: level 기반 매핑
    if (sub) {
      const subLevelMap: Record<string, string> = {
        beginner: 'beginner',
        intermediate: 'intermediate',
        advanced: 'advanced',
      };

      const subCategoryMap: Record<string, string> = {
        'real-estate-basic': 'real-estate',
        'my-house': 'my-house',
        'stock-coin': 'stock',
        auction: 'real-estate',
        subscription: 'real-estate',
        commercial: 'real-estate',
        'tax-loan': 'real-estate',
        business: 'online-store',
        basic: 'finance',
      };

      if (subLevelMap[sub]) {
        results = results.filter((c) => c.level === subLevelMap[sub]);
      } else if (subCategoryMap[sub]) {
        results = results.filter((c) => c.category === subCategoryMap[sub]);
      }
    }

    return results;
  }, [allCourses, category, sub]);

  return (
    <section className="courses-page">
      <CourseBanner category={category} />

      <div className="courses-page__content">
        <CourseSidebar />

        <div className="courses-page__main">
          <div className="courses-page__toolbar">
            <span className="courses-page__count">
              전체 <strong>{filteredCourses.length}</strong>개
            </span>
            <CourseSort />
          </div>

          {filteredCourses.length > 0 ? (
            <div className="courses-page__grid">
              {filteredCourses.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
          ) : (
            <div className="courses-page__empty">
              해당 카테고리에 강의가 없습니다.
            </div>
          )}

          <div className="courses-page__pagination">
            {/* Pagination 컴포넌트가 렌더링될 영역 */}
          </div>
        </div>
      </div>
    </section>
  );
}
