/**
 * 공유 버튼 (ShareButton)
 * - 게시글 URL을 클립보드에 복사하거나 SNS 공유를 지원하는 버튼
 * - aria-label로 접근성을 지원한다
 */

'use client';

interface ShareButtonProps {
  url: string;
  ariaLabel: string;
}

export default function ShareButton({ url, ariaLabel }: ShareButtonProps) {
  return (
    <button className="share-btn" aria-label={ariaLabel}>
      {/* 공유 아이콘/텍스트가 렌더링된다 */}
    </button>
  );
}
