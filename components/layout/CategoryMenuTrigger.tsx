/**
 * 카테고리 메뉴 트리거 (CategoryMenuTrigger)
 * - "카테고리" 항목의 hover/click으로 메가 메뉴를 열고 닫는다
 * - hover: 마우스를 올리면 열리고, 메가 메뉴 밖으로 벗어나면 닫힌다
 * - click: 카테고리 클릭 시 메뉴를 열어두고 페이지 이동을 막는다
 * - 서버 컴포넌트(CategoryMegaMenu)를 children으로 받아 합성한다
 */

'use client';

import { useState, useRef, useCallback, type JSX, type ReactNode } from 'react';
import Link from 'next/link';

interface CategoryMenuTriggerProps {
  label: string;
  href: string;
  ariaLabel?: string;
  showHamburger?: boolean;
  children: ReactNode;
}

export default function CategoryMenuTrigger({
  label,
  href,
  ariaLabel,
  showHamburger,
  children,
}: CategoryMenuTriggerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    cancelClose();
    setIsOpen(true);
  }, [cancelClose]);

  const handleMouseLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setIsOpen(false), 80);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      cancelClose();
      setIsOpen(true);
    },
    [cancelClose],
  );

  /** 메가 메뉴 내부 링크 클릭 시 메뉴를 닫는다 (이벤트 위임) */
  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a')) {
      setIsOpen(false);
    }
  }, []);

  return (
    <li
      className={`global-nav__item global-nav__item--has-menu${isOpen ? ' is-open' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        className={`global-nav__link${showHamburger ? ' global-nav__link--with-icon' : ''}`}
        aria-label={ariaLabel}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={handleClick}
      >
        {showHamburger && (
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5.33 7h17.33" />
            <path d="M5.33 14h17.33" />
            <path d="M5.33 21h17.33" />
          </svg>
        )}
        {label}
      </Link>
      {isOpen && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div onClick={handleMenuClick}>
          {children}
        </div>
      )}
    </li>
  );
}
