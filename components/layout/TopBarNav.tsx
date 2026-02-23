/**
 * 상단바 섹션 탭 (TopBarNav)
 * - 클래스 / 커뮤니티 등 상단 섹션 링크를 렌더링한다
 * - 현재 경로와 일치하는 탭에 활성(active) 스타일을 적용한다
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { JSX } from 'react';

interface TopBarNavItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

interface TopBarNavProps {
  items: TopBarNavItem[];
}

export default function TopBarNav({ items }: TopBarNavProps): JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="app-header__sections" aria-label="섹션 메뉴">
      {items.map((item) => {
        const isActive =
          item.href === '/'
            ? !pathname.startsWith('/community')
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`app-header__section-link${isActive ? ' app-header__section-link--active' : ''}`}
            aria-label={item.ariaLabel}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
