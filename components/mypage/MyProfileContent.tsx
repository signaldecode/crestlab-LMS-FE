/**
 * 프로필 콘텐츠 (MyProfileContent)
 * - 탭(소개 / 작성 및 활동 / 팔로우) 전환
 * - 각 탭에 해당하는 콘텐츠 컴포넌트를 렌더링한다
 */

'use client';

import { useState } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import ProfileIntroTab from '@/components/mypage/ProfileIntroTab';
import ProfileFollowTab from '@/components/mypage/ProfileFollowTab';
import accountData from '@/data/accountData.json';

const profileData = accountData.mypage.profile;

interface MyProfileContentProps {
  userId?: string;
  userName?: string;
}

export default function MyProfileContent({ userId, userName }: MyProfileContentProps): JSX.Element {
  const [activeTab, setActiveTab] = useState(profileData.tabs[0]);

  void userId;

  return (
    <div className="mypage-profile">
      {/* 탭 */}
      <div className="mypage-profile__tabs" role="tablist" aria-label={profileData.tabsAriaLabel}>
        {profileData.tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            className={`mypage-profile__tab${tab === activeTab ? ' mypage-profile__tab--active' : ''}`}
            aria-selected={tab === activeTab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 소개 탭 */}
      {activeTab === profileData.tabs[0] && (
        <ProfileIntroTab userName={userName} />
      )}

      {/* 작성 및 활동 탭 */}
      {activeTab === profileData.tabs[1] && (
        <>
          {/* 활동 필터 */}
          <div className="mypage-profile__filters">
            {profileData.activityFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`mypage-profile__filter${filter === profileData.activityFilters[0] ? ' mypage-profile__filter--active' : ''}`}
              >
                {filter} <span className="mypage-profile__filter-count">0</span>
              </button>
            ))}
          </div>

          {/* 검색 + 정렬 */}
          <div className="mypage-profile__toolbar">
            <select className="mypage-profile__select" aria-label={profileData.filterAriaLabel}>
              <option>{profileData.filterAllLabel}</option>
            </select>
            <input
              type="search"
              className="mypage-profile__search"
              placeholder={profileData.searchPlaceholder}
              aria-label={profileData.searchAriaLabel}
            />
          </div>

          <div className="mypage-profile__result-info">
            <span>{profileData.resultCountTemplate.replace('{count}', '0')}</span>
            <div className="mypage-profile__sort">
              {profileData.sortOptions.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  className={`mypage-profile__sort-btn${i === 0 ? ' mypage-profile__sort-btn--active' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 빈 상태 */}
          <div className="mypage-profile__empty">
            <p>{profileData.emptyActivity.line1}</p>
            <p>{profileData.emptyActivity.line2}</p>
            <Link href="/community/new" className="mypage-profile__write-btn">{profileData.emptyActivity.writeLabel}</Link>
          </div>
        </>
      )}

      {/* 팔로우 탭 */}
      {activeTab === profileData.tabs[2] && (
        <ProfileFollowTab />
      )}
    </div>
  );
}
