/**
 * 관리자 사용자 상세 페이지 (/admin/users/[id])
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminUserDetailContainer, {
  type UserDetailCopy,
} from '@/components/admin/users/AdminUserDetailContainer';
import { getPageData } from '@/lib/data';
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

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

function getDetailCopy(): UserDetailPageData | null {
  const adminPage = getPageData('admin') as { userDetail?: UserDetailPageData } | null;
  return adminPage?.userDetail ?? null;
}
function getUsersCopy(): UsersCopy | null {
  const adminPage = getPageData('admin') as { users?: UsersCopy } | null;
  return adminPage?.users ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
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
  const common = getCommonCopy();

  if (!detailCopy || !usersCopy || !common) {
    return <main>데이터를 불러올 수 없습니다.</main>;
  }

  const copy: UserDetailCopy = {
    ...detailCopy,
    roleLabels: usersCopy.roleLabels,
    statusLabels: usersCopy.statusLabels,
    levelLabels: usersCopy.levelLabels,
  };

  return (
    <AdminUserDetailContainer
      userId={Number(id)}
      copy={copy}
      common={common}
      notFoundText={detailCopy.notFoundText}
    />
  );
}
