/**
 * 카테고리 메가 메뉴 (CategoryMegaMenu)
 * - navbar "카테고리" 호버 시 펼쳐지는 전체 카테고리 드롭다운
 * - 대분류는 `GET /v1/categories` API에서 받아와 렌더하고, 마지막에 siteData 의
 *   고정 "강사" 그룹을 덧붙인다.
 * - 각 API 카테고리의 href 는 `/courses?categoryId={id}` 로 생성되며
 *   CourseGridContainer 에서 해당 파라미터를 직접 처리한다.
 */

'use client';

import { useEffect, useState, type JSX } from 'react';
import Link from 'next/link';
import { getNavData } from '@/lib/data';
import { fetchUserCategories, type UserCategory } from '@/lib/userApi';
import type { CategoryMenuGroup } from '@/types';

function toNavGroup(category: UserCategory): CategoryMenuGroup {
  return {
    label: category.name,
    href: `/courses?categoryId=${category.id}`,
    items: (category.children ?? []).map((child) => ({
      label: child.name,
      href: `/courses?categoryId=${child.id}`,
    })),
  };
}

export default function CategoryMegaMenu(): JSX.Element {
  const { categoryMenu } = getNavData();
  const [apiGroups, setApiGroups] = useState<CategoryMenuGroup[]>([]);

  // 강사 관련 고정 그룹(기존 siteData 마지막 항목) — API 데이터 뒤에 그대로 덧붙인다.
  const instructorGroup = categoryMenu.groups[categoryMenu.groups.length - 1];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const categories = await fetchUserCategories();
        if (cancelled) return;
        setApiGroups(categories.map(toNavGroup));
      } catch {
        // API 실패 시 빈 배열 유지 — 강사 그룹만 노출된다
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const groups = instructorGroup ? [...apiGroups, instructorGroup] : apiGroups;

  return (
    <div className="category-mega-menu" role="menu" aria-label={categoryMenu.ariaLabel}>
      <div className="category-mega-menu__inner">
        {groups.map((group) => (
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
