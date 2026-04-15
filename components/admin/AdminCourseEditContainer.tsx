/**
 * 관리자 강의 편집 컨테이너 (AdminCourseEditContainer)
 * - useUpload hook으로 영상 업로드 전 과정을 수행한다
 *   (Presigned URL → S3 PUT → Video 등록 → 인코딩 시작)
 * - 업로드된 videoId는 상위 레이어에서 linkLectureVideo로 강의에 연결한다
 *   (lecture 선택 UI가 붙으면 연동 예정 — 현재는 videoId만 노출)
 */

'use client';

import type { JSX } from 'react';
import { useCallback, useState } from 'react';
import useUpload from '@/hooks/useUpload';
import VideoUploadInput from './VideoUploadInput';

interface AdminTexts {
  courseEdit: {
    title: string;
    uploadSectionTitle: string;
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

interface AdminCourseEditContainerProps {
  courseId: string;
  texts: AdminTexts;
}

export default function AdminCourseEditContainer({
  courseId: _courseId,
  texts,
}: AdminCourseEditContainerProps): JSX.Element {
  const { status, progress, errorKey, upload, cancelUpload, resetUpload } = useUpload();
  const [uploadedVideoId, setUploadedVideoId] = useState<number | null>(null);

  const errorMessage = errorKey ? (texts.upload.errors[errorKey] || null) : null;

  const handleFileSelect = useCallback(
    async (file: File) => {
      const result = await upload(file);
      if (result) {
        setUploadedVideoId(result.videoId);
      }
    },
    [upload],
  );

  const handleRetry = useCallback(() => {
    setUploadedVideoId(null);
    resetUpload();
  }, [resetUpload]);

  return (
    <section className="admin-course-edit">
      <h1 className="admin-course-edit__title">{texts.courseEdit.title}</h1>
      <h2 className="admin-course-edit__section-title">{texts.courseEdit.uploadSectionTitle}</h2>
      <VideoUploadInput
        status={status}
        progress={progress}
        errorMessage={errorMessage}
        texts={texts.upload}
        onFileSelect={handleFileSelect}
        onCancel={cancelUpload}
        onRetry={handleRetry}
      />
      {uploadedVideoId !== null && (
        <p className="admin-course-edit__video-id" data-video-id={uploadedVideoId} aria-hidden="true" />
      )}
    </section>
  );
}
