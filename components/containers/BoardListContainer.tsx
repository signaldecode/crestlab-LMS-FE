/**
 * 공지사항 목록 컨테이너 (BoardListContainer)
 * - 백엔드 GET /api/v1/notices 실 API 연동
 * - 고정 공지가 상단, 페이지네이션 지원
 * - 카테고리/조회수는 백엔드 미지원으로 제거됨
 */

'use client';

import { useState, type JSX } from 'react';
import Link from 'next/link';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchNotices } from '@/lib/userApi';
import { getBoardData } from '@/lib/data';

const SK = 'board-list';
const ITEMS_PER_PAGE = 10;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function BoardListContainer(): JSX.Element {
  const boardData = getBoardData();
  const pageData = boardData.page;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, error, refetch } = useAdminQuery(
    () => fetchNotices({ page: currentPage, size: ITEMS_PER_PAGE }),
    [currentPage],
  );

  const allNotices = data?.content ?? [];
  const pinned = allNotices.filter((n) => n.pinned);
  const regular = allNotices.filter((n) => !n.pinned);
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  return (
    <main className={SK}>
      <div className={`${SK}__inner`}>
        <h1 className={`${SK}__title`}>{pageData.title}</h1>

        {loading && !data ? (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>불러오는 중…</p>
          </div>
        ) : error && !data ? (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>{error.message}</p>
            <button type="button" onClick={refetch} className={`${SK}__page-btn`}>
              다시 시도
            </button>
          </div>
        ) : (
          <>
            {pinned.length > 0 && (
              <ul className={`${SK}__pinned-list`}>
                {pinned.map((notice) => (
                  <li key={notice.id} className={`${SK}__item ${SK}__item--pinned`}>
                    <Link href={`/board/${notice.id}`} className={`${SK}__item-link`}>
                      <span className={`${SK}__pin-badge`}>{pageData.pinnedLabel}</span>
                      <span className={`${SK}__item-title`}>{notice.title}</span>
                      <span className={`${SK}__item-date`}>{formatDate(notice.createdAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {regular.length > 0 ? (
              <ul className={`${SK}__list`}>
                {regular.map((notice) => (
                  <li key={notice.id} className={`${SK}__item`}>
                    <Link href={`/board/${notice.id}`} className={`${SK}__item-link`}>
                      <span className={`${SK}__item-title`}>{notice.title}</span>
                      <span className={`${SK}__item-meta`}>
                        <span className={`${SK}__item-date`}>{formatDate(notice.createdAt)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : pinned.length === 0 ? (
              <div className={`${SK}__empty`}>
                <p className={`${SK}__empty-text`}>{pageData.emptyText}</p>
              </div>
            ) : null}

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
          </>
        )}
      </div>
    </main>
  );
}
