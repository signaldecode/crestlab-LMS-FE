/**
 * 게시글 액션 메뉴 (PostActionsMenu)
 * - 게시글 상세에서 수정/삭제/신고 등 액션을 모아놓은 드롭다운 메뉴
 * - 작성자 본인에게만 수정/삭제가 보인다
 */

'use client';

interface PostActionsMenuProps {
  isAuthor: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
}

export default function PostActionsMenu({ isAuthor, onEdit, onDelete, onReport }: PostActionsMenuProps) {
  return (
    <div className="post-actions-menu">
      {/* 수정/삭제/신고 등 액션 버튼이 렌더링된다 */}
    </div>
  );
}
