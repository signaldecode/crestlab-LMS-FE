/**
 * 홈 카테고리 아이콘 네비게이션 (HomeCategoryNav)
 * - 배너 아래 원형 아이콘 + 라벨로 구성된 카테고리 바로가기
 * - 스켈레톤 UI
 */

import type { JSX } from 'react';

const categories = [
  '첫강의추천',
  '너나위특강',
  '오리지널',
  '블로그부업',
  '직장인부업',
  '내쿠폰',
  '이달의강의',
  '첫구매특가',
  '전문가칼럼',
  '부동산중개',
];

export default function HomeCategoryNav(): JSX.Element {
  return (
    <section className="home-categories">
      <div className="home-categories__inner">
        {categories.map((label) => (
          <a key={label} href="#" className="home-categories__item">
            <div className="home-categories__icon home-categories__skeleton-circle" />
            <span className="home-categories__label">{label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
