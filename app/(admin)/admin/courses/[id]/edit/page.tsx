/**
 * 관리자 강의 수정 페이지 (/admin/courses/[id]/edit)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminCourseFormContainer, {
  type CourseFormCopy,
} from '@/components/admin/courses/AdminCourseFormContainer';
import { getPageData } from '@/lib/data';

interface CourseFormPageData extends CourseFormCopy {
  seoEdit: { title: string; description: string };
  notFoundText: string;
}

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

interface AdminCourseEditPageProps {
  params: Promise<{ id: string }>;
}

function getCopy(): CourseFormPageData | null {
  const adminPage = getPageData('admin') as { courseForm?: CourseFormPageData } | null;
  return adminPage?.courseForm ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export async function generateMetadata({ params }: AdminCourseEditPageProps): Promise<Metadata> {
  await params;
  const copy = getCopy();
  return copy ? { title: copy.seoEdit.title, description: copy.seoEdit.description } : { title: '강의 수정' };
}

export default async function AdminCourseEditFormPage({ params }: AdminCourseEditPageProps): Promise<JSX.Element> {
  const { id } = await params;
  const copy = getCopy();
  const common = getCommonCopy();
  if (!copy || !common) return <main>데이터를 불러올 수 없습니다.</main>;
  return (
    <AdminCourseFormContainer
      mode="edit"
      courseId={Number(id)}
      copy={copy}
      common={common}
      notFoundText={copy.notFoundText}
    />
  );
}
