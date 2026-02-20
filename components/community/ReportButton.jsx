/**
 * 신고 버튼 (ReportButton)
 * - 게시글/댓글을 부적절한 콘텐츠로 신고하는 버튼
 * - 클릭 시 신고 사유 모달 또는 확인 다이얼로그를 표시한다
 */

'use client';

export default function ReportButton({ targetId, targetType, ariaLabel }) {
  return (
    <button className="report-btn" aria-label={ariaLabel}>
      {/* 신고 아이콘/텍스트가 렌더링된다 */}
    </button>
  );
}
