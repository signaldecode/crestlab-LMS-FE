/**
 * 오픈예정 강의 컨테이너 (UpcomingCoursesContainer)
 * - "인기 오픈 예정 강의" 피쳐드 섹션 + "오픈 예정" 그리드 섹션을 조립한다
 * - 스켈레톤 UI를 함께 렌더링하여 로딩 상태를 시각적으로 보여준다
 */

import type { JSX } from 'react';
import { getUpcomingCourses } from '@/lib/data';
import UpcomingCourseCard from '@/components/courses/UpcomingCourseCard';
import UpcomingCourseCardSkeleton from '@/components/courses/UpcomingCourseCardSkeleton';

export default function UpcomingCoursesContainer(): JSX.Element {
  const courses = getUpcomingCourses();
  const featuredCourses = courses.filter((c) => c.featured);
  const otherCourses = courses.filter((c) => !c.featured);

  return (
    <div className="upcoming-page">
      {/* ── 인기 오픈 예정 강의 ── */}
      <section className="upcoming-page__featured">
        <h2 className="upcoming-page__section-title">인기 오픈 예정 강의</h2>
        <div className="upcoming-page__grid">
          {featuredCourses.map((course) => (
            <UpcomingCourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>

      {/* ── 오픈 예정 그리드 ── */}
      <section className="upcoming-page__list">
        <div className="upcoming-page__list-header">
          <h2 className="upcoming-page__section-title">오픈 예정</h2>
          <div className="upcoming-page__sort">
            <select
              className="upcoming-page__sort-select"
              aria-label="정렬 기준 선택"
              defaultValue="popular"
            >
              <option value="popular">인기순</option>
              <option value="latest">최신순</option>
              <option value="date">오픈일순</option>
            </select>
          </div>
        </div>

        <div className="upcoming-page__grid">
          {otherCourses.map((course) => (
            <UpcomingCourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>

      {/* ── 스켈레톤 미리보기 섹션 ── */}
      {/* <section className="upcoming-page__skeleton-preview">
        <h2 className="upcoming-page__section-title">스켈레톤 UI 미리보기</h2>
        <div className="upcoming-page__grid">
          <UpcomingCourseCardSkeleton />
          <UpcomingCourseCardSkeleton />
          <UpcomingCourseCardSkeleton />
        </div>
      </section> */}
    </div>
  );
}
