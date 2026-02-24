/**
 * 관심 클래스 콘텐츠 (WishlistContent)
 * - 관심 클래스 (찜한 강의) 섹션 + 최근 본 클래스 섹션
 * - 스켈레톤 카드(BestCourseCardSkeleton)로 로딩 상태 표현
 * - 한 줄에 최대 4개 카드 그리드
 * - 사이드바와 함께 사용되며, 오른쪽 콘텐츠 영역만 담당한다
 */

'use client';

import { useState } from 'react';
import type { JSX } from 'react';
import BestCourseCardSkeleton from '@/components/courses/BestCourseCardSkeleton';

const sortOptions = [
  { value: 'recent', label: '최신순' },
  { value: 'rating', label: '평점순' },
  { value: 'title', label: '이름순' },
];

export default function WishlistContent(): JSX.Element {
  const [sort, setSort] = useState('recent');

  return (
    <div className="wishlist">
      {/* 관심 클래스 */}
      <section className="wishlist__section">
        <div className="wishlist__header">
          <h2 className="wishlist__title">관심 클래스</h2>
          <select
            className="wishlist__sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="정렬"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* 빈 상태 */}
        <p className="wishlist__empty">관심 클래스가 없습니다.</p>
      </section>

      {/* 최근 본 클래스 */}
      <section className="wishlist__section">
        <h2 className="wishlist__title">최근 본 클래스</h2>

        <div className="wishlist__grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <BestCourseCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
