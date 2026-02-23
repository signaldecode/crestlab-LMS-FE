/**
 * 홈 히어로 컨테이너 (HomeHeroContainer)
 * - 애니메이션 배너 캐러셀 스켈레톤
 * - 3장의 슬라이드 자리 + 좌우 화살표 + 인디케이터
 */

import type { JSX } from 'react';

export default function HomeHeroContainer(): JSX.Element {
  return (
    <section className="home-hero">
      <div className="home-hero__carousel">
        {/* 메인 슬라이드 스켈레톤 */}
        <div className="home-hero__slide home-hero__skeleton" />

        {/* 좌우 네비게이션 */}
        <button type="button" className="home-hero__arrow home-hero__arrow--prev" aria-label="이전 배너">
          ‹
        </button>
        <button type="button" className="home-hero__arrow home-hero__arrow--next" aria-label="다음 배너">
          ›
        </button>

        {/* 인디케이터 */}
        <div className="home-hero__indicators">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <span
              key={n}
              className={`home-hero__dot${n === 1 ? ' home-hero__dot--active' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
