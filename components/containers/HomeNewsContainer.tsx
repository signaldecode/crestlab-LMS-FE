/**
 * 홈 뉴스 컨테이너 (HomeNewsContainer)
 * - 백엔드 GET /api/v1/news 실 API 연동 (RSS 자동 수집)
 * - 메타 텍스트는 정적 props로 받음
 */

'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchNews } from '@/lib/userApi';
import type { HomeNewsSection } from '@/types';

interface HomeNewsContainerProps {
  section: HomeNewsSection;
}

const PAGE_SIZE = 8;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function HomeNewsContainer({ section }: HomeNewsContainerProps): JSX.Element {
  const { meta, pagination } = section;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, error } = useAdminQuery(
    () => fetchNews({ page: currentPage, size: PAGE_SIZE }),
    [currentPage],
  );

  const items = data?.content ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <section className="home-news" aria-label={meta.ariaLabel}>
      <div className="home-news__header">
        <span className="home-news__label">{meta.label}</span>
        <h2 className="home-news__title">{meta.title}</h2>
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
                    src={item.thumbnailUrl}
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

      {totalPages > 1 && (
        <nav className="home-news__pagination" aria-label={pagination.ariaLabel}>
          <button
            type="button"
            className="home-news__page-btn home-news__page-btn--arrow"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
              <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`home-news__page-btn${page === currentPage ? ' home-news__page-btn--active' : ''}`}
              onClick={() => goToPage(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`${page} 페이지`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="home-news__page-btn home-news__page-btn--arrow"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
              <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </nav>
      )}
    </section>
  );
}
