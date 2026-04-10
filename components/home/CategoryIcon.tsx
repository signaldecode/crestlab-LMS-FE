/**
 * 카테고리 SVG 아이콘 (CategoryIcon)
 * - icon 식별자에 따라 컬러 배경 + 화이트 아이콘 조합의 둥근 사각형을 렌더링
 * - 배경색은 각 아이콘별 고유 컬러, 아이콘은 간결한 24×24 스타일
 */

import type { JSX } from 'react';

interface CategoryIconProps {
  icon: string;
  className?: string;
}

interface IconDef {
  bg: string;
  svg: JSX.Element;
}

const icons: Record<string, IconDef> = {
  document: {
    bg: '#FEE2E2',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="5" y="3" width="14" height="18" rx="2" fill="#E11D48" />
        <path d="M9 8h6M9 12h4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  settings: {
    bg: '#EDE9FE',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="#7C3AED" strokeWidth="2" />
        <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.42 1.42M8.35 15.65l-1.42 1.42m12.14 0l-1.42-1.42M8.35 8.35L6.93 6.93" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  pin: {
    bg: '#FEE2E2',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M16 3H8l-1 8h2l-1 10 6-8h-2l4-10z" fill="#E11D48" />
      </svg>
    ),
  },
  play: {
    bg: '#EDE9FE',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" fill="#7C3AED" />
        <polygon points="10,8.5 10,15.5 16,12" fill="#fff" />
      </svg>
    ),
  },
  verify: {
    bg: '#DBEAFE',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" fill="#3B82F6" />
        <path d="M8.5 12l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  add: {
    bg: '#DCFCE7',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" fill="#16A34A" />
        <path d="M12 8v8M8 12h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  chat: {
    bg: '#DBEAFE',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H8l-4 3V6z" fill="#3B82F6" />
        <circle cx="9" cy="10" r="1.5" fill="#fff" />
        <circle cx="15" cy="10" r="1.5" fill="#fff" />
      </svg>
    ),
  },
  circle: {
    bg: '#D1FAE5',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" fill="#10B981" />
        <circle cx="12" cy="12" r="3" fill="#fff" opacity="0.6" />
      </svg>
    ),
  },
};

const defaultIcon = icons.document;

export default function CategoryIcon({ icon, className }: CategoryIconProps): JSX.Element {
  const def = icons[icon] ?? defaultIcon;

  return (
    <span className={className} aria-hidden="true" style={{ backgroundColor: def.bg }}>
      {def.svg}
    </span>
  );
}
