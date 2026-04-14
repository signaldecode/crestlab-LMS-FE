/**
 * 관리자 강의 목록 페이지 (/admin/courses)
 * - 필터(상태/카테고리/키워드) + 테이블 + 페이지네이션
 * - mock 데이터를 클라이언트에서 필터링 (백엔드 연동 시 query string으로 전달)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminCourseListContainer, {
  type AdminCoursesCopy,
} from '@/components/admin/courses/AdminCourseListContainer';
import { getAdminCoursesData, getPageData } from '@/lib/data';

interface AdminCoursesPageData extends AdminCoursesCopy {
  seo: { title: string; description: string };
}

function getCoursesCopy(): AdminCoursesPageData | null {
  const adminPage = getPageData('admin') as { courses?: AdminCoursesPageData } | null;
  return adminPage?.courses ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getCoursesCopy();
  if (!copy) return { title: '강의 관리 — 관리자' };
  return {
    title: copy.seo.title,
    description: copy.seo.description,
  };
}

export default function AdminCoursesPage(): JSX.Element {
  const copy = getCoursesCopy();
  const data = getAdminCoursesData();

  if (!copy) {
    return <main>강의 데이터를 불러올 수 없습니다.</main>;
  }

  return (
    <AdminCourseListContainer
      courses={data.courses}
      categories={data.categories}
      copy={copy}
    />
  );
}
