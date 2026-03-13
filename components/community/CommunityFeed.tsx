/**
 * 커뮤니티 가운데 피드 (CommunityFeed)
 * - 탭과 피드 섹션을 data 기반으로 렌더링한다 (추후 admin에서 관리)
 * - 탭 전환: feedTabs data의 id 기반
 * - 피드 섹션: feedSections data 기반 for문 렌더링
 */

'use client';

import { useState } from 'react';
import type { JSX } from 'react';
import MyFeedContent from '@/components/community/MyFeedContent';
import mainData from '@/data';
import type { FeedSection } from '@/types';

const { feedTabs, feedSections, searchFilters } = mainData.community;

export default function CommunityFeed(): JSX.Element {
  const [activeTab, setActiveTab] = useState(feedTabs[0]?.id ?? 'home');

  return (
    <div className="community-feed">
      {/* 탭 — data 기반 렌더링 */}
      <div className="community-feed__tabs" role="tablist">
        {feedTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`community-feed__tab${activeTab === tab.id ? ' community-feed__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'myFeed' ? <MyFeedContent /> : <HomeFeedContent />}
    </div>
  );
}

/** 커뮤니티 홈 탭 콘텐츠 — feedSections data 기반 렌더링 */
function HomeFeedContent(): JSX.Element {
  return (
    <>
      {/* 공지 배너 스켈레톤 */}
      <div className="community-feed__notice">
        <div className="community-feed__notice-skeleton" />
      </div>

      {/* 검색 바 — searchFilters data 기반 */}
      <div className="community-feed__search">
        <select className="community-feed__select" aria-label={searchFilters.categoryLabel}>
          <option>{searchFilters.categoryDefault}</option>
        </select>
        <select className="community-feed__select" aria-label={searchFilters.scopeLabel}>
          <option>{searchFilters.scopeDefault}</option>
        </select>
        <input
          type="search"
          className="community-feed__search-input"
          placeholder={searchFilters.searchPlaceholder}
          aria-label={searchFilters.searchAriaLabel}
        />
      </div>

      {/* 피드 섹션 — data 기반 for문 렌더링 */}
      {feedSections.map((section) => (
        <FeedSectionBlock key={section.id} section={section} />
      ))}
    </>
  );
}

/** 피드 섹션 블록 — type에 따라 인기글/칼럼 형태로 렌더링 */
function FeedSectionBlock({ section }: { section: FeedSection }): JSX.Element {
  if (section.type === 'popular') {
    return (
      <div className="community-feed__section">
        <h3 className="community-feed__section-title">{section.title}</h3>
        <ol className="community-feed__popular-list">
          {Array.from({ length: section.itemCount }).map((_, i) => (
            <li key={i} className="community-feed__popular-item">
              <span className="community-feed__popular-rank">{i + 1}</span>
              <div className="community-feed__skeleton-line community-feed__skeleton-line--post" />
            </li>
          ))}
        </ol>
      </div>
    );
  }

  /* type === 'article' */
  return (
    <div className="community-feed__section">
      <div className="community-feed__section-header">
        <h3 className="community-feed__section-title">{section.title}</h3>
        {section.showMore && (
          <button type="button" className="community-feed__more">
            {section.moreLabel}
          </button>
        )}
      </div>
      {Array.from({ length: section.itemCount }).map((_, i) => (
        <div key={i} className="community-feed__article">
          <div className="community-feed__article-body">
            <div className="community-feed__skeleton-line community-feed__skeleton-line--article-title" />
            <div className="community-feed__article-meta">
              <div className="community-feed__skeleton-circle community-feed__skeleton-circle--sm" />
              <div className="community-feed__skeleton-line community-feed__skeleton-line--meta" />
            </div>
          </div>
          <div className="community-feed__article-thumb community-feed__skeleton-box" />
        </div>
      ))}
    </div>
  );
}
