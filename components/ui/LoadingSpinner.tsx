/**
 * 로딩 스피너 (LoadingSpinner)
 * - 데이터 로딩 중 표시되는 스피너 UI
 * - aria-label로 스크린리더에 로딩 상태를 알린다
 */

interface LoadingSpinnerProps {
  label?: string;
}

export default function LoadingSpinner({ label = '로딩 중' }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" role="status" aria-label={label}>
      <span className="loading-spinner__icon" aria-hidden="true" />
      <span className="loading-spinner__text">{label}</span>
    </div>
  );
}
