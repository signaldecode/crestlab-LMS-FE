/**
 * 게시글 에디터 (PostEditor)
 * - 게시글 작성/수정 폼 컴포넌트
 * - isEdit prop이 true이면 기존 데이터를 slug로 불러와 수정 모드로 동작한다
 * - 제목, 카테고리, 본문 입력 필드와 제출 버튼을 포함한다
 */

'use client';

export default function PostEditor({ slug, isEdit = false }) {
  return (
    <form className="post-editor">
      {/* 제목/카테고리/본문 입력 폼이 렌더링된다 */}
    </form>
  );
}
