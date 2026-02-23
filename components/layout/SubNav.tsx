/**
 * 서브 내비게이션 래퍼 (SubNav)
 * - 하단 탭바(GlobalNav)를 감싸며, 현재 경로에 따라 표시 여부를 제어한다
 * - /community 경로에서는 하단 탭바를 숨긴다
 */

'use client';

import { usePathname } from 'next/navigation';
import type { JSX, ReactNode } from 'react';

interface SubNavProps {
  children: ReactNode;
}

export default function SubNav({ children }: SubNavProps): JSX.Element | null {
  const pathname = usePathname();

  if (pathname.startsWith('/community')) {
    return null;
  }

  return (
    <div className="app-header__sub-nav">
      <div className="app-header__sub-nav-inner">
        {children}
      </div>
    </div>
  );
}
