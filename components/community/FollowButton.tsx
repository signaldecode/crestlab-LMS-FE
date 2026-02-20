/**
 * 팔로우 버튼 (FollowButton)
 * - 다른 사용자를 팔로우/언팔로우하는 토글 버튼
 * - 현재 팔로우 상태에 따라 텍스트와 스타일이 변경된다
 */

'use client';

interface FollowButtonProps {
  isFollowing?: boolean;
  onToggle: () => void;
  ariaLabel: string;
}

export default function FollowButton({ isFollowing = false, onToggle, ariaLabel }: FollowButtonProps) {
  return (
    <button
      className={`follow-btn${isFollowing ? ' follow-btn--following' : ''}`}
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-pressed={isFollowing}
    >
      {isFollowing ? '팔로잉' : '팔로우'}
    </button>
  );
}
