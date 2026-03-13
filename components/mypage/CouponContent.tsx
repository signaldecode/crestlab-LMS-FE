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
import accountData from '@/data/accountData.json';
import uiData from '@/data/uiData.json';
import type { CouponItem } from '@/stores/useCouponStore';

const couponPageData = accountData.mypage.couponsPage;
const SK = 'mypage-classroom';

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + uiData.priceUnit;
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
        <h2 className={`${SK}__menu-title`}>{couponPageData.title}</h2>
        <div className={`${SK}__coupon-page`}>
          {/* 쿠폰 등록 */}
          <div className={`${SK}__coupon-register`}>
            <input
              type="text"
              className={`${SK}__coupon-input`}
              placeholder={couponPageData.registerPlaceholder}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button type="button" className={`${SK}__coupon-register-btn`}>
              {couponPageData.registerButton}
            </button>
          </div>
          <p className={`${SK}__coupon-note`}>{couponPageData.registerNote}</p>

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
                      {coupon.discountRate > 0 && ` (${coupon.discountRate}${couponPageData.discountSuffix})`}
                    </p>
                    <span className={`${SK}__coupon-period`}>
                      {daysLeft > 0 && (
                        <span className={`${SK}__coupon-remaining`}>{daysLeft}{couponPageData.remainingSuffix}</span>
                      )}
                      {coupon.validFrom} ~ {coupon.validTo}
                    </span>
                  </div>
                  <div className={`${SK}__coupon-card-right`}>vscode-webview://1tln9mqp3smtksr4epaav6brjht21f440sebhegkagniakuhbdtu/index.html?id=4985b833-5ec3-4821-af70-56a26e9f18fc&parentId=1&origin=c4f8db38-8c87-4112-b7c7-1b7ff1a5fa28&swVersion=4&extensionId=Anthropic.claude-code&platform=electron&vscode-resource-base-authority=vscode-resource.vscode-cdn.net&parentOrigin=vscode-file%3A%2F%2Fvscode-app&session=f7dbe986-e57c-47eb-9da7-b256ffa34080#
                    <Link
                      href={`/courses/${coupon.courseSlug}`}
                      className={`${SK}__coupon-apply-link`}
                    >
                      {couponPageData.viewProductLabel}
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
                <p className={`${SK}__empty-text`}>{couponPageData.emptyText}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
