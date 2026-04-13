/**
 * 마이페이지 기본 라우트 (/mypage)
 * - 내 강의 목록을 표시한다
 */

import type { JSX } from 'react';
import MyClassroomContent from '@/components/mypage/MyClassroomContent';

export default function MyPage(): JSX.Element {
  return <MyClassroomContent />;
}
