/**
 * 관리자 결제 목록 페이지 (/admin/payments)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminPaymentListContainer, {
  type AdminPaymentsCopy,
} from '@/components/admin/payments/AdminPaymentListContainer';
import { getPageData } from '@/lib/data';

interface AdminPaymentsPageData extends AdminPaymentsCopy {
  seo: { title: string; description: string };
}

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

function getPaymentsCopy(): AdminPaymentsPageData | null {
  const adminPage = getPageData('admin') as { payments?: AdminPaymentsPageData } | null;
  return adminPage?.payments ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getPaymentsCopy();
  if (!copy) return { title: '결제 관리 — 관리자' };
  return { title: copy.seo.title, description: copy.seo.description };
}

export default function AdminPaymentsPage(): JSX.Element {
  const copy = getPaymentsCopy();
  const common = getCommonCopy();
  if (!copy || !common) return <main>결제 데이터를 불러올 수 없습니다.</main>;

  return <AdminPaymentListContainer copy={copy} common={common} />;
}
