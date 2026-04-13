/**
 * 앱 공통 헤더 (AppHeader)
 * - 1줄 구조: 로고 + 강의 드롭다운(메가메뉴) + 글로벌 내비게이션 + 검색 + 인증
 * - 모바일: 사이드바 메뉴
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/common/AppLogo';
import AuthTrigger from '@/components/common/AuthTrigger';
import GlobalNav from '@/components/layout/GlobalNav';
import CategoryMenuTrigger from '@/components/layout/CategoryMenuTrigger';
import CategoryMegaMenu from '@/components/layout/CategoryMegaMenu';
import SidebarMenu from '@/components/layout/SidebarMenu';
import NotificationDrawer from '@/components/common/NotificationDrawer';
import useAuthStore from '@/stores/useAuthStore';
import useNotificationStore from '@/stores/useNotificationStore';
import { getNavData, getMainData } from '@/lib/data';
import type { NotificationData } from '@/types';

export default function AppHeader(): JSX.Element {
  const nav = getNavData();
  const mainData = getMainData();
  const a11yHeader = mainData.a11y.header as {
    notificationAriaLabel: string;
    myClassroomLabel: string;
    mobileMenuOpenLabel: string;
    mobileMenuCloseLabel: string;
  };
  const notifUi = mainData.ui.notification as {
    badgeAriaLabel: string;
    mockNotifications: NotificationData[];
  };

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const toggleNotification = useNotificationStore((s) => s.toggle);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const openMenu = useCallback(() => setIsMobileMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  useEffect(() => {
    if (notifUi.mockNotifications) {
      setNotifications(notifUi.mockNotifications);
    }
  }, [notifUi.mockNotifications, setNotifications]);

  return (
    <header className="app-header" role="banner">
      <div className="app-header__top-bar">
        <div className="app-header__top-bar-inner">
          {/* 좌측: 로고 + 강의 드롭다운 + 네비 (데스크톱) / 로고만 (태블릿 이하) */}
          <div className="app-header__left">
            <AppLogo />

            {/* 강의 카테고리 드롭다운 (메가 메뉴) — 데스크톱에서만 표시 */}
            <nav className="global-nav global-nav--course-trigger" aria-label={nav.courseDropdown.ariaLabel}>
              <ul className="global-nav__list">
                <CategoryMenuTrigger
                  label={nav.courseDropdown.label}
                  href={nav.courseDropdown.href}
                  ariaLabel={nav.courseDropdown.ariaLabel}
                  showHamburger
                >
                  <CategoryMegaMenu />
                </CategoryMenuTrigger>
              </ul>
            </nav>

            {/* 글로벌 네비게이션 — 데스크톱에서만 표시 */}
            <GlobalNav />
          </div>

          {/* 우측: 검색 + 인증 (데스크톱) / 햄버거 (태블릿 이하) */}
          <div className="app-header__right">
            {/* 햄버거 버튼 — 태블릿 이하에서만 표시 */}
            <button
              type="button"
              className="app-header__hamburger"
              aria-label={isMobileMenuOpen ? a11yHeader.mobileMenuCloseLabel : a11yHeader.mobileMenuOpenLabel}
              aria-expanded={isMobileMenuOpen}
              onClick={isMobileMenuOpen ? closeMenu : openMenu}
            >
              {isMobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M20 8L8 20" />
                  <path d="M8 8l12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5.33 7h17.33" />
                  <path d="M5.33 14h17.33" />
                  <path d="M5.33 21h17.33" />
                </svg>
              )}
            </button>

            <div className="app-header__search">
              <input
                type="search"
                className="app-header__search-input"
                placeholder={nav.search.placeholder}
                aria-label={nav.search.ariaLabel}
              />
              <svg className="app-header__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="8" stroke="#999999" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" stroke="#999999" strokeWidth="2" />
              </svg>
            </div>

            {isLoggedIn ? (
              <Link href="/mypage" className="app-header__classroom-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {a11yHeader.myClassroomLabel}
              </Link>
            ) : (
              <AuthTrigger
                loginLabel={nav.auth.loginLabel}
                signupLabel={nav.auth.signupLabel}
              />
            )}
          </div>
        </div>
      </div>

      {/* 사이드바 오버레이 메뉴 — 태블릿 이하 */}
      <SidebarMenu isOpen={isMobileMenuOpen} onClose={closeMenu} />
    </header>
  );
}
