/**
 * 관리자 강의 목록 페이지 (/admin/courses)
 * - 서버 page는 copy만 주입, 실 데이터는 Container가 fetch
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminCourseListContainer, {
  type AdminCoursesCopy,
} from '@/components/admin/courses/AdminCourseListContainer';
import { getPageData } from '@/lib/data';

interface AdminCoursesPageData extends AdminCoursesCopy {
  seo: { title: string; description: string };
}

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

function getCoursesCopy(): AdminCoursesPageData | null {
  const adminPage = getPageData('admin') as { courses?: AdminCoursesPageData } | null;
  return adminPage?.courses ?? null;
}

function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getCoursesCopy();
  if (!copy) return { title: '강의 관리 — 관리자' };
  return { title: copy.seo.title, description: copy.seo.description };
}

export default function AdminCoursesPage(): JSX.Element {
  const copy = getCoursesCopy();
  const common = getCommonCopy();

  if (!copy || !common) {
    return <main>강의 데이터를 불러올 수 없습니다.</main>;
  }

  return <AdminCourseListContainer copy={copy} common={common} />;
}
