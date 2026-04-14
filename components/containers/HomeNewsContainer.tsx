/**
 * 홈 뉴스 컨테이너 (HomeNewsContainer)
 * - 백엔드 GET /api/v1/news 실 API 연동 (RSS 자동 수집)
 * - 최신 8개만 노출 (페이지네이션 없음, 전체 목록은 /news 링크로 이동)
 * - 메타 텍스트는 정적 props로 받음
 */

'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchNews } from '@/lib/userApi';
import type { HomeNewsSection } from '@/types';
import { resolveThumb } from '@/lib/images';

interface HomeNewsContainerProps {
  section: HomeNewsSection;
}

const HOME_PAGE_SIZE = 8;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function HomeNewsContainer({ section }: HomeNewsContainerProps): JSX.Element {
  const { meta } = section;

  const { data, loading, error } = useAdminQuery(
    () => fetchNews({ page: 1, size: HOME_PAGE_SIZE }),
    [],
  );

  const items = data?.content ?? [];

  return (
    <section className="home-news" aria-label={meta.ariaLabel}>
      <div className="home-news__header">
        <div className="home-news__header-text">
          <span className="home-news__label">{meta.label}</span>
          <h2 className="home-news__title">{meta.title}</h2>
        </div>
        {meta.moreHref && meta.moreLabel && (
          <Link
            href={meta.moreHref}
            className="home-news__more"
            aria-label={meta.moreAriaLabel ?? meta.moreLabel}
          >
            {meta.moreLabel} →
          </Link>
        )}
      </div>

      {loading && !data ? (
        <div className="home-news__grid"><p>불러오는 중…</p></div>
      ) : error && !data ? (
        <div className="home-news__grid"><p>{error.message}</p></div>
      ) : (
        <div className="home-news__grid">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="home-news__card"
              aria-label={item.title}
            >
              <div className="home-news__thumb">
                {item.thumbnailUrl && (
                  <Image
                    src={resolveThumb(item.thumbnailUrl)}
                    alt={item.title}
                    fill
                    sizes="(max-width: 639px) 100vw, 264px"
                    className="home-news__thumb-img"
                    unoptimized
                  />
                )}
              </div>
              <div className="home-news__content">
                <span className="home-news__date">{formatDate(item.publishedAt)}</span>
                <h3 className="home-news__card-title">{item.title}</h3>
                <div className="home-news__tags">
                  <span className="home-news__tag">{item.source}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
