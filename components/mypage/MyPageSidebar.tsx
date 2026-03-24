/**
 * 마이페이지 왼쪽 사이드바 (MyPageSidebar)
 * - 커버 이미지 + 아바타 겹침 + 닉네임/배지/역할
 * - 토글 스위치(프로필 ↔ 강의실) — Zustand 전역 상태로 관리
 * - 메뉴 항목 클릭 시 라우트 이동 없이 상태 전환 (SPA 방식)
 * - 타 유저 페이지: 토글 없이 팔로우 버튼
 */

'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useAuthStore from '@/stores/useAuthStore';
import useCouponStore from '@/stores/useCouponStore';
import useMyPageStore from '@/stores/useMyPageStore';
import accountData from '@/data/accountData.json';
import type { ProfileCardData, MyPageSection } from '@/types';

const profileCardData = accountData.profileCard as unknown as ProfileCardData;
const mypageData = accountData.mypage;

/** 메뉴 아이템 키 → 섹션 매핑 (내부 SPA 전환) */
const menuSectionKeys: Record<string, MyPageSection> = {
  myCourses: 'classroom',
  wishlist: 'wishlist',
  coupons: 'coupons',
  giftcards: 'giftcards',
  points: 'points',
  consultations: 'consultations',
  certificates: 'certificates',
  reviews: 'reviews',
  orders: 'orders',
  profileEdit: 'profileEdit',
};

/** 외부 링크 키 → href 매핑 */
const externalLinkMap: Record<string, string> = {};
mypageData.sidebar.externalLinks.forEach((link) => {
  externalLinkMap[link.key] = link.href;
});

interface MyPageSidebarProps {
  /** 타 유저 프로필인지 여부 */
  isOtherUser?: boolean;
}

/** 키로 라벨 텍스트 가져오기 */
function getItemLabel(key: string): string {
  const menuItems = mypageData.sidebar.menuItems as Record<string, string>;
  if (menuItems[key]) return menuItems[key];
  const extLink = mypageData.sidebar.externalLinks.find((l) => l.key === key);
  if (extLink) return extLink.label;
  if (key === 'logout') return mypageData.sidebar.logoutLabel;
  return key;
}

export default function MyPageSidebar({ isOtherUser = false }: MyPageSidebarProps): JSX.Element {
  const authUser = useAuthStore((s) => s.user);
  const couponCount = useCouponStore((s) => s.coupons.length);
  const [isFollowing, setIsFollowing] = useState(false);

  const activeTab = useMyPageStore((s) => s.activeTab);
  const setActiveTab = useMyPageStore((s) => s.setActiveTab);
  const activeSection = useMyPageStore((s) => s.activeSection);
  const setActiveSection = useMyPageStore((s) => s.setActiveSection);

  const menuGroups = activeTab === 'classroom'
    ? mypageData.sidebar.menuGroups.classroom
    : mypageData.sidebar.menuGroups.profile;
  const userName = authUser?.nickname || authUser?.name || mypageData.sidebar.fallbackName;
  const { toggleLabels, profileMode, classroomMode, otherUserMode } = profileCardData;

  const handleToggle = () => {
    const nextTab = activeTab === 'profile' ? 'classroom' : 'profile';
    setActiveTab(nextTab);
    setActiveSection(nextTab);
  };

  const handleMenuClick = (key: string) => {
    const section = menuSectionKeys[key];
    if (section) {
      setActiveSection(section);
    }
  };

  /** 현재 메뉴 아이템이 활성 상태인지 확인 */
  const isMenuActive = (key: string): boolean => {
    const section = menuSectionKeys[key];
    return section ? activeSection === section : false;
  };

  return (
    <aside className="mypage-sidebar">
      <div className="mypage-sidebar__sticky">
        {/* 프로필 카드 */}
        <div className="mypage-sidebar__card">
          {/* 커버 이미지 */}
          <div className="mypage-sidebar__cover">
            {authUser?.profileImage ? (
              <Image
                src={authUser.profileImage}
                alt={profileCardData.coverImageAlt}
                fill
                sizes="300px"
                className="mypage-sidebar__cover-img"
              />
            ) : (
              <div className="mypage-sidebar__cover-placeholder" />
            )}

            {/* 아바타 (커버 하단에 겹침) */}
            <div className="mypage-sidebar__avatar-wrap">
              {authUser?.profileImage ? (
                <Image
                  src={authUser.profileImage}
                  alt={profileCardData.avatarAlt}
                  width={64}
                  height={64}
                  className="mypage-sidebar__avatar-img"
                />
              ) : (
                <div className="mypage-sidebar__avatar mypage-sidebar__avatar--default">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* 이름 + 인증배지 */}
          <div className="mypage-sidebar__identity">
            <div className="mypage-sidebar__name-row">
              <span className="mypage-sidebar__username">{userName}</span>
              <Image
                src={profileCardData.verifiedBadge.src}
                alt={profileCardData.verifiedBadge.alt}
                width={18}
                height={18}
                className="mypage-sidebar__verified-badge"
              />
            </div>

            {/* 역할/소속 + 토글 (같은 줄) */}
            {!isOtherUser && (
              <div className="mypage-sidebar__role-row">
                <span className="mypage-sidebar__role">
                  {activeTab === 'profile'
                    ? profileMode.roleLabel
                    : authUser?.bio
                      ? `${classroomMode.affiliationPrefix}${authUser.bio}`
                      : profileMode.roleLabel}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={activeTab === 'classroom'}
                  aria-label={toggleLabels.ariaLabel}
                  className="mypage-sidebar__switch"
                  onClick={handleToggle}
                >
                  <span className="mypage-sidebar__switch-label">
                    {activeTab === 'profile' ? toggleLabels.profile : toggleLabels.classroom}
                  </span>
                  <span className="mypage-sidebar__switch-track">
                    <span className="mypage-sidebar__switch-thumb" />
                  </span>
                </button>
              </div>
            )}
            {isOtherUser && (
              <span className="mypage-sidebar__role">{profileMode.roleLabel}</span>
            )}
          </div>

          {/* 모드별 콘텐츠 (양쪽 모두 렌더, CSS 트랜지션) */}
          {!isOtherUser && (
            <div className="mypage-sidebar__mode-panels">
              {/* 프로필 모드 */}
              <div
                className={`mypage-sidebar__mode-panel${activeTab === 'profile' ? ' mypage-sidebar__mode-panel--active' : ''}`}
                aria-hidden={activeTab !== 'profile'}
              >
                <div className="mypage-sidebar__profile-info">
                  {/* 커뮤니티 레벨 */}
                  <div className="mypage-sidebar__level">
                    <div className="mypage-sidebar__level-header">
                      <span className="mypage-sidebar__level-title">
                        {profileMode.communityLevel.title}
                      </span>
                      <button
                        type="button"
                        className="mypage-sidebar__level-tooltip-btn"
                        aria-label={profileMode.communityLevel.tooltipAriaLabel}
                        tabIndex={activeTab === 'profile' ? 0 : -1}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4M12 8h.01" />
                        </svg>
                      </button>
                    </div>
                    <div className="mypage-sidebar__level-bar">
                      <div
                        className="mypage-sidebar__level-fill"
                        style={{ width: `${profileMode.communityLevel.progressPercent}%` }}
                      />
                    </div>
                    <div className="mypage-sidebar__level-steps">
                      {profileMode.communityLevel.steps.map((step) => (
                        <span key={step} className="mypage-sidebar__level-step">{step}</span>
                      ))}
                    </div>
                  </div>

                  {/* 통계 */}
                  <div className="mypage-sidebar__stats">
                    {profileMode.stats.map((stat) => (
                      <div key={stat.key} className="mypage-sidebar__stat">
                        <span className="mypage-sidebar__stat-label">{stat.label}</span>
                        <span className="mypage-sidebar__stat-num">{stat.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 강의실 모드 */}
              <div
                className={`mypage-sidebar__mode-panel${activeTab === 'classroom' ? ' mypage-sidebar__mode-panel--active' : ''}`}
                aria-hidden={activeTab !== 'classroom'}
              >
                <div className="mypage-sidebar__classroom-info">
                  <div className="mypage-sidebar__info-list">
                    {classroomMode.infoRows.map((row) => (
                      <div key={row.key} className="mypage-sidebar__info-row">
                        <span>{row.label}</span>
                        {row.type === 'badge' && (
                          <span className="mypage-sidebar__info-badge">{row.value}</span>
                        )}
                        {row.type === 'link' && row.href && (
                          <button
                            type="button"
                            className="mypage-sidebar__info-value mypage-sidebar__info-value--link"
                            tabIndex={activeTab === 'classroom' ? 0 : -1}
                            onClick={() => {
                              const section = Object.entries(menuSectionKeys).find(
                                ([, s]) => row.href === `/mypage/${s}`
                              );
                              if (section) setActiveSection(section[1]);
                            }}
                          >
                            {row.key === 'coupons' ? `${couponCount}장` : row.value}
                          </button>
                        )}
                        {row.type === 'text' && (
                          <span className="mypage-sidebar__info-value">{row.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 타 유저 모드 하단 */}
          {isOtherUser && (
            <div className="mypage-sidebar__other-info">
              <div className="mypage-sidebar__other-stats">
                {otherUserMode.infoRows.map((row) => (
                  <div key={row.key} className="mypage-sidebar__other-stat-row">
                    <span className="mypage-sidebar__other-stat-label">{row.label}</span>
                    <span className="mypage-sidebar__other-stat-value">-</span>
                  </div>
                ))}
              </div>

              <div className="mypage-sidebar__other-actions">
                <button
                  type="button"
                  className="mypage-sidebar__share-btn"
                  aria-label={otherUserMode.shareAriaLabel}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`mypage-sidebar__follow-btn${isFollowing ? ' mypage-sidebar__follow-btn--following' : ''}`}
                  aria-label={otherUserMode.followAriaLabel}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  {isFollowing ? otherUserMode.followingLabel : otherUserMode.followLabel}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 메뉴 목록 (본인만) */}
        {!isOtherUser && (
          <nav className="mypage-sidebar__nav">
            {menuGroups.map((group) => (
              <div key={group.section} className="mypage-sidebar__menu-section">
                <span className="mypage-sidebar__menu-heading">{group.section}</span>
                <ul className="mypage-sidebar__menu-list">
                  {group.items.map((itemKey) => {
                    const label = getItemLabel(itemKey);
                    const externalHref = externalLinkMap[itemKey];
                    const section = menuSectionKeys[itemKey];

                    /* 외부 링크 (마이페이지 밖) */
                    if (externalHref) {
                      return (
                        <li key={itemKey} className="mypage-sidebar__menu-item">
                          <Link href={externalHref} className="mypage-sidebar__menu-link">
                            {label}
                          </Link>
                        </li>
                      );
                    }

                    /* 내부 섹션 전환 (SPA) */
                    if (section) {
                      return (
                        <li key={itemKey} className="mypage-sidebar__menu-item">
                          <button
                            type="button"
                            className={`mypage-sidebar__menu-link${isMenuActive(itemKey) ? ' mypage-sidebar__menu-link--active' : ''}`}
                            onClick={() => handleMenuClick(itemKey)}
                          >
                            {label}
                          </button>
                        </li>
                      );
                    }

                    /* 로그아웃 등 특수 버튼 */
                    return (
                      <li key={itemKey} className="mypage-sidebar__menu-item">
                        <button type="button" className="mypage-sidebar__menu-link">
                          {label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        )}
      </div>
    </aside>
  );
}
