/**
 * 프로필 팔로우 탭 (ProfileFollowTab)
 * - 팔로워 / 팔로잉 서브탭 전환
 * - 빈 상태 안내 메시지
 */

'use client';

import { useState } from 'react';
import type { JSX } from 'react';

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
      <div className="profile-follow__sub-tabs" role="tablist" aria-label="팔로우 탭">
        <button
          type="button"
          role="tab"
          id="follow-tab-followers"
          className={`profile-follow__sub-tab${activeSubTab === 'followers' ? ' profile-follow__sub-tab--active' : ''}`}
          aria-selected={activeSubTab === 'followers'}
          aria-controls="follow-panel-followers"
          onClick={() => setActiveSubTab('followers')}
        >
          팔로워 <span className="profile-follow__sub-tab-count">{followerCount}</span>
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
          팔로잉 <span className="profile-follow__sub-tab-count">{followingCount}</span>
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
          나를 팔로우한 사용자가 없습니다.
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
          팔로잉 중인 사용자가 없습니다.
        </p>
      </div>
    </div>
  );
}
