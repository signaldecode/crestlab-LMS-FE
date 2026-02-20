/**
 * 앱 공통 헤더 (AppHeader)
 * - 사이트 전역에서 항상 표시되는 최상단 헤더
 * - 로고(AppLogo), 글로벌 내비게이션(GlobalNav)을 포함한다
 */

import type { JSX } from 'react';
import AppLogo from '@/components/common/AppLogo';
import GlobalNav from '@/components/layout/GlobalNav';

export default function AppHeader(): JSX.Element {
  return (
    <header className="app-header" role="banner">
      <div className="app-header__inner">
        <AppLogo />
        <GlobalNav />
      </div>
    </header>
  );
}
