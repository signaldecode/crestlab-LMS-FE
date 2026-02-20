/**
 * 커뮤니티 컨테이너 (CommunityContainer)
 * - 커뮤니티 메인 페이지의 조립 레이어
 * - CommunityHeader, CommunityTabs, PostList 등 도메인 컴포넌트를 연결한다
 */

import CommunityPageShell from '@/components/community/CommunityPageShell';

export default function CommunityContainer() {
  return (
    <div className="community-container">
      <CommunityPageShell />
    </div>
  );
}
