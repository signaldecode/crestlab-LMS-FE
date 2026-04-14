/**
 * 관리자 강의 등록 페이지 (/admin/courses/new)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminCourseFormContainer, {
  type CourseFormCopy,
} from '@/components/admin/courses/AdminCourseFormContainer';
import { getPageData } from '@/lib/data';

interface CourseFormPageData extends CourseFormCopy {
  seoCreate: { title: string; description: string };
  seoEdit: { title: string; description: string };
  notFoundText: string;
}

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

function getCopy(): CourseFormPageData | null {
  const adminPage = getPageData('admin') as { courseForm?: CourseFormPageData } | null;
  return adminPage?.courseForm ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getCopy();
  return copy ? { title: copy.seoCreate.title, description: copy.seoCreate.description } : { title: '강의 등록' };
}

export default function AdminCourseCreatePage(): JSX.Element {
  const copy = getCopy();
  const common = getCommonCopy();
  if (!copy || !common) return <main>데이터를 불러올 수 없습니다.</main>;
  return <AdminCourseFormContainer mode="create" copy={copy} common={common} />;
}
