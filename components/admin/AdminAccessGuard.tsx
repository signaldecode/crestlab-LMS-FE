/**
 * 관리자 영역 접근 가드 (AdminAccessGuard)
 * - useAuthStore의 role을 확인해 ADMIN이 아니면 접근 거부 화면을 표시한다
 * - 백엔드 연동 후에는 middleware.ts에서 1차 검증을 추가한다
 */

'use client';

import type { JSX, ReactNode } from 'react';
import Link from 'next/link';
import useAuthStore, { selectIsAdmin } from '@/stores/useAuthStore';

interface AdminAccessGuardProps {
  children: ReactNode;
  deniedTitle: string;
  deniedMessage: string;
  actionLabel: string;
  actionHref: string;
}

export default function AdminAccessGuard({
  children,
  deniedTitle,
  deniedMessage,
  actionLabel,
  actionHref,
}: AdminAccessGuardProps): JSX.Element {
  const isAdmin = useAuthStore(selectIsAdmin);

  if (!isAdmin) {
    return (
      <div className="admin-layout__denied" role="alert">
        <h1 className="admin-layout__denied-title">{deniedTitle}</h1>
        <p className="admin-layout__denied-message">{deniedMessage}</p>
        <Link href={actionHref} className="admin-layout__denied-action">
          {actionLabel}
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
