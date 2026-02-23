/**
 * 커뮤니티 페이지 셸 (CommunityPageShell)
 * - 3칸 레이아웃: 왼쪽 사이드바 / 가운데 피드 / 오른쪽 랭킹
 */

import type { JSX } from 'react';
import CommunitySidebar from '@/components/community/CommunitySidebar';
import CommunityFeed from '@/components/community/CommunityFeed';
import CommunityAside from '@/components/community/CommunityAside';

export default function CommunityPageShell(): JSX.Element {
  return (
    <div className="community-layout">
      <CommunitySidebar />
      <CommunityFeed />
      <CommunityAside />
    </div>
  );
}
