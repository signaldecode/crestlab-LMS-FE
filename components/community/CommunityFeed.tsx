/**
 * 커뮤니티 가운데 피드 (CommunityFeed)
 * - 탭과 피드 섹션을 data 기반으로 렌더링한다 (추후 admin에서 관리)
 * - feedSections의 type에 따라 인기글/시리즈/칼럼/Q&A 형태로 렌더링
 * - 더미데이터가 있으면 실제 데이터로, 없으면 스켈레톤으로 렌더링
 */

'use client';

import { useState } from 'react';
import type { JSX } from 'react';
import Image from 'next/image';
import MyFeedContent from '@/components/community/MyFeedContent';
import mainData from '@/data';
import type { FeedSection } from '@/types';

const {
  feedTabs,
  feedSections,
  searchFilters,
  noticeBanner,
  qnaLabels,
  verifiedBadge,
  dummyPopularPosts,
  dummySeriesCards,
  dummyArticles,
  dummyQnaPosts,
} = mainData.community;

export default function CommunityFeed(): JSX.Element {
  const [activeTab, setActiveTab] = useState(feedTabs[0]?.id ?? 'home');

  return (
    <div className="community-feed">
      {/* 탭 전환 */}
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

/** 커뮤니티 홈 탭 콘텐츠 */
function HomeFeedContent(): JSX.Element {
  return (
    <>
      {/* 공지 배너 */}
      <div className="community-feed__notice" aria-label={noticeBanner.ariaLabel}>
        <span className="community-feed__notice-badge">{noticeBanner.badgeLabel}</span>
        <p className="community-feed__notice-text">
          {noticeBanner.dummyText ?? ''}
        </p>
      </div>

      {/* 검색 바 */}
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
        <button
          type="button"
          className="community-feed__search-btn"
          aria-label={searchFilters.searchButtonAriaLabel}
        >
          🔍
        </button>
      </div>

      {/* 피드 섹션 — data 기반 렌더링 */}
      {feedSections.map((section) => (
        <FeedSectionBlock key={section.id} section={section} />
      ))}
    </>
  );
}

/** 피드 섹션 블록 — type에 따라 렌더링 분기 */
function FeedSectionBlock({ section }: { section: FeedSection }): JSX.Element {
  switch (section.type) {
    case 'popular':
      return <PopularSection section={section} />;
    case 'series':
      return <SeriesSection section={section} />;
    case 'article':
      return <ArticleSection section={section} />;
    case 'qna':
      return <QnaSection section={section} />;
    default:
      return <></>;
  }
}

/** 인기글 섹션 */
function PopularSection({ section }: { section: FeedSection }): JSX.Element {
  const posts = dummyPopularPosts ?? [];

  return (
    <section className="community-feed__section" aria-label={section.title}>
      <h3 className="community-feed__section-title">{section.title}</h3>
      <ol className="community-feed__popular-list">
        {posts.slice(0, section.itemCount).map((post, i) => (
          <li key={post.id} className="community-feed__popular-item">
            <span className="community-feed__popular-rank">{i + 1}</span>
            <div className="community-feed__popular-content">
              <p className="community-feed__popular-title">{post.title}</p>
              <div className="community-feed__popular-meta">
                <span className="community-feed__popular-tag">{post.authorNickname}</span>
                <span className="community-feed__popular-tag">{post.category}</span>
                <span className="community-feed__popular-date">{post.date}</span>
                <span className="community-feed__popular-views">조회수 {post.viewCount}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** 시리즈 섹션 — 2열 카드 그리드 */
function SeriesSection({ section }: { section: FeedSection }): JSX.Element {
  const cards = dummySeriesCards ?? [];

  return (
    <section className="community-feed__section" aria-label={section.title}>
      <h3 className="community-feed__section-title">{section.title}</h3>
      <div className="community-feed__series-grid">
        {cards.slice(0, section.itemCount).map((card) => (
          <article key={card.id} className="community-feed__series-card">
            <div className="community-feed__series-thumb">
              <Image
                src={card.thumbnail}
                alt={card.thumbnailAlt}
                width={400}
                height={200}
                className="community-feed__series-img"
              />
            </div>
            <div className="community-feed__series-body">
              <h4 className="community-feed__series-title">{card.title}</h4>
              <p className="community-feed__series-desc">{card.description}</p>
              <div className="community-feed__series-tags">
                {card.tags.map((tag, idx) => (
                  <span key={`${tag}-${idx}`} className="community-feed__series-chip">{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/** 전문가 칼럼 섹션 */
function ArticleSection({ section }: { section: FeedSection }): JSX.Element {
  const articles = dummyArticles ?? [];

  return (
    <section className="community-feed__section" aria-label={section.title}>
      <div className="community-feed__section-header">
        <h3 className="community-feed__section-title">{section.title}</h3>
        {section.showMore && (
          <button type="button" className="community-feed__more">
            {section.moreLabel}
          </button>
        )}
      </div>
      {articles.slice(0, section.itemCount).map((article) => (
        <article key={article.id} className="community-feed__article">
          <div className="community-feed__article-body">
            {/* 작성자 */}
            <div className="community-feed__article-author">
              <div className="community-feed__article-avatar" />
              <span className="community-feed__article-author-name">{article.authorNickname}</span>
              {article.authorVerified && (
                <Image
                  src={verifiedBadge.src}
                  alt={verifiedBadge.alt}
                  width={14}
                  height={14}
                  className="community-feed__verified-badge"
                />
              )}
              <span className="community-feed__article-date">{article.date}</span>
            </div>
            {/* 제목 + 본문 */}
            <h4 className="community-feed__article-title">{article.title}</h4>
            <p className="community-feed__article-desc">{article.description}</p>
            {/* 반응 */}
            <div className="community-feed__article-actions">
              <span className="community-feed__article-action">♡ {article.likeCount}</span>
              <span className="community-feed__article-action">💬 {article.commentCount}</span>
              <span className="community-feed__article-action">↗</span>
            </div>
          </div>
          <div className="community-feed__article-thumb">
            <Image
              src={article.thumbnail}
              alt={article.thumbnailAlt}
              width={160}
              height={120}
              className="community-feed__article-img"
            />
          </div>
        </article>
      ))}
    </section>
  );
}

/** Q&A 섹션 */
function QnaSection({ section }: { section: FeedSection }): JSX.Element {
  const posts = dummyQnaPosts ?? [];

  return (
    <section className="community-feed__section" aria-label={section.title}>
      <h3 className="community-feed__section-title">{section.title}</h3>
      <ul className="community-feed__qna-list">
        {posts.slice(0, section.itemCount).map((post) => (
          <li key={post.id} className="community-feed__qna-item">
            <div className="community-feed__qna-left">
              <span className="community-feed__qna-badge">{qnaLabels.answeredBadge}</span>
              <span className="community-feed__qna-title">{post.title}</span>
            </div>
            <div className="community-feed__qna-right">
              <span className="community-feed__qna-answerer">{post.answererNickname}</span>
              {post.answererVerified && (
                <Image
                  src={verifiedBadge.src}
                  alt={verifiedBadge.alt}
                  width={14}
                  height={14}
                  className="community-feed__verified-badge"
                />
              )}
              <span className="community-feed__qna-suffix">{qnaLabels.answeredSuffix}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
