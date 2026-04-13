/**
 * 마이페이지 왼쪽 사이드바 (MyPageSidebar)
 * - Link 기반 라우트 네비게이션
 */

'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import accountData from '@/data/accountData.json';

const mypageData = accountData.mypage;

type MenuItem = { label: string; href: string };

const menuItemMap: Record<string, MenuItem> = {};
for (const [key, val] of Object.entries(mypageData.sidebar.menuItems)) {
  const item = val as unknown as MenuItem;
  menuItemMap[key] = item;
}

const externalLinkMap: Record<string, string> = {};
mypageData.sidebar.externalLinks.forEach((link) => {
  externalLinkMap[link.key] = link.href;
});

function getItemLabel(key: string): string {
  if (menuItemMap[key]) return menuItemMap[key].label;
  const extLink = mypageData.sidebar.externalLinks.find((l) => l.key === key);
  if (extLink) return extLink.label;
  if (key === 'logout') return mypageData.sidebar.logoutLabel;
  return key;
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/mypage') return pathname === '/mypage';
  return pathname.startsWith(href);
}

export default function MyPageSidebar(): JSX.Element {
  const pathname = usePathname();
  const menuGroups = mypageData.sidebar.menuGroups;

  return (
    <aside className="mypage-sidebar">
      <div className="mypage-sidebar__sticky">
        <nav className="mypage-sidebar__nav">
          {menuGroups.map((group) => (
            <div key={group.section} className="mypage-sidebar__menu-section">
              <span className="mypage-sidebar__menu-heading">{group.section}</span>
              <ul className="mypage-sidebar__menu-list">
                {group.items.map((itemKey) => {
                  const label = getItemLabel(itemKey);
                  const externalHref = externalLinkMap[itemKey];
                  const menuItem = menuItemMap[itemKey];

                  if (externalHref) {
                    return (
                      <li key={itemKey} className="mypage-sidebar__menu-item">
                        <Link href={externalHref} className="mypage-sidebar__menu-link">
                          {label}
                        </Link>
                      </li>
                    );
                  }

                  if (menuItem) {
                    const active = isActive(pathname, menuItem.href);
                    return (
                      <li key={itemKey} className="mypage-sidebar__menu-item">
                        <Link
                          href={menuItem.href}
                          className={`mypage-sidebar__menu-link${active ? ' mypage-sidebar__menu-link--active' : ''}`}
                        >
                          {label}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={itemKey} className="mypage-sidebar__menu-item">
                      <button type="button" className="mypage-sidebar__menu-link">
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
