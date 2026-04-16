/**
 * 주문 상세 페이지 (/mypage/orders/[orderId])
 * - 주문 강의 목록, 할인 내역, 결제 정보를 표시
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import pagesData from '@/data/pagesData.json';
import accountData from '@/data/accountData.json';
import OrderDetailContent from '@/components/mypage/OrderDetailContent';

const siteTitle = pagesData.home.seo.title.split('—')[1]?.trim() || '';
const pageTitle = accountData.mypage.orderDetailPage.title;

export const metadata: Metadata = {
  title: `${pageTitle} — ${siteTitle}`,
  robots: { index: false, follow: false },
};

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps): Promise<JSX.Element> {
  const { orderId } = await params;

  return <OrderDetailContent orderId={orderId} />;
}
