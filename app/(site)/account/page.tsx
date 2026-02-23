/**
 * 마이페이지 (AccountPage)
 * - "내 강의실" / "프로필" 두 탭으로 전환되는 2칸 레이아웃
 */

import type { JSX } from 'react';
import MyPageShell from '@/components/mypage/MyPageShell';

export default function AccountPage(): JSX.Element {
  return (
    <section className="mypage">
      <MyPageShell />
    </section>
  );
}
