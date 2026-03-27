/**
 * 이주의 베스트 인기글 캐러셀 (HomeBestArticles)
 * - 1번: 피처드(대형) 카드 — 이미지 위 그라데이션 오버레이 + 타이틀/날짜
 * - 2~N번: 정사각형 썸네일 + 하단 타이틀/날짜
 * - 파란색 순위 뱃지, 우하단 좌/우 화살표
 */

'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';
import type { HomeBestArticlesSection } from '@/types';

interface HomeBestArticlesProps {
  section: HomeBestArticlesSection;
}

/** 한 번에 보이는 카드 수: 피처드 1 + 일반 4 */
const VISIBLE_COUNT = 5;

export default function HomeBestArticles({ section }: HomeBestArticlesProps): JSX.Element {
  const { meta, articles } = section;
  const maxOffset = Math.max(0, articles.length - VISIBLE_COUNT);
  const [offset, setOffset] = useState(0);

  const handlePrev = () => setOffset((o) => Math.max(0, o - 1));
  const handleNext = () => setOffset((o) => Math.min(maxOffset, o + 1));

  return (
    <section className="home-best-articles" aria-label={meta.ariaLabel}>
      <h2 className="home-best-articles__title">
        <span className="home-best-articles__icon" aria-hidden="true">{meta.icon}</span>
        {meta.title}
      </h2>

      <div className="home-best-articles__carousel">
        <div
          className="home-best-articles__track"
          style={{ transform: `translateX(-${offset * 17.5}%)` }}
        >
          {articles.map((article, idx) => {
            const isFeatured = idx === 0;

            return (
              <article
                key={article.id}
                className={`home-best-articles__card${isFeatured ? ' home-best-articles__card--featured' : ''}`}
                aria-label={article.ariaLabel}
              >
                <div className="home-best-articles__thumb">
                  <Image
                    src={article.thumbnail}
                    alt={article.thumbnailAlt}
                    fill
                    sizes={isFeatured ? '30vw' : '17vw'}
                    className="home-best-articles__image"
                  />
                  <span className="home-best-articles__badge">{article.rank}</span>

                  {isFeatured && (
                    <div className="home-best-articles__overlay">
                      <h3 className="home-best-articles__overlay-title">{article.title}</h3>
                      <p className="home-best-articles__overlay-date">{article.date}</p>
                    </div>
                  )}
                </div>

                {!isFeatured && (
                  <div className="home-best-articles__info">
                    <h3 className="home-best-articles__info-title">{article.title}</h3>
                    <p className="home-best-articles__info-date">{article.date}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* 우하단 화살표 */}
      <div className="home-best-articles__controls">
        <button
          type="button"
          className={`home-best-articles__arrow${offset === 0 ? ' home-best-articles__arrow--disabled' : ''}`}
          onClick={handlePrev}
          disabled={offset === 0}
          aria-label="이전 인기글"
        >
          &#8249;
        </button>
        <button
          type="button"
          className={`home-best-articles__arrow${offset === maxOffset ? ' home-best-articles__arrow--disabled' : ''}`}
          onClick={handleNext}
          disabled={offset === maxOffset}
          aria-label="다음 인기글"
        >
          &#8250;
        </button>
      </div>
    </section>
  );
}
