/**
 * 구매 내역 페이지 (/mypage/orders)
 */

import type { JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import OrderContent from '@/components/mypage/OrderContent';

export default function OrdersPage(): JSX.Element {
  return (
    <section className="mypage">
      <div className="mypage__layout">
        <MyPageSidebar activeTab="classroom" />
        <div className="mypage__content">
          <OrderContent />
        </div>
      </div>
    </section>
  );
}
