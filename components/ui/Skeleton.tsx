/**
 * 스켈레톤 로딩 UI (Skeleton)
 * - 데이터가 로드되기 전 콘텐츠 자리에 표시되는 플레이스홀더 UI
 * - width, height, variant(text/circle/rect)를 props로 받아 다양한 형태를 지원한다
 * - aria-hidden으로 스크린리더에서 숨긴다
 */

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circle' | 'rect';
  className?: string;
}

export default function Skeleton({ width, height, variant = 'rect', className = '' }: SkeletonProps) {
  return (
    <span
      className={`skeleton skeleton--${variant} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
