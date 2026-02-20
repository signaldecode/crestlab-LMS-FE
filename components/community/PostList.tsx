/**
 * 게시글 목록 (PostList)
 * - 커뮤니티 게시글을 PostCard 리스트로 렌더링한다
 * - ul > li 구조로 시맨틱 마크업을 준수한다
 */

import type { Post } from '@/types';
import PostCard from '@/components/community/PostCard';

interface PostListProps {
  posts?: Post[];
}

export default function PostList({ posts = [] }: PostListProps) {
  return (
    <ul className="post-list">
      {posts.map((post: Post) => (
        <li key={post.slug} className="post-list__item">
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
