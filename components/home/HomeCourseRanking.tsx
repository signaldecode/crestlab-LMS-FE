/**
 * 랭킹 강의 레이아웃 (HomeCourseRanking)
 * - 1위: 대형 카드 (좌측)
 * - 2~5위: 우측 2×2 그리드
 * - 각 카드에 순위 뱃지 표시
 */

'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Course } from '@/types';
import { resolveThumb } from '@/lib/images';

interface HomeCourseRankingProps {
  title: string;
  courses: Course[];
}

function RankBadge({ rank }: { rank: number }) {
  const isTop = rank <= 3;
  return (
    <span className={`home-course-ranking__rank${isTop ? ' home-course-ranking__rank--top' : ''}`}>
      {rank}
    </span>
  );
}

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}

export default function HomeCourseRanking({ title, courses }: HomeCourseRankingProps): JSX.Element {
  if (courses.length === 0) return <></>;

  const first = courses[0];
  const rest = courses.slice(1, 5);

  return (
    <section className="home-course-ranking">
      <h2 className="home-course-ranking__title">{title}</h2>

      <div className="home-course-ranking__layout">
        {/* 1위 대형 카드 */}
        <Link href={`/courses/${first.id}`} className="home-course-ranking__first" aria-label={`1위: ${first.title}`}>
          <div className="home-course-ranking__first-thumb">
            <Image
              src={resolveThumb(first.thumbnail)}
              alt={first.thumbnailAlt}
              fill
              sizes="(max-width: 767px) 100vw, 45vw"
              className="home-course-ranking__first-image"
            />
            <RankBadge rank={1} />
          </div>
          <div className="home-course-ranking__first-body">
            <h3 className="home-course-ranking__first-title">{first.title}</h3>
            <p className="home-course-ranking__first-instructor">{first.instructor}</p>
            <div className="home-course-ranking__first-bottom">
              {first.rating != null && (
                <span className="home-course-ranking__first-rating">★ {first.rating.toFixed(2)}</span>
              )}
              <span className="home-course-ranking__first-price">{formatPrice(first.price)}</span>
            </div>
          </div>
        </Link>

        {/* 2~5위 그리드 */}
        <div className="home-course-ranking__grid">
          {rest.map((course, i) => (
            <Link key={course.id} href={`/courses/${course.id}`} className="home-course-ranking__card" aria-label={`${i + 2}위: ${course.title}`}>
              <div className="home-course-ranking__card-thumb">
                <Image
                  src={resolveThumb(course.thumbnail)}
                  alt={course.thumbnailAlt}
                  fill
                  sizes="(max-width: 767px) 50vw, 25vw"
                  className="home-course-ranking__card-image"
                />
                <RankBadge rank={i + 2} />
              </div>
              <h3 className="home-course-ranking__card-title">{course.title}</h3>
              <p className="home-course-ranking__card-instructor">{course.instructor}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
