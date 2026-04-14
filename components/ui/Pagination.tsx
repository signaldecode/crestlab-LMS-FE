/**
 * 공용 페이지네이션 (Pagination)
 * - ellipsis 적용해 페이지가 많아져도 최대 `siblingCount * 2 + 5`개 버튼만 노출한다
 * - 예: 1 … 4 5 [6] 7 8 … 20  (siblingCount = 2)
 * - totalPages <= 1이면 아무것도 렌더하지 않는다
 * - 모든 라벨은 props copy로 주입한다 (data/*.json)
 */

'use client';

import type { JSX } from 'react';

export interface PaginationCopy {
  ariaLabel: string;
  prevAriaLabel: string;
  nextAriaLabel: string;
  /** "{page} 페이지" 형태. {page} 토큰을 페이지 번호로 치환 */
  pageAriaFormat: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  copy: PaginationCopy;
  /** 현재 페이지 좌우에 보여줄 형제 페이지 수 (기본 1) */
  siblingCount?: number;
  className?: string;
}

type Item = number | 'ellipsis-left' | 'ellipsis-right';

function buildItems(currentPage: number, totalPages: number, siblingCount: number): Item[] {
  const firstPage = 1;
  const lastPage = totalPages;
  const totalSlots = siblingCount * 2 + 5; // first + last + current + siblings*2 + 2 ellipsis

  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, firstPage);
  const rightSibling = Math.min(currentPage + siblingCount, lastPage);

  const showLeftEllipsis = leftSibling > firstPage + 1;
  const showRightEllipsis = rightSibling < lastPage - 1;

  const items: Item[] = [];

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    for (let i = 1; i <= leftItemCount; i++) items.push(i);
    items.push('ellipsis-right');
    items.push(lastPage);
  } else if (showLeftEllipsis && !showRightEllipsis) {
    items.push(firstPage);
    items.push('ellipsis-left');
    const rightItemCount = 3 + 2 * siblingCount;
    for (let i = lastPage - rightItemCount + 1; i <= lastPage; i++) items.push(i);
  } else {
    items.push(firstPage);
    items.push('ellipsis-left');
    for (let i = leftSibling; i <= rightSibling; i++) items.push(i);
    items.push('ellipsis-right');
    items.push(lastPage);
  }

  return items;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  copy,
  siblingCount = 1,
  className,
}: PaginationProps): JSX.Element | null {
  if (totalPages <= 1) return null;

  const items = buildItems(currentPage, totalPages, siblingCount);

  const handleJump = (delta: number) => {
    const next = currentPage + delta;
    if (next >= 1 && next <= totalPages) onPageChange(next);
  };

  return (
    <nav
      className={`pagination${className ? ` ${className}` : ''}`}
      aria-label={copy.ariaLabel}
    >
      <button
        type="button"
        className="pagination__btn pagination__btn--arrow"
        onClick={() => handleJump(-1)}
        disabled={currentPage === 1}
        aria-label={copy.prevAriaLabel}
      >
        ‹
      </button>

      {items.map((item, index) => {
        if (item === 'ellipsis-left' || item === 'ellipsis-right') {
          return (
            <span key={`${item}-${index}`} className="pagination__ellipsis" aria-hidden="true">
              …
            </span>
          );
        }
        const isActive = item === currentPage;
        return (
          <button
            key={item}
            type="button"
            className={`pagination__btn${isActive ? ' pagination__btn--active' : ''}`}
            onClick={() => onPageChange(item)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={copy.pageAriaFormat.replace('{page}', String(item))}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        className="pagination__btn pagination__btn--arrow"
        onClick={() => handleJump(1)}
        disabled={currentPage === totalPages}
        aria-label={copy.nextAriaLabel}
      >
        ›
      </button>
    </nav>
  );
}
