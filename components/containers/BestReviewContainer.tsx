/**
 * 수강생 베스트 후기 섹션 (BestReviewContainer)
 * - 두 줄 무한 마퀴(marquee) 방식으로 후기 카드를 자동 스크롤
 * - 1행: 좌→우 스크롤, 2행: 우→좌 스크롤 (CSS animation, hover 시 일시정지)
 * - 데이터: useMainPage() → topReviews (백엔드 큐레이션, 최대 20개)
 *   - 메타(섹션 제목/라벨)와 stats(통계 바)는 정적 데이터 유지
 *   - 백엔드 후기에는 title/avatarColor가 없어 id 기반으로 결정적 생성
 */

'use client';

import type { JSX } from 'react';
import { useMainPage } from '@/components/home/MainPageProvider';
import { getBestReviews } from '@/lib/data';
import type { MainReviewCard } from '@/lib/userApi';

const AVATAR_COLORS = ['red', 'blue', 'green', 'orange', 'purple', 'pink'] as const;
function avatarColorFromId(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

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

function BestReviewCard({ item }: { item: MainReviewCard }): JSX.Element {
  const initial = item.nickname.charAt(0);
  const ratingAriaLabel = `별점 ${item.rating}점`;
  const color = avatarColorFromId(item.id);

  return (
    <article className="home-best-review__card" aria-label={`${item.nickname}님의 후기`}>
      <div className="home-best-review__card-header">
        <div className="home-best-review__card-meta">
          <div
            className={`home-best-review__avatar home-best-review__avatar--${color}`}
            aria-hidden="true"
          >
            {initial}
          </div>
          <div>
            <p className="home-best-review__nickname">{item.nickname}</p>
            <p className="home-best-review__date">{formatDate(item.createdAt)}</p>
          </div>
        </div>
        <StarRating rating={item.rating} ariaLabel={ratingAriaLabel} />
      </div>
      <p className="home-best-review__card-text">{item.content}</p>
    </article>
  );
}

/** 배열을 최소 개수까지 순환 반복 */
function repeatToMin<T>(arr: T[], min: number): T[] {
  if (arr.length === 0 || arr.length >= min) return arr;
  const repeats = Math.ceil(min / arr.length);
  return Array.from({ length: repeats }, () => arr).flat();
}

/** 한 행에 보여줄 최소 카드 수 — 29rem(464px) × 6 = 2784px로 일반 뷰포트보다 넓어 seamless loop 보장 */
const MIN_CARDS_PER_ROW = 6;

export default function BestReviewContainer(): JSX.Element {
  const { meta, stats } = getBestReviews();
  const { data, loading, error } = useMainPage();
  const items = data?.topReviews ?? [];

  // 백엔드는 최대 20개까지 내려주며, 개수가 부족하면 각 행을 반복해 최소 수를 채운다.
  const sliced = items.slice(0, 20);
  let row1Base: MainReviewCard[];
  let row2Base: MainReviewCard[];
  if (sliced.length >= MIN_CARDS_PER_ROW * 2) {
    // 12개 이상 — 전반/후반으로 나눈다 (최대 20개면 10/10)
    row1Base = sliced.slice(0, Math.ceil(sliced.length / 2));
    row2Base = sliced.slice(Math.ceil(sliced.length / 2));
  } else {
    // 부족할 때 — 두 행 모두 전체를 쓰되 2행은 역순으로 배치해 단조로움을 줄인다
    row1Base = sliced;
    row2Base = sliced.length > 1 ? [...sliced].reverse() : [];
  }
  const row1 = repeatToMin(row1Base, MIN_CARDS_PER_ROW);
  const row2 = repeatToMin(row2Base, MIN_CARDS_PER_ROW);

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
      {loading && items.length === 0 ? (
        <div className="home-best-review__status" role="status">불러오는 중…</div>
      ) : error && items.length === 0 ? (
        <div className="home-best-review__status" role="alert">{error}</div>
      ) : items.length === 0 ? (
        <div className="home-best-review__status">등록된 후기가 없습니다.</div>
      ) : (
        <>
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
            {row2.length > 0 && (
              <div className="home-best-review__row">
                <div className="home-best-review__track home-best-review__track--right">
                  {[...row2, ...row2].map((item, idx) => (
                    <BestReviewCard key={`r2-${item.id}-${idx}`} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 스크린리더 전용 후기 목록 */}
          <ul className="sr-only" aria-label={meta.ariaLabel}>
            {sliced.map((item) => (
              <li key={item.id}>
                <span>{item.nickname}</span>
                <span>{formatDate(item.createdAt)}</span>
                <span>별점 {item.rating}점</span>
                <span>{item.content}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
