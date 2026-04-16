/**
 * 마이페이지 왼쪽 사이드바 (MyPageSidebar)
 * - Link 기반 라우트 네비게이션
 * - 모바일(<768px)에서는 드롭다운으로 전환: 현재 활성 항목을 트리거에 표시하고, 탭 시 전체 메뉴를 펼친다
 */

'use client';

import type { JSX } from 'react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import accountData from '@/data/accountData.json';
import ConfirmModal from '../layout/ConfirmModal';
import useAuth from '@/hooks/useAuth';


const mypageData = accountData.mypage;

type MenuItem = { label: string; href: string };

const menuItemMap: Record<string, MenuItem> = {};
for (const [key, val] of Object.entries(mypageData.sidebar.menuItems)) {
  const item = val as unknown as MenuItem;
  menuItemMap[key] = item;
}

function getItemLabel(key: string): string {
  if (menuItemMap[key]) return menuItemMap[key].label;
  if (key === 'logout') return mypageData.sidebar.logoutLabel;
  return key;
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/mypage') return pathname === '/mypage';
  return pathname.startsWith(href);
}

function getCurrentLabel(pathname: string): string {
  const entries = Object.values(menuItemMap);
  const exact = entries.find((i) => i.href === pathname);
  if (exact) return exact.label;
  const prefix = entries
    .filter((i) => i.href !== '/mypage' && pathname.startsWith(i.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  if (prefix) return prefix.label;
  if (pathname === '/mypage') return menuItemMap.myCourses?.label ?? '';
  return mypageData.sidebar.mobileMenuDefaultLabel;
}

export default function MyPageSidebar(): JSX.Element {
  const pathname = usePathname();
  const { logout } = useAuth();
  const menuGroups = mypageData.sidebar.menuGroups;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  const handleLogoutConfirm = async () => {
    setIsModalOpen(false);
    await logout();
    window.location.href = '/';
  };

  /* 경로 변경 시 모바일 드롭다운 닫기 */
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  /* 외부 클릭 / ESC 로 닫기 */
  useEffect(() => {
    if (!isMobileOpen) return;
    const handlePointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsMobileOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isMobileOpen]);

  const currentLabel = getCurrentLabel(pathname);

  return (
    <aside
      className={`mypage-sidebar${isMobileOpen ? ' mypage-sidebar--mobile-open' : ''}`}
      ref={rootRef}
    >
      <div className="mypage-sidebar__sticky">
        <button
          type="button"
          className="mypage-sidebar__mobile-trigger"
          aria-label={mypageData.sidebar.mobileMenuAriaLabel}
          aria-expanded={isMobileOpen}
          aria-controls="mypage-sidebar-nav"
          onClick={() => setIsMobileOpen((v) => !v)}
        >
          <span className="mypage-sidebar__mobile-trigger-label">{currentLabel}</span>
          <ChevronDown />
        </button>

        <nav id="mypage-sidebar-nav" className="mypage-sidebar__nav">
          {menuGroups.map((group) => (
            <div key={group.section} className="mypage-sidebar__menu-section">
              <span className="mypage-sidebar__menu-heading">{group.section}</span>
              <ul className="mypage-sidebar__menu-list">
                {group.items.map((itemKey) => {
                  const label = getItemLabel(itemKey);
                  const menuItem = menuItemMap[itemKey];

                  if (menuItem) {
                    const active = isActive(pathname, menuItem.href);
                    return (
                      <li key={itemKey} className="mypage-sidebar__menu-item">
                        <Link
                          href={menuItem.href}
                          className={`mypage-sidebar__menu-link${active ? ' mypage-sidebar__menu-link--active' : ''}`}
                          onClick={() => setIsMobileOpen(false)}
                        >
                          {label}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={itemKey} className="mypage-sidebar__menu-item">
                      <button
                        type="button"
                        className="mypage-sidebar__menu-link"
                        onClick={() => {
                          if (itemKey === 'logout') setIsModalOpen(true);
                        }}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <ConfirmModal
          isOpen={isModalOpen}
          message={mypageData.sidebar.logoutModalMessage}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={() => { void handleLogoutConfirm(); }}
        />

      </div>
    </aside>
  );
}

function ChevronDown() {
  return (
    <svg
      className="mypage-sidebar__mobile-trigger-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
