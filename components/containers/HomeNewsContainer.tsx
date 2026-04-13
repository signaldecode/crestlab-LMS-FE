/**
 * 홈 뉴스 컨테이너 (HomeNewsContainer)
 * - 이주의 추천 뉴스 섹션 (2열 그리드 + 페이지네이션)
 * - 모든 텍스트/aria는 data/homeData.json의 homeNews에서 가져온다
 */

'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { HomeNewsSection } from '@/types';

interface HomeNewsContainerProps {
  section: HomeNewsSection;
}

export default function HomeNewsContainer({ section }: HomeNewsContainerProps): JSX.Element {
  const { meta, items, pagination } = section;
  const { perPage, totalPages } = pagination;
  const [currentPage, setCurrentPage] = useState(1);

  const startIdx = (currentPage - 1) * perPage;
  const pageItems = items.slice(startIdx, startIdx + perPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <section className="home-news" aria-label={meta.ariaLabel}>
      {/* 헤더 */}
      <div className="home-news__header">
        <span className="home-news__label">{meta.label}</span>
        <h2 className="home-news__title">{meta.title}</h2>
      </div>

      {/* 뉴스 카드 그리드 */}
      <div className="home-news__grid">
        {pageItems.map((item) => (
          <Link key={item.id} href={item.href} className="home-news__card" aria-label={item.ariaLabel}>
            <div className="home-news__thumb">
              <Image
                src={item.thumbnail}
                alt={item.thumbnailAlt}
                fill
                sizes="(max-width: 639px) 100vw, 264px"
                className="home-news__thumb-img"
              />
            </div>
            <div className="home-news__content">
              <span className="home-news__date">{item.date}</span>
              <h3 className="home-news__card-title">{item.title}</h3>
              {item.tags.length > 0 && (
                <div className="home-news__tags">
                  {item.tags.map((tag, idx) => (
                    <span key={`${tag}-${idx}`} className="home-news__tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* 페이지네이션 */}
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
    </section>
  );
}
