/**
 * 커뮤니티 가운데 피드 (CommunityFeed)
 * - 탭(커뮤니티 홈 / 내 피드) 전환을 처리한다
 * - 커뮤니티 홈: 공지 배너, 검색, 인기글, 최신 칼럼 스켈레톤
 * - 내 피드: 팔로우한 사람의 글 목록 (없으면 추천글)
 */

'use client';

import { useState } from 'react';
import type { JSX } from 'react';
import MyFeedContent from '@/components/community/MyFeedContent';

type FeedTab = 'home' | 'myFeed';

export default function CommunityFeed(): JSX.Element {
  const [activeTab, setActiveTab] = useState<FeedTab>('home');

  return (
    <div className="community-feed">
      {/* 탭 */}
      <div className="community-feed__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'home'}
          className={`community-feed__tab${activeTab === 'home' ? ' community-feed__tab--active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          커뮤니티 홈
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'myFeed'}
          className={`community-feed__tab${activeTab === 'myFeed' ? ' community-feed__tab--active' : ''}`}
          onClick={() => setActiveTab('myFeed')}
        >
          내 피드
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'home' ? <HomeFeedContent /> : <MyFeedContent />}
    </div>
  );
}

/** 커뮤니티 홈 탭 콘텐츠 (기존 스켈레톤) */
function HomeFeedContent(): JSX.Element {
  return (
    <>
      {/* 공지 배너 스켈레톤 */}
      <div className="community-feed__notice">
        <div className="community-feed__notice-skeleton" />
      </div>

      {/* 검색 바 */}
      <div className="community-feed__search">
        <select className="community-feed__select" aria-label="카테고리 필터">
          <option>커뮤니티 전체</option>
        </select>
        <select className="community-feed__select" aria-label="검색 범위">
          <option>작성자 + 제목 + 내용</option>
        </select>
        <input
          type="search"
          className="community-feed__search-input"
          placeholder="찾고 싶은 콘텐츠를 검색하세요!"
          aria-label="커뮤니티 검색"
        />
      </div>

      {/* 인기글 */}
      <div className="community-feed__section">
        <h3 className="community-feed__section-title">🔥 인기글</h3>
        <ol className="community-feed__popular-list">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="community-feed__popular-item">
              <span className="community-feed__popular-rank">{i + 1}</span>
              <div className="community-feed__skeleton-line community-feed__skeleton-line--post" />
            </li>
          ))}
        </ol>
      </div>

      {/* 최신 전문가칼럼 */}
      <div className="community-feed__section">
        <div className="community-feed__section-header">
          <h3 className="community-feed__section-title">최신 전문가칼럼</h3>
          <button type="button" className="community-feed__more">더보기</button>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
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
    </>
  );
}
