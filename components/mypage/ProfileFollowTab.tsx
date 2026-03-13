/**
 * 프로필 팔로우 탭 (ProfileFollowTab)
 * - 팔로워 / 팔로잉 서브탭 전환
 * - 빈 상태 안내 메시지
 */

'use client';

import { useState } from 'react';
import type { JSX } from 'react';
import accountData from '@/data/accountData.json';

const followData = accountData.mypage.profileFollow;

type FollowSubTab = 'followers' | 'following';

interface ProfileFollowTabProps {
  followerCount?: number;
  followingCount?: number;
}

export default function ProfileFollowTab({
  followerCount = 0,
  followingCount = 0,
}: ProfileFollowTabProps): JSX.Element {
  const [activeSubTab, setActiveSubTab] = useState<FollowSubTab>('followers');

  return (
    <div className="profile-follow">
      {/* 서브탭: 팔로워 / 팔로잉 */}
      <div className="profile-follow__sub-tabs" role="tablist" aria-label={followData.tabsAriaLabel}>
        <button
          type="button"
          role="tab"
          id="follow-tab-followers"
          className={`profile-follow__sub-tab${activeSubTab === 'followers' ? ' profile-follow__sub-tab--active' : ''}`}
          aria-selected={activeSubTab === 'followers'}
          aria-controls="follow-panel-followers"
          onClick={() => setActiveSubTab('followers')}
        >
          {followData.followersLabel} <span className="profile-follow__sub-tab-count">{followerCount}</span>
        </button>
        <button
          type="button"
          role="tab"
          id="follow-tab-following"
          className={`profile-follow__sub-tab${activeSubTab === 'following' ? ' profile-follow__sub-tab--active' : ''}`}
          aria-selected={activeSubTab === 'following'}
          aria-controls="follow-panel-following"
          onClick={() => setActiveSubTab('following')}
        >
          {followData.followingLabel} <span className="profile-follow__sub-tab-count">{followingCount}</span>
        </button>
      </div>

      {/* 팔로워 패널 */}
      <div
        id="follow-panel-followers"
        role="tabpanel"
        aria-labelledby="follow-tab-followers"
        hidden={activeSubTab !== 'followers'}
        className="profile-follow__panel"
      >
        <p className="profile-follow__empty">
          {followData.emptyFollowers}
        </p>
      </div>

      {/* 팔로잉 패널 */}
      <div
        id="follow-panel-following"
        role="tabpanel"
        aria-labelledby="follow-tab-following"
        hidden={activeSubTab !== 'following'}
        className="profile-follow__panel"
      >
        <p className="profile-follow__empty">
          {followData.emptyFollowing}
        </p>
      </div>
    </div>
  );
}
