/**
 * 카테고리 메가 메뉴 (CategoryMegaMenu)
 * - navbar "카테고리" 호버 시 펼쳐지는 전체 카테고리 드롭다운
 * - 대분류가 column으로 나열되고, 각 대분류 아래에 소분류가 세로로 나열된다
 * - CSS hover로 동작하므로 서버 컴포넌트로 유지한다
 * - 데이터는 nav.categoryMenu에서 가져온다
 */

import type { JSX } from 'react';
import Link from 'next/link';
import { getNavData } from '@/lib/data';

export default function CategoryMegaMenu(): JSX.Element {
  const { categoryMenu } = getNavData();

  return (
    <div className="category-mega-menu" role="menu" aria-label={categoryMenu.ariaLabel}>
      <div className="category-mega-menu__inner">
        {categoryMenu.groups.map((group) => (
          <div key={group.href} className="category-mega-menu__group">
            <Link
              href={group.href}
              className="category-mega-menu__group-title"
              role="menuitem"
            >
              {group.label}
            </Link>
            <ul className="category-mega-menu__list">
              {group.items.map((item) => (
                <li key={item.href} className="category-mega-menu__item">
                  <Link
                    href={item.href}
                    className="category-mega-menu__link"
                    role="menuitem"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
