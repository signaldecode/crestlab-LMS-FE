/**
 * 강의별 영상 업로드/교체 (LectureVideoUpload)
 * - LectureRow 안에서 하나의 lecture에 대해 영상 업로드 → Video 등록 → 인코딩 시작 → 강의 연결을 수행
 * - 전역 useUploadStore 대신 로컬 state로 격리 (여러 lecture가 독립적으로 동작 가능)
 */

'use client';

import { useCallback, useRef, useState } from 'react';
import type { JSX } from 'react';
import { uploadVideo, validateVideoFile } from '@/lib/upload';
import { linkLectureVideo } from '@/lib/adminApi';

export interface LectureVideoUploadCopy {
  uploadVideoLabel: string;
  replaceVideoLabel: string;
  uploadingLabel: string;
  linkingLabel: string;
  uploadErrorText: string;
  linkErrorText: string;
  invalidVideoFormatText: string;
  videoTooLargeText: string;
}

interface Props {
  lectureId: number;
  hasVideo: boolean;
  copy: LectureVideoUploadCopy;
  onLinked: (videoId: number) => void;
}

type Phase = 'idle' | 'uploading' | 'linking' | 'error';

export default function LectureVideoUpload({
  lectureId,
  hasVideo,
  copy,
  onLinked,
}: Props): JSX.Element {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;

      const validationKey = validateVideoFile(file);
      if (validationKey) {
        setPhase('error');
        setErrorText(
          validationKey === 'fileTooLarge' ? copy.videoTooLargeText : copy.invalidVideoFormatText,
        );
        return;
      }

      setErrorText(null);
      setProgress(0);
      setPhase('uploading');

      try {
        const { promise } = uploadVideo(file, { onUploadProgress: setProgress });
        const { videoId } = await promise;

        setPhase('linking');
        await linkLectureVideo(lectureId, videoId);

        setPhase('idle');
        setProgress(0);
        onLinked(videoId);
      } catch (err) {
        setPhase('error');
        const isLinkFailure = err instanceof Error && err.message === 'linkFailed';
        setErrorText(isLinkFailure ? copy.linkErrorText : copy.uploadErrorText);
      }
    },
    [lectureId, copy, onLinked],
  );

  const busy = phase === 'uploading' || phase === 'linking';

  return (
    <div className="lecture-video-upload">
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska"
        className="lecture-video-upload__input"
        onChange={handleChange}
        hidden
      />
      <button
        type="button"
        className="curriculum-editor__btn"
        onClick={handleClick}
        disabled={busy}
      >
        {hasVideo ? copy.replaceVideoLabel : copy.uploadVideoLabel}
      </button>

      {phase === 'uploading' && (
        <span className="lecture-video-upload__status" aria-live="polite">
          {copy.uploadingLabel} {progress}%
        </span>
      )}
      {phase === 'linking' && (
        <span className="lecture-video-upload__status" aria-live="polite">
          {copy.linkingLabel}
        </span>
      )}
      {phase === 'error' && errorText && (
        <span className="lecture-video-upload__error" role="alert">
          {errorText}
        </span>
      )}
    </div>
  );
}
