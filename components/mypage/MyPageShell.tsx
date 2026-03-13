/**
 * 마이페이지 셸 (MyPageShell)
 * - 이전 호환용: /account 등에서 참조 시 /mypage와 동일한 레이아웃을 렌더링한다
 */

'use client';

import { useState } from 'react';
import type { JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import type { MyPageTab } from '@/components/mypage/MyPageSidebar';
import MyClassroomContent from '@/components/mypage/MyClassroomContent';
import MyProfileContent from '@/components/mypage/MyProfileContent';

export default function MyPageShell(): JSX.Element {
  const [activeTab, setActiveTab] = useState<MyPageTab>('classroom');

  return (
    <div className="mypage__layout">
      <MyPageSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mypage__content">
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
  );
}
