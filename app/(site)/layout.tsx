/**
 * (site) 공개 사이트 공통 레이아웃
 * - 헤더(AppHeader), 푸터(AppFooter), SkipToContent를 포함하는 전역 레이아웃
 * - app/(site)/ 하위 모든 페이지에 공통 적용된다
 * - URL에는 (site)가 노출되지 않는 Route Group이다
 */

import type { JSX, ReactNode } from 'react';
import AppHeader from '@/components/common/AppHeader';
import AppFooter from '@/components/common/AppFooter';
import SkipToContent from '@/components/common/SkipToContent';
import TopBanner from '@/components/common/TopBanner';

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps): JSX.Element {
  return (
    <>
      <SkipToContent />
      {/* <TopBanner /> */}
      <AppHeader />
      <main id="main-content">{children}</main>
      <AppFooter />
    </>
  );
}
