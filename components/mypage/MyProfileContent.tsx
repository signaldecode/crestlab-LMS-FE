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

const tabs = ['소개', '작성 및 활동', '팔로우'] as const;
type ProfileTab = (typeof tabs)[number];

const activityFilters = ['작성한 글', '댓글단 글', '저장한 글', '배지'];

interface MyProfileContentProps {
  userId?: string;
  userName?: string;
}

export default function MyProfileContent({ userId, userName }: MyProfileContentProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<ProfileTab>('소개');

  void userId;

  return (
    <div className="mypage-profile">
      {/* 탭 */}
      <div className="mypage-profile__tabs" role="tablist" aria-label="프로필 탭">
        {tabs.map((tab) => (
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
      {activeTab === '소개' && (
        <ProfileIntroTab userName={userName} />
      )}

      {/* 작성 및 활동 탭 */}
      {activeTab === '작성 및 활동' && (
        <>
          {/* 활동 필터 */}
          <div className="mypage-profile__filters">
            {activityFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`mypage-profile__filter${filter === '작성한 글' ? ' mypage-profile__filter--active' : ''}`}
              >
                {filter} <span className="mypage-profile__filter-count">0</span>
              </button>
            ))}
          </div>

          {/* 검색 + 정렬 */}
          <div className="mypage-profile__toolbar">
            <select className="mypage-profile__select" aria-label="필터">
              <option>전체</option>
            </select>
            <input
              type="search"
              className="mypage-profile__search"
              placeholder="검색어를 입력하세요"
              aria-label="검색"
            />
          </div>

          <div className="mypage-profile__result-info">
            <span>글 0건</span>
            <div className="mypage-profile__sort">
              <button type="button" className="mypage-profile__sort-btn mypage-profile__sort-btn--active">최신순</button>
              <button type="button" className="mypage-profile__sort-btn">오래된순</button>
            </div>
          </div>

          {/* 빈 상태 */}
          <div className="mypage-profile__empty">
            <p>아직은 비어있지만, 여기에 내 경험이 쌓일거에요.</p>
            <p>오늘 어떤 이야기를 남겨볼까요?</p>
            <Link href="/community/new" className="mypage-profile__write-btn">+ 글쓰기</Link>
          </div>
        </>
      )}

      {/* 팔로우 탭 */}
      {activeTab === '팔로우' && (
        <ProfileFollowTab />
      )}
    </div>
  );
}
