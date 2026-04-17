/**
 * 테이블 행을 클릭/키보드로 활성화해 상세 페이지로 이동시키는 헬퍼 훅 (useNavigableRow)
 * - <tr>에 spread하여 사용한다.
 * - 행 내부 인터랙티브 요소(버튼/링크/인풋 등) 클릭 시에는 네비게이션이 발생하지 않는다.
 */

'use client';

import { useRouter } from 'next/navigation';
import type { KeyboardEvent, MouseEvent } from 'react';

const INTERACTIVE_SELECTOR = 'button, a, input, select, textarea, [role="button"]';

export interface NavigableRowProps {
  onClick: (e: MouseEvent<HTMLElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
  tabIndex: 0;
  role: 'button';
  'aria-label'?: string;
}

export function useNavigableRow() {
  const router = useRouter();
  return (href: string, ariaLabel?: string): NavigableRowProps => ({
    onClick: (e) => {
      const interactive = (e.target as HTMLElement).closest(INTERACTIVE_SELECTOR);
      if (interactive && interactive !== e.currentTarget) return;
      router.push(href);
    },
    onKeyDown: (e) => {
      if (e.target !== e.currentTarget) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        router.push(href);
      }
    },
    tabIndex: 0,
    role: 'button',
    'aria-label': ariaLabel,
  });
}
