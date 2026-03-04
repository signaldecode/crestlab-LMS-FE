/**
 * 앱 공통 헤더 (AppHeader)
 * - 2줄 구조: 상단바(로고 + 섹션탭 + 검색 + 인증) / 하단 탭바(GlobalNav)
 * - 하단 탭바는 SubNav로 감싸 /community 경로에서 숨긴다
 */

import type { JSX } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/common/AppLogo';
import TopBarNav from '@/components/layout/TopBarNav';
import GlobalNav from '@/components/layout/GlobalNav';
import SubNav from '@/components/layout/SubNav';
import { getNavData } from '@/lib/data';

export default function AppHeader(): JSX.Element {
  const nav = getNavData();

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

            <button type="button" className="app-header__icon-btn" aria-label="알림">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>

            <Link href="/mypage" className="app-header__classroom-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              내 강의실
            </Link>
          </div>
        </div>
      </div>

      {/* 하단 탭바: 카테고리/부동산기초/오리지널 등 (커뮤니티 경로에서 숨김) */}
      <SubNav>
        <GlobalNav />
      </SubNav>
    </header>
  );
}
// 내게 맞는 강의 찾기는 삭제할듯 -> AI연결해야해서