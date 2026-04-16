/**
 * 헤더 프로필 드롭다운 (ProfileMenu)
 * - 로그인된 유저의 계정 메뉴 (마이페이지, 설정, 로그아웃)
 * - ADMIN 역할인 경우 관리자 페이지 진입 항목이 별도 섹션으로 노출된다
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useAuthStore, { selectIsAdmin } from '@/stores/useAuthStore';
import { logoutApi } from '@/lib/userApi';
import { removeToken } from '@/lib/auth';
import { resolveImageUrl } from '@/lib/images';

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
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore(selectIsAdmin);

  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
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
    try {
      await logoutApi();
    } catch {
      // 서버 호출 실패해도 클라이언트는 로그아웃 처리
    }
    removeToken();
    // 하드 리다이렉트 — 전체 페이지 리로드로 모든 클라이언트 상태 초기화
    window.location.href = '/';
  }, [close]);

  const displayName = user?.nickname || user?.name || data.triggerLabel;
  const profileImageUrl = resolveImageUrl(user?.profileImage);
  const showAvatar = Boolean(profileImageUrl) && !imageError;

  useEffect(() => {
    setImageError(false);
  }, [profileImageUrl]);

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
        {showAvatar ? (
          <span className="profile-menu__avatar">
            <Image
              src={profileImageUrl as string}
              alt=""
              width={24}
              height={24}
              className="profile-menu__avatar-img"
              onError={() => setImageError(true)}
            />
          </span>
        ) : (
          <span className="profile-menu__avatar profile-menu__avatar--fallback" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
        )}
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
