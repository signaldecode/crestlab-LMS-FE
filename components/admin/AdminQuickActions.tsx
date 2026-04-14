/**
 * 관리자 빠른 액션 (AdminQuickActions)
 * - 사용자 페이지 맥락에서 관리자에게만 노출되는 액션 모음
 * - ADMIN 역할이 아니면 아무것도 렌더링하지 않는다
 * - 페이지 우상단에 고정되며, 자식으로 링크/버튼을 받는다
 */

'use client';

import type { JSX, ReactNode } from 'react';
import useAuthStore, { selectIsAdmin } from '@/stores/useAuthStore';

interface AdminQuickActionsProps {
  label?: string;
  children: ReactNode;
}

export default function AdminQuickActions({
  label = '관리자',
  children,
}: AdminQuickActionsProps): JSX.Element | null {
  const isAdmin = useAuthStore(selectIsAdmin);
  if (!isAdmin) return null;

  return (
    <aside className="admin-quick-actions" role="complementary" aria-label={label}>
      <span className="admin-quick-actions__label">{label}</span>
      <div className="admin-quick-actions__items">{children}</div>
    </aside>
  );
}
