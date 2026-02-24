/**
 * 베스트 강의 칩 필터 (BestChipFilter)
 * - 카테고리 칩 버튼 목록을 렌더링한다
 * - 선택된 칩은 활성 스타일로 표시된다
 * - 클릭 시 해당 카테고리로 필터링한다
 */

'use client';

import { useState } from 'react';
import type { BestChipCategory, BestCourse } from '@/types';
import BestCourseCard from '@/components/courses/BestCourseCard';
import BestCourseCardSkeleton from '@/components/courses/BestCourseCardSkeleton';

interface BestChipFilterProps {
  categories: BestChipCategory[];
  courses: BestCourse[];
}

export default function BestChipFilter({ categories, courses }: BestChipFilterProps) {
  const [activeChip, setActiveChip] = useState('all');

  const filteredCourses =
    activeChip === 'all'
      ? courses
      : courses.filter((c) => c.category === activeChip);

  return (
    <>
      <div className="best-page__chips" role="tablist" aria-label="카테고리 필터">
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`best-page__chip ${activeChip === cat.value ? 'best-page__chip--active' : ''}`}
            type="button"
            role="tab"
            aria-selected={activeChip === cat.value}
            onClick={() => setActiveChip(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="best-page__grid">
        {filteredCourses.map((course) => (
          <BestCourseCard key={course.slug} course={course} />
        ))}
      </div>

      {/* 스켈레톤 UI 미리보기 */}
      <section className="best-page__skeleton-preview">
        <h3 className="best-page__section-subtitle">스켈레톤 UI 미리보기</h3>

        <div className="best-page__chips best-page__chips--skeleton" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="best-page__chip-skeleton" />
          ))}
        </div>

        <div className="best-page__grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <BestCourseCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </>
  );
}
