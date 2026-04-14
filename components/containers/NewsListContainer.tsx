/**
 * 뉴스 목록 컨테이너 (NewsListContainer)
 * - GET /api/v1/news 호출 (RSS 자동 수집된 외부 뉴스)
 * - 카테고리(STOCKS/CRYPTO/REAL_ESTATE) 필터 + 페이지네이션
 * - 카드 클릭 시 sourceUrl 새 탭으로 이동
 *
 * 모든 텍스트는 props copy로 주입한다 (data/pagesData.json)
 */

'use client';

import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import Image from 'next/image';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchNews, type NewsCategory } from '@/lib/userApi';
import { resolveThumb } from '@/lib/images';
import Pagination, { type PaginationCopy } from '@/components/ui/Pagination';

export interface NewsListCopy {
  pageTitle: string;
  pageSubtitle: string;
  ariaLabel: string;
  categoryAllLabel: string;
  categoryLabels: Record<NewsCategory, string>;
  filterAriaLabel: string;
  loadingText: string;
  emptyText: string;
  pagination: PaginationCopy;
}

interface Props {
  copy: NewsListCopy;
}

const PAGE_SIZE = 12;
const CATEGORIES: NewsCategory[] = ['STOCKS', 'CRYPTO', 'REAL_ESTATE'];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function NewsListContainer({ copy }: Props): JSX.Element {
  const [category, setCategory] = useState<NewsCategory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // /news 진입 시 항상 페이지 최상단으로 이동 (홈에서 스크롤된 상태로 넘어오는 UX 방지)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // 페이지 번호 변경 시 리스트 상단으로 부드럽게 스크롤
  useEffect(() => {
    if (currentPage === 1) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const { data, loading, error } = useAdminQuery(
    () => fetchNews({ page: currentPage, size: PAGE_SIZE, ...(category ? { category } : {}) }),
    [currentPage, category],
  );

  const items = data?.content ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const handleCategoryChange = (next: NewsCategory | null) => {
    setCategory(next);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <section className="news-list" aria-label={copy.ariaLabel}>
      <header className="news-list__header">
        <h1 className="news-list__title">{copy.pageTitle}</h1>
        <p className="news-list__subtitle">{copy.pageSubtitle}</p>
      </header>

      <nav className="news-list__filter" aria-label={copy.filterAriaLabel}>
        <button
          type="button"
          className={`news-list__chip${category === null ? ' news-list__chip--active' : ''}`}
          onClick={() => handleCategoryChange(null)}
          aria-pressed={category === null}
        >
          {copy.categoryAllLabel}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`news-list__chip${category === c ? ' news-list__chip--active' : ''}`}
            onClick={() => handleCategoryChange(c)}
            aria-pressed={category === c}
          >
            {copy.categoryLabels[c]}
          </button>
        ))}
      </nav>

      {loading && !data ? (
        <p className="news-list__status">{copy.loadingText}</p>
      ) : error && !data ? (
        <p className="news-list__status news-list__status--error" role="alert">{error.message}</p>
      ) : items.length === 0 ? (
        <p className="news-list__status">{copy.emptyText}</p>
      ) : (
        <div className="news-list__grid">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="news-list__card"
              aria-label={item.title}
            >
              <div className="news-list__thumb">
                {item.thumbnailUrl && (
                  <Image
                    src={resolveThumb(item.thumbnailUrl)}
                    alt={item.title}
                    fill
                    sizes="(max-width: 639px) 100vw, 320px"
                    className="news-list__thumb-img"
                    unoptimized
                  />
                )}
              </div>
              <div className="news-list__content">
                <span className="news-list__date">{formatDate(item.publishedAt)}</span>
                <h2 className="news-list__card-title">{item.title}</h2>
                {item.summary && <p className="news-list__summary">{item.summary}</p>}
                <div className="news-list__tags">
                  <span className="news-list__tag">{item.source}</span>
                  <span className="news-list__tag news-list__tag--category">{copy.categoryLabels[item.category]}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        copy={copy.pagination}
        siblingCount={1}
        className="news-list__pagination"
      />
    </section>
  );
}
