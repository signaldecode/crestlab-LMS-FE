/**
 * 커뮤니티 글 수정 페이지
 * - 기존 게시글을 수정하는 폼 페이지
 * - params.slug로 기존 데이터를 불러와 PostEditor에 전달한다
 */

import PostEditor from '@/components/community/PostEditor';

interface CommunityEditPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CommunityEditPostPage({ params }: CommunityEditPostPageProps) {
  const { slug } = await params;

  return (
    <section className="community-edit-page">
      <PostEditor slug={slug} isEdit />
    </section>
  );
}
