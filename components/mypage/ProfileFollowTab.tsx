/**
 * 프로필 팔로우 탭 (ProfileFollowTab)
 * - 팔로워 / 팔로잉 서브탭 전환
 * - 유저 카드 목록 렌더링
 */

'use client';

import { useState } from 'react';
import type { JSX } from 'react';
import Image from 'next/image';
import { getFollowers, getFollowing } from '@/lib/data';
import accountData from '@/data/accountData.json';

const followData = accountData.mypage.profileFollow;

type FollowSubTab = 'followers' | 'following';

export default function ProfileFollowTab(): JSX.Element {
  const [activeSubTab, setActiveSubTab] = useState<FollowSubTab>('followers');
  const followers = getFollowers();
  const following = getFollowing();

  const followerCount = followers.length;
  const followingCount = following.length;

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
        {followers.length === 0 ? (
          <p className="profile-follow__empty">
            {followData.emptyFollowers}
          </p>
        ) : (
          <div className="profile-follow__user-list">
            {followers.map((user) => (
              <div key={user.id} className="profile-follow__user-card">
                <div className="profile-follow__user-avatar">
                  <Image
                    src={user.profileImage}
                    alt={followData.defaultAvatarAlt}
                    width={48}
                    height={48}
                    className="profile-follow__user-img"
                  />
                </div>
                <div className="profile-follow__user-info">
                  <div className="profile-follow__user-name-row">
                    <span className="profile-follow__user-nickname">{user.nickname}</span>
                    {user.verified && (
                      <Image
                        src="/images/community/Bluecheck.png"
                        alt={accountData.profileCard.verifiedBadge.alt}
                        width={16}
                        height={16}
                        className="profile-follow__user-badge"
                      />
                    )}
                  </div>
                  <p className="profile-follow__user-bio">{user.bio}</p>
                </div>
                <button
                  type="button"
                  className="profile-follow__follow-btn"
                  aria-label={`${user.nickname} ${followData.followBtnLabel}`}
                >
                  {followData.followBtnLabel}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 팔로잉 패널 */}
      <div
        id="follow-panel-following"
        role="tabpanel"
        aria-labelledby="follow-tab-following"
        hidden={activeSubTab !== 'following'}
        className="profile-follow__panel"
      >
        {following.length === 0 ? (
          <p className="profile-follow__empty">
            {followData.emptyFollowing}
          </p>
        ) : (
          <div className="profile-follow__user-list">
            {following.map((user) => (
              <div key={user.id} className="profile-follow__user-card">
                <div className="profile-follow__user-avatar">
                  <Image
                    src={user.profileImage}
                    alt={followData.defaultAvatarAlt}
                    width={48}
                    height={48}
                    className="profile-follow__user-img"
                  />
                </div>
                <div className="profile-follow__user-info">
                  <div className="profile-follow__user-name-row">
                    <span className="profile-follow__user-nickname">{user.nickname}</span>
                    {user.verified && (
                      <Image
                        src="/images/community/Bluecheck.png"
                        alt={accountData.profileCard.verifiedBadge.alt}
                        width={16}
                        height={16}
                        className="profile-follow__user-badge"
                      />
                    )}
                  </div>
                  <p className="profile-follow__user-bio">{user.bio}</p>
                </div>
                <button
                  type="button"
                  className="profile-follow__follow-btn profile-follow__follow-btn--following"
                  aria-label={`${user.nickname} ${followData.followingBtnLabel}`}
                >
                  {followData.followingBtnLabel}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
