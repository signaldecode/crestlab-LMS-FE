/**
 * 범용 이미지 업로더 (ImageUploader)
 * - Presigned URL 방식으로 S3에 직접 업로드한다 (uploadImage 헬퍼)
 * - uploadType: THUMBNAIL | PROFILE_IMAGE | BACKGROUND_IMAGE | NOTICE_IMAGE
 * - 업로드 성공 시 onChange(publicUrl) 콜백 — 백엔드가 발급한 CloudFront URL
 * - 미리보기/진행률/취소/교체/삭제 + 파일 검증 내장
 *
 * 모든 라벨/문구는 props로만 주입한다 (data/*.json에서 관리, 하드코딩 금지)
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, JSX } from 'react';
import { uploadImage, validateImageFile } from '@/lib/upload';
import type { UploadType } from '@/lib/adminApi';

export interface ImageUploaderCopy {
  label: string;
  selectLabel: string;
  replaceLabel: string;
  removeLabel: string;
  cancelLabel: string;
  uploadingLabel: string;
  hint?: string;
  previewAlt: string;
  errors: {
    invalidFormat: string;
    fileTooLarge: string;
    uploadFailed: string;
  };
}

interface ImageUploaderProps {
  id: string;
  uploadType: UploadType;
  /** 서버에 저장된 이미지 공개 URL — 기존 값 표시용 */
  value: string | null;
  /** 업로드 성공 시 CloudFront publicUrl, 삭제 시 null */
  onChange: (publicUrl: string | null) => void;
  copy: ImageUploaderCopy;
  /** 미리보기 폭 비율 (예: '16/9', '1/1') */
  aspectRatio?: string;
  disabled?: boolean;
}

type Status = 'idle' | 'uploading' | 'error';

export default function ImageUploader({
  id,
  uploadType,
  value,
  onChange,
  copy,
  aspectRatio,
  disabled = false,
}: ImageUploaderProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<(() => void) | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [errorKey, setErrorKey] = useState<keyof ImageUploaderCopy['errors'] | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // 언마운트 시 objectURL 정리
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleSelect = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (inputRef.current) inputRef.current.value = '';
      if (!file) return;

      const validationError = validateImageFile(file);
      if (validationError) {
        setStatus('error');
        setErrorKey(validationError as keyof ImageUploaderCopy['errors']);
        return;
      }

      // 즉시 미리보기 생성
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const preview = URL.createObjectURL(file);
      objectUrlRef.current = preview;
      setLocalPreview(preview);

      setStatus('uploading');
      setProgress(0);
      setErrorKey(null);

      const handle = uploadImage(file, uploadType, (p) => setProgress(p));
      abortRef.current = handle.abort;

      try {
        const { publicUrl } = await handle.promise;
        setStatus('idle');
        setProgress(100);
        onChange(publicUrl);
      } catch (err) {
        const message = err instanceof Error ? err.message : '';
        if (message === 'cancelled') {
          setStatus('idle');
        } else {
          setStatus('error');
          setErrorKey('uploadFailed');
        }
      } finally {
        abortRef.current = null;
      }
    },
    [uploadType, onChange],
  );

  const handleCancel = useCallback(() => {
    abortRef.current?.();
  }, []);

  const handleRemove = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setLocalPreview(null);
    setStatus('idle');
    setProgress(0);
    setErrorKey(null);
    onChange(null);
  }, [onChange]);

  const previewSrc = localPreview ?? value;
  const hasImage = Boolean(previewSrc);
  const isUploading = status === 'uploading';

  return (
    <div className="image-uploader">
      <span className="image-uploader__label">{copy.label}</span>

      <div
        className="image-uploader__frame"
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewSrc!} alt={copy.previewAlt} className="image-uploader__image" />
        ) : (
          <div className="image-uploader__placeholder" aria-hidden="true" />
        )}

        {isUploading && (
          <div className="image-uploader__overlay" role="status" aria-live="polite">
            <div className="image-uploader__progress-track">
              <div
                className="image-uploader__progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="image-uploader__overlay-text">
              {copy.uploadingLabel} {progress}%
            </span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="image-uploader__input"
        onChange={handleSelect}
        disabled={disabled || isUploading}
        aria-label={copy.label}
      />

      <div className="image-uploader__actions">
        {!isUploading && (
          <button
            type="button"
            className="image-uploader__btn"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            {hasImage ? copy.replaceLabel : copy.selectLabel}
          </button>
        )}
        {isUploading && (
          <button
            type="button"
            className="image-uploader__btn image-uploader__btn--ghost"
            onClick={handleCancel}
          >
            {copy.cancelLabel}
          </button>
        )}
        {!isUploading && hasImage && (
          <button
            type="button"
            className="image-uploader__btn image-uploader__btn--danger"
            onClick={handleRemove}
            disabled={disabled}
          >
            {copy.removeLabel}
          </button>
        )}
      </div>

      {copy.hint && <p className="image-uploader__hint">{copy.hint}</p>}
      {status === 'error' && errorKey && (
        <p className="image-uploader__error" role="alert">
          {copy.errors[errorKey]}
        </p>
      )}
    </div>
  );
}
