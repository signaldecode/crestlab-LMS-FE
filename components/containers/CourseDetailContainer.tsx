/**
 * 강의 상세 컨테이너 (CourseDetailContainer)
 * - 피그마: 히어로 배너 → 2열(좌: 후기+탭 / 우: 구매 사이드바) → 하단 콘텐츠
 * - 모든 데이터는 백엔드 `GET /v1/courses/{id}` 로부터 조회한다. mock 의존 없음.
 */

'use client';

import { useEffect, useMemo, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Course, CourseReview, CurriculumLesson, CurriculumSection } from '@/types';
import CourseDetailContent from '@/components/courses/CourseDetailContent';
import CourseDetailSidebar from '@/components/courses/CourseDetailSidebar';
import AdminQuickActions from '@/components/admin/AdminQuickActions';
import uiData from '@/data/uiData.json';
import siteData from '@/data/siteData.json';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { useWishlistStoreBase } from '@/stores/useWishlistStore';
import {
  fetchUserCourseById,
  type CourseReviewItem,
  type UserCourseDetail,
} from '@/lib/userApi';
import { resolveThumb } from '@/lib/images';

interface CourseDetailContainerProps {
  courseId: number | null;
}

/** 초 단위 영상 길이 포맷 */
function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}시간 ${m}분`;
  if (m > 0) return `${m}분 ${s ? `${s}초` : ''}`.trim();
  return `${s}초`;
}

function formatTotalDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `총 ${h}시간 ${m}분` : `총 ${m}분`;
}

function mapReview(r: CourseReviewItem): CourseReview {
  return {
    name: r.nickname,
    rating: r.rating,
    text: r.content,
    date: r.createdAt,
  };
}

function mapCurriculum(sections: UserCourseDetail['curriculum']['sections']): CurriculumSection[] {
  return sections.map((s) => ({
    title: s.title,
    lessons: s.lectures.map<CurriculumLesson>((lec) => ({
      id: String(lec.id),
      name: lec.title,
      duration: formatDuration(lec.durationSeconds),
      locked: !lec.isPreview,
      preview: lec.isPreview,
    })),
  }));
}

/** 백엔드 `UserCourseDetail` 을 UI 가 기대하는 `Course` 형태로 어댑트 */
function toCourseShape(api: UserCourseDetail): Course {
  const info = api.courseInfo;
  const primaryInstructor = api.instructors[0];
  const instructorName = primaryInstructor?.name ?? '';
  const hasDiscount = info.discountPrice != null && info.discountPrice < info.price;
  const discountRate = hasDiscount
    ? Math.round(((info.price - (info.discountPrice as number)) / info.price) * 100)
    : 0;

  return {
    id: info.id,
    slug: String(info.id),
    title: info.title,
    summary: info.description,
    description: info.detailContent || info.description,
    thumbnail: info.thumbnailUrl,
    thumbnailAlt: info.title,
    category: info.categoryName ?? '',
    level: info.level?.toLowerCase() ?? '',
    duration: formatTotalDuration(info.totalDurationSeconds),
    price: info.price,
    instructor: instructorName,
    featured: false,
    badges: info.tags ?? [],
    tags: info.tags ?? [],
    learningPoints: [],
    rating: info.averageRating,
    reviewCount: info.reviewCount,
    enrollmentPeriod: info.monthPlan ? `${info.monthPlan}개월` : '',
    faq: [],
    bestReviews: api.bestReviews.map(mapReview),
    allReviews: api.reviews.content.map(mapReview),
    curriculum: mapCurriculum(api.curriculum.sections),
    creator: {
      name: instructorName,
      role: primaryInstructor?.specialty ?? '',
      bio: '',
      avatar: primaryInstructor?.profileImageUrl ?? undefined,
    },
    discount: hasDiscount
      ? { rate: discountRate, label: `${discountRate}% 할인`, couponValidDays: 7 }
      : undefined,
  };
}

export default function CourseDetailContainer({ courseId }: CourseDetailContainerProps): JSX.Element {
  const { data: apiDetail, loading } = useAdminQuery<UserCourseDetail | null>(
    () => (courseId != null ? fetchUserCourseById(courseId) : Promise.resolve(null)),
    [courseId],
  );

  // 백엔드 isFavorited 를 로컬 찜 스토어에 반영
  useEffect(() => {
    if (!apiDetail) return;
    const { id, isFavorited } = apiDetail.courseInfo;
    const store = useWishlistStoreBase.getState();
    const slug = String(id);
    const has = store.slugs.includes(slug);
    if (isFavorited && !has) store.setWishSlugs([...store.slugs, slug]);
    else if (!isFavorited && has) store.setWishSlugs(store.slugs.filter((s) => s !== slug));
  }, [apiDetail]);

  const course = useMemo<Course | null>(
    () => (apiDetail ? toCourseShape(apiDetail) : null),
    [apiDetail],
  );

  if (!course) {
    return (
      <div className="course-detail-layout">
        <div className="course-detail-content">
          <p>{loading ? '불러오는 중...' : uiData.emptyState.courseNotFound}</p>
        </div>
      </div>
    );
  }

  const adminActions = siteData.a11y.adminQuickActions;
  const editAriaLabel = adminActions.courseEditAriaLabelTemplate.replaceAll('{title}', course.title);

  return (
    <>
      <AdminQuickActions label={adminActions.label}>
        <Link
          href={`/admin/courses/${course.id}`}
          aria-label={editAriaLabel}
          className="admin-quick-actions__link"
        >
          {adminActions.courseEditLabel}
        </Link>
      </AdminQuickActions>

      <div className="course-detail-hero">
        <Image
          src={resolveThumb(course.thumbnail)}
          alt={course.thumbnailAlt}
          fill
          sizes="100vw"
          className="course-detail-hero__image"
          priority
        />
      </div>

      <div className="course-detail-layout">
        <CourseDetailContent course={course} />
        <CourseDetailSidebar course={course} />
      </div>

      {apiDetail && (apiDetail.recommendedCourses.length > 0 || apiDetail.learningPolicy || apiDetail.refundPolicy) && (
        <section className="course-detail-extras">
          {apiDetail.recommendedCourses.length > 0 && (
            <div className="course-detail-extras__recommended">
              <h2 className="course-detail-extras__title">다른 고객이 함께 본 클래스</h2>
              <ul className="course-detail-extras__grid" role="list">
                {apiDetail.recommendedCourses.map((c) => (
                  <li key={c.id} className="course-detail-extras__card">
                    <Link href={`/courses/${c.id}`} className="course-detail-extras__card-link">
                      <Image
                        src={resolveThumb(c.thumbnailUrl)}
                        alt={c.title}
                        width={240}
                        height={140}
                        className="course-detail-extras__card-thumb"
                      />
                      <span className="course-detail-extras__card-title">{c.title}</span>
                      {c.instructorName && (
                        <span className="course-detail-extras__card-instructor">{c.instructorName}</span>
                      )}
                      <span className="course-detail-extras__card-meta">
                        ★ {c.averageRating.toFixed(1)} ({c.reviewCount})
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(apiDetail.learningPolicy || apiDetail.refundPolicy) && (
            <div className="course-detail-extras__policies">
              {apiDetail.learningPolicy && (
                <div className="course-detail-extras__policy">
                  <h3 className="course-detail-extras__policy-title">학습 정책</h3>
                  <p className="course-detail-extras__policy-body">{apiDetail.learningPolicy}</p>
                </div>
              )}
              {apiDetail.refundPolicy && (
                <div className="course-detail-extras__policy">
                  <h3 className="course-detail-extras__policy-title">환불 규정</h3>
                  <p className="course-detail-extras__policy-body">{apiDetail.refundPolicy}</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
}
