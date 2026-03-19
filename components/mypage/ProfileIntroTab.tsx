/**
 * 프로필 소개 탭 (ProfileIntroTab)
 * - 소개글이 있으면 본문 표시, 없으면 작성 유도
 * - 대표글 섹션: 빈 상태 or 글 목록
 * - "내 소개 작성하기" 클릭 시 profileIntroEdit 섹션으로 전환
 */

'use client';

import { useCallback } from 'react';
import type { JSX } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import useMyPageStore from '@/stores/useMyPageStore';
import accountData from '@/data/accountData.json';

const introData = accountData.mypage.profileIntro;
const fallbackName = accountData.mypage.sidebar.fallbackName;

interface ProfileIntroTabProps {
  userName?: string;
  isOtherUser?: boolean;
}

export default function ProfileIntroTab({ userName = fallbackName, isOtherUser = false }: ProfileIntroTabProps): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const setActiveSection = useMyPageStore((s) => s.setActiveSection);

  const bio = user?.bio ?? '';
  const featuredCount = user?.featuredPostIds?.length ?? 0;

  const goToEdit = useCallback(() => {
    setActiveSection('profileIntroEdit');
  }, [setActiveSection]);

  return (
    <div className="profile-intro">
      {/* 소개글 섹션 */}
      {bio ? (
        <div className="profile-intro__bio profile-intro__bio--filled">
          <p className="profile-intro__bio-text">{bio}</p>
          {!isOtherUser && (
            <button type="button" className="profile-intro__bio-edit-btn" onClick={goToEdit}>
              {introData.bioWriteLabel}
            </button>
          )}
        </div>
      ) : (
        <div className="profile-intro__bio">
          <h3 className="profile-intro__bio-title">{introData.bioEmptyTitle}</h3>
          <p className="profile-intro__bio-desc">
            {introData.bioEmptyDescTemplate.replace('{userName}', userName)}
          </p>
          <p className="profile-intro__bio-desc">
            {introData.bioEmptySubDesc}
          </p>
          {!isOtherUser && (
            <button type="button" className="profile-intro__bio-btn" onClick={goToEdit}>
              {introData.bioWriteLabel}
            </button>
          )}
        </div>
      )}

      {/* 대표글 섹션 */}
      <div className="profile-intro__featured">
        <div className="profile-intro__featured-header">
          <h3 className="profile-intro__featured-title">{introData.featuredTitle}</h3>
          <span className="profile-intro__featured-count">{featuredCount}</span>
        </div>

        <div className="profile-intro__featured-empty">
          <p className="profile-intro__featured-label">{introData.featuredAddLabel}</p>
          <p className="profile-intro__featured-desc">
            {introData.featuredAddDescLine1}
            <br />
            {introData.featuredAddDescLine2}
          </p>
          {!isOtherUser && (
            <button
              type="button"
              className="profile-intro__featured-add-btn"
              aria-label={introData.featuredAddAriaLabel}
            >
              {introData.featuredAddBtnLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
