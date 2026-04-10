/**
 * 홈 강의 리스트 섹션 (HomeCourseSection)
 * - 서브타이틀(program) + 타이틀 + 3열 캐러셀 카드
 * - 좌우 화살표로 3장 단위 슬라이드
 */

'use client';

import { useState, type JSX } from 'react';
import type { HomeSectionView } from '@/types';
import CourseCard from '@/components/courses/CourseCard';

interface HomeCourseSectionProps {
  view: HomeSectionView;
}

const VISIBLE_COUNT = 3;

export default function HomeCourseSection({ view }: HomeCourseSectionProps): JSX.Element {
  const allCourses = view.chips[0]?.courses ?? [];
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(allCourses.length / VISIBLE_COUNT));
  const shiftPercent = page * (100 / Math.ceil(allCourses.length / VISIBLE_COUNT)) * (VISIBLE_COUNT / allCourses.length) * 100;

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  const offset = page * VISIBLE_COUNT;
  const visibleCourses = allCourses.slice(offset, offset + VISIBLE_COUNT);

  return (
    <section className="home-course-section">
      <div className="home-course-section__inner">
        <div className="home-course-section__header">
          <div className="home-course-section__header-left">
            {view.subtitle && (
              <span className="home-course-section__subtitle">{view.subtitle}</span>
            )}
            <h2 className="home-course-section__title">{view.title}</h2>
          </div>

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
        </div>

        <div className="home-course-section__grid">
          {visibleCourses.map((course) => (
            <div key={course.slug} className="home-course-section__card">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
