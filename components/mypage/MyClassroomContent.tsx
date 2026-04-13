/**
 * 내 강의 목록 (MyClassroomContent)
 * - 최근 학습 강의 히어로 배너
 * - 수강중/수강완료 필터
 * - 그리드 카드 + 진행률 오버레이
 */

'use client';

import type { JSX } from 'react';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getEnrolledCourses, getCourses } from '@/lib/data';
import accountData from '@/data/accountData.json';
import type { Course } from '@/types';

const cd = accountData.mypage.classroom;
const SK = 'mypage-classroom';

type FilterType = 'all' | 'inProgress' | 'completed';

interface EnrolledItem {
  courseSlug: string;
  progress: number;
  lastLecture: string;
  lastLectureId: string;
  lastAccessedAt: string;
  enrolledAt: string;
  course: Course;
}

export default function MyClassroomContent(): JSX.Element {
  const [filter, setFilter] = useState<FilterType>('all');
  const enrolledCourses = getEnrolledCourses();
  const allCourses = getCourses();

  const coursesWithDetail: EnrolledItem[] = useMemo(() => {
    return enrolledCourses
      .map((ec) => {
        const course = allCourses.find((c) => c.slug === ec.courseSlug);
        if (!course) return null;
        return { ...ec, course };
      })
      .filter((item): item is EnrolledItem => item != null)
      .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime());
  }, [enrolledCourses, allCourses]);

  const heroItem = useMemo(() => {
    return coursesWithDetail.find((item) => item.progress < 100) ?? null;
  }, [coursesWithDetail]);

  const filteredCourses = useMemo(() => {
    if (filter === 'inProgress') return coursesWithDetail.filter((c) => c.progress < 100);
    if (filter === 'completed') return coursesWithDetail.filter((c) => c.progress === 100);
    return coursesWithDetail;
  }, [coursesWithDetail, filter]);

  const inProgressCount = coursesWithDetail.filter((c) => c.progress < 100).length;
  const completedCount = coursesWithDetail.filter((c) => c.progress === 100).length;

  if (coursesWithDetail.length === 0) {
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
      {/* ── 히어로: 이어서 학습하기 ── */}
      {heroItem && (
        <Link
          href={`/learn/${heroItem.course.slug}/${heroItem.lastLectureId}`}
          className={`${SK}__hero`}
        >
          <div className={`${SK}__hero-thumb`}>
            <Image
              src={heroItem.course.thumbnail}
              alt={heroItem.course.thumbnailAlt}
              fill
              sizes="(max-width: 767px) 100vw, 700px"
              className={`${SK}__hero-img`}
            />
            <div className={`${SK}__hero-overlay`} />
            <div className={`${SK}__hero-progress`}>
              <div
                className={`${SK}__hero-progress-fill`}
                style={{ width: `${heroItem.progress}%` }}
              />
            </div>
          </div>
          <div className={`${SK}__hero-body`}>
            <span className={`${SK}__hero-label`}>{cd.heroResumeLabel}</span>
            <span className={`${SK}__hero-title`}>{heroItem.course.title}</span>
            <span className={`${SK}__hero-meta`}>
              {heroItem.course.instructor} · {cd.progressLabel} {heroItem.progress}% · {cd.heroLastAccessPrefix} {heroItem.lastAccessedAt}
            </span>
            <span className={`${SK}__hero-lecture`}>{cd.lastLectureLabel}: {heroItem.lastLecture}</span>
          </div>
          <span className={`${SK}__hero-btn`}>{cd.heroResumeLabel}</span>
        </Link>
      )}

      {/* ── 필터 ── */}
      <div className={`${SK}__filter-bar`}>
        <div className={`${SK}__filters`}>
          {([
            { key: 'all' as FilterType, label: cd.filterAll, count: coursesWithDetail.length },
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

      {/* ── 그리드 카드 ── */}
      <div className={`${SK}__grid`}>
        {filteredCourses.map((item) => {
          const isComplete = item.progress === 100;
          return (
            <Link
              key={item.courseSlug}
              href={`/learn/${item.course.slug}/${item.lastLectureId}`}
              className={`${SK}__card`}
            >
              <div className={`${SK}__card-thumb`}>
                <Image
                  src={item.course.thumbnail}
                  alt={item.course.thumbnailAlt}
                  fill
                  sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, 33vw"
                  className={`${SK}__card-img`}
                />
                <div className={`${SK}__card-progress-bar`}>
                  <div
                    className={`${SK}__card-progress-fill${isComplete ? ` ${SK}__card-progress-fill--complete` : ''}`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className={`${SK}__card-percent${isComplete ? ` ${SK}__card-percent--complete` : ''}`}>
                  {isComplete ? cd.completedBadge : `${item.progress}%`}
                </span>
              </div>
              <div className={`${SK}__card-body`}>
                <span className={`${SK}__card-title`}>{item.course.title}</span>
                <span className={`${SK}__card-instructor`}>{item.course.instructor}</span>
                <span className={`${SK}__card-lecture`}>{cd.lastLectureLabel}: {item.lastLecture}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
