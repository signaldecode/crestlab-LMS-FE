/**
 * 커뮤니티 글 상세 페이지
 * - /community/[slug] 경로로 접근하며 게시글 본문, 댓글, 좋아요 등을 보여준다
 * - params.slug로 게시글 데이터를 조회한다
 */

import PostDetail from '@/components/community/PostDetail';
import CommentList from '@/components/community/CommentList';

interface CommunityPostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CommunityPostDetailPage({ params }: CommunityPostDetailPageProps) {
  const { slug } = await params;

  return (
    <article className="community-detail-page">
      <PostDetail slug={slug} />
      <CommentList slug={slug} />
    </article>
  );
}
