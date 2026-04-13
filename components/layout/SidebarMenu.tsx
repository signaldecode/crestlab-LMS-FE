/**
 * 사이드바 메뉴 (SidebarMenu)
 * - 모바일 환경에서 슬라이드 사이드바 형태로 네비게이션을 제공한다
 * - 오버레이 클릭 또는 닫기 버튼으로 닫을 수 있다
 * - Escape 키로 닫기 지원 (키보드 접근성)
 * - data 기반 메뉴 렌더링
 */

'use client';

import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import { getNavData } from '@/lib/data';
import useAuthStore from '@/stores/useAuthStore';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps): JSX.Element {
  const nav = getNavData();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (href: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(href)) {
        next.delete(href);
      } else {
        next.add(href);
      }
      return next;
    });
  };

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

        {/* 강의 카테고리 (아코디언) */}
        <nav className="sidebar-menu__section">
          <p className="sidebar-menu__section-title">{nav.courseDropdown.label}</p>
          <ul className="sidebar-menu__list">
            {nav.categoryMenu.groups.map((group) => {
              const isExpanded = expandedGroups.has(group.href);
              return (
                <li key={group.href} className="sidebar-menu__item sidebar-menu__item--accordion">
                  <div className="sidebar-menu__accordion-header">
                    <Link
                      href={group.href}
                      className="sidebar-menu__accordion-link"
                      onClick={onClose}
                      tabIndex={isOpen ? 0 : -1}
                    >
                      {group.label}
                    </Link>
                    <button
                      type="button"
                      className="sidebar-menu__accordion-toggle"
                      aria-expanded={isExpanded}
                      aria-label={`${group.label} 하위 메뉴 ${isExpanded ? '접기' : '펼치기'}`}
                      onClick={() => toggleGroup(group.href)}
                      tabIndex={isOpen ? 0 : -1}
                    >
                      <svg
                        className={`sidebar-menu__accordion-icon${isExpanded ? ' sidebar-menu__accordion-icon--open' : ''}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                  {isExpanded && (
                    <ul className="sidebar-menu__sublist">
                      {group.items.map((item) => (
                        <li key={item.href} className="sidebar-menu__subitem">
                          <Link
                            href={item.href}
                            className="sidebar-menu__sublink"
                            onClick={onClose}
                            tabIndex={isOpen ? 0 : -1}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
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
          {isLoggedIn ? (
            <>
              <Link
                href="/mypage"
                className="sidebar-menu__auth-btn"
                onClick={onClose}
                tabIndex={isOpen ? 0 : -1}
              >
                {user?.nickname ?? user?.name ?? '마이페이지'}
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </aside>
    </>
  );
}
