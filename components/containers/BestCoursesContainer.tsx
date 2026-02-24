/**
 * 베스트 강의 컨테이너 (BestCoursesContainer)
 * - "가장 인기있는 베스트 강의" 타이틀 + 칩 필터 + 카드 그리드를 조립한다
 * - 서버 컴포넌트에서 데이터를 로드하여 클라이언트 컴포넌트에 전달한다
 */

import type { JSX } from 'react';
import { getBestCourses, getBestChipCategories } from '@/lib/data';
import BestChipFilter from '@/components/courses/BestChipFilter';

export default function BestCoursesContainer(): JSX.Element {
  const courses = getBestCourses();
  const categories = getBestChipCategories();

  return (
    <div className="best-page">
      <div className="best-page__header">
        <h2 className="best-page__title">
          가장 인기있는 베스트 강의
          <span className="best-page__info-icon" aria-label="안내">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span className="best-page__tooltip">
              &lsquo;가장 인기있는 베스트 강의&rsquo;는 카테고리별 최근 7일간 상품조회수와 만족도를 기반으로 추천됩니다.
            </span>
          </span>
        </h2>
      </div>

      <BestChipFilter categories={categories} courses={courses} />
    </div>
  );
}
