/**
 * 강사 본인 담당 강좌 목록 (InstructorMyCoursesContainer)
 * - 백엔드: GET /api/v1/admin/courses/my (페이지네이션 없음, 전체 반환)
 * - 행 클릭 시 기존 강좌 편집 페이지(/admin/courses/{id}/edit)로 이동
 */

'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchMyAdminCourses } from '@/lib/adminApi';
import type { AdminCourseLevel, AdminCourseStatus } from '@/types';

export interface InstructorMyCoursesCopy {
  title: string;
  subtitle: string;
  columns: {
    title: string;
    category: string;
    level: string;
    status: string;
    enrollment: string;
    actions: string;
  };
  statusLabels: Record<AdminCourseStatus, string>;
  levelLabels: Record<AdminCourseLevel, string>;
  personUnit: string;
  editLabel: string;
  editAriaLabelTemplate: string;
  emptyText: string;
  loadingText: string;
  errorText: string;
}

interface Props {
  copy: InstructorMyCoursesCopy;
}

export default function InstructorMyCoursesContainer({ copy }: Props): JSX.Element {
  const query = useAdminQuery(() => fetchMyAdminCourses(), []);

  return (
    <section className="admin-list-base">
      <header className="admin-list-base__header">
        <h1 className="admin-list-base__title">{copy.title}</h1>
        <p className="admin-list-base__subtitle">{copy.subtitle}</p>
      </header>

      {query.loading && <p className="admin-list-base__state">{copy.loadingText}</p>}
      {query.error && <p className="admin-list-base__state" role="alert">{copy.errorText}</p>}

      {query.data && query.data.length === 0 && (
        <p className="admin-list-base__state">{copy.emptyText}</p>
      )}

      {query.data && query.data.length > 0 && (
        <table className="admin-list-base__table">
          <thead>
            <tr>
              <th scope="col">{copy.columns.title}</th>
              <th scope="col">{copy.columns.category}</th>
              <th scope="col">{copy.columns.level}</th>
              <th scope="col">{copy.columns.status}</th>
              <th scope="col">{copy.columns.enrollment}</th>
              <th scope="col">{copy.columns.actions}</th>
            </tr>
          </thead>
          <tbody>
            {query.data.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.categoryName}</td>
                <td>{copy.levelLabels[course.level]}</td>
                <td>
                  <span className={`admin-list-base__status admin-list-base__status--${course.status.toLowerCase()}`}>
                    {copy.statusLabels[course.status]}
                  </span>
                </td>
                <td>{course.enrollmentCount.toLocaleString()}{copy.personUnit}</td>
                <td>
                  <Link
                    href={`/admin/courses/${course.id}/edit`}
                    className="admin-list-base__action-link"
                    aria-label={copy.editAriaLabelTemplate.replace('{title}', course.title)}
                  >
                    {copy.editLabel}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
