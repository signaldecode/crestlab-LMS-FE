/**
 * 관리자 강사 지원 심사 페이지 (/admin/instructor-applications)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminInstructorApplicationsContainer from '@/components/admin/instructor-applications/AdminInstructorApplicationsContainer';

export const metadata: Metadata = {
  title: '강사 지원 심사 — 관리자',
  description: '강사 지원 신청을 검토하고 승인/반려합니다.',
};

export default function Page(): JSX.Element {
  return <AdminInstructorApplicationsContainer />;
}
