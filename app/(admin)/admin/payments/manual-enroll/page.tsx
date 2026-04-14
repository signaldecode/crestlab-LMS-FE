/**
 * 관리자 수동 수강 등록 페이지 (/admin/payments/manual-enroll)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminManualEnrollContainer, {
  type ManualEnrollCopy,
} from '@/components/admin/payments/AdminManualEnrollContainer';
import { getPageData } from '@/lib/data';

interface ManualEnrollPageData extends ManualEnrollCopy {
  seo: { title: string; description: string };
}

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

function getCopy(): ManualEnrollPageData | null {
  const adminPage = getPageData('admin') as { manualEnroll?: ManualEnrollPageData } | null;
  return adminPage?.manualEnroll ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getCopy();
  return copy ? { title: copy.seo.title, description: copy.seo.description } : { title: '수동 수강 등록' };
}

export default function AdminManualEnrollPage(): JSX.Element {
  const copy = getCopy();
  const common = getCommonCopy();
  if (!copy || !common) return <main>데이터를 불러올 수 없습니다.</main>;
  return <AdminManualEnrollContainer copy={copy} common={common} />;
}
