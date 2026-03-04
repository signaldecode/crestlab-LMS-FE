/**
 * 커뮤니티 페이지 셸 (CommunityPageShell)
 * - 오른쪽 상단 글쓰기 버튼
 * - 3칸 레이아웃: 왼쪽 사이드바 / 가운데 피드 / 오른쪽 랭킹
 */

import type { JSX } from 'react';
import Link from 'next/link';
import CommunitySidebar from '@/components/community/CommunitySidebar';
import CommunityFeed from '@/components/community/CommunityFeed';
import CommunityAside from '@/components/community/CommunityAside';

export default function CommunityPageShell(): JSX.Element {
  return (
    <div className="community-shell">
      <div className="community-layout">
        <CommunitySidebar />
        <CommunityFeed />
        <CommunityAside />
      </div>

      {/* 글쓰기 FAB — 오른쪽 하단 고정 */}
      <Link href="/community/new" className="community-shell__write-fab" aria-label="글쓰기">
        + 글쓰기
      </Link>
    </div>
  );
}
