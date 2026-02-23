/**
 * 커리큘럼 히어로 배너 (CurriculumHero)
 * - 상단 풀폭 배너 스켈레톤
 */

import type { JSX } from 'react';

export default function CurriculumHero(): JSX.Element {
  return (
    <section className="curriculum-hero">
      <div className="curriculum-hero__banner curriculum-hero__skeleton">
        <div className="curriculum-hero__text">
          <div className="curriculum-hero__skeleton-line curriculum-hero__skeleton-line--sub" />
          <div className="curriculum-hero__skeleton-line curriculum-hero__skeleton-line--title" />
        </div>
      </div>
    </section>
  );
}
