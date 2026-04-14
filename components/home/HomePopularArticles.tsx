/**
 * 실시간 인기 아티클 섹션 (HomePopularArticles)
 * - 피처드 아티클(1위) + 순위 리스트(2~5위) + 하단 아티클 카드 3개
 * - 모든 텍스트/aria는 data/homeData.json의 popularArticles에서 가져온다
 */

import type { JSX } from 'react';
import Image from 'next/image';
import type { PopularArticleRanked, PopularArticleCard } from '@/types';
import { getPopularArticles } from '@/lib/data';
import { resolveThumb } from '@/lib/images';

function RankedItem({ item }: { item: PopularArticleRanked }): JSX.Element {
  return (
    <li className="home-popular__ranked-item" aria-label={item.ariaLabel}>
      <span className="home-popular__rank">{item.rank}</span>
      <div className="home-popular__ranked-info">
        <p className="home-popular__ranked-title">{item.title}</p>
        <div className="home-popular__meta">
          <span className="home-popular__author">{item.authorNickname}</span>
          <span className="home-popular__category">{item.category}</span>
          <span className="home-popular__date">{item.date}</span>
          <span className="home-popular__read-time">{item.readTime}</span>
          <span className="home-popular__views">{item.viewCount}</span>
        </div>
      </div>
    </li>
  );
}

function ArticleCard({ item }: { item: PopularArticleCard }): JSX.Element {
  return (
    <article className="home-popular__card" aria-label={item.ariaLabel}>
      <div className="home-popular__card-body">
        <div className="home-popular__card-author">
          <span className="home-popular__card-avatar" aria-hidden="true" />
          <span className="home-popular__card-nickname">{item.authorNickname}</span>
          <span className="home-popular__card-category">{item.category}</span>
        </div>
        <h3 className="home-popular__card-title">{item.title}</h3>
        <p className="home-popular__card-content">{item.content}</p>
        <div className="home-popular__card-stats">
          <span className="home-popular__card-stat">
            <span aria-hidden="true">&#9825;</span> {item.likeCount}
          </span>
          <span className="home-popular__card-stat">
            <span aria-hidden="true">&#128172;</span> {item.commentCount}
          </span>
        </div>
      </div>
      <div className="home-popular__card-thumb">
        <Image
          src={resolveThumb(item.thumbnail)}
          alt={item.thumbnailAlt}
          width={160}
          height={120}
          className="home-popular__card-image"
        />
      </div>
    </article>
  );
}

export default function HomePopularArticles(): JSX.Element {
  const { meta, featured, ranked, cards } = getPopularArticles();

  return (
    <section className="home-popular" aria-label={meta.ariaLabel}>
      <h2 className="home-popular__title">{meta.title}</h2>

      {/* 상단: 피처드(1위) + 순위 리스트(2~5위) */}
      <div className="home-popular__top">
        {/* 피처드 아티클 */}
        <div className="home-popular__featured" aria-label={featured.ariaLabel}>
          <div className="home-popular__featured-thumb">
            <Image
              src={resolveThumb(featured.thumbnail)}
              alt={featured.thumbnailAlt}
              width={480}
              height={320}
              className="home-popular__featured-image"
            />
            <span className="home-popular__featured-badge" aria-hidden="true">
              {featured.rank}
            </span>
          </div>
          <p className="home-popular__featured-title">{featured.title}</p>
          <div className="home-popular__meta">
            <span className="home-popular__author">{featured.authorNickname}</span>
            <span className="home-popular__category">{featured.category}</span>
            <span className="home-popular__date">{featured.date}</span>
            <span className="home-popular__read-time">{featured.readTime}</span>
            <span className="home-popular__views">{featured.viewCount}</span>
          </div>
        </div>

        {/* 순위 리스트 */}
        <ol className="home-popular__ranked-list">
          {ranked.map((item) => (
            <RankedItem key={item.id} item={item} />
          ))}
        </ol>
      </div>

      {/* 하단: 아티클 카드 */}
      <div className="home-popular__cards">
        {cards.map((item) => (
          <ArticleCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
