/**
 * 홈 카테고리 아이콘 네비게이션 (HomeCategoryNav)
 * - 배너 아래 원형 SVG 아이콘 + 라벨로 구성된 카테고리 바로가기
 * - 데이터는 homeData.json → getHomeCategories()에서 로드
 */

import type { JSX } from 'react';
import Link from 'next/link';
import type { HomeCategorySection } from '@/types';
import CategoryIcon from './CategoryIcon';

interface HomeCategoryNavProps {
  section: HomeCategorySection;
}

export default function HomeCategoryNav({ section }: HomeCategoryNavProps): JSX.Element {
  const { meta, items } = section;

  return (
    <nav className="home-categories" aria-label={meta.ariaLabel}>
      <div className="home-categories__inner">
        {items.map((item) => (
          <Link key={item.label} href={item.href} className="home-categories__item" aria-label={item.ariaLabel}>
            <CategoryIcon icon={item.icon} className="home-categories__icon" />
            <span className="home-categories__label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
