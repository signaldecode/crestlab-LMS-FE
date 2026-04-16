/**
 * 주문 상세 콘텐츠 (OrderDetailContent)
 * - 백엔드는 별도 상세 엔드포인트가 없어 `GET /v1/payments/history` 목록에서 id로 조회
 */

'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchMyPayments, type PaymentHistoryItem } from '@/lib/userApi';
import accountData from '@/data/accountData.json';
import uiData from '@/data/uiData.json';

const pageData = accountData.mypage.orderDetailPage;
const SK = 'order-detail';

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + uiData.priceUnit;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('ko-KR');
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

interface OrderDetailContentProps {
  orderId: string;
}

export default function OrderDetailContent({ orderId }: OrderDetailContentProps): JSX.Element {
  const { data, loading } = useAdminQuery<PaymentHistoryItem[]>(
    () => fetchMyPayments(),
    [],
  );

  const order = (data ?? []).find((o) => String(o.orderId) === orderId);

  if (loading) {
    return <div className={SK}><p>불러오는 중...</p></div>;
  }

  if (!order) {
    return (
      <div className={`${SK}`}>
        <div className={`${SK}__not-found`}>
          <h2 className={`${SK}__not-found-title`}>{pageData.notFoundTitle}</h2>
          <p className={`${SK}__not-found-desc`}>{pageData.notFoundDescription}</p>
          <Link href="/mypage/orders" className={`${SK}__not-found-link`}>
            {pageData.notFoundLinkLabel}
          </Link>
        </div>
      </div>
    );
  }

  const isRefund = order.status === 'REFUNDED' || order.status === 'CANCELED';

  return (
    <div className={`${SK}`}>
      <Link href="/mypage/orders" className={`${SK}__back`} aria-label={pageData.backAriaLabel}>
        &larr; {pageData.backLabel}
      </Link>

      <header className={`${SK}__header`}>
        <h2 className={`${SK}__title`}>{pageData.title}</h2>
        <span className={`${SK}__status ${SK}__status--${isRefund ? 'refund' : 'done'}`}>
          {statusLabel(order.status)}
        </span>
      </header>

      <section className={`${SK}__info`}>
        <dl className={`${SK}__info-list`}>
          <div className={`${SK}__info-row`}>
            <dt className={`${SK}__info-label`}>{pageData.orderIdLabel}</dt>
            <dd className={`${SK}__info-value`}>{order.orderNumber}</dd>
          </div>
          <div className={`${SK}__info-row`}>
            <dt className={`${SK}__info-label`}>{pageData.orderDateLabel}</dt>
            <dd className={`${SK}__info-value`}>{formatDate(order.paidAt)}</dd>
          </div>
        </dl>
      </section>

      <section className={`${SK}__section`}>
        <h3 className={`${SK}__section-title`}>{pageData.sectionCourses}</h3>
        <ul className={`${SK}__course-list`}>
          <li className={`${SK}__course-item`}>
            <div className={`${SK}__course-info`}>
              <span className={`${SK}__course-title`}>{order.courseName}</span>
            </div>
            <span className={`${SK}__course-price`}>{formatPrice(order.amount)}</span>
          </li>
        </ul>
      </section>

      <section className={`${SK}__section`}>
        <h3 className={`${SK}__section-title`}>{pageData.sectionPrice}</h3>
        <dl className={`${SK}__price-list`}>
          <div className={`${SK}__price-row ${SK}__price-row--total`}>
            <dt>{pageData.totalAmountLabel}</dt>
            <dd>{formatPrice(order.amount)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
