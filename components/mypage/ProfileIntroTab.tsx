/**
 * 프로필 소개 탭 (ProfileIntroTab)
 * - 소개글 빈 상태 + 대표글 섹션
 * - 소개글이 없을 때: 작성 유도 안내
 * - 대표글이 없을 때: 글 추가하기 안내
 */

'use client';

import type { JSX } from 'react';
import Link from 'next/link';

interface ProfileIntroTabProps {
  userName?: string;
}

export default function ProfileIntroTab({ userName = '회원' }: ProfileIntroTabProps): JSX.Element {
  return (
    <div className="profile-intro">
      {/* 소개글 섹션 */}
      <div className="profile-intro__bio">
        <h3 className="profile-intro__bio-title">소개글이 없어요</h3>
        <p className="profile-intro__bio-desc">
          {userName}님을 다 잘 이해할 수 있도록 소개를 남겨주세요.
        </p>
        <p className="profile-intro__bio-desc">
          이루고 싶은 목표나 현재의 고민, 관심사를 나눠주시면 좋아요.
        </p>
        <Link href="/mypage/profile/edit" className="profile-intro__bio-btn">
          내 소개 작성하기
        </Link>
      </div>

      {/* 대표글 섹션 */}
      <div className="profile-intro__featured">
        <div className="profile-intro__featured-header">
          <h3 className="profile-intro__featured-title">대표글</h3>
          <span className="profile-intro__featured-count">0</span>
        </div>

        <div className="profile-intro__featured-empty">
          <span className="profile-intro__featured-icon" aria-hidden="true">📝</span>
          <p className="profile-intro__featured-label">글 추가하기</p>
          <p className="profile-intro__featured-desc">
            나의 이야기를 보여줄 글을 골라
            <br />
            프로필에 고정해보세요.
          </p>
          <button type="button" className="profile-intro__featured-add" aria-label="대표글 추가">
            +
          </button>
        </div>
      </div>
    </div>
  );
}
