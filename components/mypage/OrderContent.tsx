/**
 * 구매 내역 콘텐츠 (OrderContent)
 * - 백엔드 `GET /v1/payments/history` 기반
 */

'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchMyPayments, type PaymentHistoryItem } from '@/lib/userApi';
import accountData from '@/data/accountData.json';
import uiData from '@/data/uiData.json';

const ordersPageData = accountData.mypage.ordersPage;
const SK = 'mypage-classroom';

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + uiData.priceUnit;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('ko-KR');
}

function statusLabel(status: string): string {
  switch (status) {
    case 'PAID': return '결제완료';
    case 'REFUNDED': return '환불';
    case 'CANCELED': return '취소';
    case 'PENDING': return '결제대기';
    default: return status;
  }
}

function statusVariant(status: string): string {
  if (status === 'REFUNDED' || status === 'CANCELED') return 'refund';
  return 'done';
}

export default function OrderContent(): JSX.Element {
  const { data, loading, error } = useAdminQuery<PaymentHistoryItem[]>(
    () => fetchMyPayments(),
    [],
  );

  const orders = data ?? [];

  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>{ordersPageData.title}</h2>
        {loading ? (
          <div className={`${SK}__empty`}><p>불러오는 중...</p></div>
        ) : error ? (
          <div className={`${SK}__empty`}><p>구매 내역을 불러오지 못했습니다.</p></div>
        ) : orders.length === 0 ? (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>{ordersPageData.emptyText}</p>
          </div>
        ) : (
          <div className={`${SK}__purchase-list`}>
            {orders.map((order) => (
              <Link
                key={order.orderId}
                href={`/mypage/orders/${order.orderId}`}
                className={`${SK}__purchase-row`}
                aria-label={ordersPageData.detailAriaLabel}
              >
                <span className={`${SK}__purchase-date`}>{formatDate(order.paidAt)}</span>
                <div className={`${SK}__purchase-course`}>
                  <div className={`${SK}__purchase-info`}>
                    <span className={`${SK}__purchase-title`}>{order.courseName}</span>
                    <span className={`${SK}__purchase-instructor`}>{order.orderNumber}</span>
                  </div>
                </div>
                <span className={`${SK}__purchase-price`}>{formatPrice(order.amount)}</span>
                <span className={`${SK}__purchase-status ${SK}__purchase-status--${statusVariant(order.status)}`}>
                  {statusLabel(order.status)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
