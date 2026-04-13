/**
 * 홈 탭 강의 섹션 (HomeTabbedSection)
 * - 서브타이틀(program) + 타이틀 + pill 탭 필터 + 3열 카드 그리드
 * - 탭 클릭 시 해당 카테고리의 강의 카드를 표시한다
 */

'use client';

import { useState, type JSX } from 'react';
import type { HomeSectionView } from '@/types';
import CourseCard from '@/components/courses/CourseCard';

interface HomeTabbedSectionProps {
  view: HomeSectionView;
}

export default function HomeTabbedSection({ view }: HomeTabbedSectionProps): JSX.Element {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeChip = view.chips[activeIdx];
  const courses = activeChip?.courses.slice(0, 3) ?? [];

  return (
    <section className="home-tabbed-section">
      <div className="home-tabbed-section__header">
        <div className="home-tabbed-section__header-left">
          {view.subtitle && (
            <span className="home-tabbed-section__label">{view.subtitle}</span>
          )}
          <h2 className="home-tabbed-section__title">{view.title}</h2>
        </div>
      </div>

      <div className="home-tabbed-section__body">
        {/* 탭 필터 */}
        <div className="home-tabbed-section__tabs" role="tablist">
          {view.chips.map((chip, idx) => (
            <button
              key={chip.label}
              type="button"
              role="tab"
              className={`home-tabbed-section__tab${idx === activeIdx ? ' home-tabbed-section__tab--active' : ''}`}
              aria-selected={idx === activeIdx}
              onClick={() => setActiveIdx(idx)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* 3열 카드 그리드 */}
        <div className="home-tabbed-section__grid" role="tabpanel">
          {courses.map((course) => (
            <div key={course.slug} className="home-tabbed-section__card">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
