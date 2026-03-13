/**
 * 타 유저 프로필 페이지 (/mypage/[userId])
 * - 토글 없이 프로필 정보 + 팔로우 버튼만 표시
 */

import type { JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import MyProfileContent from '@/components/mypage/MyProfileContent';

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function OtherUserProfilePage({ params }: ProfilePageProps): Promise<JSX.Element> {
  const { userId } = await params;

  return (
    <section className="mypage">
      <div className="mypage__layout">
        <MyPageSidebar activeTab="profile" isOtherUser />
        <div className="mypage__content">
          <MyProfileContent userId={userId} />
        </div>
      </div>
    </section>
  );
}
