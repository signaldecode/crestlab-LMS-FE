/**
 * 공지사항 목록 컨테이너 (BoardListContainer)
 * - 카테고리 필터 + 정렬 + 고정 공지 상단 배치 + 페이지네이션
 * - 모든 텍스트/라벨은 data에서 로드한다
 */

'use client';

import { useMemo, useState, type JSX } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getBoardData } from '@/lib/data';
import type { BoardNotice } from '@/types';

const ITEMS_PER_PAGE = 10;

function sortNotices(notices: BoardNotice[], sort: string): BoardNotice[] {
  const sorted = [...notices];
  if (sort === 'views') {
    return sorted.sort((a, b) => b.viewCount - a.viewCount);
  }
  return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const SK = 'board-list';

export default function BoardListContainer(): JSX.Element {
  const searchParams = useSearchParams();
  const boardData = getBoardData();
  const pageData = boardData.page;
  const allNotices = boardData.notices;

  const categoryParam = searchParams.get('category') ?? pageData.defaultCategory;
  const [sort, setSort] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);

  const { pinned, regular } = useMemo(() => {
    const filtered = allNotices.filter((n) => n.category === categoryParam);
    const sorted = sortNotices(filtered, sort);
    return {
      pinned: sorted.filter((n) => n.isPinned),
      regular: sorted.filter((n) => !n.isPinned),
    };
  }, [allNotices, categoryParam, sort]);

  const totalPages = Math.max(1, Math.ceil(regular.length / ITEMS_PER_PAGE));
  const pageNotices = regular.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const categoryLabel = (cat: string): string => {
    return pageData.categories.find((c) => c.value === cat)?.label ?? cat;
  };

  return (
    <main className={SK}>
      <div className={`${SK}__inner`}>
        <h1 className={`${SK}__title`}>{categoryLabel(categoryParam)}</h1>

        {/* 필터 바 */}
        <div className={`${SK}__toolbar`}>
          <div className={`${SK}__categories`}>
            {pageData.categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/board?category=${cat.value}`}
                className={`${SK}__category-btn${categoryParam === cat.value ? ` ${SK}__category-btn--active` : ''}`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
          <div className={`${SK}__sort`}>
            <label htmlFor="board-sort" className={`${SK}__sort-label`}>
              {pageData.sortLabel}
            </label>
            <select
              id="board-sort"
              className={`${SK}__sort-select`}
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
            >
              {pageData.sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 고정 공지 */}
        {pinned.length > 0 && (
          <ul className={`${SK}__pinned-list`}>
            {pinned.map((notice) => (
              <li key={notice.id} className={`${SK}__item ${SK}__item--pinned`}>
                <Link href={`/board/${notice.slug}`} className={`${SK}__item-link`}>
                  <span className={`${SK}__pin-badge`}>{pageData.pinnedLabel}</span>
                  <span className={`${SK}__category-badge ${SK}__category-badge--${notice.category}`}>
                    {categoryLabel(notice.category)}
                  </span>
                  <span className={`${SK}__item-title`}>{notice.title}</span>
                  <span className={`${SK}__item-date`}>{notice.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* 일반 공지 목록 */}
        {pageNotices.length > 0 ? (
          <ul className={`${SK}__list`}>
            {pageNotices.map((notice) => (
              <li key={notice.id} className={`${SK}__item`}>
                <Link href={`/board/${notice.slug}`} className={`${SK}__item-link`}>
                  <span className={`${SK}__category-badge ${SK}__category-badge--${notice.category}`}>
                    {categoryLabel(notice.category)}
                  </span>
                  <span className={`${SK}__item-title`}>{notice.title}</span>
                  <span className={`${SK}__item-meta`}>
                    <span className={`${SK}__item-date`}>{notice.date}</span>
                    <span className={`${SK}__item-views`}>
                      {pageData.viewCountUnit} {notice.viewCount.toLocaleString('ko-KR')}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>{pageData.emptyText}</p>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <nav className={`${SK}__pagination`} aria-label="페이지 탐색">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`${SK}__page-btn${page === currentPage ? ` ${SK}__page-btn--active` : ''}`}
                onClick={() => setCurrentPage(page)}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </nav>
        )}
      </div>
    </main>
  );
}
