/**
 * 관리자 사이드바 (AdminSidebar)
 * - 그룹별 메뉴 + 사이트로 돌아가기 링크
 * - 현재 경로 활성화 표시
 * - 모바일에서는 오프캔버스 드로어로 동작 (햄버거 버튼 + 백드롭)
 */

'use client';

import { useState } from 'react';
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
  /** INSTRUCTOR 전용 메뉴 */
  instructorMenuGroups: AdminMenuGroup[];
  backToSiteLabel: string;
  backToSiteHref: string;
  backToSiteAriaLabel: string;
  menuOpenAriaLabel: string;
  menuCloseAriaLabel: string;
}

export default function AdminSidebar({
  title,
  navAriaLabel,
  adminMenuGroups,
  instructorMenuGroups,
  backToSiteLabel,
  backToSiteHref,
  backToSiteAriaLabel,
  menuOpenAriaLabel,
  menuCloseAriaLabel,
}: AdminSidebarProps): JSX.Element {
  const pathname = usePathname();
  const isAdmin = useAuthStore(selectIsAdmin);
  const [isOpen, setIsOpen] = useState(false);

  const menuGroups = isAdmin ? adminMenuGroups : instructorMenuGroups;

  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      <header className="admin-layout__topbar">
        <button
          type="button"
          className="admin-layout__menu-btn"
          aria-label={menuOpenAriaLabel}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          <span className="admin-layout__menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        <p className="admin-layout__topbar-title">{title}</p>
      </header>

      <div
        className={`admin-layout__backdrop${isOpen ? ' is-open' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside className={`admin-layout__sidebar${isOpen ? ' is-open' : ''}`}>
        <button
          type="button"
          className="admin-layout__sidebar-close"
          aria-label={menuCloseAriaLabel}
          onClick={closeDrawer}
        >
          ×
        </button>
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
                        onClick={closeDrawer}
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
          onClick={closeDrawer}
        >
          {backToSiteLabel}
        </Link>
      </aside>
    </>
  );
}
