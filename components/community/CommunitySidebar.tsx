/**
 * 커뮤니티 왼쪽 사이드바 (CommunitySidebar)
 * - 프로필 영역 + 네비게이션 메뉴
 * - 현재 선택된 카테고리를 하이라이팅 표시한다
 * - 사이드바 네비게이션은 data 기반으로 렌더링한다 (추후 admin에서 관리)
 */

'use client';

import type { JSX } from 'react';
import MyPostsButton from '@/components/community/MyPostsButton';
import useCommunityStore from '@/stores/useCommunityStore';
import mainData from '@/data';
import type { SidebarNavSection } from '@/types';

const { sidebarNav, sidebar } = mainData.community;

export default function CommunitySidebar(): JSX.Element {
  const activeCategory = useCommunityStore((s) => s.activeCategory);
  const setActiveCategory = useCommunityStore((s) => s.setActiveCategory);

  /** 섹션 타이틀이 활성 상태인지 (직접 선택 또는 하위 아이템 선택) */
  const isSectionActive = (section: SidebarNavSection) =>
    activeCategory === section.title ||
    section.items.some((item) => activeCategory === item.label);

  return (
    <aside className="community-sidebar">
      <div className="community-sidebar__sticky">
      {/* 프로필 영역 */}
      <div className="community-sidebar__profile">
        <div className="community-sidebar__avatar community-sidebar__skeleton-circle" />
        <span className="community-sidebar__login-label">{sidebar.loginLabel}</span>
        <MyPostsButton />
      </div>

      {/* 네비게이션 메뉴 — data 기반 렌더링 */}
      <nav className="community-sidebar__nav">
        {sidebarNav.map((section) => (
          <div key={section.id} className="community-sidebar__section">
            <button
              type="button"
              className={`community-sidebar__section-title${
                isSectionActive(section) ? ' community-sidebar__section-title--active' : ''
              }`}
              onClick={() => setActiveCategory(section.title)}
            >
              <span className="community-sidebar__section-icon">{section.icon}</span>
              {section.title}
            </button>
            {section.items.length > 0 && (
              <ul className="community-sidebar__list">
                {section.items.map((item) => (
                  <li key={item.id} className="community-sidebar__list-item">
                    <button
                      type="button"
                      className={`community-sidebar__link${
                        activeCategory === item.label ? ' community-sidebar__link--active' : ''
                      }`}
                      onClick={() => setActiveCategory(item.label)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
      </div>
    </aside>
  );
}
