/**
 * (admin) 관리자 영역 공통 레이아웃
 * - 사이드바(내비게이션) + 메인 콘텐츠 영역으로 구성된다
 * - app/(admin)/ 하위 모든 페이지에 공통 적용된다
 * - URL에는 (admin)이 노출되지 않는 Route Group이다
 * - AdminAccessGuard로 ADMIN 역할만 진입 가능
 */

import type { JSX, ReactNode } from 'react';
import AdminAccessGuard from '@/components/admin/AdminAccessGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getPageData } from '@/lib/data';

interface AdminLayoutProps {
  children: ReactNode;
}

interface AdminMenuItem {
  label: string;
  href: string;
  ariaLabel: string;
}

interface AdminMenuGroup {
  label: string;
  items: AdminMenuItem[];
}

interface AdminLayoutData {
  title: string;
  navLabel: string;
  navAriaLabel: string;
  backToSiteLabel: string;
  backToSiteHref: string;
  backToSiteAriaLabel: string;
  accessDeniedTitle: string;
  accessDeniedMessage: string;
  accessDeniedActionLabel: string;
  menuGroups: AdminMenuGroup[];
}

export default function AdminLayout({ children }: AdminLayoutProps): JSX.Element {
  const adminData = getPageData('admin') as { layout: AdminLayoutData } | null;
  const layout = adminData?.layout;

  if (!layout) {
    return <main className="admin-layout__content">{children}</main>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar
        title={layout.title}
        navAriaLabel={layout.navAriaLabel}
        menuGroups={layout.menuGroups}
        backToSiteLabel={layout.backToSiteLabel}
        backToSiteHref={layout.backToSiteHref}
        backToSiteAriaLabel={layout.backToSiteAriaLabel}
      />
      <main className="admin-layout__content">
        <AdminAccessGuard
          deniedTitle={layout.accessDeniedTitle}
          deniedMessage={layout.accessDeniedMessage}
          actionLabel={layout.accessDeniedActionLabel}
          actionHref={layout.backToSiteHref}
        >
          {children}
        </AdminAccessGuard>
      </main>
    </div>
  );
}
