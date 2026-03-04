/**
 * 커뮤니티 글 상세 페이지
 * - /community/[slug] 경로로 접근하며 게시글 본문, 댓글, 좋아요 등을 보여준다
 * - 2칸 레이아웃: 왼쪽(글+댓글) / 오른쪽(작성자 정보)
 */

import PostDetail from '@/components/community/PostDetail';
import CommentList from '@/components/community/CommentList';
import PostAuthorAside from '@/components/community/PostAuthorAside';

interface CommunityPostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CommunityPostDetailPage({ params }: CommunityPostDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="community-detail-page">
      <div className="community-detail-page__layout">
        {/* 왼쪽: 게시글 + 댓글 */}
        <main className="community-detail-page__main">
          <PostDetail slug={slug} />
          <CommentList slug={slug} />
        </main>

        {/* 오른쪽: 작성자 정보 */}
        <aside className="community-detail-page__aside">
          <PostAuthorAside />
        </aside>
      </div>
    </div>
  );
}
