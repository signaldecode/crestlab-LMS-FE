/**
 * 영상 업로드 입력 (VideoUploadInput)
 * - 드래그앤드롭 + 파일 선택 UI
 * - 상태별(idle/uploading/success/error) 렌더링
 * - 모든 텍스트는 props로 수신한다 (하드코딩 금지)
 */

'use client';

import type { JSX, DragEvent } from 'react';
import { useRef, useState, useCallback } from 'react';
import type { UploadStatus } from '@/types';
import UploadProgress from './UploadProgress';
import Button from '@/components/ui/Button';

interface UploadTexts {
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
}

interface VideoUploadInputProps {
  status: UploadStatus;
  progress: number;
  errorMessage: string | null;
  texts: UploadTexts;
  onFileSelect: (file: File) => void;
  onCancel: () => void;
  onRetry: () => void;
}

export default function VideoUploadInput({
  status,
  progress,
  errorMessage,
  texts,
  onFileSelect,
  onCancel,
  onRetry,
}: VideoUploadInputProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const isIdle = status === 'idle';
  const isUploading = status === 'uploading' || status === 'requesting' || status === 'confirming';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <div className="video-upload">
      {isIdle && (
        <>
          <div
            className={`video-upload__dropzone${isDragActive ? ' video-upload__dropzone--active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            role="button"
            tabIndex={0}
            aria-label={texts.browseAriaLabel}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBrowseClick();
              }
            }}
          >
            <span className="video-upload__dropzone-text">
              {isDragActive ? texts.dropzoneActiveLabel : texts.dropzoneLabel}
            </span>
            <span className="video-upload__file-info">
              {texts.allowedFormats} · {texts.maxSizeLabel}: {texts.maxSizeValue}
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska"
            onChange={handleFileChange}
            hidden
          />
        </>
      )}

      {isUploading && (
        <>
          <UploadProgress progress={progress} label={texts.progressLabel} />
          <div className="video-upload__actions">
            <Button
              ariaLabel={texts.cancelAriaLabel}
              onClick={onCancel}
            >
              {texts.cancelLabel}
            </Button>
          </div>
        </>
      )}

      {isSuccess && (
        <p className="video-upload__success">{texts.successMessage}</p>
      )}

      {isError && (
        <>
          {errorMessage && (
            <p className="video-upload__error" role="alert">{errorMessage}</p>
          )}
          <div className="video-upload__actions">
            <Button
              ariaLabel={texts.retryAriaLabel}
              onClick={onRetry}
            >
              {texts.retryLabel}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
