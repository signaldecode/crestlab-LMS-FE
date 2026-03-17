/**
 * 쿠폰 선택 드롭다운 (CouponSelect)
 * - 보유 쿠폰 목록을 드롭다운으로 표시하고 적용/해제를 처리한다
 * - 라벨은 data에서 로드한다
 */

'use client';

import { getPageData } from '@/lib/data';
import type { CouponItem } from '@/stores/useCouponStore';

interface CouponSelectProps {
  coupon: CouponItem | null;
  applied: boolean;
  onApply: (applied: boolean) => void;
  onToggleCode: () => void;
}

export default function CouponSelect({
  coupon,
  applied,
  onApply,
  onToggleCode,
}: CouponSelectProps) {
  const pageData = getPageData('checkout') as Record<string, Record<string, string>> | null;
  const sections = pageData?.sections ?? {};

  return (
    <div className="checkout-container__section">
      <div className="checkout-container__section-header">
        <h2 className="checkout-container__section-title">
          {sections.coupon ?? '쿠폰'}
        </h2>
        <button
          type="button"
          className="checkout-container__coupon-link"
          onClick={onToggleCode}
        >
          {sections.couponCode ?? '쿠폰코드'} &gt;
        </button>
      </div>
      <div className="checkout-container__select-wrap">
        <select
          className="checkout-container__select"
          disabled={!coupon}
          value={applied ? 'apply' : ''}
          onChange={(e) => onApply(e.target.value === 'apply')}
          aria-label={sections.couponSelect ?? '쿠폰 선택'}
        >
          {coupon ? (
            <>
              <option value="">{sections.couponNone ?? '사용 안 함'}</option>
              <option value="apply">{coupon.discountRate}% 할인 쿠폰</option>
            </>
          ) : (
            <option value="">사용가능한 쿠폰이 없어요</option>
          )}
        </select>
        <svg
          className="checkout-container__select-arrow"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
    </div>
  );
}
