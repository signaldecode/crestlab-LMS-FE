/**
 * 관리자 사용자 상세 페이지 (/admin/users/[id])
 * - 기본 정보 + 수강/결제 이력 + 역할 변경/비활성화 모달
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AdminUserDetailContainer, {
  type UserDetailCopy,
} from '@/components/admin/users/AdminUserDetailContainer';
import { getAdminUserDetail, getPageData } from '@/lib/data';
import type { AdminUserLevel, AdminUserStatus, UserRole } from '@/types';

interface AdminUserDetailPageProps {
  params: Promise<{ id: string }>;
}

interface UserDetailPageData extends Omit<UserDetailCopy, 'roleLabels' | 'statusLabels' | 'levelLabels'> {
  seo: { title: string; description: string };
  notFoundText: string;
}

interface UsersCopy {
  roleLabels: Record<UserRole, string>;
  statusLabels: Record<AdminUserStatus, string>;
  levelLabels: Record<AdminUserLevel, string>;
}

function getDetailCopy(): UserDetailPageData | null {
  const adminPage = getPageData('admin') as { userDetail?: UserDetailPageData } | null;
  return adminPage?.userDetail ?? null;
}

function getUsersCopy(): UsersCopy | null {
  const adminPage = getPageData('admin') as { users?: UsersCopy } | null;
  return adminPage?.users ?? null;
}

export async function generateMetadata({ params }: AdminUserDetailPageProps): Promise<Metadata> {
  await params;
  const copy = getDetailCopy();
  return copy ? { title: copy.seo.title, description: copy.seo.description } : { title: '사용자 상세' };
}

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps): Promise<JSX.Element> {
  const { id } = await params;
  const detailCopy = getDetailCopy();
  const usersCopy = getUsersCopy();
  const user = getAdminUserDetail(Number(id));

  if (!detailCopy || !usersCopy) {
    return <main>데이터를 불러올 수 없습니다.</main>;
  }

  if (!user) {
    return (
      <div className="admin-user-detail">
        <Link href={detailCopy.backLinkHref} className="admin-user-detail__back">
          ← {detailCopy.backLinkLabel}
        </Link>
        <p className="admin-list__empty">{detailCopy.notFoundText}</p>
      </div>
    );
  }

  const copy: UserDetailCopy = {
    ...detailCopy,
    roleLabels: usersCopy.roleLabels,
    statusLabels: usersCopy.statusLabels,
    levelLabels: usersCopy.levelLabels,
  };

  return <AdminUserDetailContainer user={user} copy={copy} />;
}
