/**
 * 커뮤니티 왼쪽 사이드바 (CommunitySidebar)
 * - 프로필 카드(아바타, 닉네임, 인증뱃지, 팔로워, stats)
 * - 접이식(collapsible) 네비게이션 메뉴 — data 기반 렌더링
 */

'use client';

import { useState } from 'react';
import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useCommunityStore from '@/stores/useCommunityStore';
import mainData from '@/data';
import type { SidebarNavSection } from '@/types';

const { sidebarProfile, sidebarNav, verifiedBadge } = mainData.community;
const dummyUser = sidebarProfile.dummyUser;

interface CommunitySidebarProps {
  /** 드로어 내부에서 렌더링 여부 */
  inDrawer?: boolean;
  /** 드로어 내부 항목 클릭 시 드로어 닫기 콜백 */
  onNavigate?: () => void;
}

export default function CommunitySidebar({ inDrawer, onNavigate }: CommunitySidebarProps = {}): JSX.Element {
  const activeCategory = useCommunityStore((s) => s.activeCategory);
  const setActiveCategory = useCommunityStore((s) => s.setActiveCategory);

  const handleSelect = (category: string) => {
    setActiveCategory(category);
    onNavigate?.();
  };

  return (
    <aside
      className={`community-sidebar${inDrawer ? ' community-sidebar--in-drawer' : ''}`}
      aria-label={sidebarProfile.profileAriaLabel}
    >
      <div className="community-sidebar__sticky">
        {/* 프로필 카드 */}
        <div className="community-sidebar__profile-card">
          <div className="community-sidebar__avatar-wrap">
            {dummyUser?.profileImage ? (
              <Image
                src={dummyUser.profileImage}
                alt={`${dummyUser.nickname} 프로필`}
                width={72}
                height={72}
                className="community-sidebar__avatar"
              />
            ) : (
              <div className="community-sidebar__avatar community-sidebar__avatar--placeholder" />
            )}
          </div>

          {dummyUser ? (
            <>
              <div className="community-sidebar__user-info">
                <div className="community-sidebar__name-row">
                  <span className="community-sidebar__nickname">{dummyUser.nickname}</span>
                  {dummyUser.verified && (
                    <Image
                      src={verifiedBadge.src}
                      alt={verifiedBadge.alt}
                      width={16}
                      height={16}
                      className="community-sidebar__verified-badge"
                    />
                  )}
                </div>
                <span className="community-sidebar__follower-count">{dummyUser.followerCount}</span>
              </div>

              <div className="community-sidebar__stats">
                {sidebarProfile.stats.map((stat) => (
                  <div key={stat.key} className="community-sidebar__stat">
                    <span className="community-sidebar__stat-label">{stat.label}</span>
                    <span className="community-sidebar__stat-value">
                      {dummyUser.statValues[stat.key] ?? '-'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <span className="community-sidebar__login-label">{sidebarProfile.loginLabel}</span>
          )}
        </div>

        {/* 네비게이션 메뉴 — data 기반 렌더링 */}
        <nav className="community-sidebar__nav">
          {sidebarNav.map((section) => (
            <SidebarNavItem
              key={section.id}
              section={section}
              activeCategory={activeCategory}
              onSelect={handleSelect}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}

/** 사이드바 네비게이션 아이템 — collapsible 지원 */
function SidebarNavItem({
  section,
  activeCategory,
  onSelect,
}: {
  section: SidebarNavSection;
  activeCategory: string;
  onSelect: (category: string) => void;
}): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const isActive =
    activeCategory === section.title ||
    section.items.some((item) => activeCategory === item.label);

  const hasChildren = section.items.length > 0;
  const isCollapsible = section.collapsible && hasChildren;

  const handleClick = () => {
    onSelect(section.title);
    if (isCollapsible) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className="community-sidebar__section">
      {section.href && !hasChildren ? (
        <Link
          href={section.href}
          className={`community-sidebar__section-title${isActive ? ' community-sidebar__section-title--active' : ''}`}
          onClick={() => onSelect(section.title)}
        >
          <span className="community-sidebar__section-icon">{section.icon}</span>
          {section.title}
        </Link>
      ) : (
        <button
          type="button"
          className={`community-sidebar__section-title${isActive ? ' community-sidebar__section-title--active' : ''}`}
          onClick={handleClick}
          aria-expanded={isCollapsible ? isOpen : undefined}
        >
          <span className="community-sidebar__section-icon">{section.icon}</span>
          <span className="community-sidebar__section-label">{section.title}</span>
          {isCollapsible && (
            <span className={`community-sidebar__chevron${isOpen ? ' community-sidebar__chevron--open' : ''}`} aria-hidden="true">
              ›
            </span>
          )}
        </button>
      )}

      {isCollapsible && isOpen && (
        <ul className="community-sidebar__list">
          {section.items.map((item) => (
            <li key={item.id} className="community-sidebar__list-item">
              <button
                type="button"
                className={`community-sidebar__link${activeCategory === item.label ? ' community-sidebar__link--active' : ''}`}
                onClick={() => onSelect(item.label)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
