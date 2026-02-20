/**
 * 좋아요 버튼 (LikeButton)
 * - 게시글/댓글의 좋아요 토글 버튼
 * - 현재 좋아요 수와 활성 상태를 표시한다
 * - aria-label로 접근성을 지원한다
 */

'use client';

export default function LikeButton({ count = 0, isLiked = false, onToggle, ariaLabel }) {
  return (
    <button
      className={`like-btn${isLiked ? ' like-btn--active' : ''}`}
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-pressed={isLiked}
    >
      <span className="like-btn__count">{count}</span>
    </button>
  );
}
