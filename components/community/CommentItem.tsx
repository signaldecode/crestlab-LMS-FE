/**
 * 댓글 아이템 (CommentItem)
 * - 개별 댓글 하나를 렌더링하는 컴포넌트
 * - 작성자, 내용, 작성일, 좋아요/신고 버튼 등을 포함한다
 */

import type { Comment } from '@/types';

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="comment-item">
      {/* 댓글 작성자/내용/날짜/액션 버튼이 렌더링된다 */}
    </div>
  );
}
