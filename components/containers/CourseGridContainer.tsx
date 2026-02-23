/**
 * 강의 그리드 컨테이너 (CourseGridContainer)
 * - 배너 + 2단 레이아웃(사이드바 필터 + 강의 카드 그리드)을 조립한다
 * - 필터(카테고리/레벨), 정렬, 검색, 페이지네이션을 조합한다
 */

import type { JSX } from 'react';
import CourseBanner from '@/components/courses/CourseBanner';
import CourseSidebar from '@/components/courses/CourseSidebar';
import CourseSort from '@/components/courses/CourseSort';
import CourseCard from '@/components/courses/CourseCard';

export default function CourseGridContainer(): JSX.Element {
  return (
    <section className="courses-page">
      <CourseBanner />

      <div className="courses-page__content">
        <CourseSidebar />

        <div className="courses-page__main">
          <div className="courses-page__toolbar">
            <CourseSort />
          </div>

          <div className="courses-page__grid">
            {/* CourseCard 목록이 렌더링될 영역 — 추후 data 연동 */}
            <CourseCard />
            <CourseCard />
            <CourseCard />
          </div>

          <div className="courses-page__pagination">
            {/* Pagination 컴포넌트가 렌더링될 영역 */}
          </div>
        </div>
      </div>
    </section>
  );
}
