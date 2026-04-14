/**
 * 결제 완료 컨테이너 (OrderCompleteContainer)
 * - 결제 성공 후 주문 정보, 수강 시작 CTA를 표시한다
 * - useOrderStore의 completedOrder 또는 props의 orderId로 정보를 표시한다
 * - 모든 라벨은 data에서 로드한다
 */

'use client';

import Link from 'next/link';
import { getPageData } from '@/lib/data';
import { formatPrice } from '@/lib/payments';
import useOrderStore from '@/stores/useOrderStore';

interface OrderCompleteContainerProps {
  orderId?: string;
}

export default function OrderCompleteContainer({ orderId }: OrderCompleteContainerProps) {
  const completedOrder = useOrderStore((s) => s.completedOrder);

  const pageData = getPageData('orderComplete') as Record<string, string> | null;
  const title = pageData?.title ?? '결제가 완료되었습니다!';
  const subtitle = pageData?.subtitle ?? '수강 등록이 완료되었으며, 지금 바로 학습을 시작할 수 있습니다.';

  const displayOrderId = completedOrder?.orderId ?? orderId ?? '';
  const displayAmount = completedOrder?.totalAmount ?? 0;
  const displayMethod = completedOrder?.method ?? '';
  const displayDate = completedOrder?.approvedAt
    ? new Date(completedOrder.approvedAt).toLocaleString('ko-KR')
    : '';
  const receiptUrl = completedOrder?.receipt?.url;

  return (
    <section className="order-complete">
      <div className="order-complete__card">
        <div className="order-complete__icon" aria-hidden="true">✓</div>
        <h1 className="order-complete__title">{title}</h1>
        <p className="order-complete__subtitle">{subtitle}</p>

        {/* 주문 정보 */}
        <div className="order-complete__detail">
          {displayOrderId && (
            <div className="order-complete__detail-row">
              <span className="order-complete__detail-label">
                {pageData?.orderIdLabel ?? '주문번호'}
              </span>
              <span className="order-complete__detail-value">{displayOrderId}</span>
            </div>
          )}
          {displayAmount > 0 && (
            <div className="order-complete__detail-row">
              <span className="order-complete__detail-label">
                {pageData?.amountLabel ?? '결제 금액'}
              </span>
              <span className="order-complete__detail-value">
                {formatPrice(displayAmount)}
              </span>
            </div>
          )}
          {displayMethod && (
            <div className="order-complete__detail-row">
              <span className="order-complete__detail-label">
                {pageData?.methodLabel ?? '결제 수단'}
              </span>
              <span className="order-complete__detail-value">{displayMethod}</span>
            </div>
          )}
          {displayDate && (
            <div className="order-complete__detail-row">
              <span className="order-complete__detail-label">
                {pageData?.dateLabel ?? '결제 일시'}
              </span>
              <span className="order-complete__detail-value">{displayDate}</span>
            </div>
          )}
          {receiptUrl && (
            <div className="order-complete__detail-row">
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="order-complete__receipt-link"
                aria-label={pageData?.receiptAriaLabel ?? '결제 영수증 확인'}
              >
                {pageData?.receiptLabel ?? '영수증 보기'}
              </a>
            </div>
          )}
        </div>

        {/* CTA 버튼 */}
        <div className="order-complete__actions">
          <Link
            href="/mypage"
            className="order-complete__btn order-complete__btn--primary"
            aria-label={pageData?.startLearningAriaLabel ?? '구매한 강의 학습 시작하기'}
          >
            {pageData?.startLearningLabel ?? '학습 시작하기'}
          </Link>
          <Link
            href="/mypage"
            className="order-complete__btn order-complete__btn--secondary"
            aria-label={pageData?.goOrdersAriaLabel ?? '마이페이지 주문 내역으로 이동'}
          >
            {pageData?.goOrdersLabel ?? '주문 내역 보기'}
          </Link>
          <Link
            href="/"
            className="order-complete__btn order-complete__btn--text"
          >
            {pageData?.goHomeLabel ?? '홈으로 돌아가기'}
          </Link>
        </div>
      </div>
    </section>
  );
}
