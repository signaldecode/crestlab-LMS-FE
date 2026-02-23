/**
 * 커뮤니티 오른쪽 사이드 (CommunityAside)
 * - 주목받는 멤버 5명, 어제 댓글 랭킹 5명 스켈레톤
 */

import type { JSX } from 'react';

export default function CommunityAside(): JSX.Element {
  return (
    <aside className="community-aside">
      <div className="community-aside__sticky">
      {/* 주목받는 멤버 */}
      <div className="community-aside__section">
        <h3 className="community-aside__title">주목받는 멤버</h3>
        <ul className="community-aside__member-list">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="community-aside__member">
              <div className="community-aside__member-left">
                <div className="community-aside__avatar community-aside__skeleton-circle" />
                <div className="community-aside__member-info">
                  <div className="community-aside__skeleton-line community-aside__skeleton-line--name" />
                  <div className="community-aside__skeleton-line community-aside__skeleton-line--desc" />
                </div>
              </div>
              <div className="community-aside__follow-btn community-aside__skeleton-btn" />
            </li>
          ))}
        </ul>
      </div>

      {/* 어제 댓글 랭킹 */}
      <div className="community-aside__section">
        <h3 className="community-aside__title">어제 댓글 랭킹</h3>
        <ul className="community-aside__member-list">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="community-aside__member">
              <div className="community-aside__member-left">
                <span className="community-aside__rank">{i + 1}</span>
                <div className="community-aside__avatar community-aside__skeleton-circle" />
                <div className="community-aside__member-info">
                  <div className="community-aside__skeleton-line community-aside__skeleton-line--name" />
                  <div className="community-aside__skeleton-line community-aside__skeleton-line--sub" />
                </div>
              </div>
              <div className="community-aside__follow-btn community-aside__skeleton-btn" />
            </li>
          ))}
        </ul>
      </div>
      </div>
    </aside>
  );
}
