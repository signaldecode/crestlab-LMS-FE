/**
 * useUpload — 영상 업로드 상태 + Presigned URL 업로드 유틸 통합 Hook
 *
 * useUploadStore 상태와 lib/upload.ts 유틸 함수를 하나로 묶어
 * 컴포넌트에서 한 줄 호출로 영상 업로드 전 과정을 처리할 수 있게 한다.
 */

'use client';

import { useCallback } from 'react';
import useUploadStore from '@/stores/useUploadStore';
import {
  validateVideoFile,
  requestPresignedUrl,
  uploadFileToS3,
  confirmUpload,
} from '@/lib/upload';
import type { UploadStatus } from '@/types';

export default function useUpload() {
  const status = useUploadStore((s) => s.status);
  const progress = useUploadStore((s) => s.progress);
  const errorKey = useUploadStore((s) => s.errorKey);
  const setRequesting = useUploadStore((s) => s.setRequesting);
  const setUploading = useUploadStore((s) => s.setUploading);
  const setProgress = useUploadStore((s) => s.setProgress);
  const setConfirming = useUploadStore((s) => s.setConfirming);
  const setSuccess = useUploadStore((s) => s.setSuccess);
  const setError = useUploadStore((s) => s.setError);
  const cancelUpload = useUploadStore((s) => s.cancelUpload);
  const resetUpload = useUploadStore((s) => s.resetUpload);

  /** 파일 선택 → 검증 → Presigned URL 발급 → S3 업로드 → 확인 전 과정 */
  const upload = useCallback(
    async (file: File, courseId: string) => {
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
        await confirmUpload({ courseId, fileKey, fileName: file.name });

        setSuccess();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'uploadFailed';
        if (message !== 'cancelled') {
          setError(message);
        }
      }
    },
    [setRequesting, setUploading, setProgress, setConfirming, setSuccess, setError]
  );

  return {
    /** 업로드 상태 */
    status,
    progress,
    errorKey,
    isIdle: status === 'idle' as UploadStatus,
    isUploading: status === 'uploading' as UploadStatus,
    isSuccess: status === 'success' as UploadStatus,
    isError: status === 'error' as UploadStatus,

    /** 액션 */
    upload,
    cancelUpload,
    resetUpload,

    /** 파일 검증 유틸 */
    validateVideoFile,
  };
}
