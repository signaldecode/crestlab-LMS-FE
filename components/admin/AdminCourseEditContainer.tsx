/**
 * 관리자 강의 편집 컨테이너 (AdminCourseEditContainer)
 * - useUploadStore + lib/upload 함수를 오케스트레이션한다
 * - 에러 키를 data에서 해석하여 메시지로 변환한다
 * - 모든 텍스트는 props로 수신한다 (하드코딩 금지)
 */

'use client';

import type { JSX } from 'react';
import { useCallback } from 'react';
import useUploadStore from '@/stores/useUploadStore';
import { validateVideoFile, requestPresignedUrl, uploadFileToS3, confirmUpload } from '@/lib/upload';
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
  courseId,
  texts,
}: AdminCourseEditContainerProps): JSX.Element {
  const { status, progress, errorKey, setRequesting, setUploading, setProgress, setConfirming, setSuccess, setError, cancelUpload, resetUpload } =
    useUploadStore();

  const errorMessage = errorKey ? (texts.upload.errors[errorKey] || null) : null;

  const handleFileSelect = useCallback(
    async (file: File) => {
      const validationError = validateVideoFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        setRequesting();

        const { uploadUrl, fileKey } = await requestPresignedUrl({
          courseId,
          fileName: file.name,
          contentType: file.type,
        });

        const { promise, abort } = uploadFileToS3(uploadUrl, file, (percent) => {
          setProgress(percent);
        });

        setUploading(abort);
        await promise;

        setConfirming();
        await confirmUpload({
          courseId,
          fileKey,
          fileName: file.name,
        });

        setSuccess();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'uploadFailed';
        if (message !== 'cancelled') {
          setError(message);
        }
      }
    },
    [courseId, setRequesting, setUploading, setProgress, setConfirming, setSuccess, setError]
  );

  const handleRetry = useCallback(() => {
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
    </section>
  );
}
