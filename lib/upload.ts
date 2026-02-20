/**
 * 영상 업로드 유틸 (upload.ts)
 * - Presigned URL 기반 S3 직접 업로드를 위한 함수 모음
 * - requestPresignedUrl: Presigned URL 발급 요청
 * - uploadFileToS3: XHR 기반 S3 직접 업로드 (진행률 콜백 + 취소 지원)
 * - confirmUpload: 업로드 완료 확인
 * - validateVideoFile: 파일 형식/크기 검증
 */

import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  UploadConfirmRequest,
  UploadConfirmResponse,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

const ALLOWED_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB

/** 파일 형식/크기 검증 — errorKey를 반환하며, 유효하면 null */
export function validateVideoFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return 'invalidFormat';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'fileTooLarge';
  }
  return null;
}

/** Presigned URL 발급 요청 */
export async function requestPresignedUrl(
  payload: PresignedUrlRequest
): Promise<PresignedUrlResponse> {
  const res = await fetch(`${API_BASE}/admin/upload/presigned-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('presignedFailed');
  }

  return res.json();
}

/** XHR 기반 S3 직접 업로드 — 진행률 콜백 + abort 함수 반환 */
export function uploadFileToS3(
  uploadUrl: string,
  file: File,
  onProgress: (percent: number) => void
): { promise: Promise<void>; abort: () => void } {
  const xhr = new XMLHttpRequest();

  const promise = new Promise<void>((resolve, reject) => {
    xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error('uploadFailed'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('uploadFailed'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('cancelled'));
    });

    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });

  return {
    promise,
    abort: () => xhr.abort(),
  };
}

/** 업로드 완료 확인 */
export async function confirmUpload(
  payload: UploadConfirmRequest
): Promise<UploadConfirmResponse> {
  const res = await fetch(`${API_BASE}/admin/upload/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('confirmFailed');
  }

  return res.json();
}
