/**
 * 마이페이지 — 내 강의실 탭 (/mypage)
 * - 사이드바(탭 토글 + 프로필 카드 + 메뉴) + 내 강의실 콘텐츠
 */

import type { JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import MyClassroomContent from '@/components/mypage/MyClassroomContent';

export default function MyPageClassroomPage(): JSX.Element {
  return (
    <section className="mypage">
      <div className="mypage__layout">
        <MyPageSidebar activeTab="classroom" />
        <div className="mypage__content">
          <MyClassroomContent />
        </div>
      </div>
    </section>
  );
}
