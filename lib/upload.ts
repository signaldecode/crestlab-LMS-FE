/**
 * 업로드 유틸 (upload.ts)
 * - Presigned URL 기반 S3 직접 업로드를 위한 함수 모음
 * - 영상/이미지 등 모든 업로드 지점에서 동일한 흐름을 사용한다
 *   1) requestPresignedUrl  : Presigned URL 발급 요청
 *   2) uploadFileToS3       : XHR 기반 S3 직접 업로드 (진행률 콜백 + 취소 지원)
 *   3) confirmUpload        : 업로드 완료 확인 (영상에 한함)
 * - validateVideoFile / validateImageFile : 파일 형식/크기 검증
 * - uploadImage : 이미지 업로드 통합 헬퍼 (발급 → PUT → s3Key 반환)
 */

import { issuePresignedUrl, type UploadType } from '@/lib/adminApi';
import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  UploadConfirmRequest,
  UploadConfirmResponse,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
];

const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const MAX_VIDEO_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024;       // 10MB

/** 영상 파일 검증 — errorKey 반환, 유효하면 null */
export function validateVideoFile(file: File): string | null {
  if (!ALLOWED_VIDEO_MIME_TYPES.includes(file.type)) return 'invalidFormat';
  if (file.size > MAX_VIDEO_FILE_SIZE) return 'fileTooLarge';
  return null;
}

/** 이미지 파일 검증 — errorKey 반환, 유효하면 null */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) return 'invalidFormat';
  if (file.size > MAX_IMAGE_FILE_SIZE) return 'fileTooLarge';
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

/* ────────────────────────────────────────────
 *  이미지 업로드 통합 헬퍼
 *  - Presigned URL 발급 → S3 PUT → s3Key 반환
 *  - 진행률 콜백 + 취소 함수 지원
 *  - 백엔드 계약: lib/adminApi.ts `issuePresignedUrl`
 * ────────────────────────────────────────────*/
export interface UploadImageResult {
  s3Key: string;
}

export interface UploadImageHandle {
  promise: Promise<UploadImageResult>;
  abort: () => void;
}

/**
 * 이미지 파일을 Presigned URL 방식으로 업로드한다.
 * @param file        업로드할 이미지 파일 (validateImageFile 통과 가정)
 * @param uploadType  THUMBNAIL | PROFILE_IMAGE | BACKGROUND_IMAGE | NOTICE_IMAGE
 * @param onProgress  0–100 진행률 콜백
 */
export function uploadImage(
  file: File,
  uploadType: UploadType,
  onProgress: (percent: number) => void = () => {},
): UploadImageHandle {
  let abortFn: () => void = () => {};

  const promise = (async (): Promise<UploadImageResult> => {
    const { presignedUrl, s3Key } = await issuePresignedUrl({
      filename: file.name,
      contentType: file.type,
      uploadType,
    });

    const { promise: putPromise, abort } = uploadFileToS3(presignedUrl, file, onProgress);
    abortFn = abort;
    await putPromise;

    return { s3Key };
  })();

  return {
    promise,
    abort: () => abortFn(),
  };
}
