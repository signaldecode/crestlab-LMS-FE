/**
 * 커뮤니티 오른쪽 사이드 (CommunityAside)
 * - asideSections data 기반으로 섹션을 렌더링한다 (추후 admin에서 관리)
 * - type='profile': 추천 프로필 (팔로워 수 + 팔로우 버튼)
 * - type='ranking': 댓글 랭킹 (순위 + 댓글/좋아요 stats + 팔로우 버튼)
 * - 더미데이터가 있으면 실제 렌더링, 없으면 스켈레톤
 */

import type { JSX } from 'react';
import Image from 'next/image';
import mainData from '@/data';
import type { AsideSection } from '@/types';

const {
  asideSections,
  verifiedBadge,
  dummyRecommendedProfiles,
  dummyCommentRanking,
} = mainData.community;

export default function CommunityAside(): JSX.Element {
  return (
    <aside className="community-aside">
      <div className="community-aside__sticky">
        {asideSections.map((section) => (
          <AsideSectionBlock key={section.id} section={section} />
        ))}
      </div>
    </aside>
  );
}

/** Aside 섹션 블록 */
function AsideSectionBlock({ section }: { section: AsideSection }): JSX.Element {
  if (section.type === 'profile') {
    return <ProfileSection section={section} />;
  }
  return <RankingSection section={section} />;
}

/** 추천 프로필 섹션 */
function ProfileSection({ section }: { section: AsideSection }): JSX.Element {
  const profiles = dummyRecommendedProfiles ?? [];

  return (
    <div className="community-aside__section">
      <h3 className="community-aside__title">{section.title}</h3>
      <ul className="community-aside__member-list">
        {profiles.slice(0, section.itemCount).map((profile) => (
          <li key={profile.id} className="community-aside__member">
            <div className="community-aside__member-left">
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={`${profile.nickname} 프로필`}
                  width={40}
                  height={40}
                  className="community-aside__avatar"
                />
              ) : (
                <div className="community-aside__avatar community-aside__avatar--placeholder" />
              )}
              <div className="community-aside__member-info">
                <div className="community-aside__name-row">
                  <span className="community-aside__nickname">{profile.nickname}</span>
                  {profile.verified && (
                    <Image
                      src={verifiedBadge.src}
                      alt={verifiedBadge.alt}
                      width={14}
                      height={14}
                      className="community-aside__verified-img"
                    />
                  )}
                </div>
                <span className="community-aside__follower-count">{profile.followerCount}</span>
              </div>
            </div>
            <button type="button" className="community-aside__follow-btn">
              팔로우
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 댓글 랭킹 섹션 */
function RankingSection({ section }: { section: AsideSection }): JSX.Element {
  const ranking = dummyCommentRanking ?? [];
  const statLabels = section.statLabels ?? [];

  return (
    <div className="community-aside__section">
      <h3 className="community-aside__title">{section.title}</h3>
      <ul className="community-aside__member-list">
        {ranking.slice(0, section.itemCount).map((user, i) => (
          <li key={user.id} className="community-aside__member">
            <div className="community-aside__member-left">
              {section.showRank && (
                <span className="community-aside__rank">{i + 1}</span>
              )}
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={`${user.nickname} 프로필`}
                  width={40}
                  height={40}
                  className="community-aside__avatar"
                />
              ) : (
                <div className="community-aside__avatar community-aside__avatar--placeholder" />
              )}
              <div className="community-aside__member-info">
                <div className="community-aside__name-row">
                  <span className="community-aside__nickname">{user.nickname}</span>
                  {user.verified && (
                    <Image
                      src={verifiedBadge.src}
                      alt={verifiedBadge.alt}
                      width={14}
                      height={14}
                      className="community-aside__verified-img"
                    />
                  )}
                </div>
                <div className="community-aside__stat-row">
                  {statLabels.map((stat) => (
                    <span key={stat.key} className="community-aside__stat-item">
                      <span className="community-aside__stat-label">{stat.label}</span>
                      <span className="community-aside__stat-value">
                        {stat.key === 'comment' ? user.commentCount : user.likeCount}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button type="button" className="community-aside__follow-btn">
              팔로우
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
