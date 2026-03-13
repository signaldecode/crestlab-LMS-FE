/**
 * 마이페이지 (/mypage)
 * - 단일 페이지에서 토글로 강의실/프로필 전환
 * - 사이드바 + 콘텐츠 모두 같은 state를 참조하여 애니메이션이 끊기지 않음
 */

'use client';

import { useState } from 'react';
import type { JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import type { MyPageTab } from '@/components/mypage/MyPageSidebar';
import MyClassroomContent from '@/components/mypage/MyClassroomContent';
import MyProfileContent from '@/components/mypage/MyProfileContent';

export default function MyPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<MyPageTab>('classroom');

  return (
    <section className="mypage">
      <div className="mypage__layout">
        <MyPageSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mypage__content">
          {/* 콘텐츠 전환 (CSS 트랜지션) */}
          <div className="mypage__content-panels">
            <div
              className={`mypage__content-panel${activeTab === 'classroom' ? ' mypage__content-panel--active' : ''}`}
              aria-hidden={activeTab !== 'classroom'}
            >
              <MyClassroomContent />
            </div>
            <div
              className={`mypage__content-panel${activeTab === 'profile' ? ' mypage__content-panel--active' : ''}`}
              aria-hidden={activeTab !== 'profile'}
            >
              <MyProfileContent />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
