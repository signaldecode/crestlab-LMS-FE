/**
 * 공지사항 상세 콘텐츠 (BoardDetailContent)
 * - 브레드크럼 + 카테고리 뱃지 + 제목 + 메타 + 본문 + 목록으로 돌아가기
 * - 모든 텍스트/라벨은 data에서 로드한다
 */

'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { getBoardData } from '@/lib/data';
import type { BoardNotice } from '@/types';

const SK = 'board-detail';

interface BoardDetailContentProps {
  notice: BoardNotice;
}

export default function BoardDetailContent({ notice }: BoardDetailContentProps): JSX.Element {
  const pageData = getBoardData().page;
  const bc = pageData.breadcrumb;

  const categoryLabel =
    pageData.categories.find((c) => c.value === notice.category)?.label ?? notice.category;

  return (
    <main className={SK}>
      <div className={`${SK}__inner`}>
        {/* 브레드크럼 */}
        <nav className={`${SK}__breadcrumb`} aria-label={bc.ariaLabel}>
          <Link href={bc.homeHref} className={`${SK}__breadcrumb-link`}>
            {bc.homeLabel}
          </Link>
          <span className={`${SK}__breadcrumb-sep`}>&gt;</span>
          <Link href={bc.boardHref} className={`${SK}__breadcrumb-link`}>
            {bc.boardLabel}
          </Link>
          <span className={`${SK}__breadcrumb-sep`}>&gt;</span>
          <span className={`${SK}__breadcrumb-current`}>{notice.title}</span>
        </nav>

        {/* 헤더 */}
        <header className={`${SK}__header`}>
          <span className={`${SK}__category-badge ${SK}__category-badge--${notice.category}`}>
            {categoryLabel}
          </span>
          <h1 className={`${SK}__title`}>{notice.title}</h1>
          <div className={`${SK}__meta`}>
            <span className={`${SK}__author`}>{notice.author}</span>
            <span className={`${SK}__date`}>{notice.date}</span>
            <span className={`${SK}__views`}>
              {pageData.viewCountUnit} {notice.viewCount.toLocaleString('ko-KR')}
            </span>
          </div>
        </header>

        {/* 본문 */}
        <article className={`${SK}__body`}>
          {notice.content.split('\n').map((line, i) => (
            <p key={i} className={line.trim() === '' ? `${SK}__body-spacer` : undefined}>
              {line || '\u00A0'}
            </p>
          ))}
        </article>

        {/* 목록으로 */}
        <div className={`${SK}__footer`}>
          <Link href={bc.boardHref} className={`${SK}__back-btn`}>
            {pageData.backLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
