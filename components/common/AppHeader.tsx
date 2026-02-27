/**
 * 앱 공통 헤더 (AppHeader)
 * - 2줄 구조: 상단바(로고 + 섹션탭 + 검색 + 인증) / 하단 탭바(GlobalNav)
 * - 하단 탭바는 SubNav로 감싸 /community 경로에서 숨긴다
 */

import type { JSX } from 'react';
import AppLogo from '@/components/common/AppLogo';
import AuthTrigger from '@/components/common/AuthTrigger';
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
              <input
                type="search"
                className="app-header__search-input"
                placeholder={nav.search.placeholder}
                aria-label={nav.search.ariaLabel}
              />
            </div>
            <AuthTrigger
              loginLabel={nav.auth.loginLabel}
              signupLabel={nav.auth.signupLabel}
            />
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