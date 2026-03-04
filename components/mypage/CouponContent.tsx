/**
 * 쿠폰 콘텐츠 (CouponContent)
 * - /mypage/coupons 페이지에서 사용
 * - 쿠폰 등록, 사용 가능/만료 쿠폰 목록 표시
 */

'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import useCouponStore from '@/stores/useCouponStore';
import { getExpiredCoupons } from '@/lib/data';
import type { CouponItem } from '@/stores/useCouponStore';

const SK = 'mypage-classroom';

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}

function getDaysRemaining(validTo: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(validTo.replace(/\./g, '-'));
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function CouponContent(): JSX.Element {
  const claimedCoupons = useCouponStore((s) => s.coupons);
  const expiredCoupons = getExpiredCoupons();
  const [couponCode, setCouponCode] = useState('');

  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>쿠폰</h2>
        <div className={`${SK}__coupon-page`}>
          {/* 쿠폰 등록 */}
          <div className={`${SK}__coupon-register`}>
            <input
              type="text"
              className={`${SK}__coupon-input`}
              placeholder="쿠폰 번호를 입력하세요."
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button type="button" className={`${SK}__coupon-register-btn`}>
              쿠폰 등록
            </button>
          </div>
          <p className={`${SK}__coupon-note`}>대소문자 구분을 확인하세요.</p>

          {/* 쿠폰 목록 */}
          <div className={`${SK}__coupon-list`}>
            {claimedCoupons.map((coupon: CouponItem) => {
              const daysLeft = getDaysRemaining(coupon.validTo);
              return (
                <div key={coupon.id} className={`${SK}__coupon-card`}>
                  <div className={`${SK}__coupon-card-left`}>
                    <span className={`${SK}__coupon-amount`}>
                      {formatPrice(coupon.amount)}
                    </span>
                    <p className={`${SK}__coupon-desc`}>
                      {coupon.description}
                      {coupon.discountRate > 0 && ` (${coupon.discountRate}% 할인)`}
                    </p>
                    <span className={`${SK}__coupon-period`}>
                      {daysLeft > 0 && (
                        <span className={`${SK}__coupon-remaining`}>{daysLeft}일 남음</span>
                      )}
                      {coupon.validFrom} ~ {coupon.validTo}
                    </span>
                  </div>
                  <div className={`${SK}__coupon-card-right`}>
                    <Link
                      href={`/courses/${coupon.courseSlug}`}
                      className={`${SK}__coupon-apply-link`}
                    >
                      적용상품 보기 &gt;
                    </Link>
                  </div>
                </div>
              );
            })}

            {expiredCoupons.map((coupon) => (
              <div key={coupon.id} className={`${SK}__coupon-card ${SK}__coupon-card--expired`}>
                <div className={`${SK}__coupon-card-left`}>
                  <span className={`${SK}__coupon-amount ${SK}__coupon-amount--expired`}>
                    {formatPrice(coupon.amount)}
                  </span>
                  <p className={`${SK}__coupon-desc ${SK}__coupon-desc--expired`}>{coupon.description}</p>
                  <span className={`${SK}__coupon-period ${SK}__coupon-period--expired`}>
                    {coupon.validFrom} ~ {coupon.validTo}
                  </span>
                </div>
                <div className={`${SK}__coupon-card-right`}>
                  <span className={`${SK}__coupon-expired-label`}>{coupon.status}</span>
                </div>
              </div>
            ))}

            {claimedCoupons.length === 0 && expiredCoupons.length === 0 && (
              <div className={`${SK}__empty`}>
                <p className={`${SK}__empty-text`}>쿠폰이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
