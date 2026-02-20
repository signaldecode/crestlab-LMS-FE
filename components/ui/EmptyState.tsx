/**
 * 빈 상태 (EmptyState)
 * - 목록에 데이터가 없을 때 보여주는 안내 UI
 * - 제목, 설명, CTA 버튼 등을 props로 받는다
 */

import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">{title}</p>
      {description && <p className="empty-state__description">{description}</p>}
      {children}
    </div>
  );
}
