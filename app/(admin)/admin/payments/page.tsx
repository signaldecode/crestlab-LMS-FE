/**
 * 관리자 결제 목록 페이지 (/admin/payments)
 * - 필터(상태/키워드) + 테이블 + 페이지네이션
 * - 환불 처리는 상세 페이지에서, 수동 수강 등록은 헤더 진입점에서
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminPaymentListContainer, {
  type AdminPaymentsCopy,
} from '@/components/admin/payments/AdminPaymentListContainer';
import { getAdminPaymentsData, getPageData } from '@/lib/data';

interface AdminPaymentsPageData extends AdminPaymentsCopy {
  seo: { title: string; description: string };
}

function getPaymentsCopy(): AdminPaymentsPageData | null {
  const adminPage = getPageData('admin') as { payments?: AdminPaymentsPageData } | null;
  return adminPage?.payments ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getPaymentsCopy();
  if (!copy) return { title: '결제 관리 — 관리자' };
  return {
    title: copy.seo.title,
    description: copy.seo.description,
  };
}

export default function AdminPaymentsPage(): JSX.Element {
  const copy = getPaymentsCopy();
  const data = getAdminPaymentsData();

  if (!copy) {
    return <main>결제 데이터를 불러올 수 없습니다.</main>;
  }

  return <AdminPaymentListContainer orders={data.orders} copy={copy} />;
}
