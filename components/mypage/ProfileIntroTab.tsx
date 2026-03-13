/**
 * 프로필 소개 탭 (ProfileIntroTab)
 * - 소개글 빈 상태 + 대표글 섹션
 * - 소개글이 없을 때: 작성 유도 안내
 * - 대표글이 없을 때: 글 추가하기 안내
 */

'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import accountData from '@/data/accountData.json';

const introData = accountData.mypage.profileIntro;
const fallbackName = accountData.mypage.sidebar.fallbackName;

interface ProfileIntroTabProps {
  userName?: string;
}

export default function ProfileIntroTab({ userName = fallbackName }: ProfileIntroTabProps): JSX.Element {
  return (
    <div className="profile-intro">
      {/* 소개글 섹션 */}
      <div className="profile-intro__bio">
        <h3 className="profile-intro__bio-title">{introData.bioEmptyTitle}</h3>
        <p className="profile-intro__bio-desc">
          {introData.bioEmptyDescTemplate.replace('{userName}', userName)}
        </p>
        <p className="profile-intro__bio-desc">
          {introData.bioEmptySubDesc}
        </p>
        <Link href="/mypage/profile/edit" className="profile-intro__bio-btn">
          {introData.bioWriteLabel}
        </Link>
      </div>

      {/* 대표글 섹션 */}
      <div className="profile-intro__featured">
        <div className="profile-intro__featured-header">
          <h3 className="profile-intro__featured-title">{introData.featuredTitle}</h3>
          <span className="profile-intro__featured-count">0</span>
        </div>

        <div className="profile-intro__featured-empty">
          <span className="profile-intro__featured-icon" aria-hidden="true">📝</span>
          <p className="profile-intro__featured-label">{introData.featuredAddLabel}</p>
          <p className="profile-intro__featured-desc">
            {introData.featuredAddDescLine1}
            <br />
            {introData.featuredAddDescLine2}
          </p>
          <button type="button" className="profile-intro__featured-add" aria-label={introData.featuredAddAriaLabel}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}
