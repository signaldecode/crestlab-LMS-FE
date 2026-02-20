/**
 * 댓글 목록 (CommentList)
 * - 게시글 하단에 달린 댓글들을 리스트로 렌더링한다
 * - CommentItem을 반복 렌더링하고, CommentEditor를 하단에 포함한다
 */

import type { Comment } from '@/types';
import CommentItem from '@/components/community/CommentItem';
import CommentEditor from '@/components/community/CommentEditor';

interface CommentListProps {
  slug: string;
  comments?: Comment[];
}

export default function CommentList({ slug, comments = [] }: CommentListProps) {
  return (
    <section className="comment-list" aria-label="댓글">
      <ul className="comment-list__items">
        {comments.map((comment: Comment) => (
          <li key={comment.id} className="comment-list__item">
            <CommentItem comment={comment} />
          </li>
        ))}
      </ul>
      <CommentEditor slug={slug} />
    </section>
  );
}
