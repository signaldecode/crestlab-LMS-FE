/**
 * 게시글 카드 (PostCard)
 * - 게시글 목록에서 개별 게시글 요약을 보여주는 카드 컴포넌트
 * - 제목, 작성자, 날짜, 좋아요 수 등을 렌더링한다
 * - /community/[slug]로의 링크를 포함한다
 */

import type { Post } from '@/types';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <Link href={`/community/${post.slug}`} className="post-card__link">
        <h3 className="post-card__title">{post.title}</h3>
      </Link>
      {/* 작성자, 날짜, 좋아요 수 등 메타 정보가 렌더링된다 */}
    </article>
  );
}
