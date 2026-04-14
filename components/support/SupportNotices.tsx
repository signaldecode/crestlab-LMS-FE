/**
 * 고객지원 공지사항 섹션 (SupportNotices)
 * - lib/userApi.ts fetchNotices(top N)를 호출해 최신 공지를 보여준다
 * - 클릭 시 게시판 상세 페이지(/board/{id})로 이동
 *
 * 모든 라벨은 props copy로 주입한다 (data/supportData.json)
 */

'use client';

import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import { fetchNotices, type NoticeSummary } from '@/lib/userApi';

export interface SupportNoticesCopy {
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
  viewAllAriaLabel: string;
  loadingText: string;
  emptyText: string;
  errorText: string;
  pinnedLabel: string;
  maxItems: number;
}

interface Props {
  copy: SupportNoticesCopy;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function SupportNotices({ copy }: Props): JSX.Element {
  const [items, setItems] = useState<NoticeSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchNotices({ page: 1, size: copy.maxItems });
        if (!cancelled) setItems(res.content);
      } catch {
        if (!cancelled) setError(copy.errorText);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [copy.maxItems, copy.errorText]);

  return (
    <section className="support-notices" aria-label={copy.title}>
      <header className="support-notices__header">
        <h2 className="support-notices__title">{copy.title}</h2>
        <Link
          href={copy.viewAllHref}
          className="support-notices__more"
          aria-label={copy.viewAllAriaLabel}
        >
          {copy.viewAllLabel} →
        </Link>
      </header>

      {loading ? (
        <p className="support-notices__status">{copy.loadingText}</p>
      ) : error ? (
        <p className="support-notices__status support-notices__status--error" role="alert">{error}</p>
      ) : !items || items.length === 0 ? (
        <p className="support-notices__status">{copy.emptyText}</p>
      ) : (
        <ul className="support-notices__list">
          {items.map((notice) => (
            <li key={notice.id} className="support-notices__item">
              <Link href={`/board/${notice.id}`} className="support-notices__link">
                {notice.pinned && (
                  <span className="support-notices__badge">{copy.pinnedLabel}</span>
                )}
                <span className="support-notices__item-title">{notice.title}</span>
                <span className="support-notices__date">{formatDate(notice.createdAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
