/**
 * 관리자 결제 상세 페이지 (/admin/payments/[id])
 * - 주문 정보 + 환불 처리 모달
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AdminPaymentDetailContainer, {
  type PaymentDetailCopy,
} from '@/components/admin/payments/AdminPaymentDetailContainer';
import { findAdminOrderById, getPageData } from '@/lib/data';
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

function getDetailCopy(): PaymentDetailPageData | null {
  const adminPage = getPageData('admin') as { paymentDetail?: PaymentDetailPageData } | null;
  return adminPage?.paymentDetail ?? null;
}

function getPaymentsCopy(): PaymentsCopy | null {
  const adminPage = getPageData('admin') as { payments?: PaymentsCopy } | null;
  return adminPage?.payments ?? null;
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
  const order = findAdminOrderById(Number(id));

  if (!detailCopy || !paymentsCopy) {
    return <main>데이터를 불러올 수 없습니다.</main>;
  }

  if (!order) {
    return (
      <div className="admin-payment-detail">
        <Link href={detailCopy.backLinkHref} className="admin-user-detail__back">
          ← {detailCopy.backLinkLabel}
        </Link>
        <p className="admin-list__empty">{detailCopy.notFoundText}</p>
      </div>
    );
  }

  const copy: PaymentDetailCopy = {
    ...detailCopy,
    statusLabels: paymentsCopy.statusLabels,
  };

  return <AdminPaymentDetailContainer order={order} copy={copy} />;
}
