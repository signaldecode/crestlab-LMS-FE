/**
 * 글로벌 내비게이션 (GlobalNav)
 * - 헤더 내부의 주요 메뉴 링크를 렌더링한다
 * - main(카테고리/베스트/신규/이벤트/커뮤니티) + user(내 강의실/장바구니) + auth(로그인/회원가입)
 * - 메뉴 항목은 data에서 가져온다
 */

import type { JSX } from 'react';
import Link from 'next/link';
import { getNavData } from '@/lib/data';

export default function GlobalNav(): JSX.Element {
  const nav = getNavData();

  return (
    <nav className="global-nav" aria-label="주요 메뉴">
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

        <div className="global-nav__auth">
          <Link
            href={nav.auth.loginHref}
            className="global-nav__auth-link"
            aria-label={nav.auth.loginAriaLabel}
          >
            {nav.auth.loginLabel}
          </Link>
          <Link
            href={nav.auth.signupHref}
            className="global-nav__auth-link global-nav__auth-link--signup"
            aria-label={nav.auth.signupAriaLabel}
          >
            {nav.auth.signupLabel}
          </Link>
        </div>
      </div>
    </nav>
  );
}
