/**
 * 상품권 페이지 (/mypage/giftcards)
 */

import type { JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import GiftcardContent from '@/components/mypage/GiftcardContent';

export default function GiftcardsPage(): JSX.Element {
  return (
    <section className="mypage">
      <div className="mypage__layout">
        <MyPageSidebar activeTab="classroom" />
        <div className="mypage__content">
          <GiftcardContent />
        </div>
      </div>
    </section>
  );
}
