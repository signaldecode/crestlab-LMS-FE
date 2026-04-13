/**
 * 결제 금액 요약 (PriceSummary)
 * - 강의 금액, 쿠폰 할인, 포인트/상품권 사용, 최종 결제 금액을 표시한다
 * - 모든 라벨은 data에서 로드한다
 */

'use client';

import { getPageData } from '@/lib/data';
import { formatPrice } from '@/lib/payments';

interface PriceSummaryProps {
  coursePrice: number;
  couponDiscount: number;
  pointUsed: number;
  voucherUsed: number;
}

export default function PriceSummary({
  coursePrice,
  couponDiscount,
  pointUsed,
  voucherUsed,
}: PriceSummaryProps) {
  const pageData = getPageData('checkout') as Record<string, Record<string, string>> | null;
  const labels = pageData?.summary ?? {};

  const totalDiscount = couponDiscount + pointUsed + voucherUsed;
  const finalPrice = Math.max(coursePrice - totalDiscount, 0);

  return (
    <>
      <h2 className="checkout-container__section-title">
        {labels.totalLabel ?? '최종 결제 금액'}
      </h2>

      <div className="checkout-container__summary-row">
        <span>{labels.coursePrice ?? '강의 금액'}</span>
        <span>{formatPrice(coursePrice)}</span>
      </div>
      <div className="checkout-container__summary-row">
        <span>{labels.couponDiscount ?? '쿠폰 할인'}</span>
        <span className={couponDiscount > 0 ? 'checkout-container__summary-discount' : ''}>
          {couponDiscount > 0 ? `-${formatPrice(couponDiscount)}` : formatPrice(0)}
        </span>
      </div>
      <div className="checkout-container__summary-row">
        <span>{labels.pointDiscount ?? '포인트 사용'}</span>
        <span>{pointUsed > 0 ? `-${formatPrice(pointUsed)}` : formatPrice(0)}</span>
      </div>

      <div className="checkout-container__summary-divider" />

      <div className="checkout-container__summary-row checkout-container__summary-row--total">
        <span>{labels.totalLabel ?? '최종 결제 금액'}</span>
        <span>{formatPrice(finalPrice)}</span>
      </div>
    </>
  );
}
