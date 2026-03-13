/**
 * 커뮤니티 오른쪽 사이드 (CommunityAside)
 * - asideSections data 기반으로 섹션을 렌더링한다 (추후 admin에서 관리)
 * - showRank 플래그에 따라 랭킹 번호 표시 여부를 결정한다
 */

import type { JSX } from 'react';
import mainData from '@/data';
import type { AsideSection } from '@/types';

const { asideSections } = mainData.community;

export default function CommunityAside(): JSX.Element {
  return (
    <aside className="community-aside">
      <div className="community-aside__sticky">
      {/* Aside 섹션 — data 기반 for문 렌더링 */}
      {asideSections.map((section) => (
        <AsideSectionBlock key={section.id} section={section} />
      ))}
      </div>
    </aside>
  );
}

/** Aside 섹션 블록 — showRank에 따라 랭킹 번호 표시 */
function AsideSectionBlock({ section }: { section: AsideSection }): JSX.Element {
  return (
    <div className="community-aside__section">
      <h3 className="community-aside__title">{section.title}</h3>
      <ul className="community-aside__member-list">
        {Array.from({ length: section.itemCount }).map((_, i) => (
          <li key={i} className="community-aside__member">
            <div className="community-aside__member-left">
              {section.showRank && (
                <span className="community-aside__rank">{i + 1}</span>
              )}
              <div className="community-aside__avatar community-aside__skeleton-circle" />
              <div className="community-aside__member-info">
                <div className="community-aside__skeleton-line community-aside__skeleton-line--name" />
                <div className={`community-aside__skeleton-line community-aside__skeleton-line--${section.showRank ? 'sub' : 'desc'}`} />
              </div>
            </div>
            <div className="community-aside__follow-btn community-aside__skeleton-btn" />
          </li>
        ))}
      </ul>
    </div>
  );
}
