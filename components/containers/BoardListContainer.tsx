/**
 * 공지사항 목록 컨테이너 (BoardListContainer)
 * - 백엔드 GET /api/v1/notices 실 API 연동
 * - 고정 공지가 상단, 일반 공지에는 역순 번호 부여, 페이지네이션 지원
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

function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
    template,
  );
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
  const totalElements = data?.totalElements ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);
  // 일반 공지 역순 번호 — 최신글이 가장 큰 번호
  const regularStartNumber = Math.max(0, totalElements - pinned.length - (currentPage - 1) * ITEMS_PER_PAGE);

  return (
    <main className={SK}>
      <div className={`${SK}__inner`}>
        <header className={`${SK}__header`}>
          <h1 className={`${SK}__title`}>{pageData.title}</h1>
          <p className={`${SK}__subtitle`}>{pageData.subtitle}</p>
        </header>

        {loading && !data ? (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>{pageData.loadingText}</p>
          </div>
        ) : error && !data ? (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>{error.message}</p>
            <button type="button" onClick={refetch} className={`${SK}__page-btn`}>
              {pageData.errorRetryLabel}
            </button>
          </div>
        ) : (
          <>
            <div className={`${SK}__meta-bar`}>
              <span className={`${SK}__total-count`}>
                {fillTemplate(pageData.totalCountTemplate, { count: totalElements })}
              </span>
            </div>

            {(pinned.length > 0 || regular.length > 0) ? (
              <>
                <div className={`${SK}__table-head`} role="presentation">
                  <span className={`${SK}__col ${SK}__col--num`}>{pageData.columns.number}</span>
                  <span className={`${SK}__col ${SK}__col--title`}>{pageData.columns.title}</span>
                  <span className={`${SK}__col ${SK}__col--date`}>{pageData.columns.date}</span>
                </div>

                <ul className={`${SK}__list`}>
                  {pinned.map((notice) => (
                    <li key={notice.id} className={`${SK}__item ${SK}__item--pinned`}>
                      <Link href={`/board/${notice.id}`} className={`${SK}__item-link`}>
                        <span className={`${SK}__col ${SK}__col--num`}>
                          <span className={`${SK}__pin-badge`}>{pageData.pinnedLabel}</span>
                        </span>
                        <span className={`${SK}__col ${SK}__col--title ${SK}__item-title`}>
                          {notice.title}
                        </span>
                        <span className={`${SK}__col ${SK}__col--date ${SK}__item-date`}>
                          {formatDate(notice.createdAt)}
                        </span>
                      </Link>
                    </li>
                  ))}

                  {regular.map((notice, idx) => (
                    <li key={notice.id} className={`${SK}__item`}>
                      <Link href={`/board/${notice.id}`} className={`${SK}__item-link`}>
                        <span className={`${SK}__col ${SK}__col--num ${SK}__item-num`}>
                          {regularStartNumber - idx}
                        </span>
                        <span className={`${SK}__col ${SK}__col--title ${SK}__item-title`}>
                          {notice.title}
                        </span>
                        <span className={`${SK}__col ${SK}__col--date ${SK}__item-date`}>
                          {formatDate(notice.createdAt)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className={`${SK}__empty`}>
                <p className={`${SK}__empty-text`}>{pageData.emptyText}</p>
              </div>
            )}

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
