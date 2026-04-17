/**
 * 공지사항 상세 콘텐츠 (BoardDetailContent)
 * - 백엔드 GET /api/v1/notices/{id} 실 API 연동
 * - 카테고리/조회수는 백엔드 미지원으로 제거됨
 */

'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchNoticeById } from '@/lib/userApi';
import { getBoardData } from '@/lib/data';

const SK = 'board-detail';

interface BoardDetailContentProps {
  noticeId: number;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function BoardDetailContent({ noticeId }: BoardDetailContentProps): JSX.Element {
  const pageData = getBoardData().page;
  const bc = pageData.breadcrumb;

  const { data, loading, error, refetch } = useAdminQuery(
    () => fetchNoticeById(noticeId),
    [noticeId],
  );

  if (loading && !data) {
    return (
      <main className={SK}>
        <div className={`${SK}__inner`}>
          <p>불러오는 중…</p>
        </div>
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className={SK}>
        <div className={`${SK}__inner`}>
          <p>{error.message}</p>
          <button type="button" onClick={refetch}>다시 시도</button>
          <Link href={bc.boardHref}>{pageData.backLabel}</Link>
        </div>
      </main>
    );
  }

  if (!data) return <main className={SK} />;

  return (
    <main className={SK}>
      <div className={`${SK}__inner`}>
        <nav className={`${SK}__breadcrumb`} aria-label={bc.ariaLabel}>
          <Link href={bc.homeHref} className={`${SK}__breadcrumb-link`}>{bc.homeLabel}</Link>
          <span className={`${SK}__breadcrumb-sep`}>&gt;</span>
          <Link href={bc.boardHref} className={`${SK}__breadcrumb-link`}>{bc.boardLabel}</Link>
          <span className={`${SK}__breadcrumb-sep`}>&gt;</span>
          <span className={`${SK}__breadcrumb-current`}>{data.title}</span>
        </nav>

        <article className={`${SK}__card`}>
          <header className={`${SK}__header`}>
            <div className={`${SK}__title-row`}>
              <h1 className={`${SK}__title`}>{data.title}</h1>
              {data.pinned && (
                <span className={`${SK}__pin-badge`}>{pageData.pinnedLabel}</span>
              )}
            </div>
            <div className={`${SK}__meta`}>
              <span className={`${SK}__date`}>{formatDate(data.createdAt)}</span>
            </div>
          </header>

          <div className={`${SK}__body`}>
            {data.content.split('\n').map((line, i) => (
              <p key={i} className={line.trim() === '' ? `${SK}__body-spacer` : undefined}>
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </article>

        <div className={`${SK}__footer`}>
          <Link href={bc.boardHref} className={`${SK}__back-btn`}>
            {pageData.backLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
