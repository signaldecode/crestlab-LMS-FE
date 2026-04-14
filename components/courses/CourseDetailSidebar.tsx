/**
 * 강의 상세 사이드바 (CourseDetailSidebar)
 * - 피그마: 뱃지 + 제목/공유 + 설명 + 수강정보 + 가격 + 위시/수강신청 버튼
 */

'use client';

import { useCallback, useEffect, useState, type JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Course } from '@/types';
import useWishlistStore from '@/stores/useWishlistStore';
import useCourseFavorite from '@/hooks/useCourseFavorite';
import useAuth from '@/hooks/useAuth';
import { enrollFreeCourse, fetchMyEnrollments, UserApiError } from '@/lib/userApi';

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}

interface CourseDetailSidebarProps {
  course: Course;
}

export default function CourseDetailSidebar({ course }: CourseDetailSidebarProps): JSX.Element {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const addRecent = useWishlistStore((s) => s.addRecent);
  const { wished, toggle } = useCourseFavorite(course.id, course.slug);
  const wishCount = 120;

  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');

  useEffect(() => {
    addRecent(course.slug);
  }, [course.slug, addRecent]);

  const isFree = course.price === 0;

  const handleFreeEnroll = useCallback(async () => {
    if (enrolling) return;
    if (!isLoggedIn) {
      setEnrollError('로그인이 필요합니다.');
      return;
    }
    setEnrolling(true);
    setEnrollError('');
    try {
      await enrollFreeCourse(course.id);
      // 등록 직후 첫 강의로 이동하기 위해 enrollmentId는 사용하지 않고 마이페이지로 이동
      router.push('/mypage');
    } catch (err) {
      // 이미 수강중이면 마이페이지로 이동
      if (err instanceof UserApiError && err.status === 409) {
        router.push('/mypage');
        return;
      }
      setEnrollError(err instanceof UserApiError ? err.message : '수강신청에 실패했습니다.');
    } finally {
      setEnrolling(false);
    }
  }, [enrolling, isLoggedIn, course.id, router]);

  // 이미 수강중인지 여부 표시를 위해 enrollment 목록 조회 (로그인 상태일 때만)
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  useEffect(() => {
    if (!isLoggedIn) { setAlreadyEnrolled(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchMyEnrollments();
        if (cancelled) return;
        setAlreadyEnrolled(list.some((e) => e.courseId === course.id));
      } catch {
        if (!cancelled) setAlreadyEnrolled(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isLoggedIn, course.id]);

  return (
    <aside className="course-detail-sidebar">
      <div className="course-detail-sidebar__sticky">
        {/* 뱃지 */}
        {course.badges.length > 0 && (
          <div className="course-detail-sidebar__badges">
            {course.badges.map((badge) => (
              <span key={badge} className="course-detail-sidebar__badge">{badge}</span>
            ))}
          </div>
        )}

        {/* 제목 + 공유 */}
        <div className="course-detail-sidebar__header">
          <h2 className="course-detail-sidebar__title">{course.title}</h2>
          <button type="button" className="course-detail-sidebar__share" aria-label="공유하기">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="15" cy="4" r="3" />
              <circle cx="5" cy="10" r="3" />
              <circle cx="15" cy="16" r="3" />
              <path d="M7.5 8.8l5-3.6M7.5 11.2l5 3.6" />
            </svg>
          </button>
        </div>

        {/* 설명 */}
        <p className="course-detail-sidebar__desc">{course.summary}</p>

        {/* 수강 정보 */}
        <div className="course-detail-sidebar__info">
          <div className="course-detail-sidebar__info-row">
            <div className="course-detail-sidebar__info-label">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#767676" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="4" width="14" height="14" rx="2" />
                <path d="M13 2v4M7 2v4M3 9h14" />
              </svg>
              <span>수강기간</span>
            </div>
            <span className="course-detail-sidebar__info-value">{course.enrollmentPeriod}</span>
          </div>
          <div className="course-detail-sidebar__info-row">
            <div className="course-detail-sidebar__info-label">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#767676" strokeWidth="1.5" aria-hidden="true">
                <circle cx="10" cy="10" r="8" />
                <path d="M10 5v5l3 3" />
              </svg>
              <span>강의분량</span>
            </div>
            <span className="course-detail-sidebar__info-value">{course.duration}</span>
          </div>
          <div className="course-detail-sidebar__info-row">
            <div className="course-detail-sidebar__info-label">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#767676" strokeWidth="1.5" aria-hidden="true">
                <path d="M4 4h12v14H4z" />
                <path d="M7 2v4M13 2v4M4 9h12" />
              </svg>
              <span>난이도</span>
            </div>
            <span className="course-detail-sidebar__info-value">{course.level === 'beginner' ? '입문' : course.level === 'intermediate' ? '중급이상' : '고급'}</span>
          </div>
        </div>

        {/* 가격 */}
        <div className="course-detail-sidebar__price">
          <span className="course-detail-sidebar__price-label">상품금액</span>
          <span className="course-detail-sidebar__price-value">{formatPrice(course.price)}</span>
        </div>

        {/* CTA 버튼 */}
        <div className="course-detail-sidebar__actions">
          <button
            type="button"
            className={`course-detail-sidebar__wish-btn${wished ? ' course-detail-sidebar__wish-btn--active' : ''}`}
            onClick={() => { void toggle(); }}
            aria-label={wished ? '찜 해제' : '찜하기'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="course-detail-sidebar__wish-count">{wishCount}</span>
          </button>
          {alreadyEnrolled ? (
            <Link
              href="/mypage"
              className="course-detail-sidebar__buy-btn"
            >
              내 강의실로 이동
            </Link>
          ) : isFree ? (
            <button
              type="button"
              className="course-detail-sidebar__buy-btn"
              onClick={handleFreeEnroll}
              disabled={enrolling}
            >
              {enrolling ? '수강신청 중...' : '무료 수강신청'}
            </button>
          ) : (
            <Link
              href={`/checkout?courseId=${course.id}`}
              className="course-detail-sidebar__buy-btn"
            >
              강의 구매하기
            </Link>
          )}
        </div>
        {enrollError && (
          <p className="course-detail-sidebar__enroll-error" role="alert">{enrollError}</p>
        )}
      </div>
    </aside>
  );
}
