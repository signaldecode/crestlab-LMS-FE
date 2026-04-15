/**
 * 강사 소개 목록 컨테이너 (InstructorListContainer)
 * - 백엔드 GET /api/v1/instructors 실 API 연동
 * - Figma 디자인: 4열 카드 그리드, 카드 상단 이미지 + 흰색 이름 칩 오버레이
 *   + 주요이력/주요강의 불릿 + "프로필 보기" CTA, 숫자형 페이지네이션
 */

'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import {
  fetchInstructors,
  type InstructorCategory,
  type InstructorListItem,
} from '@/lib/userApi';

const SK = 'instructors-list';
const PAGE_SIZE = 12;
const BULLET_LIMIT = 2;

const CATEGORY_OPTIONS: { value: InstructorCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'STOCKS', label: '주식' },
  { value: 'CRYPTO', label: '비트코인' },
  { value: 'REAL_ESTATE', label: '부동산' },
];

/** career 문자열을 줄바꿈/세미콜론 기준으로 분리해 불릿 배열로 변환 (최대 N개) */
function toBullets(text: string | null | undefined, limit: number): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n|;|·/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, limit);
}

/** 페이지 번호 목록 — 현재 페이지 기준 ±2 윈도우 (최대 6개 노출) */
function buildPageNumbers(current: number, total: number): number[] {
  if (total <= 6) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  let start = Math.max(1, current - 2);
  let end = Math.min(total, start + 5);
  if (end - start < 5) start = Math.max(1, end - 5);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function InstructorListContainer(): JSX.Element {
  const [category, setCategory] = useState<InstructorCategory | 'ALL'>('ALL');
  const [page, setPage] = useState(1);

  const { data, loading, error } = useAdminQuery(
    () => fetchInstructors({ category: category === 'ALL' ? undefined : category, page, size: PAGE_SIZE }),
    [category, page],
  );

  const items = data?.content ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);
  const pageNumbers = buildPageNumbers(page, totalPages);
  const showMore = totalPages > pageNumbers[pageNumbers.length - 1];

  return (
    <section className={SK}>
      <div className={`${SK}__inner`}>
        <header className={`${SK}__header`}>
          <h1 className={`${SK}__title`}>강사소개 페이지</h1>
        </header>

        <nav className={`${SK}__filters`} role="tablist" aria-label="강사 카테고리">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={category === opt.value}
              className={`${SK}__filter${category === opt.value ? ` ${SK}__filter--active` : ''}`}
              onClick={() => { setCategory(opt.value); setPage(1); }}
            >
              {opt.label}
            </button>
          ))}
        </nav>

        {loading && !data ? (
          <p className={`${SK}__empty`}>불러오는 중…</p>
        ) : error && !data ? (
          <p className={`${SK}__empty`}>{error.message}</p>
        ) : items.length === 0 ? (
          <p className={`${SK}__empty`}>등록된 강사가 없습니다.</p>
        ) : (
          <ul className={`${SK}__grid`} role="list">
            {items.map((inst) => (
              <InstructorCard key={inst.instructorId} item={inst} />
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <nav className={`${SK}__pagination`} aria-label="페이지 탐색">
            <button
              type="button"
              className={`${SK}__page-arrow`}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              aria-label="이전 페이지"
            >
              ‹
            </button>
            {pageNumbers.map((n) => (
              <button
                key={n}
                type="button"
                className={`${SK}__page-num${n === page ? ` ${SK}__page-num--active` : ''}`}
                onClick={() => setPage(n)}
                aria-current={n === page ? 'page' : undefined}
                aria-label={`${n} 페이지`}
              >
                {n}
              </button>
            ))}
            {showMore && <span className={`${SK}__page-more`} aria-hidden="true">…</span>}
            <button
              type="button"
              className={`${SK}__page-arrow`}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              aria-label="다음 페이지"
            >
              ›
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}

interface CardProps { item: InstructorListItem }

function InstructorCard({ item }: CardProps): JSX.Element {
  const careerBullets = toBullets(item.career, BULLET_LIMIT);
  const courseBullets = item.mainCourses.slice(0, BULLET_LIMIT).map((c) => c.title);

  return (
    <li className={`${SK}__card`}>
      <div className={`${SK}__media`}>
        {item.profileImageUrl ? (
          <Image
            src={item.profileImageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className={`${SK}__media-img`}
          />
        ) : (
          <span className={`${SK}__media-placeholder`} aria-hidden="true" />
        )}
        <div className={`${SK}__name-chip`}>
          <span className={`${SK}__name`}>{item.name}</span>
          {item.specialty && (
            <span className={`${SK}__specialty`}>{item.specialty}</span>
          )}
        </div>
      </div>

      <div className={`${SK}__info`}>
        {careerBullets.length > 0 && (
          <div className={`${SK}__info-block`}>
            <span className={`${SK}__info-label`}>주요이력</span>
            <ul className={`${SK}__info-list`}>
              {careerBullets.map((line, i) => (
                <li key={i} className={`${SK}__info-item`}>{line}</li>
              ))}
            </ul>
          </div>
        )}
        {courseBullets.length > 0 && (
          <div className={`${SK}__info-block`}>
            <span className={`${SK}__info-label`}>주요강의</span>
            <ul className={`${SK}__info-list`}>
              {courseBullets.map((title, i) => (
                <li key={i} className={`${SK}__info-item`}>{title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Link
        href={`/instructors/${item.instructorId}`}
        className={`${SK}__cta`}
        aria-label={`${item.name} 프로필 보기`}
      >
        프로필 보기
      </Link>
    </li>
  );
}
