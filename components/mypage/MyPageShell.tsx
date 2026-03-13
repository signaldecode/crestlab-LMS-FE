/**
 * 마이페이지 셸 (MyPageShell)
 * - 이전 호환용: /account 등에서 참조 시 /mypage와 동일한 레이아웃을 렌더링한다
 * - Zustand store 기반으로 상태를 관리한다
 */

'use client';

import type { JSX } from 'react';
import useMyPageStore from '@/stores/useMyPageStore';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import MyClassroomContent from '@/components/mypage/MyClassroomContent';
import MyProfileContent from '@/components/mypage/MyProfileContent';

export default function MyPageShell(): JSX.Element {
  const activeSection = useMyPageStore((s) => s.activeSection);

  return (
    <div className="mypage__layout">
      <MyPageSidebar />
      <div className="mypage__content">
        <div className="mypage__content-panels">
          <div
            className={`mypage__content-panel${activeSection === 'classroom' ? ' mypage__content-panel--active' : ''}`}
            aria-hidden={activeSection !== 'classroom'}
          >
            <MyClassroomContent />
          </div>
          <div
            className={`mypage__content-panel${activeSection === 'profile' ? ' mypage__content-panel--active' : ''}`}
            aria-hidden={activeSection !== 'profile'}
          >
            <MyProfileContent />
          </div>
        </div>
      </div>
    </div>
  );
}
