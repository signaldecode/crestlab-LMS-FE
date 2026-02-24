/**
 * 마이페이지 — 프로필 탭 (/mypage/[userId])
 * - 사이드바(탭 토글 + 프로필 카드 + 메뉴) + 프로필 콘텐츠
 * - userId로 해당 유저의 프로필을 표시한다
 */

import type { JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import MyProfileContent from '@/components/mypage/MyProfileContent';

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function MyPageProfilePage({ params }: ProfilePageProps): Promise<JSX.Element> {
  const { userId } = await params;

  return (
    <section className="mypage">
      <div className="mypage__layout">
        <MyPageSidebar activeTab="profile" userId={userId} />
        <div className="mypage__content">
          <MyProfileContent userId={userId} />
        </div>
      </div>
    </section>
  );
}
