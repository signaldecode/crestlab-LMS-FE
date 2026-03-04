/**
 * 게시글 작성자 사이드바 (PostAuthorAside)
 * - 작성자 프로필: 아바타, 이름, 레벨, 소속, 통계(팔로워/글/댓글/배지), 소개글
 * - 팔로우 버튼
 * - 작성자의 최근 글 3개
 */

import type { JSX } from 'react';

const SK = 'post-author';

export default function PostAuthorAside(): JSX.Element {
  return (
    <div className={`${SK}__sticky`}>
      {/* 작성자 프로필 카드 */}
      <div className={`${SK}__card`}>
        {/* 아바타 + 이름 + 레벨 */}
        <div className={`${SK}__header`}>
          <div className={`${SK}__skel-avatar`} />
          <div className={`${SK}__header-info`}>
            <div className={`${SK}__name-row`}>
              <span className={`${SK}__skel-line ${SK}__skel-line--name`} />
              <span className={`${SK}__skel-badge ${SK}__skel-badge--level`} />
            </div>
            <span className={`${SK}__skel-line ${SK}__skel-line--group`} />
          </div>
        </div>

        {/* 통계: 팔로워 · 작성한 글 · 댓글 · 배지 */}
        <div className={`${SK}__stats`}>
          <div className={`${SK}__stat`}>
            <span className={`${SK}__stat-label`}>팔로워</span>
            <span className={`${SK}__skel-line ${SK}__skel-line--stat-num`} />
          </div>
          <div className={`${SK}__stat`}>
            <span className={`${SK}__stat-label`}>작성한 글</span>
            <span className={`${SK}__skel-line ${SK}__skel-line--stat-num`} />
          </div>
          <div className={`${SK}__stat`}>
            <span className={`${SK}__stat-label`}>댓글</span>
            <span className={`${SK}__skel-line ${SK}__skel-line--stat-num`} />
          </div>
          <div className={`${SK}__stat`}>
            <span className={`${SK}__stat-label`}>배지</span>
            <span className={`${SK}__skel-line ${SK}__skel-line--stat-num`} />
          </div>
        </div>

        {/* 소개글 */}
        <div className={`${SK}__bio`}>
          <div className={`${SK}__skel-line ${SK}__skel-line--bio`} />
        </div>

        {/* 팔로우 버튼 */}
        <div className={`${SK}__skel-follow-btn`} />
      </div>

      {/* 작성자의 최근 글 */}
      <div className={`${SK}__posts`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`${SK}__post-item`}>
            <div className={`${SK}__post-body`}>
              <div className={`${SK}__skel-line ${SK}__skel-line--post-title`} />
              <div className={`${SK}__post-meta`}>
                <span className={`${SK}__skel-line ${SK}__skel-line--post-date`} />
                <span className={`${SK}__skel-line ${SK}__skel-line--post-stat`} />
                <span className={`${SK}__skel-line ${SK}__skel-line--post-stat`} />
                <span className={`${SK}__skel-line ${SK}__skel-line--post-stat`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
