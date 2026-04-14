/**
 * 관리자 사용자 목록 페이지 (/admin/users)
 * - 필터(역할/상태/키워드) + 테이블 + 페이지네이션
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminUserListContainer, {
  type AdminUsersCopy,
} from '@/components/admin/users/AdminUserListContainer';
import { getAdminUsersData, getPageData } from '@/lib/data';

interface AdminUsersPageData extends AdminUsersCopy {
  seo: { title: string; description: string };
}

function getUsersCopy(): AdminUsersPageData | null {
  const adminPage = getPageData('admin') as { users?: AdminUsersPageData } | null;
  return adminPage?.users ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getUsersCopy();
  if (!copy) return { title: '사용자 관리 — 관리자' };
  return {
    title: copy.seo.title,
    description: copy.seo.description,
  };
}

export default function AdminUsersPage(): JSX.Element {
  const copy = getUsersCopy();
  const data = getAdminUsersData();

  if (!copy) {
    return <main>사용자 데이터를 불러올 수 없습니다.</main>;
  }

  return <AdminUserListContainer users={data.users} copy={copy} />;
}
