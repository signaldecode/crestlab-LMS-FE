/**
 * useUpload — 영상 업로드 상태 + uploadVideo 유틸 통합 Hook
 *
 * 플로우: Presigned URL 발급 → S3 PUT → Video 등록 → 인코딩 시작
 * 반환된 videoId는 별도 단계에서 `linkLectureVideo(lectureId, videoId)`로 강의에 연결한다.
 */

'use client';

import { useCallback } from 'react';
import useUploadStore from '@/stores/useUploadStore';
import { validateVideoFile, uploadVideo, type UploadVideoResult } from '@/lib/upload';
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

  const upload = useCallback(
    async (file: File): Promise<UploadVideoResult | null> => {
      const validationError = validateVideoFile(file);
      if (validationError) {
        setError(validationError);
        return null;
      }

      try {
        setRequesting();

        const { promise } = uploadVideo(file, {
          onUploadProgress: setProgress,
          onPutStarted: (abort) => setUploading(abort),
          onPutCompleted: () => setConfirming(),
        });

        const result = await promise;
        setSuccess();
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'uploadFailed';
        if (message !== 'cancelled') {
          setError(message);
        }
        return null;
      }
    },
    [setRequesting, setUploading, setProgress, setConfirming, setSuccess, setError],
  );

  return {
    status,
    progress,
    errorKey,
    isIdle: status === ('idle' as UploadStatus),
    isUploading: status === ('uploading' as UploadStatus),
    isSuccess: status === ('success' as UploadStatus),
    isError: status === ('error' as UploadStatus),

    upload,
    cancelUpload,
    resetUpload,

    validateVideoFile,
  };
}
