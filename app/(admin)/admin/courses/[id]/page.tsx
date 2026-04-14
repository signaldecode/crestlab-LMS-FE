/**
 * 관리자 강의 편집 통합 페이지 (/admin/courses/[id])
 * - 기본정보 / 커리큘럼 / 영상 / 설정 4개 탭을 AdminCourseTabs에 위임한다
 * - URL query `?tab=basic|curriculum|video|settings`로 탭 전환
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
    uploadSectionTitle: string;
    editBasicInfoLinkLabel: string;
    editBasicInfoLinkAriaLabel: string;
    tabs: AdminCourseTabsCopy;
    curriculum: CurriculumEditorCopy;
  };
  courseForm?: CourseFormCopy & { notFoundText?: string };
  common?: { loadingText: string; errorTitle: string; errorRetryLabel: string };
  upload: {
    dropzoneLabel: string;
    dropzoneActiveLabel: string;
    browseLabel: string;
    browseAriaLabel: string;
    cancelLabel: string;
    cancelAriaLabel: string;
    retryLabel: string;
    retryAriaLabel: string;
    progressLabel: string;
    successMessage: string;
    allowedFormats: string;
    maxSizeLabel: string;
    maxSizeValue: string;
    errors: Record<string, string>;
  };
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

  const videoTexts = {
    courseEdit: {
      title: adminData.courseEdit.title,
      uploadSectionTitle: adminData.courseEdit.uploadSectionTitle,
    },
    upload: {
      dropzoneLabel: adminData.upload.dropzoneLabel,
      dropzoneActiveLabel: adminData.upload.dropzoneActiveLabel,
      browseLabel: adminData.upload.browseLabel,
      browseAriaLabel: adminData.upload.browseAriaLabel,
      cancelLabel: adminData.upload.cancelLabel,
      cancelAriaLabel: adminData.upload.cancelAriaLabel,
      retryLabel: adminData.upload.retryLabel,
      retryAriaLabel: adminData.upload.retryAriaLabel,
      progressLabel: adminData.upload.progressLabel,
      successMessage: adminData.upload.successMessage,
      allowedFormats: adminData.upload.allowedFormats,
      maxSizeLabel: adminData.upload.maxSizeLabel,
      maxSizeValue: adminData.upload.maxSizeValue,
      errors: adminData.upload.errors,
    },
  };

  return (
    <AdminCourseTabs
      courseId={Number(id)}
      formCopy={adminData.courseForm}
      common={adminData.common}
      notFoundText={adminData.courseForm.notFoundText ?? ''}
      curriculumCopy={adminData.courseEdit.curriculum}
      tabsCopy={adminData.courseEdit.tabs}
      videoTexts={videoTexts}
    />
  );
}
