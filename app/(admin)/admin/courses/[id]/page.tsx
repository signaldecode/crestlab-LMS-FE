/**
 * 관리자 강의 편집 페이지
 * - /admin/courses/[id] (admin Route Group) 경로로 접근한다
 * - Next.js 16 async params 패턴을 사용한다
 * - getPageData('admin')으로 텍스트를 로드하고 AdminCourseEditContainer에 위임한다
 */

import type { JSX } from 'react';
import Link from 'next/link';
import { getPageData } from '@/lib/data';
import AdminCourseEditContainer from '@/components/admin/AdminCourseEditContainer';

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
  };
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

  const texts = {
    courseEdit: {
      title: adminData?.courseEdit.title || '',
      uploadSectionTitle: adminData?.courseEdit.uploadSectionTitle || '',
    },
    upload: {
      dropzoneLabel: adminData?.upload.dropzoneLabel || '',
      dropzoneActiveLabel: adminData?.upload.dropzoneActiveLabel || '',
      browseLabel: adminData?.upload.browseLabel || '',
      browseAriaLabel: adminData?.upload.browseAriaLabel || '',
      cancelLabel: adminData?.upload.cancelLabel || '',
      cancelAriaLabel: adminData?.upload.cancelAriaLabel || '',
      retryLabel: adminData?.upload.retryLabel || '',
      retryAriaLabel: adminData?.upload.retryAriaLabel || '',
      progressLabel: adminData?.upload.progressLabel || '',
      successMessage: adminData?.upload.successMessage || '',
      allowedFormats: adminData?.upload.allowedFormats || '',
      maxSizeLabel: adminData?.upload.maxSizeLabel || '',
      maxSizeValue: adminData?.upload.maxSizeValue || '',
      errors: adminData?.upload.errors || {},
    },
  };

  return (
    <>
      <div className="admin-course-edit-entry">
        <Link
          href={`/admin/courses/${id}/edit`}
          aria-label={adminData?.courseEdit.editBasicInfoLinkAriaLabel ?? ''}
          className="admin-modal__btn admin-modal__btn--ghost"
        >
          {adminData?.courseEdit.editBasicInfoLinkLabel ?? ''}
        </Link>
      </div>
      <AdminCourseEditContainer courseId={id} texts={texts} />
    </>
  );
}
