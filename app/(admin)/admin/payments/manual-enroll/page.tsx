/**
 * 관리자 수동 수강 등록 페이지 (/admin/payments/manual-enroll)
 * - 결제 없이 수강권 발급
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminManualEnrollContainer, {
  type ManualEnrollCopy,
} from '@/components/admin/payments/AdminManualEnrollContainer';
import { getAdminCoursesData, getAdminUsersData, getPageData } from '@/lib/data';

interface ManualEnrollPageData extends ManualEnrollCopy {
  seo: { title: string; description: string };
}

function getCopy(): ManualEnrollPageData | null {
  const adminPage = getPageData('admin') as { manualEnroll?: ManualEnrollPageData } | null;
  return adminPage?.manualEnroll ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getCopy();
  return copy ? { title: copy.seo.title, description: copy.seo.description } : { title: '수동 수강 등록' };
}

export default function AdminManualEnrollPage(): JSX.Element {
  const copy = getCopy();
  const usersData = getAdminUsersData();
  const coursesData = getAdminCoursesData();

  if (!copy) {
    return <main>데이터를 불러올 수 없습니다.</main>;
  }

  return (
    <AdminManualEnrollContainer
      users={usersData.users}
      courses={coursesData.courses}
      copy={copy}
    />
  );
}
