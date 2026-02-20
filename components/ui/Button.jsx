/**
 * 범용 버튼 (Button)
 * - 도메인 지식이 없는 순수 UI 부품
 * - label, ariaLabel 등은 props로만 받아 렌더링하며 하드코딩하지 않는다
 * - variant(primary/secondary/outline 등)로 스타일을 분기한다
 */

export default function Button({ children, variant = 'primary', type = 'button', ariaLabel, onClick, disabled }) {
  return (
    <button
      className={`btn btn--${variant}`}
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
