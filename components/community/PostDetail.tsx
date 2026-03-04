/**
 * 게시글 상세 (PostDetail)
 * - 게시글 본문(카테고리, 제목, 메타, 본문) + 좋아요/북마크/공유 스켈레톤
 */

import type { JSX } from 'react';

interface PostDetailProps {
  slug: string;
}

const SK = 'post-detail';

export default function PostDetail({ slug }: PostDetailProps): JSX.Element {
  return (
    <article className={SK} aria-label="게시글 상세">
      {/* 카테고리 뱃지 */}
      <div className={`${SK}__category`}>
        <span className={`${SK}__skel-badge`} />
      </div>

      {/* 제목 */}
      <div className={`${SK}__title-area`}>
        <div className={`${SK}__skel-line ${SK}__skel-line--title`} />
      </div>

      {/* 메타: 작성시간 · 조회수 */}
      <div className={`${SK}__meta`}>
        <span className={`${SK}__skel-line ${SK}__skel-line--date`} />
        <span className={`${SK}__meta-dot`} />
        <span className={`${SK}__skel-line ${SK}__skel-line--views`} />
      </div>

      {/* 본문 스켈레톤 */}
      <div className={`${SK}__body`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`${SK}__skel-line ${SK}__skel-line--body`}
            style={{ width: `${70 + Math.round((i * 17) % 30)}%` }}
          />
        ))}
        {/* 본문 이미지 영역 */}
        <div className={`${SK}__skel-image`} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`b${i}`}
            className={`${SK}__skel-line ${SK}__skel-line--body`}
            style={{ width: `${65 + Math.round((i * 23) % 35)}%` }}
          />
        ))}
      </div>

      {/* 좋아요 / 북마크 / 공유 */}
      <div className={`${SK}__actions`}>
        <div className={`${SK}__action-group`}>
          <span className={`${SK}__skel-action`} />
          <span className={`${SK}__skel-action`} />
        </div>
        <div className={`${SK}__action-group`}>
          <span className={`${SK}__skel-action`} />
          <span className={`${SK}__skel-action`} />
        </div>
      </div>
    </article>
  );
}
