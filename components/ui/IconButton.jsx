/**
 * 아이콘 버튼 (IconButton)
 * - 아이콘만 표시되는 버튼 (좋아요, 공유, 닫기 등)
 * - 시각적 텍스트가 없으므로 aria-label이 필수다
 * - children으로 아이콘(SVG/이미지)을 받는다
 */

export default function IconButton({ ariaLabel, onClick, className = '', disabled, children }) {
  return (
    <button
      className={`icon-btn ${className}`}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
