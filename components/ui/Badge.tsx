/**
 * 뱃지 (Badge)
 * - NEW, BEST, 할인율, 카테고리 등 라벨을 작은 태그로 표시한다
 * - variant(new/best/discount/category 등)로 스타일을 분기한다
 * - 텍스트는 props(data)에서 받아 하드코딩하지 않는다
 */

interface BadgeProps {
  label: string;
  variant?: string;
}

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <span className={`badge badge--${variant}`}>
      {label}
    </span>
  );
}
