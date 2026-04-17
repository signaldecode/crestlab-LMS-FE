/**
 * 관리자 강의 편집 통합 페이지 (/admin/courses/[id])
 * - 기본정보 / 커리큘럼 / 설정 3개 탭을 AdminCourseTabs에 위임한다
 * - URL query `?tab=basic|curriculum|settings`로 탭 전환
 */

import type { JSX } from 'react';
import { getPageData } from '@/lib/data';
import AdminCourseTabs, {
  type AdminCourseTabsCopy,
} from '@/components/admin/courses/AdminCourseTabs';
import type { CourseFormCopy } from '@/components/admin/courses/AdminCourseFormContainer';
import type { CurriculumEditorCopy } from '@/components/admin/courses/CurriculumEditor';

interface AdminCourseEditPageProps {
  params: Promise<{ id: string }>;
}

interface AdminPageData {
  courseEdit: {
    seo: { title: string };
    title: string;
    editBasicInfoLinkLabel: string;
    editBasicInfoLinkAriaLabel: string;
    tabs: AdminCourseTabsCopy;
    curriculum: CurriculumEditorCopy;
  };
  courseForm?: CourseFormCopy & { notFoundText?: string };
  common?: { loadingText: string; errorTitle: string; errorRetryLabel: string };
}

export async function generateMetadata({ params }: AdminCourseEditPageProps) {
  await params;
  const adminData = getPageData('admin') as AdminPageData | null;
  return {
    title: adminData?.courseEdit.seo.title || '강의 편집',
  };
}

export default async function AdminCourseEditPage({ params }: AdminCourseEditPageProps): Promise<JSX.Element> {
  const { id } = await params;
  const adminData = getPageData('admin') as AdminPageData | null;

  if (!adminData?.courseEdit || !adminData.courseForm || !adminData.common) {
    return <main>데이터를 불러올 수 없습니다.</main>;
  }

  return (
    <AdminCourseTabs
      courseId={Number(id)}
      formCopy={adminData.courseForm}
      common={adminData.common}
      notFoundText={adminData.courseForm.notFoundText ?? ''}
      curriculumCopy={adminData.courseEdit.curriculum}
      tabsCopy={adminData.courseEdit.tabs}
    />
  );
}
