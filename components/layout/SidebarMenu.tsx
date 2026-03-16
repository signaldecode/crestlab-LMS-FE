/**
 * 사이드바 메뉴 (SidebarMenu)
 * - 모바일 환경에서 슬라이드 사이드바 형태로 네비게이션을 제공한다
 * - 오버레이 클릭 또는 닫기 버튼으로 닫을 수 있다
 * - Escape 키로 닫기 지원 (키보드 접근성)
 * - data 기반 메뉴 렌더링
 */

'use client';

import { useEffect } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import { getNavData } from '@/lib/data';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps): JSX.Element {
  const nav = getNavData();

  // Escape 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // 스크롤 잠금
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          className="sidebar-menu__overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`sidebar-menu${isOpen ? ' sidebar-menu--open' : ''}`}
        aria-hidden={!isOpen}
        role="dialog"
        aria-label="모바일 메뉴"
      >
        {/* 검색 */}
        <div className="sidebar-menu__search">
          <svg className="sidebar-menu__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            className="sidebar-menu__search-input"
            placeholder={nav.search.placeholder}
            aria-label={nav.search.ariaLabel}
            tabIndex={isOpen ? 0 : -1}
          />
        </div>

        {/* 섹션 탭 (클래스 / 커뮤니티) */}
        <nav className="sidebar-menu__section">
          <ul className="sidebar-menu__list">
            {nav.topBar.map((item) => (
              <li key={item.href} className="sidebar-menu__item">
                <Link
                  href={item.href}
                  className="sidebar-menu__link sidebar-menu__link--section"
                  onClick={onClose}
                  tabIndex={isOpen ? 0 : -1}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 메인 네비게이션 */}
        <nav className="sidebar-menu__section">
          <ul className="sidebar-menu__list">
            {nav.main.map((item) => (
              <li key={item.href} className="sidebar-menu__item">
                <Link
                  href={item.href}
                  className="sidebar-menu__link"
                  onClick={onClose}
                  tabIndex={isOpen ? 0 : -1}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 유저 메뉴 */}
        <nav className="sidebar-menu__section">
          <ul className="sidebar-menu__list">
            {nav.user.map((item) => (
              <li key={item.href} className="sidebar-menu__item">
                <Link
                  href={item.href}
                  className="sidebar-menu__link"
                  onClick={onClose}
                  tabIndex={isOpen ? 0 : -1}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 인증 */}
        <div className="sidebar-menu__auth">
          <Link
            href="/auth/login"
            className="sidebar-menu__auth-btn"
            onClick={onClose}
            tabIndex={isOpen ? 0 : -1}
          >
            {nav.auth.loginLabel}
          </Link>
          <Link
            href="/auth/signup"
            className="sidebar-menu__auth-btn sidebar-menu__auth-btn--primary"
            onClick={onClose}
            tabIndex={isOpen ? 0 : -1}
          >
            {nav.auth.signupLabel}
          </Link>
        </div>
      </aside>
    </>
  );
}
