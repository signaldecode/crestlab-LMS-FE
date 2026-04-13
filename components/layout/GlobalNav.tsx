/**
 * 글로벌 내비게이션 (GlobalNav)
 * - 헤더 좌측에 위치하는 메인 메뉴 링크를 렌더링한다
 * - 피그마 기준: 회사소개 / 주식 / 가상자산 / 부동산 / 강사
 */

import type { JSX } from 'react';
import Link from 'next/link';
import { getNavData } from '@/lib/data';
import siteData from '@/data/siteData.json';

export default function GlobalNav(): JSX.Element {
  const nav = getNavData();

  return (
    <nav className="global-nav" aria-label={siteData.a11y.nav.mainMenu}>
      <ul className="global-nav__list">
        {nav.main.map((item) => (
          <li key={item.href} className="global-nav__item">
            <Link
              href={item.href}
              className="global-nav__link"
              aria-label={item.ariaLabel}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
