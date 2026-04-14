/**
 * 관리자 대시보드 페이지 (/admin/dashboard)
 * - 서버 page는 copy(UI 텍스트)만 조립, 데이터 fetch는 Container에서 수행
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminDashboardContainer, {
  type DashboardCopy,
} from '@/components/admin/dashboard/AdminDashboardContainer';
import { getPageData } from '@/lib/data';

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

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

function getDashboardCopy(): AdminDashboardPageData | null {
  const adminPage = getPageData('admin') as { dashboard?: AdminDashboardPageData } | null;
  return adminPage?.dashboard ?? null;
}

function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getDashboardCopy();
  if (!copy) return { title: '관리자 대시보드' };
  return { title: copy.seo.title, description: copy.seo.description };
}

export default function AdminDashboardPage(): JSX.Element {
  const copy = getDashboardCopy();
  const common = getCommonCopy();
  if (!copy || !common) return <main>대시보드 데이터를 불러올 수 없습니다.</main>;

  return <AdminDashboardContainer copy={copy} common={common} />;
}
