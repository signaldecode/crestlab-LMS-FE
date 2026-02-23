/**
 * 홈 강의 리스트 섹션 (HomeCourseSection)
 * - 키워드 타이틀 + 한 줄 5개 강의 카드 스켈레톤
 * - 여러 섹션이 반복 사용된다
 */

import type { JSX } from 'react';

interface HomeCourseSectionProps {
  title: string;
}

export default function HomeCourseSection({ title }: HomeCourseSectionProps): JSX.Element {
  return (
    <section className="home-course-section">
      <div className="home-course-section__inner">
        <div className="home-course-section__header">
          <h2 className="home-course-section__title">{title}</h2>
          <button type="button" className="home-course-section__more" aria-label={`${title} 더보기`}>
            {'>'} 더보기
          </button>
        </div>

        <div className="home-course-section__grid">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="home-course-card">
              <div className="home-course-card__thumb home-course-card__skeleton" />
              <div className="home-course-card__body">
                <div className="home-course-card__skeleton-line home-course-card__skeleton-line--title" />
                <div className="home-course-card__skeleton-line home-course-card__skeleton-line--sub" />
                <div className="home-course-card__skeleton-line home-course-card__skeleton-line--price" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
