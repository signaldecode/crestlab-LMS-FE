/**
 * 커뮤니티 페이지 셸 (CommunityPageShell)
 * - 커뮤니티 메인 페이지의 전체 구조를 잡는 셸 컴포넌트
 * - CommunityHeader, CommunityTabs, PostList를 조합하여 렌더링한다
 */

import CommunityHeader from '@/components/community/CommunityHeader';
import CommunityTabs from '@/components/community/CommunityTabs';
import PostList from '@/components/community/PostList';

export default function CommunityPageShell(): React.JSX.Element {
  return (
    <div className="community-page-shell">
      <CommunityHeader />
      <CommunityTabs />
      <PostList />
    </div>
  );
}
