/**
 * 마이페이지 셸 (MyPageShell)
 * - 이전 호환용: /account 등에서 참조 시 /mypage와 동일한 레이아웃을 렌더링한다
 * - 실제 탭 전환은 라우트 기반(/mypage, /mypage/[userId])으로 처리된다
 */

import type { JSX } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import MyClassroomContent from '@/components/mypage/MyClassroomContent';

export default function MyPageShell(): JSX.Element {
  return (
    <div className="mypage__layout">
      <MyPageSidebar activeTab="classroom" />
      <div className="mypage__content">
        <MyClassroomContent />
      </div>
    </div>
  );
}
