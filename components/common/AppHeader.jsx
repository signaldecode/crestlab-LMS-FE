/**
 * 앱 공통 헤더 (AppHeader)
 * - 사이트 전역에서 항상 표시되는 최상단 헤더
 * - 로고(AppLogo), 글로벌 내비게이션(GlobalNav)을 포함한다
 * - 텍스트/라벨은 data에서 가져온다
 */

import AppLogo from '@/components/common/AppLogo';
import GlobalNav from '@/components/layout/GlobalNav';

export default function AppHeader() {
  return (
    <header className="app-header" role="banner">
      <AppLogo />
      <GlobalNav />
    </header>
  );
}
