/**
 * 수강생 베스트 후기 섹션 (BestReviewContainer)
 * - 홈 페이지에서 두 줄 무한 마퀴(marquee) 방식으로 후기 카드를 자동 스크롤한다
 * - 1행: 좌→우 스크롤, 2행: 우→좌 스크롤 (CSS animation, hover 시 일시정지)
 * - 모든 텍스트/aria는 data/homeData.json의 bestReviews에서 가져온다
 */

import type { JSX } from 'react';
import type { BestReviewItem } from '@/types';
import { getBestReviews } from '@/lib/data';

function StarRating({ rating, ariaLabel }: { rating: number; ariaLabel: string }): JSX.Element {
  return (
    <div className="home-best-review__stars" aria-label={ariaLabel} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={
            i < rating
              ? 'home-best-review__star home-best-review__star--filled'
              : 'home-best-review__star'
          }
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

function BestReviewCard({ item }: { item: BestReviewItem }): JSX.Element {
  const initial = item.nickname.charAt(0);
  const ratingAriaLabel = `별점 ${item.rating}점`;

  return (
    <article className="home-best-review__card" aria-label={item.ariaLabel}>
      <div className="home-best-review__card-header">
        <div className="home-best-review__card-meta">
          <div
            className={`home-best-review__avatar home-best-review__avatar--${item.avatarColor}`}
            aria-hidden="true"
          >
            {initial}
          </div>
          <div>
            <p className="home-best-review__nickname">{item.nickname}</p>
            <p className="home-best-review__date">{item.date}</p>
          </div>
        </div>
        <StarRating rating={item.rating} ariaLabel={ratingAriaLabel} />
      </div>
      <h3 className="home-best-review__card-title">{item.title}</h3>
      <p className="home-best-review__card-text">{item.content}</p>
    </article>
  );
}

export default function BestReviewContainer(): JSX.Element {
  const { meta, stats, items } = getBestReviews();

  // 6개씩 두 행으로 분리, 각 행은 seamless loop를 위해 2배 복제
  const row1 = items.slice(0, 6);
  const row2 = items.slice(6, 12);

  return (
    <section className="home-best-review" aria-label={meta.ariaLabel}>
      {/* 헤더 */}
      <div className="home-best-review__header">
        <span className="home-best-review__label" aria-hidden="true">
          {meta.label}
        </span>
        <h2 className="home-best-review__title">{meta.title}</h2>
        <p className="home-best-review__desc">{meta.description}</p>
      </div>

      {/* 통계 바 */}
      <div className="home-best-review__stats">
        {stats.map((stat) => (
          <div key={stat.label} className="home-best-review__stat" aria-label={stat.ariaLabel}>
            <div className="home-best-review__stat-value-wrap">
              <img
                className="home-best-review__stat-wing"
                src="/images/main/leftwing.svg"
                alt=""
                aria-hidden="true"
              />
              <div className="home-best-review__stat-inner">
                <span className="home-best-review__stat-label">{stat.label}</span>
                <span className="home-best-review__stat-value">{stat.value}</span>
              </div>
              <img
                className="home-best-review__stat-wing"
                src="/images/main/rightwing.svg"
                alt=""
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 마퀴 영역 (풀 블리드) */}
      <div className="home-best-review__rows" aria-hidden="true">
        {/* 1행: 좌→우 스크롤 */}
        <div className="home-best-review__row">
          <div className="home-best-review__track home-best-review__track--left">
            {[...row1, ...row1].map((item, idx) => (
              <BestReviewCard key={`r1-${item.id}-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* 2행: 우→좌 스크롤 */}
        <div className="home-best-review__row">
          <div className="home-best-review__track home-best-review__track--right">
            {[...row2, ...row2].map((item, idx) => (
              <BestReviewCard key={`r2-${item.id}-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* 스크린리더 전용 후기 목록 */}
      <ul className="sr-only" aria-label={meta.ariaLabel}>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.nickname}</span>
            <span>{item.date}</span>
            <span>별점 {item.rating}점</span>
            <span>{item.title}</span>
            <span>{item.content}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
