/**
 * 후기 관리 페이지 (/mypage/reviews)
 */

import type { JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import ReviewContent from '@/components/mypage/ReviewContent';

export default function ReviewsPage(): JSX.Element {
  return (
    <section className="mypage">
      <div className="mypage__layout">
        <MyPageSidebar activeTab="classroom" />
        <div className="mypage__content">
          <ReviewContent />
        </div>
      </div>
    </section>
  );
}
