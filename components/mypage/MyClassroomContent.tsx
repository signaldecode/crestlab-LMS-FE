/**
 * 내 강의 목록 (MyClassroomContent)
 * - 목록: `GET /v1/enrollments` (EnrollmentResponse — 진도 미포함)
 * - 진도/남은 기간: `GET /v1/enrollments/{id}` (EnrollmentDetail) 일괄 조회
 */

'use client';

import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import {
  fetchEnrollmentDetail,
  fetchMyEnrollments,
  type EnrollmentDetail,
  type EnrollmentItem,
} from '@/lib/userApi';
import { resolveThumb } from '@/lib/images';
import accountData from '@/data/accountData.json';

const cd = accountData.mypage.classroom;
const SK = 'mypage-classroom';

type FilterType = 'all' | 'inProgress' | 'completed';

function formatDate(iso: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('ko-KR');
}

/** 진도/마지막 접속 정보를 카드에 표시하기 위한 enrollment detail 캐시 */
type EnrollmentCard = EnrollmentItem & {
  progressPercent: number;
  lastAccessedAt: string | null;
  remainingDays: number | null;
};

export default function MyClassroomContent(): JSX.Element {
  const [filter, setFilter] = useState<FilterType>('all');
  const { data, loading, error } = useAdminQuery<EnrollmentItem[]>(
    () => fetchMyEnrollments(),
    [],
  );

  // enrollment detail 일괄 조회 — 진도율/남은 기간/최근 학습일을 한 번에 가공해서 저장
  interface DetailComputed {
    progressPercent: number;
    lastAccessedAt: string | null;
    remainingDays: number | null;
  }
  const [computed, setComputed] = useState<Record<number, DetailComputed>>({});
  useEffect(() => {
    const items = data ?? [];
    let cancelled = false;
    (async () => {
      const now = Date.now();
      const entries = await Promise.all(
        items.map(async (e) => {
          try {
            const d: EnrollmentDetail = await fetchEnrollmentDetail(e.id);
            const lastCompleted = d.progresses
              .map((p) => p.completedAt)
              .filter((v): v is string => !!v)
              .sort()
              .pop() ?? null;
            const daysLeft = d.expiresAt
              ? Math.max(0, Math.ceil((new Date(d.expiresAt).getTime() - now) / 86400000))
              : null;
            const info: DetailComputed = {
              progressPercent: d.progressPercent ?? 0,
              lastAccessedAt: lastCompleted ?? d.startedAt ?? null,
              remainingDays: daysLeft,
            };
            return [e.id, info] as const;
          } catch {
            return null;
          }
        }),
      );
      if (cancelled) return;
      const map: Record<number, DetailComputed> = {};
      for (const entry of entries) if (entry) map[entry[0]] = entry[1];
      setComputed(map);
    })();
    return () => { cancelled = true; };
  }, [data]);

  const enriched: EnrollmentCard[] = useMemo(() => {
    return (data ?? []).map((e) => {
      const c = computed[e.id];
      return {
        ...e,
        progressPercent: c?.progressPercent ?? 0,
        lastAccessedAt: c?.lastAccessedAt ?? null,
        remainingDays: c?.remainingDays ?? null,
      };
    });
  }, [data, computed]);

  const enrollments = useMemo(() => {
    return [...enriched].sort((a, b) => {
      const at = a.lastAccessedAt ? new Date(a.lastAccessedAt).getTime() : 0;
      const bt = b.lastAccessedAt ? new Date(b.lastAccessedAt).getTime() : 0;
      return bt - at;
    });
  }, [enriched]);

  const heroItem = useMemo(
    () => enrollments.find((e) => e.progressPercent < 100) ?? null,
    [enrollments],
  );

  const filteredCourses = useMemo(() => {
    if (filter === 'inProgress') return enrollments.filter((c) => c.progressPercent < 100);
    if (filter === 'completed') return enrollments.filter((c) => c.progressPercent >= 100);
    return enrollments;
  }, [enrollments, filter]);

  const inProgressCount = enrollments.filter((c) => c.progressPercent < 100).length;
  const completedCount = enrollments.filter((c) => c.progressPercent >= 100).length;

  if (loading) {
    return <div className={SK}><div className={`${SK}__empty`}><p>불러오는 중...</p></div></div>;
  }

  if (error) {
    return <div className={SK}><div className={`${SK}__empty`}><p>수강 내역을 불러오지 못했습니다.</p></div></div>;
  }

  if (enrollments.length === 0) {
    return (
      <div className={SK}>
        <div className={`${SK}__empty`}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <p className={`${SK}__empty-text`}>{cd.emptyText}</p>
          <p className={`${SK}__empty-sub`}>{cd.emptySubText}</p>
          <Link href="/courses" className={`${SK}__empty-browse`}>{cd.emptyBrowseLabel}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={SK}>
      {heroItem && (
        <Link
          href={`/courses/${heroItem.courseId}`}
          className={`${SK}__hero`}
        >
          <div className={`${SK}__hero-thumb`}>
            <Image
              src={resolveThumb(heroItem.thumbnailUrl)}
              alt={heroItem.courseTitle}
              fill
              sizes="(max-width: 767px) 100vw, 700px"
              className={`${SK}__hero-img`}
            />
            <div className={`${SK}__hero-overlay`} />
            <div className={`${SK}__hero-progress`}>
              <div
                className={`${SK}__hero-progress-fill`}
                style={{ width: `${heroItem.progressPercent}%` }}
              />
            </div>
          </div>
          <div className={`${SK}__hero-body`}>
            <span className={`${SK}__hero-label`}>{cd.heroResumeLabel}</span>
            <span className={`${SK}__hero-title`}>{heroItem.courseTitle}</span>
            <span className={`${SK}__hero-meta`}>
              {cd.progressLabel} {heroItem.progressPercent}% · {cd.heroLastAccessPrefix} {formatDate(heroItem.lastAccessedAt)}
            </span>
          </div>
          <span className={`${SK}__hero-btn`}>{cd.heroResumeLabel}</span>
        </Link>
      )}

      <div className={`${SK}__filter-bar`}>
        <div className={`${SK}__filters`}>
          {([
            { key: 'all' as FilterType, label: cd.filterAll, count: enrollments.length },
            { key: 'inProgress' as FilterType, label: cd.filterInProgress, count: inProgressCount },
            { key: 'completed' as FilterType, label: cd.filterCompleted, count: completedCount },
          ]).map((f) => (
            <button
              key={f.key}
              type="button"
              className={`${SK}__filter-chip${filter === f.key ? ` ${SK}__filter-chip--active` : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className={`${SK}__filter-count`}>{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`${SK}__grid`}>
        {filteredCourses.map((item) => {
          const isComplete = item.progressPercent >= 100;
          return (
            <Link
              key={item.id}
              href={`/courses/${item.courseId}`}
              className={`${SK}__card`}
            >
              <div className={`${SK}__card-thumb`}>
                <Image
                  src={resolveThumb(item.thumbnailUrl)}
                  alt={item.courseTitle}
                  fill
                  sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, 33vw"
                  className={`${SK}__card-img`}
                />
                <div className={`${SK}__card-progress-bar`}>
                  <div
                    className={`${SK}__card-progress-fill${isComplete ? ` ${SK}__card-progress-fill--complete` : ''}`}
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
                <span className={`${SK}__card-percent${isComplete ? ` ${SK}__card-percent--complete` : ''}`}>
                  {isComplete ? cd.completedBadge : `${item.progressPercent}%`}
                </span>
              </div>
              <div className={`${SK}__card-body`}>
                <span className={`${SK}__card-title`}>{item.courseTitle}</span>
                <span className={`${SK}__card-lecture`}>{cd.heroLastAccessPrefix} {formatDate(item.lastAccessedAt)}</span>
                {item.remainingDays != null && (
                  <span className={`${SK}__card-period`}>남은 기간 {item.remainingDays}일</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
