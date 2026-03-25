/**
 * 공통 프로필 카드 (ProfileCard)
 * - 마이페이지 사이드바, 커뮤니티 사이드바 등에서 재사용
 * - options prop으로 표시 요소를 선택적으로 제어한다
 *
 * 표시 옵션:
 *   showCover         — 커버 이미지 + 아바타 겹침 (false면 아바타만 단독 표시)
 *   showRole          — 닉네임 하단 역할/소속 라벨
 *   showFollowerCount — 팔로워 수 텍스트
 *   showLevel         — 커뮤니티 레벨 프로그레스바
 *   showStats         — 하단 통계 영역
 */

'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import type {
  ProfileCardUser,
  ProfileCardStat,
  ProfileCardOptions,
  CommunityLevelData,
} from '@/types';

interface ProfileCardProps {
  /** 유저 정보 */
  user: ProfileCardUser;
  /** 표시 옵션 (기본값: 모두 true) */
  options?: ProfileCardOptions;
  /** 인증 뱃지 이미지 */
  verifiedBadge?: { src: string; alt: string };
  /** 통계 아이템 목록 */
  stats?: ProfileCardStat[];
  /** statValues 매핑 (커뮤니티처럼 key→value 매핑이 별도인 경우) */
  statValues?: Record<string, string | number>;
  /** 커뮤니티 레벨 데이터 */
  level?: CommunityLevelData;
  /** 커버/아바타 alt 텍스트 */
  coverImageAlt?: string;
  avatarAlt?: string;
  /** 프로필 영역 aria-label */
  ariaLabel?: string;
  /** 카드 하단에 추가 콘텐츠 (토글, 모드패널 등) */
  children?: React.ReactNode;
}

const DEFAULT_OPTIONS: Required<ProfileCardOptions> = {
  showCover: true,
  showRole: true,
  showFollowerCount: true,
  showLevel: true,
  showStats: true,
};

export default function ProfileCard({
  user,
  options,
  verifiedBadge,
  stats,
  statValues,
  level,
  coverImageAlt,
  avatarAlt,
  ariaLabel,
  children,
}: ProfileCardProps): JSX.Element {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return (
    <div className="profile-card" aria-label={ariaLabel}>
      {/* ── 커버 + 아바타 (겹침) ── */}
      {opts.showCover && (
        <div className="profile-card__cover">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt={coverImageAlt ?? ''}
              fill
              sizes="300px"
              className="profile-card__cover-img"
            />
          ) : (
            <div className="profile-card__cover-placeholder" />
          )}
          <div className="profile-card__avatar-wrap profile-card__avatar-wrap--overlay">
            <AvatarImage user={user} avatarAlt={avatarAlt} />
          </div>
        </div>
      )}

      {/* ── 아바타 단독 (커버 없을 때) ── */}
      {!opts.showCover && (
        <div className="profile-card__avatar-wrap profile-card__avatar-wrap--standalone">
          <AvatarImage user={user} avatarAlt={avatarAlt} />
        </div>
      )}

      {/* ── 유저 정보 ── */}
      <div className={`profile-card__identity${opts.showCover ? ' profile-card__identity--with-cover' : ''}`}>
        <div className="profile-card__name-row">
          <span className="profile-card__username">{user.nickname}</span>
          {user.verified && verifiedBadge && (
            <Image
              src={verifiedBadge.src}
              alt={verifiedBadge.alt}
              width={16}
              height={16}
              className="profile-card__verified-badge"
            />
          )}
        </div>

        {opts.showRole && user.role && (
          <span className="profile-card__role">{user.role}</span>
        )}

        {opts.showFollowerCount && user.followerCount && (
          <span className="profile-card__follower-count">{user.followerCount}</span>
        )}
      </div>

      {/* ── 커뮤니티 레벨 ── */}
      {opts.showLevel && level && (
        <div className="profile-card__level">
          <div className="profile-card__level-header">
            <span className="profile-card__level-title">{level.title}</span>
            <button
              type="button"
              className="profile-card__level-tooltip-btn"
              aria-label={level.tooltipAriaLabel}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </button>
          </div>
          <div className="profile-card__level-bar">
            <div
              className="profile-card__level-fill"
              style={{ width: `${level.progressPercent}%` }}
            />
          </div>
          <div className="profile-card__level-steps">
            {level.steps.map((step) => (
              <span key={step} className="profile-card__level-step">{step}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── 통계 ── */}
      {opts.showStats && stats && stats.length > 0 && (
        <div className="profile-card__stats">
          {stats.map((stat) => {
            const value = statValues
              ? (statValues[stat.key] ?? stat.value ?? '-')
              : (stat.value ?? '-');
            const displayValue = typeof value === 'number' ? value.toLocaleString() : value;

            return (
              <div key={stat.key} className="profile-card__stat">
                <span className="profile-card__stat-label">{stat.label}</span>
                <span className="profile-card__stat-value">{displayValue}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 추가 콘텐츠 (토글/모드패널 등) ── */}
      {children}
    </div>
  );
}

/** 아바타 이미지 (내부 헬퍼) */
function AvatarImage({ user, avatarAlt }: { user: ProfileCardUser; avatarAlt?: string }): JSX.Element {
  if (user.profileImage) {
    return (
      <Image
        src={user.profileImage}
        alt={avatarAlt ?? `${user.nickname} 프로필`}
        width={72}
        height={72}
        className="profile-card__avatar-img"
      />
    );
  }

  return (
    <div className="profile-card__avatar profile-card__avatar--default">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
}
