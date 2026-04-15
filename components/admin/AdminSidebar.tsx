/**
 * 관리자 사이드바 (AdminSidebar)
 * - 그룹별 메뉴 + 사이트로 돌아가기 링크
 * - 현재 경로 활성화 표시
 */

'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuthStore, { selectIsAdmin } from '@/stores/useAuthStore';

interface AdminMenuItem {
  label: string;
  href: string;
  ariaLabel: string;
}

interface AdminMenuGroup {
  label: string;
  items: AdminMenuItem[];
}

interface AdminSidebarProps {
  title: string;
  navAriaLabel: string;
  /** ADMIN 전용 메뉴 */
  adminMenuGroups: AdminMenuGroup[];
  /** INSTRUCTOR 가 볼 메뉴 (ADMIN 도 함께 볼 수 있음) */
  instructorMenuGroups: AdminMenuGroup[];
  backToSiteLabel: string;
  backToSiteHref: string;
  backToSiteAriaLabel: string;
}

export default function AdminSidebar({
  title,
  navAriaLabel,
  adminMenuGroups,
  instructorMenuGroups,
  backToSiteLabel,
  backToSiteHref,
  backToSiteAriaLabel,
}: AdminSidebarProps): JSX.Element {
  const pathname = usePathname();
  const isAdmin = useAuthStore(selectIsAdmin);
  const menuGroups = isAdmin
    ? [...instructorMenuGroups, ...adminMenuGroups]
    : instructorMenuGroups;

  return (
    <aside className="admin-layout__sidebar">
      <h2 className="admin-layout__sidebar-title">{title}</h2>
      <nav aria-label={navAriaLabel}>
        {menuGroups.map((group) => (
          <div key={group.label} className="admin-layout__nav-group">
            <h3 className="admin-layout__nav-group-label">{group.label}</h3>
            <ul className="admin-layout__nav-list">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-label={item.ariaLabel}
                      aria-current={isActive ? 'page' : undefined}
                      className={`admin-layout__nav-link${isActive ? ' is-active' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <Link
        href={backToSiteHref}
        aria-label={backToSiteAriaLabel}
        className="admin-layout__back-link"
      >
        {backToSiteLabel}
      </Link>
    </aside>
  );
}
