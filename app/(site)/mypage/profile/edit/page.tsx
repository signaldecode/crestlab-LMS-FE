/**
 * 프로필 수정 페이지 (/mypage/profile/edit)
 * - 닉네임, 소개글, 대표글을 편집할 수 있는 폼 페이지
 */

import type { JSX } from 'react';
import ProfileEditContent from '@/components/mypage/ProfileEditContent';

export default function ProfileEditPage(): JSX.Element {
  return (
    <section className="mypage">
      <ProfileEditContent />
    </section>
  );
}
