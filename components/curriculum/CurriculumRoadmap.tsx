/**
 * 커리큘럼 로드맵 다이어그램 (CurriculumRoadmap)
 * - 3단계 목표(내집마련 / 순자산10억 / 순자산30억) + 하위 강의 목록
 * - 스켈레톤 UI
 */

import type { JSX } from 'react';

interface RoadmapCol {
  goal: string;
  highlight: string;
  items: string[];
}

interface CurriculumRoadmapProps {
  cols: RoadmapCol[];
}

export default function CurriculumRoadmap({ cols }: CurriculumRoadmapProps): JSX.Element {
  return (
    <section className="curriculum-roadmap">
      <div className="curriculum-roadmap__inner">
        {cols.map((col) => (
          <div key={col.goal} className="curriculum-roadmap__col">
            <h3 className="curriculum-roadmap__goal">{col.goal}</h3>
            {col.highlight && (
              <span className="curriculum-roadmap__highlight">{col.highlight}</span>
            )}
            <div className="curriculum-roadmap__icon curriculum-roadmap__skeleton-circle" />
            <ul className="curriculum-roadmap__list">
              {col.items.map((item) => (
                <li key={item} className="curriculum-roadmap__item">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
