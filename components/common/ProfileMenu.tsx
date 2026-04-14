/**
 * 헤더 프로필 드롭다운 (ProfileMenu)
 * - 로그인된 유저의 계정 메뉴 (마이페이지, 설정, 로그아웃)
 * - ADMIN 역할인 경우 관리자 페이지 진입 항목이 별도 섹션으로 노출된다
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore, { selectIsAdmin } from '@/stores/useAuthStore';
import useAuth from '@/hooks/useAuth';
import useToastStore from '@/stores/useToastStore';

interface ProfileMenuItem {
  label: string;
  href: string;
  ariaLabel: string;
}

interface ProfileMenuAdminItem extends ProfileMenuItem {
  sectionLabel: string;
}

interface ProfileMenuData {
  triggerAriaLabel: string;
  triggerLabel: string;
  items: ProfileMenuItem[];
  adminItem: ProfileMenuAdminItem;
  logoutLabel: string;
  logoutAriaLabel: string;
}

interface ProfileMenuProps {
  data: ProfileMenuData;
}

export default function ProfileMenu({ data }: ProfileMenuProps): JSX.Element {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore(selectIsAdmin);
  const { logout } = useAuth();
  const showToast = useToastStore((s) => s.show);

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, close]);

  const handleLogout = useCallback(async () => {
    close();
    await logout();
    router.push('/');
    router.refresh();
    showToast('로그아웃되었습니다.', 'info');
  }, [logout, close, router, showToast]);

  const displayName = user?.nickname || user?.name || data.triggerLabel;

  return (
    <div className="profile-menu" ref={containerRef}>
      <button
        type="button"
        className="profile-menu__trigger"
        aria-label={data.triggerAriaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggle}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="profile-menu__trigger-label">{displayName}</span>
      </button>

      {isOpen && (
        <div className="profile-menu__dropdown" role="menu">
          <ul className="profile-menu__list">
            {data.items.map((item) => (
              <li key={item.href} role="none">
                <Link
                  href={item.href}
                  className="profile-menu__link"
                  role="menuitem"
                  aria-label={item.ariaLabel}
                  onClick={close}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {isAdmin && (
            <>
              <div className="profile-menu__divider" role="separator" />
              <div className="profile-menu__section-label">{data.adminItem.sectionLabel}</div>
              <ul className="profile-menu__list">
                <li role="none">
                  <Link
                    href={data.adminItem.href}
                    className="profile-menu__link profile-menu__link--admin"
                    role="menuitem"
                    aria-label={data.adminItem.ariaLabel}
                    onClick={close}
                  >
                    {data.adminItem.label}
                  </Link>
                </li>
              </ul>
            </>
          )}

          <div className="profile-menu__divider" role="separator" />
          <button
            type="button"
            className="profile-menu__logout"
            role="menuitem"
            aria-label={data.logoutAriaLabel}
            onClick={handleLogout}
          >
            {data.logoutLabel}
          </button>
        </div>
      )}
    </div>
  );
}
