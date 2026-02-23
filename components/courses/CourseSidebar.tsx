/**
 * 강의 사이드바 필터 (CourseSidebar)
 * - 왼쪽 사이드바에 카테고리 필터 탭을 아코디언 형태로 표시한다
 * - 메가 메뉴(categoryMenu.groups)와 동일한 카테고리 구조를 사용한다
 * - 현재 URL의 category/sub 파라미터에 따라 활성 탭을 굵게 표시한다
 * - 활성 카테고리는 기본 펼침, 나머지는 접힌 상태
 */

'use client';

import { useState, useCallback, type JSX } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getNavData } from '@/lib/data';

export default function CourseSidebar(): JSX.Element {
  const { categoryMenu } = getNavData();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') ?? '';
  const activeSub = searchParams.get('sub') ?? '';

  // 한 번에 하나만 펼침 — 활성 카테고리를 기본값으로
  const [openGroup, setOpenGroup] = useState<string | null>(() => {
    for (const group of categoryMenu.groups) {
      const url = new URL(group.href, 'http://x');
      if (url.searchParams.get('category') === activeCategory) {
        return group.href;
      }
    }
    return null;
  });

  const toggleGroup = useCallback((href: string) => {
    setOpenGroup((prev) => (prev === href ? null : href));
  }, []);

  return (
    <aside className="course-sidebar" aria-label="강의 필터">
      <nav className="course-sidebar__nav">
        <ul className="course-sidebar__list">
          {categoryMenu.groups.map((group) => {
            const groupUrl = new URL(group.href, 'http://x');
            const isGroupActive = groupUrl.searchParams.get('category') === activeCategory;
            const isOpen = openGroup === group.href;

            return (
              <li key={group.href} className="course-sidebar__group">
                <button
                  type="button"
                  className={`course-sidebar__group-title${isGroupActive ? ' course-sidebar__group-title--active' : ''}`}
                  onClick={() => toggleGroup(group.href)}
                  aria-expanded={isOpen}
                >
                  <span>{group.label}</span>
                  <span className={`course-sidebar__chevron${isOpen ? ' course-sidebar__chevron--open' : ''}`} aria-hidden="true">
                    &#8250;
                  </span>
                </button>
                {isOpen && (
                  <ul className="course-sidebar__sub-list">
                    {group.items.map((item) => {
                      const itemUrl = new URL(item.href, 'http://x');
                      const isSubActive =
                        isGroupActive && itemUrl.searchParams.get('sub') === activeSub;

                      return (
                        <li key={item.href} className="course-sidebar__sub-item">
                          <Link
                            href={item.href}
                            className={`course-sidebar__sub-link${isSubActive ? ' course-sidebar__sub-link--active' : ''}`}
                            aria-current={isSubActive ? 'page' : undefined}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
