/**
 * 앱 공통 헤더 (AppHeader)
 * - 2줄 구조: 상단바(로고 + 섹션탭 + 검색 + 인증) / 하단 탭바(GlobalNav)
 * - 하단 탭바는 SubNav로 감싸 /community 경로에서 숨긴다
 * - 모바일: 햄버거 버튼으로 SidebarMenu 토글
 */

'use client';

import { useState, useCallback } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/common/AppLogo';
import TopBarNav from '@/components/layout/TopBarNav';
import GlobalNav from '@/components/layout/GlobalNav';
import SubNav from '@/components/layout/SubNav';
import SidebarMenu from '@/components/layout/SidebarMenu';
import { getNavData, getMainData } from '@/lib/data';

export default function AppHeader(): JSX.Element {
  const nav = getNavData();
  const a11yHeader = getMainData().a11y.header as {
    notificationAriaLabel: string;
    myClassroomLabel: string;
    mobileMenuOpenLabel: string;
    mobileMenuCloseLabel: string;
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const openMenu = useCallback(() => setIsMobileMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <header className="app-header" role="banner">
      {/* 상단바: 로고 + 섹션탭 + 검색 + 인증 */}
      <div className="app-header__top-bar">
        <div className="app-header__top-bar-inner">
          <div className="app-header__top-left">
            <AppLogo />
            <TopBarNav items={nav.topBar} />
          </div>

          <div className="app-header__top-right">
            {/* 검색 — 데스크톱에서만 표시 */}
            <div className="app-header__search">
              <svg className="app-header__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                className="app-header__search-input"
                placeholder={nav.search.placeholder}
                aria-label={nav.search.ariaLabel}
              />
            </div>

            {/* 알림 아이콘 */}
            <button type="button" className="app-header__icon-btn" aria-label={a11yHeader.notificationAriaLabel}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>

            {/* 내 강의실 버튼 — 데스크톱에서만 표시 */}
            <Link href="/mypage" className="app-header__classroom-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {a11yHeader.myClassroomLabel}
            </Link>

            {/* 햄버거 메뉴 버튼 — 모바일에서만 표시 */}
            <button
              type="button"
              className="app-header__mobile-toggle"
              aria-label={isMobileMenuOpen ? a11yHeader.mobileMenuCloseLabel : a11yHeader.mobileMenuOpenLabel}
              aria-expanded={isMobileMenuOpen}
              onClick={isMobileMenuOpen ? closeMenu : openMenu}
            >
              {isMobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 하단 탭바: 카테고리/부동산기초/오리지널 등 (커뮤니티 경로에서 숨김) */}
      <SubNav>
        <GlobalNav />
      </SubNav>

      {/* 모바일 사이드바 메뉴 */}
      <SidebarMenu isOpen={isMobileMenuOpen} onClose={closeMenu} />
    </header>
  );
}
