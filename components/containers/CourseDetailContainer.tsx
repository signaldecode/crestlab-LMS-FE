/**
 * 강의 상세 컨테이너 (CourseDetailContainer)
 * - 피그마: 히어로 배너 → 2열(좌: 후기+탭 / 우: 구매 사이드바) → 하단 콘텐츠
 */

import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Course } from '@/types';
import CourseDetailContent from '@/components/courses/CourseDetailContent';
import CourseDetailSidebar from '@/components/courses/CourseDetailSidebar';
import AdminQuickActions from '@/components/admin/AdminQuickActions';
import uiData from '@/data/uiData.json';
import siteData from '@/data/siteData.json';

interface CourseDetailContainerProps {
  course: Course | null;
}

export default function CourseDetailContainer({ course }: CourseDetailContainerProps): JSX.Element {
  if (!course) {
    return (
      <div className="course-detail-layout">
        <div className="course-detail-content">
          <p>{uiData.emptyState.courseNotFound}</p>
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
          href={`/admin/courses/${course.slug}`}
          aria-label={editAriaLabel}
          className="admin-quick-actions__link"
        >
          {adminActions.courseEditLabel}
        </Link>
      </AdminQuickActions>

      {/* 히어로 배너 */}
      <div className="course-detail-hero">
        <Image
          src={course.thumbnail}
          alt={course.thumbnailAlt}
          fill
          sizes="100vw"
          className="course-detail-hero__image"
          priority
        />
      </div>

      {/* 2열 레이아웃 */}
      <div className="course-detail-layout">
        <CourseDetailContent course={course} />
        <CourseDetailSidebar course={course} />
      </div>
    </>
  );
}
