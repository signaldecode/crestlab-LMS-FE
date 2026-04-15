/**
 * 업로드 유틸 (upload.ts)
 * - Presigned URL 기반 S3 직접 업로드를 위한 함수 모음
 *
 * 영상 업로드 플로우 (BE 계약):
 *   1) issuePresignedUrl(VIDEO)          → { presignedUrl, s3Key }
 *   2) uploadFileToS3(presignedUrl, ...) → S3 PUT (진행률/취소 지원)
 *   3) registerVideoUpload({ s3Key, ... }) → Video 엔티티 생성 (PENDING)
 *   4) startVideoEncode(videoId)         → 인코딩 시작
 *   5) linkLectureVideo(lectureId, videoId) → 강의와 연결 (업로드 외부에서 호출)
 *
 * 이미지는 presigned URL + S3 PUT만으로 완료되며 s3Key만 반환한다.
 */

import {
  issuePresignedUrl,
  registerVideoUpload,
  startVideoEncode,
  type UploadType,
  type VideoMetadata,
} from '@/lib/adminApi';

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

/** XHR 기반 S3 직접 업로드 — 진행률 콜백 + abort 함수 반환 */
export function uploadFileToS3(
  uploadUrl: string,
  file: File,
  onProgress: (percent: number) => void,
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

/* ────────────────────────────────────────────
 *  이미지 업로드 통합 헬퍼
 *  - Presigned URL 발급 → S3 PUT → { s3Key, publicUrl } 반환
 *  - publicUrl 은 백엔드가 내려주는 CloudFront 공개 URL (S3 버킷이 private + OAC 구조)
 * ────────────────────────────────────────────*/
export interface UploadImageResult {
  s3Key: string;
  /** CloudFront 공개 URL — DB 저장/이미지 src 용. 백엔드가 이미지 타입에 한해 발급. */
  publicUrl: string;
}

export interface UploadImageHandle {
  promise: Promise<UploadImageResult>;
  abort: () => void;
}

export function uploadImage(
  file: File,
  uploadType: UploadType,
  onProgress: (percent: number) => void = () => {},
): UploadImageHandle {
  let abortFn: () => void = () => {};

  const promise = (async (): Promise<UploadImageResult> => {
    const { presignedUrl, s3Key, publicUrl } = await issuePresignedUrl({
      filename: file.name,
      contentType: file.type,
      uploadType,
    });

    if (!publicUrl) {
      throw new Error('이미지 업로드 응답에 publicUrl 이 없습니다. 백엔드 업로드 타입 설정을 확인하세요.');
    }

    const { promise: putPromise, abort } = uploadFileToS3(presignedUrl, file, onProgress);
    abortFn = abort;
    await putPromise;

    return { s3Key, publicUrl };
  })();

  return {
    promise,
    abort: () => abortFn(),
  };
}

/* ────────────────────────────────────────────
 *  영상 업로드 통합 헬퍼
 *  - Presigned URL 발급 → S3 PUT → Video 등록 → 인코딩 시작
 *  - 반환된 videoId로 이후 `linkLectureVideo(lectureId, videoId)` 호출
 * ────────────────────────────────────────────*/
export interface UploadVideoResult {
  videoId: number;
  s3Key: string;
  encodingStatus: VideoMetadata['encodingStatus'];
}

export interface UploadVideoCallbacks {
  onUploadProgress?: (percent: number) => void;
  onPutStarted?: (abort: () => void) => void;
  onPutCompleted?: () => void;
}

export interface UploadVideoHandle {
  promise: Promise<UploadVideoResult>;
  abort: () => void;
}

export function uploadVideo(
  file: File,
  callbacks: UploadVideoCallbacks = {},
): UploadVideoHandle {
  const { onUploadProgress = () => {}, onPutStarted, onPutCompleted } = callbacks;
  let abortFn: () => void = () => {};

  const promise = (async (): Promise<UploadVideoResult> => {
    const { presignedUrl, s3Key } = await issuePresignedUrl({
      filename: file.name,
      contentType: file.type,
      uploadType: 'VIDEO',
    });

    const { promise: putPromise, abort } = uploadFileToS3(presignedUrl, file, onUploadProgress);
    abortFn = abort;
    onPutStarted?.(abort);
    await putPromise;
    onPutCompleted?.();

    const { videoId, encodingStatus } = await registerVideoUpload({
      originalFilename: file.name,
      s3Key,
      fileSize: file.size,
      contentType: file.type,
    });

    await startVideoEncode(videoId);

    return { videoId, s3Key, encodingStatus };
  })();

  return {
    promise,
    abort: () => abortFn(),
  };
}
