/**
 * (admin) 관리자 영역 공통 레이아웃
 * - 사이드바(내비게이션) + 메인 콘텐츠 영역으로 구성된다
 * - app/(admin)/ 하위 모든 페이지에 공통 적용된다
 * - URL에는 (admin)이 노출되지 않는 Route Group이다
 */

import type { JSX, ReactNode } from 'react';
import { getPageData } from '@/lib/data';

interface AdminLayoutProps {
  children: ReactNode;
}

interface AdminLayoutData {
  title: string;
  navLabel: string;
  navAriaLabel: string;
  menuItems: { label: string; href: string; ariaLabel: string }[];
}

export default function AdminLayout({ children }: AdminLayoutProps): JSX.Element {
  const adminData = getPageData('admin') as { layout: AdminLayoutData } | null;
  const layout = adminData?.layout;

  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <h2 className="admin-layout__sidebar-title">{layout?.title}</h2>
        <nav aria-label={layout?.navAriaLabel}>
          <ul className="admin-layout__nav-list">
            {layout?.menuItems.map((item) => (
              <li key={item.href}>
                <a
                  className="admin-layout__nav-link"
                  href={item.href}
                  aria-label={item.ariaLabel}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="admin-layout__content">{children}</main>
    </div>
  );
}
