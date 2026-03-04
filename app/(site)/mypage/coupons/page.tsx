/**
 * 내 쿠폰 페이지 (/mypage/coupons)
 */

import type { JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import CouponContent from '@/components/mypage/CouponContent';

export default function CouponsPage(): JSX.Element {
  return (
    <section className="mypage">
      <div className="mypage__layout">
        <MyPageSidebar activeTab="classroom" />
        <div className="mypage__content">
          <CouponContent />
        </div>
      </div>
    </section>
  );
}
