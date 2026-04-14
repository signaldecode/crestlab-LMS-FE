/**
 * 관리자 대시보드 페이지 (/admin/dashboard)
 * - 백엔드 GET /api/v1/admin/dashboard 응답 형태의 mock 데이터를 표시
 * - 매출/신규가입자/인기강의/리뷰/결제 5개 섹션
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminDashboardContainer, {
  type DashboardCopy,
} from '@/components/admin/dashboard/AdminDashboardContainer';
import { getAdminDashboardData, getPageData } from '@/lib/data';

interface AdminDashboardPageData {
  seo: { title: string; description: string };
  title: string;
  subtitle: string;
  currencyUnit: string;
  countUnit: string;
  personUnit: string;
  ratingUnit: string;
  periodLabels: DashboardCopy['periodLabels'];
  sections: DashboardCopy['sections'];
}

function getDashboardCopy(): AdminDashboardPageData | null {
  const adminPage = getPageData('admin') as { dashboard?: AdminDashboardPageData } | null;
  return adminPage?.dashboard ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getDashboardCopy();
  if (!copy) return { title: '관리자 대시보드' };
  return {
    title: copy.seo.title,
    description: copy.seo.description,
  };
}

export default function AdminDashboardPage(): JSX.Element {
  const copy = getDashboardCopy();
  const data = getAdminDashboardData();

  if (!copy) {
    return <main>대시보드 데이터를 불러올 수 없습니다.</main>;
  }

  return <AdminDashboardContainer data={data} copy={copy} />;
}
