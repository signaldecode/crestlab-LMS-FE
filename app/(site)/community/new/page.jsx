/**
 * 커뮤니티 글 작성 페이지
 * - 새 게시글을 작성하는 폼 페이지
 * - PostEditor 컴포넌트를 사용한다
 */

import PostEditor from '@/components/community/PostEditor';

export default function CommunityNewPostPage() {
  return (
    <section className="community-new-page">
      <PostEditor />
    </section>
  );
}
