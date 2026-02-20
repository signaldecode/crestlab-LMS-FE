/**
 * 댓글 에디터 (CommentEditor)
 * - 새 댓글을 작성하는 입력 폼
 * - 게시글 slug를 props로 받아 해당 게시글에 댓글을 등록한다
 */

'use client';

interface CommentEditorProps {
  slug: string;
}

export default function CommentEditor({ slug }: CommentEditorProps) {
  return (
    <form className="comment-editor">
      {/* 댓글 입력 텍스트영역 + 등록 버튼이 렌더링된다 */}
    </form>
  );
}
