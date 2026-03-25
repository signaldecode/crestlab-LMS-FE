/**
 * 커뮤니티 페이지 셸 (CommunityPageShell)
 * - 3칸 레이아웃: 왼쪽 사이드바 / 가운데 피드 / 오른쪽 랭킹
 * - 모바일: 사이드바를 드로어로 전환 (햄버거 트리거)
 * - 오른쪽 하단 글쓰기 FAB
 */

'use client';

import { useEffect, useCallback } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import CommunitySidebar from '@/components/community/CommunitySidebar';
import CommunityFeed from '@/components/community/CommunityFeed';
import CommunityAside from '@/components/community/CommunityAside';
import useCommunityStore from '@/stores/useCommunityStore';
import mainData from '@/data';

const { writeButtonLabel, writeButtonAriaLabel, sidebarDrawer } = mainData.community;

export default function CommunityPageShell(): JSX.Element {
  const drawerOpen = useCommunityStore((s) => s.drawerOpen);
  const setDrawerOpen = useCommunityStore((s) => s.setDrawerOpen);

  const closeDrawer = useCallback(() => setDrawerOpen(false), [setDrawerOpen]);

  /* ESC 키로 닫기 */
  useEffect(() => {
    if (!drawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <div className="community-shell">
      <div className="community-layout">
        {/* 데스크톱: 그리드 내 사이드바 */}
        <CommunitySidebar />
        <CommunityFeed />
        <CommunityAside />
      </div>

      {/* ── 모바일 드로어 ── */}
      <div
        className={`community-drawer-overlay${drawerOpen ? ' community-drawer-overlay--open' : ''}`}
        aria-label={sidebarDrawer.overlayAriaLabel}
        onClick={closeDrawer}
        role="presentation"
      />
      <aside
        className={`community-drawer${drawerOpen ? ' community-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={sidebarDrawer.triggerAriaLabel}
      >
        <div className="community-drawer__header">
          <button
            type="button"
            className="community-drawer__close"
            aria-label={sidebarDrawer.closeAriaLabel}
            onClick={closeDrawer}
          >
            ✕
          </button>
        </div>
        <div className="community-drawer__body">
          <CommunitySidebar inDrawer onNavigate={closeDrawer} />
        </div>
      </aside>

      {/* 글쓰기 FAB — 오른쪽 하단 고정 */}
      <Link href="/community/new" className="community-shell__write-fab" aria-label={writeButtonAriaLabel}>
        + {writeButtonLabel}
      </Link>
    </div>
  );
}
