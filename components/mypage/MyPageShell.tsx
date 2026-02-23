/**
 * 마이페이지 셸 (MyPageShell)
 * - "내 강의실" / "프로필" 탭 전환 + 2칸 레이아웃
 * - 탭에 따라 사이드바 메뉴와 오른쪽 콘텐츠가 바뀐다
 */

'use client';

import { useState, type JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import MyClassroomContent from '@/components/mypage/MyClassroomContent';
import MyProfileContent from '@/components/mypage/MyProfileContent';

type MyPageTab = 'classroom' | 'profile';

export default function MyPageShell(): JSX.Element {
  const [activeTab, setActiveTab] = useState<MyPageTab>('classroom');

  return (
    <div className="mypage__layout">
      <MyPageSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mypage__content">
        {activeTab === 'classroom' ? <MyClassroomContent /> : <MyProfileContent />}
      </div>
    </div>
  );
}
