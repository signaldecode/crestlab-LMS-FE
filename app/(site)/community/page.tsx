/**
 * 커뮤니티 메인 페이지
 * - 탭(전체/인기/공지 등), 검색, 글쓰기 버튼을 포함하는 커뮤니티 진입점
 * - CommunityContainer로 도메인 컴포넌트들을 조립한다
 */

import CommunityContainer from '@/components/containers/CommunityContainer';

export default function CommunityPage() {
  return (
    <section className="community-page">
      <CommunityContainer />
    </section>
  );
}