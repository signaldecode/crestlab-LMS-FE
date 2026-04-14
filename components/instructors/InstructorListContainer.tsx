/**
 * 강사 소개 목록 컨테이너 (InstructorListContainer)
 * - 백엔드 GET /api/v1/instructors 실 API 연동
 */

'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchInstructors, type InstructorCategory } from '@/lib/userApi';

const SK = 'instructors-list';

const CATEGORY_OPTIONS: { value: InstructorCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'STOCKS', label: '주식' },
  { value: 'CRYPTO', label: '가상자산' },
  { value: 'REAL_ESTATE', label: '부동산' },
];

export default function InstructorListContainer(): JSX.Element {
  const [category, setCategory] = useState<InstructorCategory | 'ALL'>('ALL');
  const [page, setPage] = useState(1);

  const { data, loading, error } = useAdminQuery(
    () => fetchInstructors({ category: category === 'ALL' ? undefined : category, page, size: 12 }),
    [category, page],
  );

  const items = data?.content ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  return (
    <section className={SK}>
      <div className={`${SK}__inner`}>
        <header className={`${SK}__header`}>
          <h1 className={`${SK}__title`}>강사 소개</h1>
          <p className={`${SK}__subtitle`}>플랫폼에서 활동 중인 강사들을 만나보세요.</p>
        </header>

        <nav className={`${SK}__categories`} role="tablist">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={category === opt.value}
              className={`${SK}__category${category === opt.value ? ` ${SK}__category--active` : ''}`}
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
              <li key={inst.instructorId} className={`${SK}__card`}>
                <Link href={`/instructors/${inst.instructorId}`} className={`${SK}__card-link`}>
                  <div className={`${SK}__card-avatar`}>
                    {inst.profileImageUrl && (
                      <Image
                        src={inst.profileImageUrl}
                        alt={inst.name}
                        width={120}
                        height={120}
                        className={`${SK}__card-avatar-img`}
                      />
                    )}
                  </div>
                  <h2 className={`${SK}__card-name`}>{inst.name}</h2>
                  {inst.specialty && (
                    <p className={`${SK}__card-specialty`}>{inst.specialty}</p>
                  )}
                  {inst.career && (
                    <p className={`${SK}__card-description`}>{inst.career}</p>
                  )}
                  <div className={`${SK}__card-footer`}>
                    <span>강의 {inst.mainCourses.length}개</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <nav className={`${SK}__pagination`} aria-label="페이지 탐색">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>이전</button>
            <span>{page} / {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>다음</button>
          </nav>
        )}
      </div>
    </section>
  );
}
