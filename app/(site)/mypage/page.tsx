/**
 * 마이페이지 (/mypage)
 * - 단일 페이지에서 모든 섹션을 상태 기반으로 전환 (SPA 방식)
 * - 사이드바 토글(강의실/프로필) + 서브 콘텐츠 모두 동일한 CSS 트랜지션 적용
 */

'use client';

import type { JSX } from 'react';
import useMyPageStore from '@/stores/useMyPageStore';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import MyClassroomContent from '@/components/mypage/MyClassroomContent';
import MyProfileContent from '@/components/mypage/MyProfileContent';
import WishlistContent from '@/components/mypage/WishlistContent';
import OrderContent from '@/components/mypage/OrderContent';
import CouponContent from '@/components/mypage/CouponContent';
import PointContent from '@/components/mypage/PointContent';
import GiftcardContent from '@/components/mypage/GiftcardContent';
import ReviewContent from '@/components/mypage/ReviewContent';
import CertificateContent from '@/components/mypage/CertificateContent';
import ConsultationContent from '@/components/mypage/ConsultationContent';
import ProfileEditContent from '@/components/mypage/ProfileEditContent';
import ProfileIntroEditContent from '@/components/mypage/ProfileIntroEditContent';
import type { MyPageSection } from '@/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
const sectionComponents: Record<MyPageSection, React.ComponentType<any>> = {
  classroom: MyClassroomContent,
  profile: MyProfileContent,
  wishlist: WishlistContent,
  orders: OrderContent,
  coupons: CouponContent,
  points: PointContent,
  giftcards: GiftcardContent,
  reviews: ReviewContent,
  certificates: CertificateContent,
  consultations: ConsultationContent,
  profileEdit: ProfileEditContent,
  profileIntroEdit: ProfileIntroEditContent,
};

const sectionKeys = Object.keys(sectionComponents) as MyPageSection[];

export default function MyPage(): JSX.Element {
  const activeSection = useMyPageStore((s) => s.activeSection);

  return (
    <section className="mypage">
      <div className="mypage__layout">
        <MyPageSidebar />
        <div className="mypage__content">
          <div className="mypage__content-panels">
            {sectionKeys.map((key) => {
              const Component = sectionComponents[key];
              return (
                <div
                  key={key}
                  className={`mypage__content-panel${activeSection === key ? ' mypage__content-panel--active' : ''}`}
                  aria-hidden={activeSection !== key}
                >
                  <Component />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
