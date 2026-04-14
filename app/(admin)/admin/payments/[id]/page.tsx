/**
 * 관리자 결제 상세 페이지 (/admin/payments/[id])
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminPaymentDetailContainer, {
  type PaymentDetailCopy,
} from '@/components/admin/payments/AdminPaymentDetailContainer';
import { getPageData } from '@/lib/data';
import type { AdminOrderStatus } from '@/types';

interface AdminPaymentDetailPageProps {
  params: Promise<{ id: string }>;
}

interface PaymentDetailPageData extends Omit<PaymentDetailCopy, 'statusLabels'> {
  seo: { title: string; description: string };
  notFoundText: string;
}

interface PaymentsCopy {
  statusLabels: Record<AdminOrderStatus, string>;
}

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

function getDetailCopy(): PaymentDetailPageData | null {
  const adminPage = getPageData('admin') as { paymentDetail?: PaymentDetailPageData } | null;
  return adminPage?.paymentDetail ?? null;
}
function getPaymentsCopy(): PaymentsCopy | null {
  const adminPage = getPageData('admin') as { payments?: PaymentsCopy } | null;
  return adminPage?.payments ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export async function generateMetadata({ params }: AdminPaymentDetailPageProps): Promise<Metadata> {
  await params;
  const copy = getDetailCopy();
  return copy ? { title: copy.seo.title, description: copy.seo.description } : { title: '결제 상세' };
}

export default async function AdminPaymentDetailPage({ params }: AdminPaymentDetailPageProps): Promise<JSX.Element> {
  const { id } = await params;
  const detailCopy = getDetailCopy();
  const paymentsCopy = getPaymentsCopy();
  const common = getCommonCopy();

  if (!detailCopy || !paymentsCopy || !common) {
    return <main>데이터를 불러올 수 없습니다.</main>;
  }

  const copy: PaymentDetailCopy = {
    ...detailCopy,
    statusLabels: paymentsCopy.statusLabels,
  };

  return (
    <AdminPaymentDetailContainer
      orderId={Number(id)}
      copy={copy}
      common={common}
      notFoundText={detailCopy.notFoundText}
    />
  );
}
