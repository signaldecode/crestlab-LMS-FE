/**
 * 관심 클래스 페이지 (/mypage/wishlist)
 * - 사이드바(탭 토글 + 프로필 카드 + 메뉴) + 관심 클래스 콘텐츠
 */

import type { JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import WishlistContent from '@/components/mypage/WishlistContent';

export default function WishlistPage(): JSX.Element {
  return (
    <section className="mypage">
      <div className="mypage__layout">
        <MyPageSidebar activeTab="classroom" />
        <div className="mypage__content">
          <WishlistContent />
        </div>
      </div>
    </section>
  );
}
