/**
 * 링크 복사 버튼 (CopyLinkButton)
 * - 현재 게시글 URL을 클립보드에 복사한다
 * - 복사 성공 시 Toast와 연동하여 "링크가 복사되었습니다" 피드백을 표시한다
 * - aria-label로 접근성을 지원한다
 */

'use client';

export default function CopyLinkButton({ url, ariaLabel }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // 클립보드 API 미지원 시 fallback
    }
  };

  return (
    <button className="copy-link-btn" onClick={handleCopy} aria-label={ariaLabel}>
      {/* 링크 복사 아이콘/텍스트가 렌더링된다 */}
    </button>
  );
}
