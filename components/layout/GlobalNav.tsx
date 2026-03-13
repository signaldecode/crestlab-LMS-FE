/**
 * 글로벌 내비게이션 (GlobalNav)
 * - 하단 탭바의 메뉴 링크를 렌더링한다
 * - main(카테고리/부동산기초/오리지널/베스트 등) + user(강사 지원하기)
 * - "카테고리" 항목 hover 시 메가 메뉴 드롭다운이 표시된다
 * - 인증(로그인/회원가입)은 상단바(AppHeader)에서 렌더링한다
 */

import type { JSX } from 'react';
import Link from 'next/link';
import { getNavData } from '@/lib/data';
import siteData from '@/data/siteData.json';
import CategoryMegaMenu from '@/components/layout/CategoryMegaMenu';
import CategoryMenuTrigger from '@/components/layout/CategoryMenuTrigger';

export default function GlobalNav(): JSX.Element {
  const nav = getNavData();

  return (
    <nav className="global-nav" aria-label={siteData.a11y.nav.mainMenu}>
      <ul className="global-nav__list">
        {nav.main.map((item, index) =>
          index === 0 ? (
            <CategoryMenuTrigger
              key={item.href}
              label={item.label}
              href={item.href}
              ariaLabel={item.ariaLabel}
            >
              <CategoryMegaMenu />
            </CategoryMenuTrigger>
          ) : (
            <li key={item.href} className="global-nav__item">
              <Link
                href={item.href}
                className="global-nav__link"
                aria-label={item.ariaLabel}
              >
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>

      <div className="global-nav__right">
        <ul className="global-nav__list">
          {nav.user.map((item) => (
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
      </div>
    </nav>
  );
}
