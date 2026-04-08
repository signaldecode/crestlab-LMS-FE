/**
 * 홈 강의 리스트 섹션 (HomeCourseSection)
 * - 카테고리 칩(첫 칩은 항상 "전체")으로 노출 강의를 전환
 * - 캐러셀: 한 번에 4개 카드 표시, 좌우 화살표로 슬라이드
 * - 칩 전환 시 캐러셀 위치는 처음으로 리셋된다
 */

'use client';

import { useState, type JSX } from 'react';
import type { HomeSectionView } from '@/types';
import CourseCard from '@/components/courses/CourseCard';

interface HomeCourseSectionProps {
  view: HomeSectionView;
}

const VISIBLE_COUNT = 4;

export default function HomeCourseSection({ view }: HomeCourseSectionProps): JSX.Element {
  const [chipIdx, setChipIdx] = useState(0);
  const [offset, setOffset] = useState(0);

  const courses = view.chips[chipIdx]?.courses ?? [];
  const maxOffset = Math.max(0, courses.length - VISIBLE_COUNT);
  const shiftPercent = offset * 25;

  const handleSelectChip = (idx: number) => {
    setChipIdx(idx);
    setOffset(0);
  };

  const handlePrev = () => setOffset((o) => Math.max(0, o - 1));
  const handleNext = () => setOffset((o) => Math.min(maxOffset, o + 1));

  return (
    <section className="home-course-section">
      <div className="home-course-section__inner">
        <div className="home-course-section__header">
          <h2 className="home-course-section__title">{view.title}</h2>

          <div className="home-course-section__header-right">
            <ul className="home-course-section__chips" role="tablist" aria-label={`${view.title} 카테고리`}>
              {view.chips.map((chip, idx) => {
                const active = idx === chipIdx;
                return (
                  <li key={chip.label} className="home-course-section__chip-item">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={active}
                      className={`home-course-section__chip${active ? ' home-course-section__chip--active' : ''}`}
                      onClick={() => handleSelectChip(idx)}
                    >
                      {chip.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="home-course-section__controls">
              <button
                type="button"
                className={`home-course-section__arrow${offset === 0 ? ' home-course-section__arrow--disabled' : ''}`}
                onClick={handlePrev}
                disabled={offset === 0}
                aria-label="이전"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className={`home-course-section__arrow${offset === maxOffset ? ' home-course-section__arrow--disabled' : ''}`}
                onClick={handleNext}
                disabled={offset === maxOffset}
                aria-label="다음"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="home-course-section__carousel">
          <div
            className="home-course-section__track"
            style={{ transform: `translateX(-${shiftPercent}%)` }}
          >
            {courses.map((course) => (
              <div key={course.slug} className="home-course-section__slide">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
